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


// Inicialização do Servidor
app.listen(port, () => {
    console.log(`♻️ EcoPonto Digital rodando com sucesso em http://localhost:${port}`);
});