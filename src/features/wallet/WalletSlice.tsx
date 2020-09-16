import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Pocket } from "./Wallet";

const namespace = "wallet";

interface InitialState {
  currencies: Pocket[];
  loading: boolean;
  error: string | null;
}

export const initialState: InitialState = {
  currencies: [
    { name: "USD", amount: 1000 },
    { name: "EUR", amount: 1000 },
    { name: "GBP", amount: 1000 },
  ],
  loading: false,
  error: null,
};

export const slice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    changeAmount: (
      state,
      action: PayloadAction<{ currency: string; amount: number }>
    ) => {
      const { currency, amount } = action.payload;

      const pocket = state.currencies.find(
        (pocket: Pocket) => pocket.name === currency
      );

      if (pocket) {
        pocket.amount += amount;
      }
    },
  },
});

export const { changeAmount } = slice.actions;

export default slice.reducer;
