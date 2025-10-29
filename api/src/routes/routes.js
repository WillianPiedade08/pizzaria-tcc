const express = require('express');
const routes = express.Router();

const { authMiddleware } = require('../middlewares/auth');          // Funcionários
const { authClienteMiddleware, register, login } = require('../middlewares/authCliente'); // Clientes

const Cliente = require('../controllers/cliente');
const Pedido = require('../controllers/pedido');
const Item = require('../controllers/itemPedido');
const Funcionario = require('../controllers/funcionario');
const Estoque = require('../controllers/movimentoEstoque');
const Produto = require('../controllers/produto');
const Reserva = require('../controllers/reserva');
const { checkout } = require('../controllers/checkout');
const Auth = require('../controllers/auth');

routes.get('/', (req, res) => res.json({ titulo: 'Pizzaria Seu Zé' }));

routes.post('/auth/register', Auth.register);
routes.post('/auth/login', Auth.login);

routes.post('/clientes/register', register);
routes.post('/clientes/login', login);

routes.get('/clientes/me', authClienteMiddleware, Cliente.readMe);
routes.get('/clientes', authClienteMiddleware, Cliente.read); 
routes.get('/clientes/:id', authClienteMiddleware, Cliente.readOne);
routes.put('/clientes/:id', authClienteMiddleware, Cliente.update);
routes.delete('/clientes/:id', authClienteMiddleware, Cliente.remove);

routes.post('/pedidos', Pedido.create);
routes.get('/pedidos', Pedido.read);
routes.get('/pedidos/:id', Pedido.readOne);
routes.put('/pedidos/:id', Pedido.update);
routes.delete('/pedidos/:id', Pedido.remove);

routes.post('/itens', authClienteMiddleware, Item.create);
routes.get('/itens', authClienteMiddleware, Item.read);
routes.get('/itens/:id', authClienteMiddleware, Item.readOne);
routes.put('/itens/:id', authClienteMiddleware, Item.update);
routes.delete('/itens/:id', authClienteMiddleware, Item.remove);

routes.post('/pedidos/checkout', authClienteMiddleware, checkout);

routes.get('/funcionarios', authMiddleware, Funcionario.read);
routes.post('/funcionarios', authMiddleware, Funcionario.create);
routes.get('/funcionarios/:id', authMiddleware, Funcionario.readOne);
routes.put('/funcionarios/:id', authMiddleware, Funcionario.update);
routes.delete('/funcionarios/:id', authMiddleware, Funcionario.remove);

routes.post('/estoque', authMiddleware, Estoque.create);
routes.get('/estoque', authMiddleware, Estoque.read);
routes.get('/estoque/:id', authMiddleware, Estoque.readOne);
routes.put('/estoque/:id', authMiddleware, Estoque.update);
routes.delete('/estoque/:id', authMiddleware, Estoque.remove);

routes.post('/produtos', authMiddleware, Produto.create);
routes.get('/produtos', authMiddleware, Produto.read);
routes.get('/produtos/:id', authMiddleware, Produto.readOne);
routes.put('/produtos/:id', authMiddleware, Produto.update);
routes.delete('/produtos/:id', authMiddleware, Produto.remove);

routes.post('/reservas', Reserva.create);
routes.get('/reservas', Reserva.read);
routes.get('/reservas/:id', Reserva.readOne);
routes.put('/reservas/:id', Reserva.update);
routes.delete('/reservas/:id', Reserva.remove);

routes.get('/teste-db', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao conectar com o banco' });
  }
});


module.exports = routes;



