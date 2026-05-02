-- Execute este script no PostgreSQL antes de rodar o backend

-- Criar o banco de dados
CREATE DATABASE produtos_db;

-- Conectar ao banco
\c produtos_db;

-- A tabela será criada automaticamente pelo Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- Mas se quiser criar manualmente:

CREATE TABLE IF NOT EXISTS produtos (
    id BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    preco NUMERIC(10, 2) NOT NULL
);

-- Inserir alguns produtos de exemplo
INSERT INTO produtos (descricao, preco) VALUES
    ('Notebook Dell Inspiron 15', 3499.99),
    ('Mouse Logitech MX Master 3', 429.90),
    ('Teclado Mecânico Keychron K2', 599.00),
    ('Monitor LG 24" Full HD', 1199.00),
    ('Headset HyperX Cloud II', 349.90),
    ('SSD Samsung 500GB', 289.00),
    ('Webcam Logitech C920', 499.00),
    ('Hub USB-C 7 portas', 189.90),
    ('Mousepad XL Gamer', 89.90),
    ('Suporte para Notebook', 149.00),
    ('Cabo HDMI 2.0 2m', 49.90),
    ('Pen Drive 64GB SanDisk', 59.90),
    ('Cooler para Processador', 199.00),
    ('Fonte 650W 80 Plus Bronze', 399.90),
    ('Gabinete Mid Tower ATX', 349.00),
    ('Memória RAM 16GB DDR4', 279.90),
    ('Placa de Vídeo RX 6600', 1899.00),
    ('Processador Ryzen 5 5600', 799.00),
    ('Placa-mãe B550M Aorus', 699.00),
    ('Impressora HP LaserJet', 899.90);
