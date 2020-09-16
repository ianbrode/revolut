import { screen, fireEvent, waitFor } from "@testing-library/react";
import Exchange from "./Exchange";
import React from "react";
import exchangeReducer, { changeBase } from "./ExchangeSlice";
import { renderWithRedux, rootInitialState } from "utils/test-helpers";
import axios from "axios";
import { fetchExchange, pollExchange, stopPollExchange } from "./ExchangeSlice";
import { commitExchange } from "../global/GlobalSlice";
import { changeAmount } from "../wallet/WalletSlice";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("<Exchange />", () => {
  test("Exchange renders with sufficient items", () => {
    renderWithRedux(<Exchange />);

    expect(screen.getByTestId("exchange-wrapper")).toBeVisible();
    expect(screen.getByTestId("exchange-column1")).toBeVisible();
    expect(screen.getByTestId("exchange-column2")).toBeVisible();

    expect(screen.getByTestId("exchange-currency_selector")).toBeVisible();
    expect(
      screen.getByTestId("exchange-currency_selector_sell_name")
    ).toBeVisible();
    expect(
      screen.getByTestId("exchange-currency_selector_sell_select")
    ).toBeVisible();
    expect(screen.getByTestId("exchange-sell-input")).toBeVisible();
    expect(screen.getByTestId("exchange-sell-balance")).toBeVisible();
    expect(
      screen.getByTestId("exchange-currency_selector_buy_name")
    ).toBeVisible();
    expect(
      screen.getByTestId("exchange-currency_selector_buy_select")
    ).toBeVisible();
    expect(screen.getByTestId("exchange-buy-input")).toBeVisible();
    expect(screen.getByTestId("exchange-buy-balance")).toBeVisible();
    expect(screen.getByTestId("exchange-rate")).toBeVisible();
    expect(screen.getByTestId("exchange-commit")).toBeVisible();
  });

  test("Polling Started and works after start", async () => {
    const result = { rates: { EUR: 0.844153, GBP: 0.77557, USD: 1 } };
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: result });
    const { mockStore } = renderWithRedux(<Exchange flipped={true} />);
    jest.useFakeTimers();
    await waitFor(() => null, { timeout: 100 });
    expect(mockStore.getActions()[0].type).toEqual(pollExchange.pending.type);
    expect(mockStore.getActions()[1].type).toEqual(
      stopPollExchange.pending.type
    );
    expect(mockStore.getActions()[2].type).toEqual(
      stopPollExchange.fulfilled.type
    );
    expect(mockStore.getActions()[3].type).toEqual(fetchExchange.pending.type);
    expect(mockStore.getActions()[4].type).toEqual(
      fetchExchange.fulfilled.type
    );
    expect(mockStore.getActions()[4].payload).toEqual(result.rates);
    expect(mockStore.getActions()[5].type).toEqual(pollExchange.fulfilled.type);

    jest.advanceTimersByTime(10000);

    // Initial call and advanceTimersByTime
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  test("Sets loading on fetch start", () => {
    expect(
      exchangeReducer({ ...rootInitialState.exchange }, fetchExchange.pending)
    ).toEqual({ ...rootInitialState.exchange, loading: true });
  });

  test("Base currency change", () => {
    expect(
      exchangeReducer(
        { ...rootInitialState.exchange },
        {
          type: changeBase,
          payload: "EUR",
        }
      )
    ).toEqual({ ...rootInitialState.exchange, base: "EUR" });
  });

  test("Rates are processed by store properly ", () => {
    expect(
      exchangeReducer(
        { ...rootInitialState.exchange },
        {
          type: fetchExchange.fulfilled.type,
          payload: { EUR: 0.844153, GBP: 0.77557, USD: 1 },
        }
      )
    ).toEqual({
      ...rootInitialState.exchange,
      rates: { EUR: 0.844153, GBP: 0.77557, USD: 1 },
    });
  });

  test("Rates are rendered and properly calculated", async () => {
    renderWithRedux(<Exchange flipped={true} />, {
      ...rootInitialState,
      exchange: {
        ...rootInitialState.exchange,
        rates: { EUR: 0.844153, GBP: 0.77557, USD: 1 },
      },
    });

    const rate = screen.getByTestId("exchange-rate");
    const rateValue = `Rate $1.00
 = €0.84`;

    const sellInput = screen.getByTestId("exchange-sell-input");
    const buyInput = screen.getByTestId("exchange-buy-input");

    fireEvent.change(sellInput, {
      target: {
        value: 20,
      },
    });

    expect(rate.innerHTML.replace(/  +/g, " ").trim()).toEqual(rateValue);
    expect(sellInput).toHaveValue("20");
    expect(buyInput).toHaveValue("16.88");

    const buySelector = screen.getByTestId(
      "exchange-currency_selector_buy_select"
    );

    fireEvent.change(buySelector, {
      target: {
        value: "GBP",
      },
    });

    expect(buyInput).toHaveValue("15.51");
  });
});

test("Exchange is commited", async () => {
  const { mockStore } = renderWithRedux(<Exchange flipped={false} />, {
    ...rootInitialState,
    exchange: {
      ...rootInitialState.exchange,
      rates: { EUR: 0.844153, GBP: 0.77557, USD: 1 },
    },
  });

  const sellInput = screen.getByTestId("exchange-sell-input");

  fireEvent.change(sellInput, {
    target: {
      value: 20,
    },
  });

  const commit = screen.getByTestId("exchange-commit");
  fireEvent.click(commit);

  const buyInput = screen.getByTestId("exchange-buy-input");

  expect(buyInput).toHaveValue("0.00");
  expect(sellInput).toHaveValue("");
  await waitFor(() => null, { timeout: 100 });
  expect(mockStore.getActions()[0].type).toEqual(stopPollExchange.pending.type);
  expect(mockStore.getActions()[1].type).toEqual(commitExchange.pending.type);
  expect(mockStore.getActions()[2].type).toEqual(changeAmount.type);
  expect(mockStore.getActions()[2].payload).toEqual({
    amount: -20,
    currency: "USD",
  });
  expect(mockStore.getActions()[3].type).toEqual(changeAmount.type);
  expect(mockStore.getActions()[3].payload).toEqual({
    amount: 16.88306,
    currency: "EUR",
  });
  expect(mockStore.getActions()[4].type).toEqual(
    stopPollExchange.fulfilled.type
  );
  expect(mockStore.getActions()[5].type).toEqual(commitExchange.fulfilled.type);
});
