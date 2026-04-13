-- ============================================
-- API Catálogo de Produtos — Script DDL
-- Banco: Oracle Database
-- ============================================

-- Sequences para geração automática de IDs
CREATE SEQUENCE seq_categorias START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_produtos START WITH 1 INCREMENT BY 1;

-- Tabela de categorias
CREATE TABLE categorias (
    id NUMBER DEFAULT seq_categorias.NEXTVAL PRIMARY KEY,
    nome VARCHAR2(100) NOT NULL UNIQUE,
    descricao VARCHAR2(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE produtos (
    id NUMBER DEFAULT seq_produtos.NEXTVAL PRIMARY KEY,
    nome VARCHAR2(150) NOT NULL,
    descricao VARCHAR2(500),
    preco NUMBER(10,2) NOT NULL,
    estoque NUMBER DEFAULT 0 NOT NULL,
    ativo NUMBER(1) DEFAULT 1,
    categoria_id NUMBER NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP,
    CONSTRAINT chk_preco CHECK (preco > 0),
    CONSTRAINT chk_estoque CHECK (estoque >= 0),
    CONSTRAINT chk_ativo CHECK (ativo IN (0, 1)),
    CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Índice para otimizar buscas por categoria
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);

-- ============================================
-- Dados iniciais para demonstração
-- ============================================

INSERT INTO categorias (nome, descricao) VALUES ('Eletrônicos', 'Dispositivos e equipamentos eletrônicos');
INSERT INTO categorias (nome, descricao) VALUES ('Periféricos', 'Acessórios e periféricos para computador');
INSERT INTO categorias (nome, descricao) VALUES ('Software', 'Licenças e assinaturas de software');

INSERT INTO produtos (nome, descricao, preco, estoque, ativo, categoria_id) VALUES ('Notebook Dell Inspiron', 'Notebook 15 polegadas, 16GB RAM, SSD 512GB', 4299.90, 15, 1, 1);
INSERT INTO produtos (nome, descricao, preco, estoque, ativo, categoria_id) VALUES ('Mouse Logitech MX Master', 'Mouse sem fio ergonômico', 549.00, 42, 1, 2);
INSERT INTO produtos (nome, descricao, preco, estoque, ativo, categoria_id) VALUES ('Teclado Mecânico Redragon', 'Teclado mecânico RGB switch brown', 289.90, 30, 1, 2);
INSERT INTO produtos (nome, descricao, preco, estoque, ativo, categoria_id) VALUES ('Monitor LG 27"', 'Monitor IPS 27 polegadas Full HD', 1399.00, 8, 1, 1);
INSERT INTO produtos (nome, descricao, preco, estoque, ativo, categoria_id) VALUES ('Windows 11 Pro', 'Licença digital Windows 11 Professional', 899.90, 100, 1, 3);

COMMIT;