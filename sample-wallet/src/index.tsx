import React from 'react';
import ReactDOM from 'react-dom';
import BurnerCore from '@burner-wallet/core';
import { xdai, dai, eth, ERC20Asset } from '@burner-wallet/assets';
import { InjectedSigner, LocalSigner } from '@burner-wallet/core/signers';
import { InfuraGateway, InjectedGateway, XDaiGateway, } from '@burner-wallet/core/gateways';
import Exchange from '@burner-wallet/exchange';
import { xdaiBridge, uniswapDai } from '@burner-wallet/exchange/pairs';
import BurnerUI from '@burner-wallet/ui';
import HelenaPlugin from '../../plugin';

const proton = new ERC20Asset({
  id: 'xpp',
  name: 'xP+',
  network: '100',
  address: '0xe22dca93cea79855202bba1bf2a1db48294efb13',
});

const core = new BurnerCore({
  signers: [new InjectedSigner(), new LocalSigner()],
  gateways: [
    new InjectedGateway(),
    new InfuraGateway(process.env.REACT_APP_INFURA_KEY),
    new XDaiGateway(),
  ],
  assets: [proton, xdai, dai, eth],
});

const exchange = new Exchange({
  pairs: [xdaiBridge, uniswapDai],
});

const helena = new HelenaPlugin({
  name: 'Helena Market',
  contact: 'support@helena.network',
  tradingdb: 'https://burner-api.helena.network/api',
  helenaUsers: 'http://localhost:8000',
  token: 'xpp',
});

const BurnerWallet = () =>
  <BurnerUI
    title="Helena Markets"
    core={core}
    plugins={[exchange, helena]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));
