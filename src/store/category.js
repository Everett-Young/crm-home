import firebase from "firebase/app";

export default {
	actions: {
		async createCategory({ commit, dispatch }, { title, limit }) {
			try {
				let uid = await dispatch("getUid");
				let category = await firebase
					.database()
					.ref(`users/${uid}/categories`)
					.push({ title, limit });
				return {
					title: title,
					limit: limit,
					id: category.key
				};
			} catch (e) {
				commit("setError", e);
				console.log(e);
				throw e;
			}
		},
		async updateCategory({ commit, dispatch }, { title, limit, id }) {
			try {
				let uid = await dispatch("getUid");
				await firebase
					.database()
					.ref(`users/${uid}/categories`)
					.child(id)
					.update({ title, limit });
			} catch (e) {
				commit("setError", e);
				console.log(e);
				throw e;
			}
		},
		async getCategories({ commit, dispatch }) {
			try {
				let uid = await dispatch("getUid");
				let categories =
					(
						await firebase
							.database()
							.ref(`users/${uid}/categories`)
							.once("value")
					).val() || {};

				return Object.keys(categories).map(key => ({
					...categories[key],
					id: key
				}));
			} catch (e) {
				commit("setError", e);
				console.log(e);
				throw e;
			}
		},
		async getCategoriesById({ commit, dispatch }, id) {
			try {
				let uid = await dispatch("getUid");
				let category =
					(
						await firebase
							.database()
							.ref(`users/${uid}/categories`)
							.child(id)
							.once("value")
					).val() || {};

				return {
					...category,
					id
				};
			} catch (e) {
				commit("setError", e);
				console.log(e);
				throw e;
			}
		}
	}
};
