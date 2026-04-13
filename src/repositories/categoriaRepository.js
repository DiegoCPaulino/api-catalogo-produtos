const database = require('../config/database');

async function criar(nome, descricao) {
  let connection;
  try {
    connection = await database.getConnection();

    const sql = `
      INSERT INTO categorias (nome, descricao)
      VALUES (:nome, :descricao)
      RETURNING id INTO :id
    `;

    const binds = {
      nome,
      descricao: descricao || null,
      id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER }
    };

    const result = await connection.execute(sql, binds);
    return result.outBinds.id[0];

  } finally {
    if (connection) await connection.close();
  }
}

async function buscarTodas() {
  let connection;
  try {
    connection = await database.getConnection();

    const sql = 'SELECT * FROM categorias ORDER BY nome';
    const result = await connection.execute(sql);

    return result.rows;

  } finally {
    if (connection) await connection.close();
  }
}

async function buscarPorId(id) {
  let connection;
  try {
    connection = await database.getConnection();

    const sql = 'SELECT * FROM categorias WHERE id = :id';
    const result = await connection.execute(sql, { id });

    return result.rows[0] || null;

  } finally {
    if (connection) await connection.close();
  }
}

async function atualizar(id, nome, descricao) {
  let connection;
  try {
    connection = await database.getConnection();

    const sql = `
      UPDATE categorias
      SET nome = :nome, descricao = :descricao
      WHERE id = :id
    `;

    const result = await connection.execute(sql, { id, nome, descricao: descricao || null });
    return result.rowsAffected;

  } finally {
    if (connection) await connection.close();
  }
}

async function deletar(id) {
  let connection;
  try {
    connection = await database.getConnection();

    const sql = 'DELETE FROM categorias WHERE id = :id';
    const result = await connection.execute(sql, { id });

    return result.rowsAffected;

  } finally {
    if (connection) await connection.close();
  }
}

async function contarProdutos(categoriaId) {
  let connection;
  try {
    connection = await database.getConnection();

    const sql = 'SELECT COUNT(*) AS TOTAL FROM produtos WHERE categoria_id = :categoriaId';
    const result = await connection.execute(sql, { categoriaId });

    return result.rows[0].TOTAL;

  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  criar,
  buscarTodas,
  buscarPorId,
  atualizar,
  deletar,
  contarProdutos
};