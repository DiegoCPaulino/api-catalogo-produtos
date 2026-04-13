require('dotenv').config();

const express = require('express');
const database = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

const app = express();

// Middleware que permite o Express interpretar JSON no body das requisições
app.use(express.json());

// Rota raiz — útil pra verificar se a API está no ar
app.get('/', (req, res) => {
  res.json({
    message: 'API Catálogo de Produtos',
    version: '1.0.0'
  });
});

// Montagem das rotas com seus prefixos
app.use('/api/categorias', categoriaRoutes);
app.use('/api/produtos', produtoRoutes);

// Middleware de erro — DEVE ser registrado DEPOIS de todas as rotas
app.use(errorHandler);

// Inicialização: primeiro conecta ao banco, depois sobe o servidor
const PORT = process.env.PORT || 3000;

async function startup() {
  try {
    await database.initialize();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
    process.exit(1);
  }
}

// Graceful shutdown: fecha o pool antes de encerrar
process.on('SIGINT', async () => {
  console.log('\nEncerrando aplicação...');
  await database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nEncerrando aplicação...');
  await database.close();
  process.exit(0);
});

startup();