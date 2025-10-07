const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function create(req, res) {
  try {
    const { nome, email, telefone, endereco, senha } = req.body;

    if (!nome || !telefone || !senha || !email) {
      return res.status(400).json({ error: 'nome, email, telefone e senha são obrigatórios' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const existingCliente = await prisma.cliente.findFirst({
      where: { OR: [{ telefone }, { email }] },
    });
    if (existingCliente) {
      return res.status(400).json({ error: 'Telefone ou email já registrados' });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    const cliente = await prisma.cliente.create({
      data: { nome, email, telefone, endereco, senha: hashedSenha },
    });

    
    const { senha: _, ...clienteSemSenha } = cliente;
    res.status(201).json(clienteSemSenha);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar cliente: ' + err.message });
  }
}

async function read(req, res) {
  try {
    const clientes = await prisma.cliente.findMany();
    
    const clientesSemSenha = clientes.map(({ senha, ...cliente }) => cliente);
    res.json(clientesSemSenha);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar clientes: ' + err.message });
  }
}

async function readOne(req, res) {
  try {
    const clienteId = Number(req.params.id);
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const { senha, ...clienteSemSenha } = cliente;
    res.json(clienteSemSenha);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar cliente: ' + err.message });
  }
}

async function readMe(req, res) {
  try {
    const clienteId = req.user.cliente_id; 
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    const { senha, ...clienteSemSenha } = cliente;
    res.json(clienteSemSenha);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar cliente logado: ' + err.message });
  }
}

async function update(req, res) {
  try {
    const clienteId = Number(req.params.id);
    const { nome, telefone, endereco, senha } = req.body;

    const dataToUpdate = { nome, telefone, endereco };
    if (senha) {
      dataToUpdate.senha = await bcrypt.hash(senha, 10);
    }

    const cliente = await prisma.cliente.update({
      where: { id: clienteId },
      data: dataToUpdate,
    });

    const { senha: _, ...clienteSemSenha } = cliente;
    res.json(clienteSemSenha);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao atualizar cliente: ' + err.message });
  }
}

async function remove(req, res) {
  try {
    const clienteId = Number(req.params.id);
    await prisma.cliente.delete({
      where: { id: clienteId },
    });
    res.json({ message: 'Cliente removido com sucesso!' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao remover cliente: ' + err.message });
  }
}

module.exports = { create, read, readOne, readMe, update, remove };