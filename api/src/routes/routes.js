const express = require('express');
const routes = express.Router();

// Middlewares
const { authMiddleware } = require('../middlewares/auth');          // Funcionários
const { authClienteMiddleware, register, login } = require('../middlewares/authCliente'); // Clientes

// Controllers
const Cliente = require('../controllers/cliente');
const Pedido = require('../controllers/pedido')
const Item = require('../controllers/itemPedido');
const Funcionario = require('../controllers/funcionario');
const Estoque = require('../controllers/movimentoEstoque');
const Produto = require('../controllers/produto');
const { checkout } = require('../controllers/checkout');

// Rota principal
routes.get('/', (req, res) => res.json({ titulo: 'Pizzaria Seu Zé' }));

// --- Autenticação Funcionário ---
routes.post('/auth/register', authMiddleware, require('../controllers/auth').register); // Adicionei authMiddleware se necessário
routes.post('/auth/login', require('../controllers/auth').login);

// --- Autenticação Cliente ---
routes.post('/clientes/register', register);
routes.post('/clientes/login', login);

// --- Rotas protegidas de cliente ---
routes.get('/clientes/me', authClienteMiddleware, Cliente.readMe); // Substitui readOne para /clientes/me
routes.get('/clientes/:id', authClienteMiddleware, Cliente.readOne);
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
routes.post('/pedidos/checkout', authClienteMiddleware, checkout); // Ajustei para /pedidos/checkout

// --- Rotas protegidas de funcionário ---
routes.get('/funcionarios', authMiddleware, Funcionario.read);

// Estoque
routes.post('/estoque', authMiddleware, Estoque.create);
routes.get('/estoque', authMiddleware, Estoque.read);

// Produtos
routes.post('/produtos', authMiddleware, Produto.create);
routes.get('/produtos', authMiddleware, Produto.read);

module.exports = routes;