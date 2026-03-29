-- Schema completo do projeto EcoPonto Digital
-- Compatível com MySQL 8+

DROP DATABASE IF EXISTS coleta_seletiva;
CREATE DATABASE coleta_seletiva CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE coleta_seletiva;

-- ======================================================
-- TABELA: usuarios
-- Perfis de acesso para futura autenticação
-- ======================================================
CREATE TABLE usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil ENUM('cliente','colaborador','admin') NOT NULL DEFAULT 'cliente',
    ativo TINYINT UNSIGNED NOT NULL DEFAULT 1,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ======================================================
-- TABELA: pontos_coleta
-- Pontos para mapa e cadastro local
-- ======================================================
CREATE TABLE pontos_coleta (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    materiais VARCHAR(255) NOT NULL,
    horario_funcionamento VARCHAR(120) NULL,
    ativo TINYINT UNSIGNED NOT NULL DEFAULT 1,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ======================================================
-- TABELA: agendamentos
-- Usada por:
-- - POST /api/agendamento
-- - GET /api/agendamentos (painel)
-- - PATCH /api/agendamento/:id/status (painel)
-- ======================================================
CREATE TABLE agendamentos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    endereco VARCHAR(220) NOT NULL,
    tipo_residuo VARCHAR(80) NOT NULL,
    data_coleta DATE NOT NULL,
    observacoes TEXT NULL,
    status ENUM('pendente','em_andamento','concluido','cancelado') NOT NULL DEFAULT 'pendente',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_agendamento_status (status),
    INDEX idx_agendamento_data (data_coleta),
    INDEX idx_agendamento_nome (nome)
) ENGINE=InnoDB;

-- ======================================================
-- DADOS INICIAIS (opcional)
-- ======================================================
INSERT INTO pontos_coleta (nome, endereco, bairro, latitude, longitude, materiais, horario_funcionamento) VALUES
('Ecoponto Boa Viagem', 'Av. Boa Viagem, 1000 - Boa Viagem', 'Boa Viagem', -8.1192000, -34.9006000, 'papel,plastico,metal,vidro', 'Seg-Sab 08:00-17:00'),
('Ecoponto Casa Amarela', 'R. Padre Roma, 200 - Casa Amarela', 'Casa Amarela', -8.0406000, -34.9273000, 'papel,plastico,metal', 'Seg-Sex 08:00-16:00'),
('Ecoponto Derby', 'R. do Derby, 150 - Derby', 'Derby', -8.0577000, -34.9007000, 'papel,plastico,metal,vidro', 'Seg-Sab 08:00-17:00');

INSERT INTO agendamentos (nome, telefone, endereco, tipo_residuo, data_coleta, observacoes, status) VALUES
('Maria Silva', '(81) 99888-1122', 'Rua da Aurora, 150 - Boa Vista, Recife', 'Plastico', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'Portao azul.', 'pendente'),
('Joao Oliveira', '(81) 99777-3344', 'Av. Recife, 2450 - Afogados, Recife', 'Metal', DATE_ADD(CURDATE(), INTERVAL 3 DAY), NULL, 'em_andamento');
