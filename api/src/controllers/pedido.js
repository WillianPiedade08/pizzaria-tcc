const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
  try {
    const { cliente_id, sub_total, forma_pagamento, itens } = req.body;

    if (!cliente_id || !sub_total || !itens || itens.length === 0) {
      return res.status(400).json({ error: 'cliente_id, sub_total e itens são obrigatórios' });
    }

    const cliente = await prisma.cliente.findUnique({ where: { id: Number(cliente_id) } });
    if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

    const pedido = await prisma.$transaction(async (tx) => {
      const novoPedido = await tx.pedido.create({
        data: {
          cliente_id: Number(cliente_id),
          sub_total: new Prisma.Decimal(String(sub_total)),
          forma_pagamento: forma_pagamento || 'Não informado',
        },
      });

      let total = new Prisma.Decimal(0);
      for (const it of itens) {
        const quantidade = Number(it.quantidade || 1);
        const produto = await tx.produto.findUnique({ where: { id: Number(it.produto_id) } });
        if (!produto) throw new Error(`Produto ${it.produto_id} não encontrado`);
        if (produto.qtd_estoque < quantidade) throw new Error('Estoque insuficiente');
        const preco = new Prisma.Decimal(String(it.preco_unitario || produto.preco));
        const valorTotal = new Prisma.Decimal((quantidade * parseFloat(preco)).toFixed(2));

        await tx.itemPedido.create({
          data: {
            pedido_id: novoPedido.id,
            produto_id: Number(it.produto_id),
            quantidade,
            preco_unitario: preco,
            valor_total: valorTotal,
            forma_pagamento: forma_pagamento || 'Não informado',
          },
        });

        await tx.produto.update({
          where: { id: Number(it.produto_id) },
          data: { qtd_estoque: { decrement: quantidade } },
        });

        total = total.plus(valorTotal);
      }

      return await tx.pedido.update({
        where: { id: novoPedido.id },
        data: { sub_total: total },
        include: { itens: true, cliente: true },
      });
    });

    return res.status(201).json(pedido);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Adicionando a função read que estava faltando
const read = async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: { cliente: true, itens: true },
    });
    return res.json(pedidos);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar pedidos: ' + error.message });
  }
};

const readOne = async (req, res) => {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(req.params.id) }, // Ajuste para 'pedido_id' se for o campo correto
      include: { cliente: true, itens: true },
    });
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
    return res.json(pedido);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar pedido: ' + error.message });
  }
};

const update = async (req, res) => {
  try {
    const pedido = await prisma.pedido.update({
      where: { id: Number(req.params.id) }, // Ajuste para 'pedido_id' se necessário
      data: req.body,
    });
    return res.status(200).json(pedido);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Pedido não encontrado' });
    return res.status(500).json({ error: 'Erro ao atualizar pedido: ' + error.message });
  }
};

const remove = async (req, res) => {
  try {
    await prisma.pedido.delete({ where: { id: Number(req.params.id) } }); // Ajuste para 'pedido_id'
    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Pedido não encontrado' });
    return res.status(500).json({ error: 'Erro ao remover pedido: ' + error.message });
  }
};

module.exports = { create, read, readOne, update, remove };