const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function create(req, res) {
  try {
    const { nome, preco, descricao, qtd_estoque } = req.body;
    if (!nome || !preco || !qtd_estoque) {
      return res.status(400).json({ error: 'Nome, preço e quantidade em estoque são obrigatórios' });
    }
    if (preco <= 0 || qtd_estoque < 0) {
      return res.status(400).json({ error: 'Preço e quantidade devem ser positivos' });
    }
    const produto = await prisma.produto.create({
      data: { nome, preco, descricao, qtd_estoque },
    });
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto: ' + error.message });
  }
}

async function read(req, res) {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar produtos: ' + error.message });
  }
}

async function readOne(req, res) {
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: Number(req.params.id) }, 
    });
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto: ' + error.message });
  }
}

async function update(req, res) {
  try {
    const { nome, preco, descricao, qtd_estoque } = req.body;
    const produto = await prisma.produto.update({
      where: { id: Number(req.params.id) },
      data: { nome, preco, descricao, qtd_estoque },
    });
    res.status(200).json(produto);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Produto não encontrado' });
    res.status(500).json({ error: 'Erro ao atualizar produto: ' + error.message });
  }
}

async function remove(req, res) {
  try {
    await prisma.produto.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Produto não encontrado' });
    res.status(500).json({ error: 'Erro ao remover produto: ' + error.message });
  }
}

module.exports = { create, read, readOne, update, remove };