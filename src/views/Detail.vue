<template>
	<div>
		<loader v-if="loading" />
		<div v-else-if="record">
			<div class="breadcrumb-wrap">
				<router-link to="/history" class="breadcrumb">{{
					"MenuHistory" | localize
				}}</router-link>
				<a @click.prevent="" class="breadcrumb">
					{{ record.typeText }}
				</a>
			</div>
			<div class="row">
				<div class="col s12 m6">
					<div :class="[record.typeClass]" class="card">
						<div class="card-content white-text">
							<p>{{ "Description" | localize }}: {{ record.description }}</p>
							<p>
								{{ "Amount" | localize }}:
								{{ record.amount | currencyFilter() }}
							</p>
							<p>{{ "Category" | localize }}: {{ record.categoryName }}</p>
							<small>{{ record.date | date("datetime") }}</small>
						</div>
					</div>
				</div>
			</div>
		</div>
		<p v-else class="center">
			{{ "RecordNotFoundMessage" | localize($route.params.id) }}
		</p>
	</div>
</template>

<script>
import Loader from "../components/app/Loader";
import localizeFilter from "../filters/localize.filter";
export default {
	name: "DetailRecord",
	components: { Loader },
	data: () => ({
		record: null,
		loading: true
	}),
	metaInfo() {
		return {
			title: this.$metaTitle("DetailMetaTitle")
		};
	},
	async mounted() {
		let id = this.$route.params.id;
		let record = await this.$store.dispatch("fetchRecordsById", id);
		let category = await this.$store.dispatch(
			"getCategoriesById",
			record.categoryId
		);
		// eslint-disable-next-line no-debugger
		this.record = {
			...record,
			categoryName: category.title,
			typeClass: record.type === "income" ? "green" : "red",
			typeText: localizeFilter(record.type === "outcome" ? "Outcome" : "Income")
		};

		this.loading = false;
	}
};
</script>

<style scoped></style>
