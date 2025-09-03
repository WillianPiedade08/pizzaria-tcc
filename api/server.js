// server.js
const express = require('express'); 
require('dotenv').config(); 
const cors = require('cors');

const routes = require('./src/routes/routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(5000, () => {
  console.log('API executando em http://localhost:5000');
});
