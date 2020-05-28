var api = require('./src/api.js').app;
var cars = require('./src/cars.json');
const fs = require('fs');

api.get('/', function (request, response) {
  response.json('NodeJS REST API');
});

api.get('/cars', function (request, response) {
  response.json(getCars());
});

api.get('/cars/:index', function (request, response) {
  for(var i=0;i<cars.length;i++){
    if (i == request.params.index) response.json(cars[i]);
  }
  response.json('not found');
});

api.put('/cars', function (request, response) {
  // ce se intampla daca nu avem fisier initial cu array vid?
  saveCar(request.body);
  // console.table(request.body);
  response.json('User was saved succesfully');
});

api.post('/cars', function (request, response) {
  // citim cars din fisier
  // cautam daca exista indexul de pe request.body
  // daca exista actualizam parametrii
  // salvam in fisier
  response.json('User was saved succesfully');
});

api.delete('/cars/:index', function (request, response) {
  cars.splice(request.params.index, 1);
  response.json('User with index ' + request.params.index + ' was deleted');
});

api.listen(3000, function () {
  console.log('Server running @ localhost:3000');
});

function getCars() {
  let cars = [];
  try {
    cars = JSON.parse(fs.readFileSync("./src/cars-tmp.json", 'utf8'));
  } catch (err) {
    console.error(err);
    return false;
  }
  return cars;
}

function saveCar(car) {
  cars = getCars();
  cars.push(car);
  try {
    fs.writeFileSync("./src/cars-tmp.json", JSON.stringify(cars));
  } catch (err) {
    console.error(err)
  }
}