const produtoRepository = require('../repositories/produtoRepository');
const categoriaRepository = require('../repositories/categoriaRepository');

async function criar(dados) {
  validarDados(dados);

  const categoria = await categoriaRepository.buscarPorId(dados.categoriaId);
  if (!categoria) {
    const error = new Error('Categoria informada não existe');
    error.statusCode = 400;
    throw error;
  }

  const id = await produtoRepository.criar(dados);

  return await produtoRepository.buscarPorId(id);
}

async function buscarTodos(filtros) {
  return await produtoRepository.buscarTodos(filtros);
}

async function buscarPorId(id) {
  const produto = await produtoRepository.buscarPorId(id);

  if (!produto) {
    const error = new Error('Produto não encontrado');
    error.statusCode = 404;
    throw error;
  }

  return produto;
}

async function atualizar(id, dados) {
  validarDados(dados);

  await buscarPorId(id);

  const categoria = await categoriaRepository.buscarPorId(dados.categoriaId);
  if (!categoria) {
    const error = new Error('Categoria informada não existe');
    error.statusCode = 400;
    throw error;
  }

  await produtoRepository.atualizar(id, dados);

  return await produtoRepository.buscarPorId(id);
}

async function deletar(id) {
  await buscarPorId(id);
  await produtoRepository.deletar(id);
}

function validarDados(dados) {
  if (!dados.nome || dados.nome.trim() === '') {
    const error = new Error('O nome do produto é obrigatório');
    error.statusCode = 400;
    throw error;
  }

  if (dados.preco === undefined || dados.preco === null || dados.preco <= 0) {
    const error = new Error('O preço deve ser maior que zero');
    error.statusCode = 400;
    throw error;
  }

  if (dados.estoque !== undefined && dados.estoque < 0) {
    const error = new Error('O estoque não pode ser negativo');
    error.statusCode = 400;
    throw error;
  }

  if (!dados.categoriaId) {
    const error = new Error('O produto deve estar vinculado a uma categoria');
    error.statusCode = 400;
    throw error;
  }
}

module.exports = {
  criar,
  buscarTodos,
  buscarPorId,
  atualizar,
  deletar
};