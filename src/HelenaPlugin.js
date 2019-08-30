import React from 'react';
import Decimal from 'decimal.js';
import Bet from './pages/Bet';
import Graph from './pages/Graph';
import Market from './pages/Markets';
import { initHelenaConnection, initReadOnlyHelenaConnection } from './utils/pm';
import { initServices, pmService } from './services';
import { getTokenBalance } from './utils/token';

Decimal.set({ toExpPos: 9999, precision: 50 });

export default class HelenaPlugin {
  constructor({ name, contact, tradingdb, helenaUsers, token }) {
    this.name = name;
    this.contact = contact;
    this.tradingdb = tradingdb;
    this.helenaUsers = helenaUsers;
    this.token = token;

    this.markets = [];
    this.marketListeners = new Set();
  }

  constructor() {
    this._pluginContext = null;
  }

  initializePlugin(pluginContext) {
    this._pluginContext = pluginContext;

    pluginContext.addPage('/markets', Markets);
    pluginContext.addHomeButton('Helena Markets', '/markets');
    this.init();
  }

  async init() {
    const { name, tradingdb, helenaUsers } = this;
    const web3 = this._pluginContext.getWeb3('100');
    await Promise.all([
      initReadOnlyHelenaConnection(web3),
      initHelenaConnection(web3),
    ]);
    await initServices({ web3, name, tradingdb, helenaUsers });
    this.updateMarkets();
  }

  getBalance() {
    const balance = await getTokenBalance();
    return Decimal(balance).div(1e18).toDP(4).toString();
  }

  getMarkets() {
    return this.markets;
  }

  addMarketListener(listener) {
    this.changeListeners.add(listener);
  }

  removeMarketListener(listener) {
    this.changeListeners.delete(listener);
  }

  async updateMarkets() {
    this.markets = pmService.getMarkets();
    this.marketListeners.forEach(listener => listener(this.markets));
  }
}
