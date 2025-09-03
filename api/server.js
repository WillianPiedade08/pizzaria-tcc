const express = require('express'); // Importa o Express
const routes = require('./src/router'); // importa suas rotas
require('dotenv').config(); // garante que o .env será carregado

const cors = require('cors');
const app = express();

const router = require('./src/router');

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(5000, () => {
  console.log('API executando em http://localhost:5000');


});