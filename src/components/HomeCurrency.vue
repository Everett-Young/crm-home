<template>
	<div class="col s12 m6 l8">
		<div class="card orange darken-3 bill-card">
			<div class="card-content white-text">
				<div class="card-header">
					<span class="card-title">{{ "CurrencyAmountTitle" | localize }} {{base}}</span>
				</div>
				<table>
					<thead>
						<tr>
							<th>{{ "Currency" | localize }}</th>
							<th>{{ "CurrencyType" | localize }}</th>
							<th>{{ "Date" | localize }}</th>
						</tr>
					</thead>

					<tbody>
						<tr v-for="cur in currencies" :key="cur">
							<td>{{ cur }}</td>
							<td>{{ rates[cur] | currencyFilter }}</td>
							<td>{{ date | date("date") }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "HomeCurrency",
	props: ["rates", "date", "locale", "base"],
	data: () => ({
		currencies: ["EUR", "DKK"]
	}),
	methods: {
		getCurrency(currency) {
			// eslint-disable-next-line no-debugger
			debugger;
			return this.rates["USD"] / this.rates[currency];
		}
	}
};
</script>

<style scoped></style>
