import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import styled from "@emotion/styled";

import { currencyFormatter } from "../../components/currency";

export type Pocket = { name: string; amount: number };

const Container = styled.div`
  padding: 12px 0;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
`;

const Wallet: FC = () => {
  const currencies = useSelector((state: RootState) => state.wallet.currencies);

  return (
    <Container data-testid="wallet-container">
      {currencies.map(({ name, amount }: Pocket, i: number) => (
        <Item key={i} data-testid={`wallet-pocket-${name}`}>
          <div data-testid={`wallet-pocket-${name}-name`}>{name}</div>
          <div data-testid={`wallet-pocket-${name}-value`}>
            {currencyFormatter({ base: name, value: amount })}
          </div>
        </Item>
      ))}
    </Container>
  );
};

export default Wallet;
