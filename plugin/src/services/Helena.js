class HelenaService {
  constructor(httpService, name) {
    this.httpService = httpService;
    this.name = name;
  }

  signUp(user) {
    user.instance = this.name;
    return this.httpService.post('/users', user);
  }
}

export default HelenaService;
