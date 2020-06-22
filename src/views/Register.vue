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
					{{ "RegisterEmailRequiredMessage" | localize }}
				</small>
				<small
					class="helper-text invalid"
					v-else-if="$v.email.$dirty && !$v.email.email"
				>
					{{ "ValidEmailMessage" | localize }}
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
			<div class="input-field">
				<input
					id="name"
					type="text"
					v-model.trim="name"
					:class="{ invalid: $v.name.$dirty && !$v.name.required }"
				/>
				<label for="name">Имя</label>
				<small
					v-if="$v.name.$dirty && !$v.name.required"
					class="helper-text invalid"
				>
					{{ "EnterNameMessage" | localize }}
				</small>
			</div>
			<p>
				<label>
					<input
						type="checkbox"
						v-model="agree"
						:class="{ 'check-invalid': $v.agree.$dirty && !$v.agree.checked }"
					/>
					<span>{{ "TermsAgree" | localize }}</span>
				</label>
			</p>
		</div>
		<div class="card-action">
			<div>
				<button class="btn waves-effect waves-light auth-submit" type="submit">
					{{ "LoginFormRegisterLink" | localize }}
					<i class="material-icons right">send</i>
				</button>
			</div>

			<p class="center">
				{{"RegisterText" | localize}}
				<router-link to="/login">{{ "LoginButton" | localize }}</router-link>
			</p>
		</div>
	</form>
</template>

<script>
import { email, required, minLength } from "vuelidate/lib/validators";

export default {
	name: "Register",
	data: () => ({
		email: "",
		password: "",
		name: "",
		agree: false
	}),
	metaInfo() {
		return {
			title: this.$metaTitle("RegisterMetaTitle")
		};
	},
	validations: {
		email: { email, required },
		password: { required, minLength: minLength(8) },
		name: { required },
		agree: { checked: v => v }
	},
	methods: {
		async submitHandler() {
			if (this.$v.$invalid) {
				this.$v.$touch();
				return;
			}

			let formData = {
				email: this.email,
				password: this.password,
				name: this.name,
				agree: this.agree
			};

			try {
				await this.$store.dispatch("register", formData);
				this.$router.push("/");
			} catch (e) {
				console.log(e);
			}
		}
	}
};
</script>

<style scoped>
.check-invalid + span:before {
	border-color: red;
}
</style>
