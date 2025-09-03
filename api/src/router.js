const express = require('express');
const routes = express.Router();

const authMiddleware = require('./middlewares/auth');
const Auth = require('./controllers/auth');

const Cliente = require('./controllers/cliente');
const Pedido = require('./controllers/pedido');
const Item = require('./controllers/itemPedido');
const Funcionario = require('./controllers/funcionario');
const Estoque = require('./controllers/movimentoEstoque');
const Produto = require('./controllers/produto');

routes.get('/', (req, res) => res.json({ titulo: 'Pizzaria Seu Zé' }));

// Auth
routes.post('/auth/register', Auth.register);
routes.post('/auth/login', Auth.login);

// Exemplo: proteger tudo abaixo com JWT
routes.use(authMiddleware);

// Clientes
routes.post('/clientes', Cliente.create);
routes.get('/clientes', Cliente.read);
routes.get('/clientes/:id', Cliente.readOne);
routes.put('/clientes/:id', Cliente.update);
routes.delete('/clientes/:id', Cliente.remove);

// Pedidos
routes.post('/pedidos', Pedido.create);
routes.get('/pedidos', Pedido.read);
routes.get('/pedidos/:id', Pedido.readOne);
routes.put('/pedidos/:id', Pedido.update);
routes.delete('/pedidos/:id', Pedido.remove);

// Itens
routes.post('/itens', Item.create);
routes.get('/itens', Item.read);
routes.get('/itens/:id', Item.readOne);
routes.put('/itens/:id', Item.update);
routes.delete('/itens/:id', Item.remove);

// Funcionários (se quiser limitar por cargo, dá pra checar req.user.cargo)
routes.get('/funcionarios', Funcionario.read);
// ...

// Estoque
routes.post('/estoque', Estoque.create);
routes.get('/estoque', Estoque.read);
// ...

// Produtos
routes.post('/produtos', Produto.create);
routes.get('/produtos', Produto.read);
// ...

module.exports = routes;
