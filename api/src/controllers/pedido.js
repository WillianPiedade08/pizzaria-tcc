const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const { cliente_id, sub_total } = req.body;

        if (!cliente_id || !sub_total) {
            return res.status(400).json({ error: "cliente_id e sub_total são obrigatórios" });
        }

        const pedido = await prisma.pedido.create({
            data: {
                cliente_id,
                sub_total
            }
        });

        return res.status(201).json(pedido);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const read = async (req, res) => {
    try {
        const pedidos = await prisma.pedido.findMany({
            include: { cliente: true, itens: true } // traz cliente e itens do pedido
        });
        return res.json(pedidos);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const readOne = async (req, res) => {
    try {
        const pedido = await prisma.pedido.findUnique({
            where: { pedido_id: Number(req.params.id) },
            include: { cliente: true, itens: true }
        });
        return res.json(pedido);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const pedido = await prisma.pedido.update({
            where: { pedido_id: Number(req.params.id) },
            data: req.body
        });
        return res.status(202).json(pedido);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await prisma.pedido.delete({ where: { pedido_id: Number(req.params.id) } });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};

module.exports = { create, read, readOne, update, remove };
