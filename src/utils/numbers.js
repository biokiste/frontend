const Euro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR"
});

export function toCurrency(value, currency = "Euro") {
  return getCurrencyFormat(currency).format(value);
}

export function fromCurrency(value, currency = "Euro") {
  return parseFloat(
    value
      .replace(getCurrencyGroupDivider(currency), "")
      .replace(getCurrencyDecimalDivider(currency), ".")
  );
}

export function getCurrencyGroupDivider(currency) {
  return getCurrencyFormat(currency)
    .format(1111)
    .replace("1", "");
}

export function getCurrencyDecimalDivider(currency) {
  return getCurrencyFormat(currency)
    .format(1.1)
    .replace("1", "");
}

function getCurrencyFormat(currency) {
  return Euro;
}
