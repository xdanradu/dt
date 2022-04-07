let express = require('express');
let cors = require('cors');
let app = express();
app.use(cors());

let bodyParser = require('body-parser');
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

exports.app = app;
