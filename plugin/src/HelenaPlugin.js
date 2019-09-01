import React from 'react';
import Decimal from 'decimal.js';
import Markets from './pages/Markets';
import { initHelenaConnection, initReadOnlyHelenaConnection } from './utils/pm';
import { initServices, pmService } from './services';

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
    this._pluginContext = null;
  }

  initializePlugin(pluginContext) {
    this._pluginContext = pluginContext;

    pluginContext.addPage('/markets', Markets);
    pluginContext.addHomeButton('Helena Markets', '/markets');
    this.init();
  }

  async init() {
    const { name, tradingdb, helenaUsers, token } = this;
    const web3 = this._pluginContext.getWeb3('100');
    await Promise.all([
      initReadOnlyHelenaConnection(web3),
      initHelenaConnection(web3),
    ]);
    await initServices({ web3, name, tradingdb, helenaUsers, token });
    this.updateMarkets();
  }

  getToken() {
    const [token] = this._pluginContext.getAssets().filter(asset => asset.id === this.token);
    if (!token) {
      throw new Error(`Can't find token ${this.token}`);
    }
    return token;
  }

  getMarkets() {
    return this.markets;
  }

  addMarketListener(listener) {
    this.marketListeners.add(listener);
  }

  removeMarketListener(listener) {
    this.marketListeners.delete(listener);
  }

  async updateMarkets() {
    this.markets = await pmService.getMarkets(this.getToken().address);
    this.marketListeners.forEach(listener => listener(this.markets));
  }
}
