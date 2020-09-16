export const currencyFormatter = ({
  base = "USD",
  value = 0,
  style = "currency",
  locale = "en-US",
  dropCurrencySign = false,
}: {
  base?: string;
  value?: number;
  style?: string;
  locale?: string;
  dropCurrencySign?: boolean;
}) => {
  const intl = new Intl.NumberFormat(locale, {
    style,
    currency: base,
  });

  if (dropCurrencySign) {
    return intl
      .formatToParts(value || 0)
      .reduce(
        (acc: string, val: any) =>
          val.type !== "currency" ? acc + val.value : acc,
        ""
      );
  }

  return intl.format(value || 0);
};
