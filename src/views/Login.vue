<template>
	<form class="card auth-card" @submit.prevent="submitHandler">
		<div class="card-content">
			<span class="card-title">Home CRM</span>
			<div class="input-field">
				<input
					id="email"
					type="text"
					v-model.trim="email"
					:class="{
						invalid:
							($v.email.$dirty && !$v.email.required) ||
							($v.email.$dirty && !$v.email.email)
					}"
				/>
				<label for="email">Email</label>
				<small
					class="helper-text invalid"
					v-if="$v.email.$dirty && !$v.email.required"
				>
					{{ "LoginInvalidText" | localize }}
				</small>
				<small
					class="helper-text invalid"
					v-else-if="$v.email.$dirty && !$v.email.email"
				>
					{{ "LoginInvalidEmail" | localize }}
				</small>
			</div>
			<div class="input-field">
				<input
					id="password"
					type="password"
					v-model.trim="password"
					:class="{
						invalid:
							($v.password.$dirty && !$v.password.required) ||
							($v.password.$dirty && !$v.password.minLength)
					}"
				/>
				<label for="password">{{ "LoginPassword" | localize }}</label>
				<small
					v-if="$v.password.$dirty && !$v.password.required"
					class="helper-text invalid"
				>
					{{ "LoginPasswordEnter" | localize }}
				</small>
				<small
					v-else-if="$v.password.$dirty && !$v.password.minLength"
					class="helper-text invalid"
				>
					{{
						"LoginPasswordInvalidText"
							| localize($v.password.$params.minLength.min, password.length)
					}}
				</small>
			</div>
		</div>
		<div class="card-action">
			<div>
				<button class="btn waves-effect waves-light auth-submit" type="submit">
					{{ "LoginButton" | localize }}
					<i class="material-icons right">send</i>
				</button>
			</div>

			<p class="center">
				{{ "LoginFormText" | localize }}
				<router-link to="/register">{{
					"LoginFormRegisterLink" | localize
				}}</router-link>
			</p>
		</div>
	</form>
</template>

<script>
import { email, required, minLength } from "vuelidate/lib/validators";
import message from "../utils/message";
import localizeFilter from "../filters/localize.filter";

export default {
	name: "Login",
	data: () => ({
		email: "",
		password: ""
	}),
	metaInfo() {
		return {
			title: this.$metaTitle("LoginButton")
		};
	},
	validations: {
		email: { email, required },
		password: { required, minLength: minLength(8) }
	},
	mounted() {
		if (message[this.$route.query.message]) {
			this.$message(localizeFilter(this.$route.query.message));
		}
	},
	methods: {
		async submitHandler() {
			if (this.$v.$invalid) {
				this.$v.$touch();
				return;
			}

			let formData = {
				email: this.email,
				password: this.password
			};

			try {
				await this.$store.dispatch("login", formData);
				await this.$router.push("/");
			} catch (e) {
				console.log(e);
			}
		}
	}
};
</script>

<style scoped></style>
