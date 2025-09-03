const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

async function register(req, res) {
  try {
    const { nome, cargo, telefone, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'nome, email e senha são obrigatórios' });
    }

    const jaExiste = await prisma.funcionario.findUnique({ where: { email } });
    if (jaExiste) {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10);

    const user = await prisma.funcionario.create({
      data: { nome, cargo: cargo || 'Atendente', telefone: telefone || '', email, senha: hash },
      select: { funcionario_id: true, nome: true, email: true, cargo: true },
    });

    return res.status(201).json(user);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'email e senha são obrigatórios' });
    }

    const user = await prisma.funcionario.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const ok = await bcrypt.compare(senha, user.senha);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = signToken({
      sub: user.funcionario_id,
      email: user.email,
      cargo: user.cargo,
    });

    return res.json({
      token,
      user: { id: user.funcionario_id, nome: user.nome, email: user.email, cargo: user.cargo },
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

module.exports = { register, login };
