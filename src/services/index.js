import HttpService from './Http';
import PMService from './PM';
import HelenaService from './Helena';

export let pmService;
export let helenaService;

export const initServices = async ({ name, tradingdb, helenaUsers }) => {
  const pmHttpService = new HttpService(tradingdb);
  const helenaHttpService = new HttpService(helenaUsers);

  helenaService = new HelenaService(helenaHttpService, name);
  pmService = new PMService(pmHttpService);
}
