import { createAsyncThunk } from "@reduxjs/toolkit";

import { changeAmount } from "../wallet/WalletSlice";

const namespace = "global";

interface ExchangePayload {
  base: string;
  baseAmount: number;
  target: string;
  targetAmount: number;
}

export const commitExchange = createAsyncThunk(
  `${namespace}/commitExchange`,
  async (payload: ExchangePayload, { rejectWithValue, dispatch }) => {
    try {
      const { base, baseAmount, target, targetAmount } = payload;

      dispatch(changeAmount({ currency: base, amount: -baseAmount }));
      dispatch(changeAmount({ currency: target, amount: targetAmount }));
    } catch (err) {
      return rejectWithValue("Something went wrong.");
    }
  }
);
