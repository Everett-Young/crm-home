import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
import info from "./info";
import category from "./category";
import record from "./record";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		error: null
	},
	mutations: {
		setError(state, error) {
			state.error = error;
		},
		clearError(state) {
			state.error = null;
		}
	},
	getters: {
		error(state) {
			return state.error;
		}
	},
	actions: {
		async fetchCurrency() {
			//let key = process.env.VUE_APP_FIXER;
			let res = await fetch(
				`https://api.ratesapi.io/api/latest?base=USD&symbols=EUR,USD,DKK`
			);
			return await res.json();
		}
	},
	modules: {
		auth,
		info,
		category,
		record
	}
});
