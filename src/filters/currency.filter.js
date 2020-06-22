import store from "../store";

export default function currencyFilter(value, currency = "USD") {
	// eslint-disable-next-line no-debugger
	let locale = store.getters.info.locale || "ru-RU";
	let res = new Intl.NumberFormat(locale, {
		style: "currency",
		currency
	}).format(value);

	return res;
}
