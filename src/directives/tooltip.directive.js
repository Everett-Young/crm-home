import localizeFilter from "../filters/localize.filter";

export default {
	bind(el, { value, arg, modifiers }) {
		// eslint-disable-next-line no-undef
		M.Tooltip.init(el, {
			html: modifiers.nlocale ? value : localizeFilter(value),
			position: arg
		});
	},
	unbind(el) {
		// eslint-disable-next-line no-undef
		let tooltip = M.Tooltip.getInstance(el);
		if (tooltip && tooltip.destroy) {
			tooltip.destroy();
		}
	}
};
