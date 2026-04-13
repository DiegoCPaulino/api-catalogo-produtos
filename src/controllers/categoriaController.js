const categoriaService = require('../services/categoriaService');

async function criar(req, res, next) {
  try {
    const categoria = await categoriaService.criar(req.body);
    res.status(201).json({ data: categoria });
  } catch (error) {
    next(error);
  }
}

async function buscarTodas(req, res, next) {
  try {
    const categorias = await categoriaService.buscarTodas();
    res.status(200).json({ data: categorias });
  } catch (error) {
    next(error);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const categoria = await categoriaService.buscarPorId(Number(req.params.id));
    res.status(200).json({ data: categoria });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req, res, next) {
  try {
    const categoria = await categoriaService.atualizar(Number(req.params.id), req.body);
    res.status(200).json({ data: categoria });
  } catch (error) {
    next(error);
  }
}

async function deletar(req, res, next) {
  try {
    await categoriaService.deletar(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  criar,
  buscarTodas,
  buscarPorId,
  atualizar,
  deletar
};