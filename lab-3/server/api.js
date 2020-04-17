var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());

var bodyParser = require('body-parser');
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

exports.app = app;
