import firebase from "firebase/app";

export default {
	actions: {
		async createRecord({ dispatch, commit }, record) {
			try {
				let uId = await dispatch("getUid");
				return await firebase
					.database()
					.ref(`/users/${uId}/records`)
					.push(record);
			} catch (e) {
				commit("setError", e);
				throw e;
			}
		},
		async fetchRecords({ dispatch, commit }) {
			try {
				let uid = await dispatch("getUid");
				let records =
					(
						await firebase
							.database()
							.ref(`users/${uid}/records`)
							.once("value")
					).val() || {};

				return Object.keys(records).map(key => ({
					...records[key],
					id: key
				}));
			} catch (e) {
				commit("setError", e);
				throw e;
			}
		},
		async fetchRecordsById({ dispatch, commit }, id) {
			try {
				let uid = await dispatch("getUid");
				let record =
					(
						await firebase
							.database()
							.ref(`users/${uid}/records`)
							.child(id)
							.once("value")
					).val() || {};

				return {
					...record,
					id
				};
			} catch (e) {
				commit("setError", e);
				throw e;
			}
		}
	}
};
