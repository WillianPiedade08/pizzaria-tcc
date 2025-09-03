const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar um funcionário
const create = async (req, res) => {
    try {
        const { nome, cargo, telefone } = req.body;

        const funcionario = await prisma.funcionario.create({
            data: {
                nome,
                cargo,
                telefone
            }
        });

        res.status(201).json(funcionario).end();
    } catch (e) {
        res.status(400).json({ error: e.message }).end();
    }
}

// Ler todos os funcionários
const read = async (req, res) => {
    try {
        const funcionarios = await prisma.funcionario.findMany({
            orderBy: { funcionario_id: 'asc' }
        });
        res.json(funcionarios);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// Ler um funcionário pelo ID
const readOne = async (req, res) => {
    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { funcionario_id: Number(req.params.id) }
        });
        res.json(funcionario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Atualizar um funcionário
const update = async (req, res) => {
    try {
        const { nome, cargo, telefone } = req.body;

        const funcionario = await prisma.funcionario.update({
            where: { funcionario_id: Number(req.params.id) },
            data: { nome, cargo, telefone }
        });

        res.status(202).json(funcionario).end();
    } catch (e) {
        res.status(400).json({ error: e.message }).end();
    }
}

// Remover um funcionário
const remove = async (req, res) => {
    try {
        await prisma.funcionario.delete({
            where: { funcionario_id: Number(req.params.id) }
        });
        res.status(204).send();
    } catch (e) {
        res.status(400).json({ error: e.message }).end();
    }
}

module.exports = { create, read, readOne, update, remove };
