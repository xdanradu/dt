function users() {
  get = function () {
    return axios.get('http://localhost:3000/users');
  };

  return {
    get: get
  };
}
