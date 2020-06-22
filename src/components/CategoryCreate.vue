<template>
	<div class="col s12 m6">
		<div>
			<div class="page-subtitle">
				<h4>{{ "Create" | localize }}</h4>
			</div>

			<form @submit.prevent="submitHandler">
				<div class="input-field">
					<input
						id="name"
						type="text"
						v-model="title"
						:class="{ invalid: $v.title.$dirty && !$v.title.required }"
					/>
					<label for="name">{{ "Title" | localize }}</label>
					<span
						v-if="$v.title.$dirty && !$v.title.required"
						class="helper-text invalid"
						>{{ "MessageCategoryTitle" | localize }}</span
					>
				</div>

				<div class="input-field">
					<input
						id="limit"
						type="number"
						v-model.number="limit"
						:class="{ invalid: $v.limit.$dirty && !$v.limit.minValue }"
					/>
					<label for="limit">{{ "Limit" | localize }}</label>
					<span
						v-if="$v.limit.$dirty && !$v.limit.minValue"
						class="helper-text invalid"
					>
						{{ "MessageMinLength" | localize($v.limit.$params.minValue.min) }}
					</span>
				</div>

				<button class="btn waves-effect waves-light" type="submit">
					{{ "Create" | localize }}
					<i class="material-icons right">send</i>
				</button>
			</form>
		</div>
	</div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
import M from "materialize-css";

export default {
	name: "CategoryCreate",
	data: () => ({
		title: "",
		limit: 1
	}),
	validations: {
		title: { required },
		limit: { minValue: minValue(1) }
	},
	mounted() {
		M.updateTextFields();
	},
	methods: {
		async submitHandler() {
			if (this.$v.$invalid) {
				this.$v.$touch();
				return;
			}

			try {
				let category = await this.$store.dispatch("createCategory", {
					title: this.title,
					limit: this.limit
				});

				this.title = "";
				this.limit = 1;
				this.$v.$reset();
				this.$message(`Категория: ${category.title} была создана`);
				this.$emit("created", category);
			} catch (e) {
				this.$error(e.message || "Ошибка при создании категории");
			}
		}
	}
};
</script>

<style scoped></style>
