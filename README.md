# API REST — Catálogo de Produtos

API RESTful de catálogo de produtos com CRUD completo para duas entidades relacionadas (categorias e produtos), conectada a banco Oracle Database, com validações de dados, tratamento de erros padronizado e arquitetura em camadas.

## Tecnologias

- **Node.js** — Runtime JavaScript
- **Express.js** — Framework para APIs REST
- **Oracle Database** — Banco de dados relacional
- **oracledb** — Driver oficial da Oracle para Node.js
- **dotenv** — Gerenciamento de variáveis de ambiente

## Arquitetura

O projeto segue uma **arquitetura em camadas** com separação clara de responsabilidades:

```
Request HTTP → Route → Controller → Service → Repository → Oracle DB
```
```
src/
├── config/         → Conexão e pool do banco Oracle
├── routes/         → Mapeamento de rotas HTTP (zero lógica)
├── controllers/    → Interface HTTP: extrai dados da request, retorna response
├── services/       → Regras de negócio e validações (não conhece HTTP)
├── repositories/   → Queries SQL (única camada que acessa o banco)
└── middlewares/     → Tratamento global de erros
```
**Por que essa separação?**

Cada camada tem uma responsabilidade única. O controller nunca escreve SQL. O service nunca recebe `req`/`res`. O repository nunca valida regras de negócio. Isso facilita manutenção, testes e evolução — trocar o banco de Oracle para outro, por exemplo, exigiria mudanças apenas na camada de repository.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- Acesso a uma instância Oracle Database
- [Oracle Instant Client](https://www.oracle.com/database/technologies/instant-client.html) (caso necessário para o driver oracledb)

## Instalação e execução

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/catalogo-produtos-api.git
cd catalogo-produtos-api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar o .env com as credenciais do seu banco Oracle

# Executar o script DDL no Oracle SQL Developer
# O arquivo database/init.sql contém a criação das tabelas e dados de teste

# Iniciar a API
npm start

# Ou em modo desenvolvimento (com hot reload)
npm run dev
```

## Rotas disponíveis

### Categorias

| Método | Rota                  | Descrição                                    |
|--------|-----------------------|----------------------------------------------|
| POST   | `/api/categorias`     | Criar nova categoria                         |
| GET    | `/api/categorias`     | Listar todas as categorias                   |
| GET    | `/api/categorias/:id` | Buscar categoria por ID                      |
| PUT    | `/api/categorias/:id` | Atualizar categoria                          |
| DELETE | `/api/categorias/:id` | Deletar categoria (bloqueia se tiver produtos)|

### Produtos

| Método | Rota                | Descrição                                      |
|--------|---------------------|-------------------------------------------------|
| POST   | `/api/produtos`     | Criar novo produto                              |
| GET    | `/api/produtos`     | Listar produtos (filtros: `categoria_id`, `ativo`)|
| GET    | `/api/produtos/:id` | Buscar produto por ID (inclui dados da categoria)|
| PUT    | `/api/produtos/:id` | Atualizar produto                               |
| DELETE | `/api/produtos/:id` | Deletar produto                                 |

**Exemplos de uso dos filtros:**
GET /api/produtos?categoria_id=1          → Produtos da categoria 1
GET /api/produtos?ativo=1                 → Apenas produtos ativos
GET /api/produtos?categoria_id=2&ativo=1  → Produtos ativos da categoria 2

## Regras de negócio

- Preço do produto deve ser maior que zero
- Estoque não pode ser negativo
- Todo produto deve estar vinculado a uma categoria existente
- Categoria não pode ser deletada se possuir produtos vinculados
- Nome do produto e da categoria são obrigatórios
- Produto pode ser desativado (campo `ativo = 0`) sem ser deletado

## Modelagem do banco de dados
categorias (1) ←→ (N) produtos

- **categorias**: id, nome (único), descricao, criado_em
- **produtos**: id, nome, descricao, preco, estoque, ativo, categoria_id (FK), criado_em, atualizado_em

O script DDL completo está em `database/init.sql`.

## Decisões técnicas

- **Oracle Database** em vez de SQLite ou MySQL: escolha intencional por ser um banco de dados corporativo, demonstrando contato com ferramentas enterprise.
- **Catálogo de produtos** em vez de to-do list: modelo de dados mais rico com duas tabelas relacionadas, regras de negócio mais realistas e alinhamento com sistemas de negócio.
- **Arquitetura em camadas**: separação de responsabilidades que facilita manutenção e demonstra pensamento arquitetural.
- **Bind variables** em todas as queries: prevenção contra SQL injection e melhor performance por reutilização de planos de execução do Oracle.
- **Node.js/JavaScript**: escolhido por maior familiaridade no momento. Os conceitos aplicados (API REST, SQL, arquitetura em camadas, padrões de projeto) são transferíveis para qualquer linguagem, incluindo C#.

## Possíveis evoluções

- Autenticação e autorização com JWT
- Testes automatizados (unitários e de integração)
- Paginação na listagem de produtos
- Upload de imagens de produtos
- Deploy em ambiente cloud (Azure)
- Containerização com Docker

## Autor

**Diego Paulino** — Estudante de Análise e Desenvolvimento de Sistemas (FIAP)