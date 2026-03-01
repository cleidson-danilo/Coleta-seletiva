const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '???', // Coloque a senha que você configurou no Workbench
    database: 'aqui bota o nome do banco'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

module.exports = connection;