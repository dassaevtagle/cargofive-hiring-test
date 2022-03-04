import axios from "axios";

class Service {
  constructor() {
    this.client = axios.create({
      baseURL: 'http://apitest.cargofive.com/api',
    })
  }

  getPorts() {
    const url = '/ports?page=2';

    return this.client.get(url);
  }
}

export const PortsService = new Service();
