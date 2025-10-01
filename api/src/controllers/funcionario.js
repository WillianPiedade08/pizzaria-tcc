const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function create(req, res) {
  try {
    const { nome, email, senha, telefone, cargo } = req.body;
    if (!nome || !email || !senha || !telefone || !cargo) {
      return res.status(400).json({ error: 'Nome, email, senha, telefone e cargo são obrigatórios' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    const existingFuncionario = await prisma.funcionario.findFirst({
      where: { OR: [{ email }, { telefone }] },
    });
    if (existingFuncionario) {
      return res.status(400).json({ error: 'Email ou telefone já registrados' });
    }
    const hashedPassword = await bcrypt.hash(senha, 10);
    const funcionario = await prisma.funcionario.create({
      data: { nome, email, senha: hashedPassword, telefone, cargo },
    });
    const { senha: _, ...funcionarioSemSenha } = funcionario;
    res.status(201).json(funcionarioSemSenha);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function read(req, res) {
  try {
    const funcionarios = await prisma.funcionario.findMany({ orderBy: { id: 'asc' } });
    res.json(funcionarios.map(f => ({ ...f, senha: undefined })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function readOne(req, res) {
  try {
    const funcionario = await prisma.funcionario.findUnique({ where: { id: Number(req.params.id) } });
    if (!funcionario) return res.status(404).json({ error: 'Funcionário não encontrado' });
    const { senha: _, ...funcionarioSemSenha } = funcionario;
    res.json(funcionarioSemSenha);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const { nome, email, telefone, cargo, senha } = req.body;
    const data = { nome, email, telefone, cargo };
    if (senha) data.senha = await bcrypt.hash(senha, 10);
    const funcionario = await prisma.funcionario.update({
      where: { id: Number(req.params.id) },
      data,
    });
    const { senha: _, ...funcionarioSemSenha } = funcionario;
    res.status(200).json(funcionarioSemSenha); // Ajustado de 202 para 200
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Funcionário não encontrado' });
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    await prisma.funcionario.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Funcionário não encontrado' });
    res.status(500).json({ error: e.message });
  }
}

module.exports = { create, read, readOne, update, remove };