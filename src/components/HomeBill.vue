<template>
	<div class="col s12 m6 l4">
		<div class="card light-blue bill-card">
			<div class="card-content white-text">
				<span class="card-title">{{ "BillInCurrency" | localize }}</span>

				<p v-for="currency in currencies" :key="currency" class="currency-line">
					<span>{{ getCurrency(currency) | currencyFilter(currency) }}</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "HomeBill",
	props: ["rates"],
	data: () => ({
		currencies: ["USD", "EUR", "DKK"]
	}),
	computed: {
		base() {
			return this.$store.getters.info.bill;
		}
	},
	methods: {
		getCurrency(currency) {
			return Math.floor(this.base * this.rates[currency]);
		}
	}
};
</script>

<style scoped></style>
