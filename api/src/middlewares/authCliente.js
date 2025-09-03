// src/middlewares/authCliente.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Segredo para JWT de clientes
const secret = "segredoClienteSuperSecreto"; // ideal: process.env.CLIENTE_SECRET

// Middleware para rotas protegidas de cliente
function authClienteMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token inválido" });
        req.user = decoded; // salva dados do cliente no req
        next();
    });
}

// Função para registrar cliente
async function register(req, res) {
    try {
        const { nome, telefone, endereco, senha } = req.body;

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        const cliente = await prisma.cliente.create({
            data: {
                nome,
                telefone,
                endereco,
                senha: hashedPassword
            }
        });

        // Gera token
        const token = jwt.sign(
            { cliente_id: cliente.cliente_id, nome: cliente.nome },
            secret,
            { expiresIn: "7d" }
        );

        res.json({ cliente, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Função para login do cliente
async function login(req, res) {
    try {
        const { telefone, senha } = req.body;

        const cliente = await prisma.cliente.findUnique({
            where: { telefone }
        });

        if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });

        const senhaValida = await bcrypt.compare(senha, cliente.senha);
        if (!senhaValida) return res.status(401).json({ error: "Senha inválida" });

        // Gera token
        const token = jwt.sign(
            { cliente_id: cliente.cliente_id, nome: cliente.nome },
            secret,
            { expiresIn: "7d" }
        );

        res.json({ cliente, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    authClienteMiddleware,
    register,
    login,
    secret
};
