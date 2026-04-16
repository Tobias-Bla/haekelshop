const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "long",
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatDate(value: Date | string) {
  return dateFormatter.format(new Date(value));
}

export function formatStock(stock: number) {
  if (stock <= 0) {
    return "Ausverkauft";
  }

  if (stock === 1) {
    return "Nur noch 1 Stück";
  }

  return `${stock} Stück verfügbar`;
}
