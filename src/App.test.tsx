import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("Renders Wallet", () => {
  render(<App />);
  const title = screen.getByTestId("app-wallet-title");
  expect(title).toBeVisible();
  expect(title.innerHTML).toEqual("My Wallet");
  expect(screen.getByTestId("app-wallet-button")).toBeVisible();
  // NB: testing Exchange's title and button won't be helpful because they are rendered on card's backface and exist in dom
});

test("Flips and renders Exchange", () => {
  render(<App />);
  const card = screen.getByTestId("app-card");
  const button = screen.getByTestId("app-wallet-button");
  fireEvent.click(button);
  const css = window.getComputedStyle(card, null);
  expect(css.transform).toEqual("rotateY(180deg)");
});
