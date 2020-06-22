import localizeFilter from "../filters/localize.filter";

export default {
	install(Vue) {
		Vue.prototype.$metaTitle = function(titleKey) {
			let appName = process.env.VUE_APP_TITLE;

			return `${localizeFilter(titleKey)} - ${appName}`;
		};
	}
};
