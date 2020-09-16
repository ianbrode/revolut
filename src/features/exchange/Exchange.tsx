import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { changeBase, pollExchange, stopPollExchange } from "./ExchangeSlice";
import { commitExchange } from "../global/GlobalSlice";
import { Pocket } from "../wallet/Wallet";
import Input from "../../components/input";
import { Button } from "../../components/button";
import { currencyFormatter } from "../../components/currency";
import {
  Wrapper,
  Column,
  CurrencySelector,
  Rate,
  Footer,
  AcceptIcon,
  Balance,
} from "./style";

const Exchange: FC<any> = (props) => {
  const { flipped } = props;
  const dispatch = useDispatch();
  const base = useSelector((state: RootState) => state.exchange.base);
  const rates = useSelector((state: RootState) => state.exchange.rates);
  const currencies = useSelector((state: RootState) => state.wallet.currencies);
  const [targetCurrency, selectTargetCurrency] = useState(
    currencies[1].name || "USD"
  );
  const [baseAmount, setBaseAmount] = useState("");

  useEffect(() => {
    if (flipped) {
      dispatch(pollExchange());
    } else {
      dispatch(stopPollExchange());
    }
  }, [flipped]);

  const baseInPocket = currencies.find(
    (pocket: Pocket) => pocket.name === base
  );

  const targetInPocket = currencies.find(
    (pocket: Pocket) => pocket.name === targetCurrency
  );

  const overdraft = +baseAmount > (baseInPocket?.amount || 0);

  const disabled =
    base === targetCurrency || !parseFloat(baseAmount) || overdraft;

  return (
    <>
      <Wrapper data-testid="exchange-wrapper">
        <Column data-testid="exchange-column1">
          <CurrencySelector data-testid="exchange-currency_selector">
            <span data-testid="exchange-currency_selector_sell_name">Sell</span>
            <select
              data-testid="exchange-currency_selector_sell_select"
              value={base}
              onChange={(event) => {
                dispatch(changeBase(event.target.value));
              }}
            >
              {currencies.map((e: any, i: number) => (
                <option key={i} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
          </CurrencySelector>
          <Input
            dataTest="exchange-sell-input"
            type="currency"
            value={baseAmount}
            onChange={(val: string) => {
              setBaseAmount(val);
            }}
          />
          <Balance
            data-testid="exchange-sell-balance"
            overdraft={overdraft}
          >{`You have ${currencyFormatter({
            base: baseInPocket?.name,
            value: baseInPocket?.amount,
          })}`}</Balance>
        </Column>
        <Column data-testid="exchange-column2">
          <CurrencySelector>
            <span data-testid="exchange-currency_selector_buy_name">Buy</span>
            <select
              data-testid="exchange-currency_selector_buy_select"
              value={targetCurrency}
              onChange={(event) => {
                selectTargetCurrency(event.target.value);
              }}
            >
              {currencies.map((e: any, i: number) => (
                <option key={i} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
          </CurrencySelector>
          <div>
            <Input
              dataTest="exchange-buy-input"
              value={currencyFormatter({
                base: targetCurrency,
                value: +baseAmount * rates[targetCurrency],
                dropCurrencySign: true,
              })}
              type="currency"
              disabled
            />
            <Balance data-testid="exchange-buy-balance">{`You have ${currencyFormatter(
              {
                base: targetInPocket?.name,
                value: targetInPocket?.amount,
              }
            )}`}</Balance>
          </div>
        </Column>
      </Wrapper>
      <Footer>
        <Rate data-testid="exchange-rate">
          {`Rate ${currencyFormatter({ base, value: 1 })}
            = ${currencyFormatter({
              base: targetCurrency,
              value: rates[targetCurrency],
            })}
          `}
        </Rate>
        <Button
          data-testid="exchange-commit"
          disabled={disabled}
          onClick={() => {
            dispatch(
              commitExchange({
                base,
                baseAmount: +baseAmount,
                target: targetCurrency,
                targetAmount: +baseAmount * rates[targetCurrency],
              })
            );
            setBaseAmount("");
          }}
        >
          <AcceptIcon />
        </Button>
      </Footer>
    </>
  );
};

export default Exchange;
