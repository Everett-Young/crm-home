<template>
	<div class="col s12 m6">
		<div>
			<div class="page-subtitle">
				<h4>{{ "Edit" | localize }}</h4>
			</div>

			<form @submit.prevent="submitUpdate">
				<div class="input-field">
					<select ref="select" v-model="current">
						<option v-for="cat in categories" :key="cat.id" :value="cat.id">
							{{ cat.title }}
						</option>
					</select>
					<label>{{ "SelectCategory" | localize }}</label>
				</div>

				<div class="input-field">
					<input
						type="text"
						id="name"
						v-model="title"
						:class="{ invalid: $v.title.$dirty && !$v.title.required }"
					/>
					<label for="name">{{ "Title" | localize }}</label>
					<span
						v-if="$v.title.$dirty && !$v.title.required"
						class="helper-text invalid"
					>
						{{ "MessageCategoryTitle" | localize }}
					</span>
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
					{{ "ProfileEditButton" | localize }}
					<i class="material-icons right">send</i>
				</button>
			</form>
		</div>
	</div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
import M from "materialize-css";
import localizeFilter from "../filters/localize.filter";

export default {
	name: "CategoryEdit",
	props: {
		categories: {
			type: Array,
			required: true
		}
	},
	data: () => ({
		select: null,
		title: "",
		limit: 1,
		current: null
	}),
	validations: {
		title: { required },
		limit: { minValue: minValue(1) }
	},
	methods: {
		async submitUpdate() {
			if (this.$v.$invalid) {
				this.$v.$touch();
				return;
			}
			try {
				let categoryData = {
					id: this.current,
					title: this.title,
					limit: this.limit
				};
				await this.$store.dispatch("updateCategory", categoryData);

				this.$message(
					localizeFilter("MessageSuccessUpdateCategory", this.title)
				);

				this.$emit("catUpdated", categoryData);
			} catch (e) {
				this.$error(
					e.message || localizeFilter("MessageErrorUpdatingCategory")
				);
				throw e;
			}
		}
	},
	watch: {
		current(catId) {
			let { title, limit } = this.categories.find(c => c.id === catId);
			this.title = title;
			this.limit = limit;
		}
	},
	created() {
		let { id, title, limit } = this.categories[0];
		this.current = id;
		this.title = title;
		this.limit = limit;
	},
	mounted() {
		M.updateTextFields();
		this.select = M.FormSelect.init(this.$refs.select);
	},
	beforeDestroy() {
		if (this.select && this.select.destroy) {
			this.select.destroy();
		}
	}
};
</script>

<style scoped></style>
