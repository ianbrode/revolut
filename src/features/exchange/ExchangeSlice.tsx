import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { exchangeRates } from "../../api";

const namespace = "exchange";

interface InitialState {
  base: string;
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
}

export const initialState: InitialState = {
  base: "USD",
  rates: {},
  loading: false,
  error: null,
};

export const fetchExchange = createAsyncThunk(
  `${namespace}/fetchExchange`,
  async (_, { rejectWithValue, getState }) => {
    try {
      const {
        exchange: { base },
      }: any = getState();

      // NB: OER has cut of individual currency exchange rate on free plan, so have to use bulk response
      const response = await exchangeRates(base);
      return response.data.rates;
    } catch (err) {
      return rejectWithValue("Something went wrong.");
    }
  }
);

let intervalId: ReturnType<typeof setInterval>;

export const stopPollExchange = createAsyncThunk(
  `${namespace}/stopPollExchange`,
  async () => {
    clearInterval(intervalId);
  }
);

export const pollExchange = createAsyncThunk(
  `${namespace}/pollExchange`,
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await dispatch(stopPollExchange());
      await dispatch(fetchExchange());

      intervalId = setInterval(async () => {
        await dispatch(fetchExchange());
      }, 10000);
    } catch (err) {
      return rejectWithValue("Something went wrong.");
    }
  }
);

export const slice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    changeBase: (state, action: PayloadAction<string>) => {
      state.base = action.payload;
    },
  },
  extraReducers: {
    [fetchExchange.pending.type]: (state) => {
      state.loading = true;
    },
    [fetchExchange.fulfilled.type]: (
      state,
      action: PayloadAction<Record<string, number>>
    ) => {
      state.rates = action.payload;
      state.loading = false;
    },
    [fetchExchange.rejected.type]: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { changeBase } = slice.actions;

export default slice.reducer;
