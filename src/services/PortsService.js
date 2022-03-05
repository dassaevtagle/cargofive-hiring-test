import axios from "axios";

class Service {
  constructor() {
    this.client = axios.create({
      baseURL: 'http://apitest.cargofive.com/api',
    })
  }

  getPorts(page = 1) {
    const url = `/ports?page=${page}`;

    return this.client.get(url);
  }
}

export const PortsService = new Service();
