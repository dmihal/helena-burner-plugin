import React from 'react';
import cn from 'classnames/bind';
import Overview from './Overview';
import Bet from './Bet';
import Graph from './Graph';
import { pmService } from '../../../services';

import styles from './Market.module.css';

const cx = cn.bind(styles);
const INTERVAL_MARKET_REFRESH = 15000;

export default class Market extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      direction: 1,
      index: 0,
      market: {},
    };
  }

  componentDidMount() {
    this.refreshMarket();

    this.marketInterval = setInterval(
      this.refreshMarket,
      INTERVAL_MARKET_REFRESH
    );
  }

  componentWillUnmount() {
    clearInterval(this.marketInterval);
  }

  toggle = (step) => (e) => {
    this.setState((prevState) => {
      let direction;
      if (prevState.index === 0 && step === 1) {
        direction = 1;
      } else if (prevState.index === 0 && step === 2) {
        direction = -1;
      } else if (prevState.index === 1 && step === 0) {
        direction = -1;
      } else if (prevState.index === 2 && step === 0) {
        direction = 1;
      }
      return { index: step, direction };
    });
  };

  refreshMarket = async () => {
    const market = pmService.getMarket(this.props.marketId);
    this.setState({ market });
  };

  render() {
    const { index, market, direction } = this.state;

    if (!market.title) {
      return 'Loading';
    }

    return (
      <AccountBalance
        asset={this.props.token}
        account={this.props.account}
        render={(err, balance) => (
          <div className={cx('container')}>
            <div className={cx('main')}>
              {index === 0 && (
                <Overview
                  onDetail={this.toggle(2)}
                  onBet={this.toggle(1)}
                  market={market}
                  balance={balance}
                  account={this.props.account}
                />
              )}

              {index === 1 && (
                <Bet
                  market={market}
                  onOverview={this.toggle(0)}
                  balance={balance}
                  canInteract={balance != 0}
                  refreshMarket={this.refreshMarket}
                  account={this.props.account}
                />
              )}

              {index === 2 && (
                <Graph onOverview={this.toggle(0)} market={market} />
              )}
            </div>
          </div>
        )}
      />
    );
  }
}
