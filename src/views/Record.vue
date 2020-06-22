<template>
	<div>
		<div class="page-title">
			<h3>{{ "MenuNewRecord" | localize }}</h3>
		</div>
		<loader v-if="loading" />
		<p v-else-if="!categories.length" class="center">
			{{ "NoCategories" | localize }}
			<router-link to="/categories">{{ "AddFirst" | localize }}</router-link>
		</p>
		<form v-else class="form" @submit.prevent="addRecordHandler">
			<div class="input-field">
				<select ref="select" v-model="category">
					<option v-for="cat in categories" :key="cat.id" :value="cat.id">
						{{ cat.title }}
					</option>
				</select>
				<label>{{ "SelectCategory" | localize }}</label>
			</div>

			<p>
				<label>
					<input
						v-model="type"
						class="with-gap"
						name="type"
						type="radio"
						value="income"
					/>
					<span>{{ "Income" | localize }}</span>
				</label>
			</p>

			<p>
				<label>
					<input
						v-model="type"
						class="with-gap"
						name="type"
						type="radio"
						value="outcome"
					/>
					<span>{{ "Outcome" | localize }}</span>
				</label>
			</p>

			<div class="input-field">
				<input
					v-model.number="amount"
					:class="{ invalid: $v.amount.$dirty && !$v.amount.minValue }"
					id="amount"
					type="number"
				/>
				<label for="amount">{{ "Amount" | localize }}</label>
				<span
					v-if="$v.amount.$dirty && !$v.amount.minValue"
					class="helper-text invalid"
				>
					{{ "MessageMinLength" | localize($v.amount.$params.minValue.min) }}
				</span>
			</div>

			<div class="input-field">
				<input
					:class="{
						invalid: $v.description.$dirty && !$v.description.required
					}"
					v-model="description"
					id="description"
					type="text"
				/>
				<label for="description">{{ "Description" | localize }}</label>
				<span
					v-if="$v.description.$dirty && !$v.description.required"
					class="helper-text invalid"
				>
					{{ "MessageEnterDescription" | localize }}
				</span>
			</div>

			<button class="btn waves-effect waves-light" type="submit">
				{{ "Create" | localize }}
				<i class="material-icons right">send</i>
			</button>
		</form>
	</div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
import Loader from "../components/app/Loader";
import { mapGetters } from "vuex";
import localizeFilter from "../filters/localize.filter";

export default {
	name: "Record",
	components: { Loader },
	data: () => ({
		loading: true,
		categories: [],
		select: null,
		category: null,
		type: "outcome",
		amount: 1,
		description: ""
	}),
	metaInfo() {
		return {
			title: this.$metaTitle("MenuNewRecord")
		};
	},
	validations: {
		amount: { minValue: minValue(1) },
		description: { required }
	},
	computed: {
		...mapGetters(["info"]),
		canCreateRecord() {
			if (this.type === "income") {
				return true;
			}

			return this.info.bill >= this.amount;
		}
	},
	methods: {
		async addRecordHandler() {
			if (this.$v.$invalid) {
				this.$v.$touch();
				return;
			}

			if (this.canCreateRecord) {
				try {
					await this.$store.dispatch("createRecord", {
						categoryId: this.category,
						amount: this.amount,
						description: this.description,
						type: this.type,
						date: new Date().toJSON()
					});

					let bill =
						this.type === "income"
							? this.info.bill + this.amount
							: this.info.bill - this.amount;

					await this.$store.dispatch("updateInfo", { bill });
					this.$message(localizeFilter("RecordCreatedMessage"));
					this.$v.$reset();
					this.amount = 1;
					this.description = "";
				} catch (e) {
					this.$error(e.messages || localizeFilter("RecordErrorMessage"));
					throw e;
				}
			} else {
				this.$message(
					localizeFilter("NotEnoughMoney", this.amount - this.info.bill)
				);
			}
		}
	},
	async mounted() {
		this.categories = await this.$store.dispatch("getCategories");
		this.loading = false;

		if (this.categories.length) {
			this.category = this.categories[0].id;
		}

		setTimeout(() => {
			// eslint-disable-next-line no-undef
			M.updateTextFields();
			// eslint-disable-next-line no-undef
			this.select = M.FormSelect.init(this.$refs.select);
		}, 0);
	},
	beforeDestroy() {
		if (this.select && this.select.destroy) {
			this.select.destroy();
		}
	}
};
</script>

<style scoped></style>
