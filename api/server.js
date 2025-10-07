const express = require('express');
require('dotenv').config();
const cors = require('cors');

const routes = require('./src/routes/routes');

const app = express();

app.use(cors()); 
app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`API executando em http://localhost:${PORT}`);
});