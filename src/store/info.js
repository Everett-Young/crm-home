import firebase from "firebase/app";

export default {
	state: {
		info: {}
	},
	mutations: {
		setInfo(state, info) {
			state.info = info;
		},
		clearInfo(state) {
			state.info = {};
		}
	},
	actions: {
		async removeAvatar({ dispatch, commit }) {
			try {
				let userId = await dispatch("getUid");
				await firebase
					.database()
					.ref(`/users/${userId}/info/avatar`)
					.remove();
				await dispatch("getUserInfo");
			} catch (e) {
				commit("setError", e);
				throw e;
			}
		},
		async updateAvatar({ dispatch, getters }, imgFile) {
			if (!imgFile) return getters.info.avatar || null;
			let userId = await dispatch("getUid");

			let storageRef = await firebase
				.storage()
				.ref(`/user/${userId}/avatars/imageAv`);

			await storageRef.put(imgFile);

			return await storageRef.getDownloadURL();
		},
		async updateInfo({ dispatch, commit, getters }, toUpdate) {
			try {
				let userId = await dispatch("getUid");

				let updateData = {
					...getters.info,
					...toUpdate,
					avatar: await dispatch("updateAvatar", toUpdate.file)
				};
				delete updateData.file;

				await firebase
					.database()
					.ref(`/users/${userId}/info`)
					.update(updateData);
				commit("setInfo", updateData);
			} catch (e) {
				commit("setError", e);
				throw e;
			}
		},
		async getUserInfo({ dispatch, commit }) {
			try {
				let userId = await dispatch("getUid");
				let info = (
					await firebase
						.database()
						.ref(`/users/${userId}/info`)
						.once("value")
				).val();
				commit("setInfo", info);
			} catch (e) {
				commit("setError", e);
				throw e;
			}
		}
	},
	getters: {
		info(state) {
			return state.info;
		}
	}
};
