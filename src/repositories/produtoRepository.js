const oracledb = require('oracledb');
const database = require('../config/database');

async function criar(dados) {
  let connection;
  try {
    connection = await database.getConnection();

    const sql = `
      INSERT INTO produtos (nome, descricao, preco, estoque, ativo, categoria_id)
      VALUES (:nome, :descricao, :preco, :estoque, :ativo, :categoriaId)
      RETURNING id INTO :id
    `;

    const binds = {
      nome: dados.nome,
      descricao: dados.descricao || null,
      preco: dados.preco,
      estoque: dados.estoque ?? 0,
      ativo: dados.ativo ?? 1,
      categoriaId: dados.categoriaId,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result = await connection.execute(sql, binds);
    return result.outBinds.id[0];

  } finally {
    if (connection) await connection.close();
  }
}

async function buscarTodos(filtros = {}) {
  let connection;
  try {
    connection = await database.getConnection();

    let sql = `
      SELECT p.*, c.nome AS CATEGORIA_NOME
      FROM produtos p
      INNER JOIN categorias c ON p.categoria_id = c.id
    `;

    const condicoes = [];
    const binds = {};

    if (filtros.categoriaId) {
      condicoes.push('p.categoria_id = :categoriaId');
      binds.categoriaId = Number(filtros.categoriaId);
    }

    if (filtros.ativo !== undefined && filtros.ativo !== '') {
      condicoes.push('p.ativo = :ativo');
      binds.ativo = Number(filtros.ativo);
    }

    if (condicoes.length > 0) {
      sql += ' WHERE ' + condicoes.join(' AND ');
    }

    sql += ' ORDER BY p.nome';

    const result = await connection.execute(sql, binds);
    return result.rows;

  } finally {
    if (connection) await connection.close();
  }
}

async function buscarPorId(id) {
  let connection;
  try {
    connection = await database.getConnection();

    const sql = `
      SELECT p.*, c.nome AS CATEGORIA_NOME
      FROM produtos p
      INNER JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = :id
    `;

    const result = await connection.execute(sql, { id });
    return result.rows[0] || null;

  } finally {
    if (connection) await connection.close();
  }
}

async function atualizar(id, dados) {
  let connection;
  try {
    connection = await database.getConnection();

    const sql = `
      UPDATE produtos
      SET nome = :nome,
          descricao = :descricao,
          preco = :preco,
          estoque = :estoque,
          ativo = :ativo,
          categoria_id = :categoriaId,
          atualizado_em = CURRENT_TIMESTAMP
      WHERE id = :id
    `;

    const binds = {
      id,
      nome: dados.nome,
      descricao: dados.descricao || null,
      preco: dados.preco,
      estoque: dados.estoque,
      ativo: dados.ativo,
      categoriaId: dados.categoriaId
    };

    const result = await connection.execute(sql, binds);
    return result.rowsAffected;

  } finally {
    if (connection) await connection.close();
  }
}

async function deletar(id) {
  let connection;
  try {
    connection = await database.getConnection();

    const sql = 'DELETE FROM produtos WHERE id = :id';
    const result = await connection.execute(sql, { id });

    return result.rowsAffected;

  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  criar,
  buscarTodos,
  buscarPorId,
  atualizar,
  deletar
};