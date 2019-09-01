## Helena Plugin

Plugin to add Helena markets to the [Burner Wallet 2](https://github.com/dmihal/burner-wallet-2)


### Setup
Add a token and Helena Plugin to your wallet entry point

```
const proton = new ERC20Asset({
  id: 'xpp',
  name: 'xP+',
  network: '100',
  address: '0xe22dca93cea79855202bba1bf2a1db48294efb13',
});

const core = new BurnerCore({
  ...
  assets: [proton, ...],
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
    ...
    plugins={[helena]}
  />
```
