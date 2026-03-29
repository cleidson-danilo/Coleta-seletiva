const mysql = require('mysql2');

// Configura uma conexão simples (single connection) usada pelas rotas da API.
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '85750076', // Coloque a senha que você configurou no Workbench
    database: 'coleta_seletiva' // Coloque o nome do banco de dados que você criou (ex: coleta_seletiva)
});

// Valida conexão na inicialização para detectar erro de credencial/servidor cedo.
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

// Exporta a conexão para ser reutilizada em app.js.
module.exports = connection;