import firebase from "firebase/app";

export default {
	actions: {
		async login({ commit }, { email, password }) {
			try {
				await firebase.auth().signInWithEmailAndPassword(email, password);
			} catch (e) {
				commit("setError", e);
				throw e;
			}
		},

		async logout({ commit }) {
			await firebase.auth().signOut();
			commit("clearInfo");
		},

		async register({ dispatch, commit }, { email, password, name }) {
			try {
				await firebase.auth().createUserWithEmailAndPassword(email, password);
				let uid = await dispatch("getUid");
				await firebase
					.database()
					.ref(`/users/${uid}/info`)
					.set({
						bill: 1000,
						name: name,
						locale: "ru-RU"
					});
			} catch (e) {
				commit("setError", e);
				throw e;
			}
		},

		getUid() {
			let user = firebase.auth().currentUser;
			return user ? user.uid : null;
		}
	}
};
