import { Trade } from '../models/Trade';
import { web3Service } from './index';
import { hexWithoutPrefix } from '../utils/helpers';
import { CategoricalMarket, ScalarMarket } from '../models/Market';

class PMService {
  constructor(httpService, web3, token) {
    this.httpService = httpService;
    this.token = token;
  }

  newMarket(market) {
    return market.event.type === 'CATEGORICAL'
      ? new CategoricalMarket(market)
      : new ScalarMarket(market);
  }

  async getMarkets(tokenAddress) {
    const response = await this.httpService.get('/markets');
    if (!response.results) {
      return [];
    }

    const records = response.results.map(this.newMarket);
    const filteredRecords = records.filter(
      (market) => tokenAddress.substr(2).toLowerCase() === market.collateralToken.toLowerCase()
    );
    return filteredRecords;
  }

  getMarket(marketId) {
    return this.httpService.get(`/markets/${marketId}`).then((response) => {
      if (!response) {
        return {};
      }
      return this.newMarket(response);
    });
  }

  getMarketTrades(marketId) {
    return this.httpService
      .get(`/markets/${marketId}/trades`)
      .then((response) => {
        if (response && response.results.length) {
          return response.results.map((trade) => new Trade(trade));
        }

        return [];
      });
  }

  async getAccountTrades(marketId, account) {
    const normalizedAccount = hexWithoutPrefix(account);
    const response = await this.httpService
      .get(`/markets/${marketId}/trades/${normalizedAccount.toLowerCase()}`);

    if (response && response.results.length) {
      return response.results.map((trade) => new Trade(trade));
    }

    return [];
  }
}

export default PMService;
