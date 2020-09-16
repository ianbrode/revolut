import React, { useState } from "react";
import { Provider } from "react-redux";
import store from "./store";
import styled from "@emotion/styled";
import Wallet from "./features/wallet/Wallet";
import Exchange from "./features/exchange/Exchange";
import { ReactComponent as ExchangeI } from "./ico/exchange.svg";
import { ReactComponent as WalletI } from "./ico/wallet.svg";
import { Button, ButtonWrapper } from "./components/button";
import {
  Scene,
  Card,
  CardBackFace,
  CardFace,
} from "./components/flippableCard";

const ExchangeIcon = styled(ExchangeI)`
  fill: white;
  width: 25px;
  height: 25px;
`;

const WalletIcon = styled(WalletI)`
  fill: white;
  width: 25px;
  height: 25px;
`;

const Paper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: rgba(255, 255, 255, 1);
  height: 200px;
  color: #232323;
  padding: 20px;
  width: 100%;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const App = () => {
  const [flipped, setFlip] = useState(false);

  return (
    <Provider store={store}>
      <Scene>
        <Card flipped={flipped} data-testid="app-card">
          <CardFace>
            <Paper>
              <HeaderWrapper>
                <Title data-testid="app-wallet-title">My Wallet</Title>
                <ButtonWrapper>
                  <Button
                    data-testid="app-wallet-button"
                    onClick={() => setFlip(true)}
                  >
                    <ExchangeIcon />
                  </Button>
                </ButtonWrapper>
              </HeaderWrapper>
              <Wallet />
            </Paper>
          </CardFace>
          <CardBackFace>
            <Paper>
              <HeaderWrapper>
                <Title data-testid="app-exchange-title">
                  Currency Exchange
                </Title>
                <ButtonWrapper>
                  <Button
                    data-testid="app-currency-button"
                    onClick={() => setFlip(false)}
                  >
                    <WalletIcon />
                  </Button>
                </ButtonWrapper>
              </HeaderWrapper>
              <Exchange flipped={flipped} />
            </Paper>
          </CardBackFace>
        </Card>
      </Scene>
    </Provider>
  );
};

export default App;
