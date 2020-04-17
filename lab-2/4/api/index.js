var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());
var bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.json({ message: "REST API" });
});

app.post("/login", function (request, response) {
  if (request.body.username == "admin" && request.body.password == "1234") {
    response.json({ status: "ALLOW" });
  } else {
    response.json({ status: "DENY" });
  }
});

app.listen(3000, function () {
  console.log("Server running @ localhost:3000");
});
