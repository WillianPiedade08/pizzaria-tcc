const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const secret = process.env.CLIENTE_SECRET || process.env.JWT_SECRET || 'fallback_segredo'; 

function authClienteMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token malformado' });

    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = decoded; 
        next();
    });
}

async function register(req, res) {
    try {
        const { nome, telefone, endereco, senha, email } = req.body; 

        if (!nome || !telefone || !senha) {
            return res.status(400).json({ error: 'Nome, telefone e senha são obrigatórios' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const cliente = await prisma.cliente.create({
            data: {
                nome,
                telefone,
                endereco,
                senha: hashedPassword,
                email: email || null,
            },
        });

        const token = jwt.sign(
            { cliente_id: cliente.id, nome: cliente.nome }, 
            { expiresIn: '7d' }
        );

        const { senha: _, ...clienteSemSenha } = cliente;

        res.status(201).json({ cliente: clienteSemSenha, token });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Telefone já registrado' });
        }
        res.status(500).json({ error: 'Erro ao registrar cliente: ' + err.message });
    }
}

async function login(req, res) {
    try {
        const { telefone, senha } = req.body;

        if (!telefone || !senha) {
            return res.status(400).json({ error: 'Telefone e senha são obrigatórios' });
        }

        const cliente = await prisma.cliente.findUnique({
            where: { telefone },
        });

        if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

        const senhaValida = await bcrypt.compare(senha, cliente.senha);
        if (!senhaValida) return res.status(401).json({ error: 'Senha inválida' });

        const token = jwt.sign(
            { cliente_id: cliente.id, nome: cliente.nome }, 
            secret,
            { expiresIn: '7d' }
        );

        const { senha: _, ...clienteSemSenha } = cliente;

        res.json({ cliente: clienteSemSenha, token });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao fazer login: ' + err.message });
    }
}

module.exports = {
    authClienteMiddleware,
    register,
    login,
};