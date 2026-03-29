const express = require('express');
const path = require('path');
const db = require('./src/config/db'); // Importa a conexão com o MySQL
const app = express();
const port = 3000;

// --- CONFIGURAÇÕES E MIDDLEWARES ---

// Serve arquivos estáticos (CSS, Imagens, JS do navegador) da pasta public
app.use(express.static('public')); 

// Permite que o Express leia os dados enviados pelos formulários (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- ROTAS DE NAVEGAÇÃO (ENTREGA DOS ARQUIVOS HTML) ---

// Home: Página principal do projeto
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'home.html'));
});

// Login: Tela de escolha entre Cliente e Colaborador
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'login.html'));
});

// Pontos de Coleta: Tela que mostrará os dados reais do Dados.gov
app.get('/pontos', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'pontos.html'));
});

// --- ÁREA DO CLIENTE (Subpasta cliente) ---
app.get('/solicitar-coleta', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'cliente', 'agendamento.html'));
});

app.get('/guia', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'cliente', 'guia.html'));
});

// --- ÁREA DO COLABORADOR (Subpasta colaborador) ---
app.get('/painel-cooperativa', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'colaborador', 'painel.html'));
});

// --- ROTAS DE API (COMUNICAÇÃO COM O BANCO DE DADOS) ---

// Cria um novo agendamento a partir dos dados enviados pelo cliente.
app.post('/api/agendamento', (req, res) => {
    const { nome, telefone, endereco, tipo_residuo, data_coleta, observacoes } = req.body;

    // Validação basica dos campos obrigatorios antes de consultar o banco.
    if (!nome || !telefone || !endereco || !tipo_residuo || !data_coleta) {
        return res.status(400).json({ erro: 'Preencha todos os campos obrigatorios.' });
    }

    // INSERT parametrizado evita SQL injection e mantém consistencia de dados.
    const sql = `
        INSERT INTO agendamentos (nome, telefone, endereco, tipo_residuo, data_coleta, observacoes)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [nome, telefone, endereco, tipo_residuo, data_coleta, observacoes || null],
        (err, result) => {
            if (err) {
                console.error('Erro ao salvar agendamento:', err);
                return res.status(500).json({
                    erro: 'Nao foi possivel salvar o agendamento. Verifique se a tabela agendamentos existe no banco.'
                });
            }

            // Retorna o ID criado para permitir rastreio/confirmacao no frontend.
            return res.status(201).json({
                mensagem: 'Agendamento realizado com sucesso!',
                id: result.insertId
            });
        }
    );
});

// Lista agendamentos ordenando por prioridade de status e data de coleta.
app.get('/api/agendamentos', (req, res) => {
    const sql = `
        SELECT id, nome, telefone, endereco, tipo_residuo, data_coleta, observacoes, status
        FROM agendamentos
        ORDER BY
            CASE status
                WHEN 'pendente' THEN 1
                WHEN 'em_andamento' THEN 2
                WHEN 'concluido' THEN 3
                WHEN 'cancelado' THEN 4
                ELSE 5
            END,
            data_coleta ASC,
            id DESC
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Erro ao listar agendamentos:', err);
            return res.status(500).json({ erro: 'Nao foi possivel buscar os agendamentos.' });
        }

        // Resposta direta em JSON para alimentar o painel da cooperativa.
        return res.json(rows);
    });
});

// Atualiza apenas o status de um agendamento existente.
app.patch('/api/agendamento/:id/status', (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;
    const statusPermitidos = ['pendente', 'em_andamento', 'concluido', 'cancelado'];

    // Garante que o ID recebido na rota seja numerico e valido.
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID invalido.' });
    }

    // Restringe transicoes a estados conhecidos pelo sistema.
    if (!statusPermitidos.includes(status)) {
        return res.status(400).json({
            erro: 'Status invalido. Use: pendente, em_andamento, concluido ou cancelado.'
        });
    }

    const sql = 'UPDATE agendamentos SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar status do agendamento:', err);
            return res.status(500).json({ erro: 'Nao foi possivel atualizar o status.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Agendamento nao encontrado.' });
        }

        // Confirma alteracao para o frontend atualizar o estado local.
        return res.json({ mensagem: 'Status atualizado com sucesso.' });
    });
});

// Fallback de API: qualquer rota /api nao mapeada retorna 404 em JSON.
app.use(/^\/api\//, (req, res) => {
    return res.status(404).json({ erro: 'Rota de API nao encontrada.' });
});


// Inicialização do Servidor
app.listen(port, () => {
    console.log(`♻️ EcoPonto Digital rodando com sucesso em http://localhost:${port}`);
});