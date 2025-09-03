const express = require('express'); 
const routes = require('./src/routes/routes'); 
require('dotenv').config(); 

const cors = require('cors');
const app = express();

const router = require('./src/routes/routes');

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(5000, () => {
  console.log('API executando em http://localhost:5000');


});