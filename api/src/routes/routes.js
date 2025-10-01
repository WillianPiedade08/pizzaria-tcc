const express = require('express');
const routes = express.Router();

// Middlewares
const { authMiddleware } = require('../middlewares/auth');          // Funcionários
const { authClienteMiddleware, register, login } = require('../middlewares/authCliente'); // Clientes

// Controllers
const Cliente = require('../controllers/cliente');
const Pedido = require('../controllers/pedido');
const Item = require('../controllers/itemPedido');
const Funcionario = require('../controllers/funcionario');
const Estoque = require('../controllers/movimentoEstoque');
const Produto = require('../controllers/produto');
const Reserva = require('../controllers/reserva');
const { checkout } = require('../controllers/checkout');
const Auth = require('../controllers/auth');

// Rota principal
routes.get('/', (req, res) => res.json({ titulo: 'Pizzaria Seu Zé' }));

// --- Autenticação Funcionário ---
routes.post('/auth/register', Auth.register);
routes.post('/auth/login', Auth.login);

// --- Autenticação Cliente ---
routes.post('/clientes/register', register);
routes.post('/clientes/login', login);

// --- Rotas protegidas de cliente ---
routes.get('/clientes/me', authClienteMiddleware, Cliente.readMe);
routes.get('/clientes', authClienteMiddleware, Cliente.read); // Lista apenas para clientes
routes.get('/clientes/:id', authClienteMiddleware, Cliente.readOne);
routes.put('/clientes/:id', authClienteMiddleware, Cliente.update);
routes.delete('/clientes/:id', authClienteMiddleware, Cliente.remove);

// --- Pedidos do cliente ---
routes.post('/pedidos', authClienteMiddleware, Pedido.create);
routes.get('/pedidos', authClienteMiddleware, Pedido.read);
routes.get('/pedidos/:id', authClienteMiddleware, Pedido.readOne);
routes.put('/pedidos/:id', authClienteMiddleware, Pedido.update);
routes.delete('/pedidos/:id', authClienteMiddleware, Pedido.remove);

// --- Itens de pedido ---
routes.post('/itens', authClienteMiddleware, Item.create);
routes.get('/itens', authClienteMiddleware, Item.read);
routes.get('/itens/:id', authClienteMiddleware, Item.readOne);
routes.put('/itens/:id', authClienteMiddleware, Item.update);
routes.delete('/itens/:id', authClienteMiddleware, Item.remove);

// --- Checkout ---
routes.post('/pedidos/checkout', authClienteMiddleware, checkout);

// --- Rotas protegidas de funcionário ---
routes.get('/funcionarios', authMiddleware, Funcionario.read);
routes.post('/funcionarios', authMiddleware, Funcionario.create);
routes.get('/funcionarios/:id', authMiddleware, Funcionario.readOne);
routes.put('/funcionarios/:id', authMiddleware, Funcionario.update);
routes.delete('/funcionarios/:id', authMiddleware, Funcionario.remove);

// --- Estoque ---
routes.post('/estoque', authMiddleware, Estoque.create);
routes.get('/estoque', authMiddleware, Estoque.read);
routes.get('/estoque/:id', authMiddleware, Estoque.readOne);
routes.put('/estoque/:id', authMiddleware, Estoque.update);
routes.delete('/estoque/:id', authMiddleware, Estoque.remove);

// --- Produtos ---
routes.post('/produtos', authMiddleware, Produto.create);
routes.get('/produtos', authMiddleware, Produto.read);
routes.get('/produtos/:id', authMiddleware, Produto.readOne);
routes.put('/produtos/:id', authMiddleware, Produto.update);
routes.delete('/produtos/:id', authMiddleware, Produto.remove);

// --- Reservas ---
routes.post('/reservas', authClienteMiddleware, Reserva.create);
routes.get('/reservas', authClienteMiddleware, Reserva.read);
routes.get('/reservas/:id', authClienteMiddleware, Reserva.readOne);
routes.put('/reservas/:id', authClienteMiddleware, Reserva.update);
routes.delete('/reservas/:id', authClienteMiddleware, Reserva.remove);

module.exports = routes;