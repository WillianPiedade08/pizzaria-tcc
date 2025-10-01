const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

async function create(req, res) {
  try {
    const { clienteId, total, formaPagamento, itens } = req.body;
    if (!clienteId || !total || !itens || itens.length === 0) {
      return res.status(400).json({ error: 'clienteId, total e itens são obrigatórios' });
    }
    const cliente = await prisma.cliente.findUnique({ where: { id: Number(clienteId) } });
    if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

    const pedido = await prisma.$transaction(async (tx) => {
      const novoPedido = await tx.pedido.create({
        data: {
          clienteId: Number(clienteId),
          total: new Prisma.Decimal(String(total)),
          statusPagamento: formaPagamento || 'Pendente',
        },
      });

      let totalCalculado = new Prisma.Decimal(0);
      for (const it of itens) {
        const quantidade = Number(it.quantidade || 1);
        const produto = await tx.produto.findUnique({ where: { id: Number(it.produtoId) } });
        if (!produto) throw new Error(`Produto ${it.produtoId} não encontrado`);
        const preco = new Prisma.Decimal(String(it.precoUnitario || produto.preco));
        const valorTotal = preco.times(quantidade);

        await tx.itemPedido.create({
          data: {
            pedidoId: novoPedido.id,
            produtoId: Number(it.produtoId),
            quantidade,
            precoUnitario: preco,
            valor_total: valorTotal,
          },
        });

        totalCalculado = totalCalculado.plus(valorTotal);
      }

      return await tx.pedido.update({
        where: { id: novoPedido.id },
        data: { total: totalCalculado },
        include: { itens: true, cliente: true },
      });
    });

    res.status(201).json(pedido);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(400).json({ error: error.message });
  }
}

async function read(req, res) {
  try {
    const pedidos = await prisma.pedido.findMany({ include: { cliente: true, itens: true } });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pedidos: ' + error.message });
  }
}

async function readOne(req, res) {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(req.params.id) },
      include: { cliente: true, itens: true },
    });
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedido: ' + error.message });
  }
}

async function update(req, res) {
  try {
    const { clienteId, total, statusPagamento } = req.body;
    const pedido = await prisma.pedido.update({
      where: { id: Number(req.params.id) },
      data: { clienteId, total: new Prisma.Decimal(String(total)), statusPagamento },
      include: { cliente: true, itens: true },
    });
    res.status(200).json(pedido);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Pedido não encontrado' });
    res.status(500).json({ error: 'Erro ao atualizar pedido: ' + error.message });
  }
}

async function remove(req, res) {
  try {
    await prisma.pedido.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Pedido não encontrado' });
    res.status(500).json({ error: 'Erro ao remover pedido: ' + error.message });
  }
}

module.exports = { create, read, readOne, update, remove };