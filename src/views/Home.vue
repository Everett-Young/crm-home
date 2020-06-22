<template>
	<div>
		<div class="page-title">
			<h3>{{ "MenuBill" | localize }}</h3>

			<button @click="refresh" class="btn waves-effect waves-light btn-small">
				<i class="material-icons">refresh</i>
			</button>
		</div>

		<loader v-if="loading" />
		<div v-else class="row">
			<home-bill :rates="currency.rates" />
			<home-currency
				:rates="currency.rates"
				:date="currency.date"
				:base="currency.base"
				:locale="locale"
			/>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import HomeBill from "@/components/HomeBill";
import HomeCurrency from "@/components/HomeCurrency";
import Loader from "../components/app/Loader";

export default {
	name: "Home",
	data: () => ({
		loading: true,
		currency: null
	}),
	metaInfo() {
		return {
			title: this.$metaTitle("MenuBill"),
			meta: [
				{
					vmid: "description",
					name: "description",
					content: "Home CRM - this is cool and try say no"
				}
			]
		};
	},
	components: {
		Loader,
		HomeBill,
		HomeCurrency
	},
	computed: {
		locale() {
			return this.$store.getters.info.locale;
		}
	},
	methods: {
		async refresh() {
			this.loading = true;
			setTimeout(async () => {
				this.currency = await this.$store.dispatch("fetchCurrency");
				this.loading = false;
			}, 2000);
		}
	},
	async mounted() {
		this.currency = await this.$store.dispatch("fetchCurrency");
		this.loading = false;
	}
};
</script>
