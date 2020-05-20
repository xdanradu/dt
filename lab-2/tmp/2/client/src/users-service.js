function users() {
  get = function () {
    return axios.get('http://localhost:3000/users');
  };

  remove = function (index) {
    return axios.delete('http://localhost:3000/users/'+index);
  };

  return {
    get: get,
    remove: remove
  };
}
