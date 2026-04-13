const oracledb = require('oracledb');

// Configura o formato de saída das queries para retornar objetos em vez de arrays.
// Sem isso, cada linha viria como [valor1, valor2, ...]
// Com isso, vem como { COLUNA1: valor1, COLUNA2: valor2, ... }
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Configura o autoCommit global. Com true, cada INSERT/UPDATE/DELETE é commitado automaticamente.
// Sem isso, você precisaria chamar connection.commit() manualmente após cada operação de escrita.
oracledb.autoCommit = true;

async function initialize() {
  await oracledb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SID}`,
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1
  });

  console.log('Pool de conexões Oracle criado com sucesso');
}

async function getConnection() {
  return await oracledb.getConnection();
}

async function close() {
  await oracledb.getPool().close(0);
  console.log('Pool de conexões Oracle encerrado');
}

module.exports = { initialize, getConnection, close };