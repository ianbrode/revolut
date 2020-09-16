import { screen } from "@testing-library/react";
import Wallet from "./Wallet";
import React from "react";
import walletReducer, { changeAmount } from "./WalletSlice";
import { renderWithRedux, rootInitialState } from "utils/test-helpers";

describe("<Wallet />", () => {
  test("Container render with pockets", () => {
    renderWithRedux(<Wallet />);
    expect(screen.getByTestId("wallet-container")).toBeVisible();
    expect(screen.getByTestId("wallet-pocket-USD")).toBeVisible();
    expect(screen.getByTestId("wallet-pocket-EUR")).toBeVisible();
    expect(screen.getByTestId("wallet-pocket-GBP")).toBeVisible();
  });

  test("Pocket render with USD", () => {
    renderWithRedux(<Wallet />);
    const name = screen.getByTestId("wallet-pocket-USD-name");
    const value = screen.getByTestId("wallet-pocket-USD-value");

    expect(name).toBeVisible();
    expect(value).toBeVisible();

    expect(name.innerHTML).toEqual("USD");
    expect(value.innerHTML).toEqual("$1,000.00");
  });

  test("Pocket render with EUR", () => {
    renderWithRedux(<Wallet />);
    const name = screen.getByTestId("wallet-pocket-EUR-name");
    const value = screen.getByTestId("wallet-pocket-EUR-value");

    expect(name).toBeVisible();
    expect(value).toBeVisible();

    expect(name.innerHTML).toEqual("EUR");
    expect(value.innerHTML).toEqual("€1,000.00");
  });

  test("Pocket render with GBP", () => {
    renderWithRedux(<Wallet />);
    const name = screen.getByTestId("wallet-pocket-GBP-name");
    const value = screen.getByTestId("wallet-pocket-GBP-value");

    expect(name).toBeVisible();
    expect(value).toBeVisible();

    expect(name.innerHTML).toEqual("GBP");
    expect(value.innerHTML).toEqual("£1,000.00");
  });
});

describe("WalletSlice", () => {
  test("Wallet balance changes", () => {
    expect(
      walletReducer(
        { ...rootInitialState.wallet },
        {
          type: changeAmount,
          payload: { currency: "USD", amount: 100 },
        }
      )
    ).toEqual({
      ...rootInitialState.wallet,
      currencies: rootInitialState.wallet.currencies.map((pocket) => {
        if (pocket.name === "USD") {
          pocket.amount = 1100;
        }

        return pocket;
      }),
    });
  });
});
