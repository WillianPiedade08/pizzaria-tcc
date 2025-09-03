const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const SECRET = "segredo_super_secreto"; // 🔒 coloque no .env

async function checkout(req, res) {
  try {
    const { nome, telefone, endereco, pagamento, carrinho } = req.body;

    if (!nome || !telefone || !carrinho || carrinho.length === 0) {
      return res.status(400).json({ error: "Dados incompletos para finalizar pedido" });
    }

    // 1. Criar cliente
    const cliente = await prisma.cliente.create({
      data: { nome, telefone, endereco }
    });

    // 2. Gerar token para o cliente
    const token = jwt.sign({ cliente_id: cliente.cliente_id }, SECRET, { expiresIn: "2h" });

    // 3. Calcular subtotal
    const sub_total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    // 4. Criar pedido
    const pedido = await prisma.pedido.create({
      data: {
        cliente_id: cliente.cliente_id,
        sub_total,
        itens: {
          create: carrinho.map(item => ({
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade
          }))
        }
      },
      include: { itens: true }
    });

    return res.status(201).json({ cliente, token, pedido });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { checkout };
