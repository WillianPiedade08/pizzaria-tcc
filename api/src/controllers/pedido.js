const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
  try {
    const { cliente_id, sub_total, forma_pagamento, itens } = req.body;

    if (!cliente_id || !sub_total || !itens || itens.length === 0) {
      return res.status(400).json({ error: "cliente_id, sub_total e itens são obrigatórios" });
    }

    
    const pedido = await prisma.$transaction(async (tx) => {
      // cria o pedido
      const novoPedido = await tx.pedido.create({
        data: {
          cliente_id: Number(cliente_id),
          sub_total: new Prisma.Decimal(String(sub_total)),
        }
      });

      // cria os itens do pedido
      for (const it of itens) {
        const quantidade = Number(it.quantidade || 1);
        const preco = new Prisma.Decimal(String(it.preco_unitario || "0.00"));
        const valorTotal = new Prisma.Decimal((quantidade * parseFloat(preco)).toFixed(2));

        // cria o item
        await tx.itemPedido.create({
          data: {
            pedido_id: novoPedido.pedido_id,
            produto_id: Number(it.produto_id),
            quantidade,
            preco_unitario: preco,
            valor_total: valorTotal,
            forma_pagamento: forma_pagamento || "Não informado"
          }
        });

        // atualiza estoque
        await tx.produto.update({
          where: { produto_id: Number(it.produto_id) },
          data: { qtd_estoque: { decrement: quantidade } }
        });
      }

      return await tx.pedido.findUnique({
        where: { pedido_id: novoPedido.pedido_id },
        include: { itens: true, cliente: true }
      });
    });

    return res.status(201).json(pedido);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(400).json({ error: error.message });
  }
};

const read = async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: { cliente: true, itens: true }
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
