import HttpService from './Http';
import PMService from './PM';
import Web3Service from './Web3';
import HelenaService from './Helena';


export let pmService;
export let helenaService;
export let web3Service;

export const initServices = async ({ web3, name, tradingdb, helenaUsers }) => {
  const pmHttpService = new HttpService(tradingdb);
  const helenaHttpService = new HttpService(helenaUsers);

  helenaService = new HelenaService(helenaHttpService, name);
  pmService = new PMService(pmHttpService);
  web3Service = new Web3Service(web3);
  await web3Service.init();
}
