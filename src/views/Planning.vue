<template>
	<div>
		<div class="page-title">
			<h3>{{ "MenuPlaning" | localize }}</h3>
			<h4>{{ info.bill | currencyFilter() }}</h4>
		</div>
		<loader v-if="loading" />
		<p v-else-if="!categories.length" class="center">
			{{ "NoCategories" | localize }}
			<router-link to="/categories">{{ "AddFirst" | localize }}</router-link>
		</p>
		<section v-else>
			<div v-for="cat in categories" :key="cat.id">
				<p>
					<strong>{{ cat.title }}:</strong>
					{{ cat.spend | currencyFilter() }} из
					{{ cat.limit | currencyFilter() }}
				</p>
				<div v-tooltip.nlocale="cat.tooltip" class="progress">
					<div
						class="determinate"
						:class="[cat.percentColor]"
						:style="{ width: cat.progress + '%' }"
					></div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import Loader from "../components/app/Loader";
import currencyFilter from "../filters/currency.filter";
import localizeFilter from "../filters/localize.filter";

export default {
	name: "Planning",
	components: { Loader },
	data: () => ({
		loading: true,
		categories: []
	}),
	metaInfo() {
		return {
			title: this.$metaTitle("MenuPlaning")
		};
	},
	computed: {
		...mapGetters(["info"])
	},
	async mounted() {
		let records = await this.$store.dispatch("fetchRecords");
		let categories = await this.$store.dispatch("getCategories");

		this.categories = categories.map(cat => {
			let spend = records
				.filter(record => record.categoryId === cat.id)
				.filter(r => r.type === "outcome")
				.reduce((total, record) => {
					return total + +record.amount;
				}, 0);

			let percent = (100 * spend) / cat.limit;
			let progress = percent > 100 ? 100 : percent;
			let percentColor =
				percent < 60 ? "green" : percent < 100 ? "yellow" : "red";

			let tooltipValue = cat.limit - spend;
			let tooltip = localizeFilter(
				tooltipValue < 0 ? "MoreThan" : "Stayed",
				currencyFilter(Math.abs(tooltipValue))
			);
			return {
				...cat,
				progress,
				percentColor,
				spend,
				tooltip
			};
		});

		this.loading = false;
	},
	beforeDestroy() {}
};
</script>

<style scoped></style>
