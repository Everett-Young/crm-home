import store from "../store";
import ru from "../locales/ru";
import en from "../locales/en";

let localesObj = {
	"ru-RU": ru,
	"en-US": en
};

export default function localizeFilter(key, ...args) {
	let locale =
		store.getters.info.locale || localStorage.getItem("locale") || "ru-RU";

	let totalLocalized =
		localesObj[locale][key] || `[Localize error]: key ${key} not found`;

	if (args && localesObj[locale][key]) {
		args.forEach(a => {
			totalLocalized = totalLocalized.replace("$args$", a);
		});
		return totalLocalized;
	}

	return totalLocalized;
}
