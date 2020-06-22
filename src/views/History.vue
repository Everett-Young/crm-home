<template>
	<div>
		<div class="page-title">
			<h3>{{ "HistoryTitle" | localize }}</h3>
		</div>

		<div class="history-chart">
			<canvas ref="canvas"></canvas>
		</div>

		<loader v-if="loading" />
		<p class="center" v-else-if="!records.length">
			{{ "NoRecords" | localize }} <br />
			<router-link to="/record">{{ "AddNewRecord" | localize }}</router-link>
		</p>
		<section v-else>
			<history-table :records="items" />
			<paginate
				v-model="page"
				:page-count="pageCount"
				:click-handler="pageChangeHandler"
				:prev-text="'Back' | localize"
				:next-text="'Forward' | localize"
				:container-class="'pagination'"
				:page-class="'waves-effect'"
			/>
		</section>
	</div>
</template>

<script>
import HistoryTable from "../components/HistoryTable";
import Loader from "../components/app/Loader";
import paginationMixin from "@/mixins/pagination.mixin";
import { Pie } from "vue-chartjs";
import localizeFilter from "../filters/localize.filter";

export default {
	name: "History",
	components: { Loader, HistoryTable },
	mixins: [paginationMixin],
	extends: Pie,
	data: () => ({
		loading: true,
		records: [],
		categories: []
	}),
	metaInfo() {
		return {
			title: this.$metaTitle("MenuHistory")
		};
	},
	async mounted() {
		this.records = await this.$store.dispatch("fetchRecords");
		this.categories = await this.$store.dispatch("getCategories");

		this.setup();

		this.loading = false;
	},
	methods: {
		setup() {
			this.setupPaginations(
				this.records.map(record => {
					return {
						...record,
						categoryName: this.categories.find(c => c.id === record.categoryId)
							.title,
						typeClass: record.type === "income" ? "green" : "red",
						typeText:
							record.type === "income"
								? localizeFilter("Income")
								: localizeFilter("Outcome")
					};
				})
			);

			this.renderChart({
				labels: this.categories.map(cat => cat.title),
				datasets: [
					{
						label: "Расходы по категориям",
						data: this.categories.map(cat => {
							return this.records.reduce((total, record) => {
								if (record.categoryId === cat.id && record.type === "outcome") {
									total += +record.amount;
								}
								return total;
							}, 0);
						}),
						backgroundColor: [
							"rgba(255, 99, 132, 0.2)",
							"rgba(54, 162, 235, 0.2)",
							"rgba(255, 206, 86, 0.2)",
							"rgba(75, 192, 192, 0.2)",
							"rgba(153, 102, 255, 0.2)",
							"rgba(255, 159, 64, 0.2)"
						],
						borderColor: [
							"rgba(255, 99, 132, 1)",
							"rgba(54, 162, 235, 1)",
							"rgba(255, 206, 86, 1)",
							"rgba(75, 192, 192, 1)",
							"rgba(153, 102, 255, 1)",
							"rgba(255, 159, 64, 1)"
						],
						borderWidth: 1
					}
				]
			});
		}
	}
};
</script>

<style scoped>
.waves-effect,
.waves-effect:focus,
.waves-effect:hover {
	border: none;
}
.history-chart {
	padding: 15px;
}
</style>
