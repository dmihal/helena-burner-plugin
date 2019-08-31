import React from 'react';
import moment from 'moment';
import Button from '../../../../ui-components/Button';
import Input from '../../../../ui-components/Input';
import BarChart from '@material-ui/icons/BarChart';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import Toll from '@material-ui/icons/Toll';

import cn from 'classnames/bind';
import OutcomeCategorical from './OutcomeCategorical';
import OutcomeScalar from './OutcomeScalar';
import { RESOLUTION_TIME } from '../../../../utils/constants';
import style from './index.module.css';

const cx = cn.bind(style);
export default class Market extends React.Component {
  render() {
    const { market, onBet, onDetail, balance, amount, errorAmount, handleBuyTokens, canBet, onChangeAmount } = this.props;

    let marketStatus;
    if (!market.closed && !market.resolved) {
      marketStatus = 'OPEN';
    } else if (market.closed && !market.resolved) {
      marketStatus = 'CLOSED';
    } else if (market.resolved) {
      marketStatus = 'RESOLVED';
    }

    const resolutionDate = moment(market.resolution).format(
      RESOLUTION_TIME.ABSOLUTE_FORMAT
    );
    const bounds = market.bounds
      ? {
          upperBound: market.bounds.upper,
          lowerBound: market.bounds.lower,
          unit: market.bounds.unit,
          decimals: market.bounds.decimals
        }
      : {};

    return (
      <div className={cx('overview-container')}>
        <div className={cx('read')}>
          <div className={cx('title-header')}>
            <div className={cx('title')}>{market.title}</div>
            {/* <div className={cx('subtitle')}>{market.description}</div> */}
          </div>
          {marketStatus !== 'RESOLVED' && (
            <div className={cx('bar-chart')}>
              {market.isScalar ? (
                <OutcomeScalar {...market} {...bounds} />
              ) : (
                <OutcomeCategorical {...market} />
              )}
            </div>
          )}
        </div>
          {marketStatus === 'OPEN' && (
            <div className={cx('bet')}>
              <div className={cx('input-amount')}>
                <Input
                  id="amount"
                  label="Amount of xP+ you want to bet"
                  value={amount}
                  onChange={onChangeAmount}
                  fullWidth
                  error={errorAmount}
                />
              </div>
              <div className={cx('outcomes')}>
                {market.isScalar ? (
                  <React.Fragment>
                    <Button variant="outlined" className={cx('scalar-button', 'button')} size="small" onClick={handleBuyTokens(0)}>
                      Short
                    </Button>
                    <Button variant="outlined" className={cx('scalar-button', 'button')} size="small" onClick={handleBuyTokens(1)}>
                      Long
                    </Button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {market.outcomes.map((outcome, outcomeIndex) => {
                      return <Button variant="outlined" size="small" className={cx('cat-button', 'button')} onClick={handleBuyTokens(outcomeIndex)}>
                        {outcome}
                      </Button>
                    })}
                  </React.Fragment>
                )}
              </div>
            </div>
          )}
          {marketStatus === 'CLOSED' && (
            <div className={cx('market-info', 'market-closed')}>Market closed</div>
          )}
          {marketStatus === 'RESOLVED' && (
            <div className={cx('market-info')}>
              <div className={cx('market-resolved')}>Winning Outcome: {market.winningOutcome}</div>
            </div>
          )}
      </div>
    );
  }
}
