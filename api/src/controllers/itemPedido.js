const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function create(req, res) {
  try {
    const { pedidoId, produtoId, quantidade, precoUnitario } = req.body;
    if (!pedidoId || !produtoId || !quantidade || !precoUnitario) {
      return res.status(400).json({ error: 'pedidoId, produtoId, quantidade e precoUnitario são obrigatórios' });
    }

    // Valida tipos e valores
    const parsedPedidoId = Number(pedidoId);
    const parsedProdutoId = Number(produtoId);
    const parsedQuantidade = Number(quantidade);
    const parsedPrecoUnitario = Number(precoUnitario);
    if (isNaN(parsedPedidoId) || isNaN(parsedProdutoId) || isNaN(parsedQuantidade) || isNaN(parsedPrecoUnitario)) {
      return res.status(400).json({ error: 'Todos os campos devem ser números válidos' });
    }
    if (parsedQuantidade <= 0 || parsedPrecoUnitario <= 0) {
      return res.status(400).json({ error: 'Quantidade e precoUnitario devem ser maiores que zero' });
    }

    // Valida existência de pedido e produto
    const pedido = await prisma.pedido.findUnique({ where: { id: parsedPedidoId } });
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    const produto = await prisma.produto.findUnique({ where: { id: parsedProdutoId } });
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const valor_total = parsedQuantidade * parsedPrecoUnitario;
    const item = await prisma.itemPedido.create({
      data: { pedidoId: parsedPedidoId, produtoId: parsedProdutoId, quantidade: parsedQuantidade, precoUnitario: parsedPrecoUnitario, valor_total },
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function read(req, res) {
  try {
    const itens = await prisma.itemPedido.findMany({ include: { pedido: true, produto: true } });
    res.json(itens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function readOne(req, res) {
  try {
    const item = await prisma.itemPedido.findUnique({
      where: { id: Number(req.params.id) },
      include: { pedido: true, produto: true },
    });
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const { pedidoId, produtoId, quantidade, precoUnitario } = req.body;
    const parsedId = Number(req.params.id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Busca o item existente
    const itemExistente = await prisma.itemPedido.findUnique({ where: { id: parsedId } });
    if (!itemExistente) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    let dataToUpdate = {};
    if (pedidoId !== undefined) {
      const parsedPedidoId = Number(pedidoId);
      const pedido = await prisma.pedido.findUnique({ where: { id: parsedPedidoId } });
      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
      dataToUpdate.pedidoId = parsedPedidoId;
    }
    if (produtoId !== undefined) {
      const parsedProdutoId = Number(produtoId);
      const produto = await prisma.produto.findUnique({ where: { id: parsedProdutoId } });
      if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
      dataToUpdate.produtoId = parsedProdutoId;
    }
    if (quantidade !== undefined) {
      const parsedQuantidade = Number(quantidade);
      if (isNaN(parsedQuantidade) || parsedQuantidade <= 0) {
        return res.status(400).json({ error: 'Quantidade deve ser um número maior que zero' });
      }
      dataToUpdate.quantidade = parsedQuantidade;
    }
    if (precoUnitario !== undefined) {
      const parsedPrecoUnitario = Number(precoUnitario);
      if (isNaN(parsedPrecoUnitario) || parsedPrecoUnitario <= 0) {
        return res.status(400).json({ error: 'precoUnitario deve ser um número maior que zero' });
      }
      dataToUpdate.precoUnitario = parsedPrecoUnitario;
    }

    // Calcula valor_total usando os valores do item existente ou os novos, se fornecidos
    const quantidadeUtilizada = dataToUpdate.quantidade !== undefined ? dataToUpdate.quantidade : itemExistente.quantidade;
    const precoUnitarioUtilizado = dataToUpdate.precoUnitario !== undefined ? dataToUpdate.precoUnitario : itemExistente.precoUnitario;
    const valor_total = quantidadeUtilizada * precoUnitarioUtilizado;
    dataToUpdate.valor_total = valor_total;

    const item = await prisma.itemPedido.update({
      where: { id: parsedId },
      data: dataToUpdate,
      include: { pedido: true, produto: true },
    });
    res.status(200).json(item);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Item não encontrado' });
    res.status(500).json({ error: error.message });
  }
}

async function remove(req, res) {
  try {
    await prisma.itemPedido.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Item não encontrado' });
    res.status(500).json({ error: error.message });
  }
}

module.exports = { create, read, readOne, update, remove };