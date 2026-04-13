const categoriaRepository = require('../repositories/categoriaRepository');

async function criar(dados) {
  const { nome, descricao } = dados;

  if (!nome || nome.trim() === '') {
    const error = new Error('O nome da categoria é obrigatório');
    error.statusCode = 400;
    throw error;
  }

  const id = await categoriaRepository.criar(nome.trim(), descricao?.trim());

  return await categoriaRepository.buscarPorId(id);
}

async function buscarTodas() {
  return await categoriaRepository.buscarTodas();
}

async function buscarPorId(id) {
  const categoria = await categoriaRepository.buscarPorId(id);

  if (!categoria) {
    const error = new Error('Categoria não encontrada');
    error.statusCode = 404;
    throw error;
  }

  return categoria;
}

async function atualizar(id, dados) {
  const { nome, descricao } = dados;

  if (!nome || nome.trim() === '') {
    const error = new Error('O nome da categoria é obrigatório');
    error.statusCode = 400;
    throw error;
  }

  await buscarPorId(id);

  await categoriaRepository.atualizar(id, nome.trim(), descricao?.trim());

  return await categoriaRepository.buscarPorId(id);
}

async function deletar(id) {
  await buscarPorId(id);

  const totalProdutos = await categoriaRepository.contarProdutos(id);

  if (totalProdutos > 0) {
    const error = new Error(
      `Não é possível deletar esta categoria pois ela possui ${totalProdutos} produto(s) vinculado(s)`
    );
    error.statusCode = 400;
    throw error;
  }

  await categoriaRepository.deletar(id);
}

module.exports = {
  criar,
  buscarTodas,
  buscarPorId,
  atualizar,
  deletar
};