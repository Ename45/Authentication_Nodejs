require("./configurations/databaseConnect");

const express = require('express');
const cors = require('cors');

const bodyParser = express.json;

const app = express();

app.use(bodyParser());
app.use(cors());


module.exports = app;