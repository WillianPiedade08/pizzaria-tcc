const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function create(req, res) {
  try {
    const { nome, telefone, endereco } = req.body;
    const cliente = await prisma.cliente.create({
      data: { nome, telefone, endereco }
    });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function read(req, res) {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function readOne(req, res) {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { cliente_id: Number(req.params.id) }
    });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const { nome, telefone, endereco } = req.body;
    const cliente = await prisma.cliente.update({
      where: { cliente_id: Number(req.params.id) },
      data: { nome, telefone, endereco }
    });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await prisma.cliente.delete({
      where: { cliente_id: Number(req.params.id) }
    });
    res.json({ message: 'Cliente removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { create, read, readOne, update, remove };
