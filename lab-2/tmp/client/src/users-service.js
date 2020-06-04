function users() {
  get = function () {
    return axios.get('http://localhost:3000/cars');
  };

  remove = function (index) {
    return axios.delete('http://localhost:3000/cars/'+index);
  };

  return {
    get: get,
    remove: remove
  };
}
