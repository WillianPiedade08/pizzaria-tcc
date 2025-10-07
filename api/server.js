const express = require('express');
require('dotenv').config();
const cors = require('cors');

const routes = require('./src/routes/routes');

const app = express();

// Middleware
app.use(cors()); // Ajuste o origin se necessário
app.use(express.json());

// Rotas
app.use(routes);

// Inicia o servidor
const PORT = process.env.PORT || 5000; // Usa PORT do .env ou 5000 como fallback
app.listen(PORT, () => {
  console.log(`API executando em http://localhost:${PORT}`);
});