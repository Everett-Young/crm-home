import Vue from "vue";
import Vuelidate from "vuelidate";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import dateFilters from "@/filters/date.filter.js";
import currencyFilter from "@/filters/currency.filter.js";
import localizeFilter from "@/filters/localize.filter.js";

import VueMeta from "vue-meta";
import metaTitle from "@/utils/metaTitle.plugin";
import tooltipDirective from "@/directives/tooltip.directive";
import messagePlugin from "@/utils/message.plugin.js";
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";
import Loader from "@/components/app/Loader";
import Paginate from "vuejs-paginate";

import firebase from "firebase/app";
import 'firebase/storage';
import "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false;

Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.use(VueMeta, {
	refreshOnceOnNavigation: true
});

Vue.use(metaTitle);

Vue.filter("date", dateFilters);
Vue.filter("currencyFilter", currencyFilter);
Vue.filter("localize", localizeFilter);

Vue.directive("tooltip", tooltipDirective);

Vue.component("paginate", Paginate);
Vue.component(Loader);

firebase.initializeApp({
	apiKey: "AIzaSyBCTFCDzL6MjyaX9EeT1wK8bcZq7Le6NcI",
	authDomain: "crm-home-f648f.firebaseapp.com",
	databaseURL: "https://crm-home-f648f.firebaseio.com",
	projectId: "crm-home-f648f",
	storageBucket: "crm-home-f648f.appspot.com",
	messagingSenderId: "593489671375",
	appId: "1:593489671375:web:25407d35116763cd7c73ba",
	measurementId: "G-7YYKV8SM1S"
});

let app;

firebase.auth().onAuthStateChanged(() => {
	if (!app) {
		app = new Vue({
			router,
			store,
			render: h => h(App)
		}).$mount("#app");
	}
});
