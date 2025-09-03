// src/routes/routes.js
const express = require('express');
const routes = express.Router();

// Middlewares
const { authMiddleware } = require('../middlewares/auth');          // Funcionários
const { authClienteMiddleware } = require('../middlewares/authCliente'); // Clientes

// Controllers
const AuthFuncionario = require('../controllers/auth');       // Funcionários
const AuthCliente = require('../middlewares/authCliente');   // Clientes
const Cliente = require('../controllers/cliente');
const Pedido = require('../controllers/pedido');
const Item = require('../controllers/itemPedido');
const Funcionario = require('../controllers/funcionario');
const Estoque = require('../controllers/movimentoEstoque');
const Produto = require('../controllers/produto');
const { checkout } = require('../controllers/checkout');

// Rota principal
routes.get('/', (req, res) => res.json({ titulo: 'Pizzaria Seu Zé' }));

// --- Autenticação Funcionário ---
routes.post('/auth/register', AuthFuncionario.register);
routes.post('/auth/login', AuthFuncionario.login);

// --- Autenticação Cliente ---
routes.post('/clientes/register', AuthCliente.register);
routes.post('/clientes/login', AuthCliente.login);

// --- Rotas protegidas de cliente ---
routes.get('/clientes/me', authClienteMiddleware, Cliente.readOne); // Dados do cliente logado
routes.put('/clientes/me', authClienteMiddleware, Cliente.update);
routes.delete('/clientes/me', authClienteMiddleware, Cliente.remove);

// Pedidos do cliente
routes.post('/pedidos', authClienteMiddleware, Pedido.create);
routes.get('/pedidos', authClienteMiddleware, Pedido.read);
routes.get('/pedidos/:id', authClienteMiddleware, Pedido.readOne);
routes.put('/pedidos/:id', authClienteMiddleware, Pedido.update);
routes.delete('/pedidos/:id', authClienteMiddleware, Pedido.remove);

// Itens de pedido
routes.post('/itens', authClienteMiddleware, Item.create);
routes.get('/itens', authClienteMiddleware, Item.read);
routes.get('/itens/:id', authClienteMiddleware, Item.readOne);
routes.put('/itens/:id', authClienteMiddleware, Item.update);
routes.delete('/itens/:id', authClienteMiddleware, Item.remove);

// Checkout
routes.post('/checkout', authClienteMiddleware, checkout);

// --- Rotas protegidas de funcionário ---
routes.get('/funcionarios', authMiddleware, Funcionario.read);

// Estoque
routes.post('/estoque', authMiddleware, Estoque.create);
routes.get('/estoque', authMiddleware, Estoque.read);

// Produtos
routes.post('/produtos', authMiddleware, Produto.create);
routes.get('/produtos', authMiddleware, Produto.read);

module.exports = routes;
