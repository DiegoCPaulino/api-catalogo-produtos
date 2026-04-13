const produtoService = require('../services/produtoService');

async function criar(req, res, next) {
  try {
    const dados = {
      nome: req.body.nome,
      descricao: req.body.descricao,
      preco: req.body.preco,
      estoque: req.body.estoque,
      ativo: req.body.ativo,
      categoriaId: req.body.categoria_id
    };

    const produto = await produtoService.criar(dados);
    res.status(201).json({ data: produto });
  } catch (error) {
    next(error);
  }
}

async function buscarTodos(req, res, next) {
  try {
    const filtros = {
      categoriaId: req.query.categoria_id,
      ativo: req.query.ativo
    };

    const produtos = await produtoService.buscarTodos(filtros);
    res.status(200).json({ data: produtos });
  } catch (error) {
    next(error);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const produto = await produtoService.buscarPorId(Number(req.params.id));
    res.status(200).json({ data: produto });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req, res, next) {
  try {
    const dados = {
      nome: req.body.nome,
      descricao: req.body.descricao,
      preco: req.body.preco,
      estoque: req.body.estoque,
      ativo: req.body.ativo,
      categoriaId: req.body.categoria_id
    };

    const produto = await produtoService.atualizar(Number(req.params.id), dados);
    res.status(200).json({ data: produto });
  } catch (error) {
    next(error);
  }
}

async function deletar(req, res, next) {
  try {
    await produtoService.deletar(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  criar,
  buscarTodos,
  buscarPorId,
  atualizar,
  deletar
};