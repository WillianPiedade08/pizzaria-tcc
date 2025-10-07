const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const secret = process.env.JWT_SECRET || '10072007';
console.log('Secret configurado (controller):', secret);

async function register(req, res) {
  try {
    const { nome, email, senha, telefone } = req.body;
    if (!nome || !email || !senha || !telefone) {
      return res.status(400).json({ error: 'Nome, email, senha e telefone são obrigatórios' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const funcionario = await prisma.funcionario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        telefone,
      }
    });

    const token = jwt.sign(
      { funcionario_id: funcionario.id, nome: funcionario.nome },
      secret,
      { expiresIn: '7d' }
    );

    const { senha: _, ...funcionarioSemSenha } = funcionario;
    res.json({ funcionario: funcionarioSemSenha, token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar: ' + err.message });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const funcionario = await prisma.funcionario.findUnique({ where: { email } });
    if (!funcionario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, funcionario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { funcionario_id: funcionario.id, nome: funcionario.nome },
      secret,
      { expiresIn: '7d' }
    );

    const { senha: _, ...funcionarioSemSenha } = funcionario;
    res.json({ funcionario: funcionarioSemSenha, token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login: ' + err.message });
  }
}

module.exports = { register, login }; 