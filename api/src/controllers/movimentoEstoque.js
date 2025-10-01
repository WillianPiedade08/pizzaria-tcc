const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function create(req, res) {
  try {
    const { produtoId, quantidade, tipo } = req.body;
    if (!produtoId || !quantidade || !tipo) {
      return res.status(400).json({ error: 'produtoId, quantidade e tipo são obrigatórios' });
    }
    const movimento = await prisma.movimentoEstoque.create({
      data: { produtoId, quantidade, tipo },
    });
    res.status(201).json(movimento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function read(req, res) {
  try {
    const movimentos = await prisma.movimentoEstoque.findMany({ include: { produto: true } });
    res.json(movimentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function readOne(req, res) {
  try {
    const movimento = await prisma.movimentoEstoque.findUnique({
      where: { id: Number(req.params.id) },
      include: { produto: true },
    });
    if (!movimento) return res.status(404).json({ error: 'Movimento não encontrado' });
    res.json(movimento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const { produtoId, quantidade, tipo } = req.body;
    const movimento = await prisma.movimentoEstoque.update({
      where: { id: Number(req.params.id) },
      data: { produtoId, quantidade, tipo },
      include: { produto: true },
    });
    res.status(200).json(movimento);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Movimento não encontrado' });
    res.status(500).json({ error: error.message });
  }
}

async function remove(req, res) {
  try {
    await prisma.movimentoEstoque.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Movimento não encontrado' });
    res.status(500).json({ error: error.message });
  }
}

module.exports = { create, read, readOne, update, remove };