<template>
	<div>
		<div class="page-title">
			<h3>{{ "profileTitle" | localize }}</h3>
		</div>
		<div class="avatar-wrapper">
			<avatar :username="name" :customStyle="avatarStyleObj" :size="100" :src="info.avatar"></avatar>
			<button class="btn-small" @click="removeHandler"><i class="material-icons">broken_image</i></button>
		</div>
		<form class="form" @submit.prevent="submitHandler">
			<div class="input-field">
				<input
					id="description"
					type="text"
					v-model="name"
					:class="{
						invalid: $v.name.$dirty && !$v.name.required
					}"
				/>
				<label for="description">{{ "ProfileName" | localize }}</label>
				<span
					v-if="$v.name.$dirty && !$v.name.required"
					class="helper-text invalid"
				>
					{{ "ProfileHelpText" | localize }}
				</span>
			</div>
			<div class="file-field input-field">
				<div class="btn-small">
					<span>Изменить аватар</span>
					<input
						ref="imageFileInput"
						type="file"
						@change="previewFiles"
						accept=".jpg, .jpeg, .png"
					/>
				</div>
				<div class="file-path-wrapper">
					<input ref="imageLocalSrc" class="file-path validate" type="text" />
				</div>
			</div>

			<div class="switch">
				<label>
					English
					<input type="checkbox" v-model="isRuLocale" />
					<span class="lever"></span>
					Русский
				</label>
			</div>

			<button class="btn waves-effect waves-light" type="submit">
				{{ "ProfileEditButton" | localize }}
				<i class="material-icons right">send</i>
			</button>
		</form>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";
import localizeFilter from "../filters/localize.filter";
import Avatar from "vue-avatar";

export default {
	name: "Profile",
	components: {
		Avatar
	},
	metaInfo() {
		return {
			title: this.$metaTitle("ProfileMetaTitle")
		};
	},
	data: () => ({
		name: "",
		isRuLocale: true,
		imageFile: null,
		avatarStyleObj: {
			verticalAlign: "middle",
			marginRight: "10px",
			backgroundSize: "cover",
			backgroundPosition: "center"
		}
	}),
	mounted() {
		this.name = this.info.name;
		this.isRuLocale = this.info.locale === "ru-RU";

		setTimeout(() => {
			// eslint-disable-next-line no-undef
			M.updateTextFields();
		}, 0);
	},
	validations: {
		name: { required }
	},
	computed: {
		...mapGetters(["info"])
	},
	methods: {
		previewFiles(event) {
			this.imageFile = event.target.files[0];
			console.log(this.imageFile);
		},
		...mapActions(["updateInfo", "removeAvatar"]),
		async submitHandler() {
			if (this.$v.$invalid) {
				this.$v.$touch();
				return;
			}

			try {
				let loc = this.isRuLocale ? "ru-RU" : "en-US";

				await this.updateInfo({
					name: this.name,
					locale: loc,
					file: this.imageFile
				});

				localStorage.setItem("locale", loc);
				this.$refs.imageFileInput.value = "";
				this.$refs.imageLocalSrc.value = "";
				this.$message(localizeFilter("ProfileSuccessMessage"));
			} catch (e) {
				this.$error(e.messages || localizeFilter("ProfileErrorMessage"));
				throw e;
			}
		},
		async removeHandler() {
			await this.removeAvatar();
		}
	}
};
</script>

<style scoped>
.switch {
	margin: 2rem 0;
}
.avatar-wrapper {
	display: flex;
	align-items: center;
	padding: 15px 0;
}

.avatar-wrapper button {
	margin-left: 10px;
}
</style>
