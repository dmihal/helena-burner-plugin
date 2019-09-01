import React, { useState, useEffect } from 'react';
import Market from './containers/Market';

const Markets = ({ plugin, burnerComponents, accounts }) => {
  const [markets, setMarkets] = useState(plugin.getMarkets());

  useEffect(() => {
    const listener = _markets => setMarkets(_markets);
    plugin.addMarketListener(listener);

    return () => plugin.removeMarketListener(listener);
  }, []);

  const { Page } = burnerComponents;
  return (
    <Page title="Helena Markets">
      {markets.map(market => (
        <Market
          marketId={market.address}
          key={market.address}
          burnerComponents={burnerComponents}
          token={plugin.token}
          account={accounts[0]}
        />
      ))}
    </Page>
  );
};

export default Markets;
