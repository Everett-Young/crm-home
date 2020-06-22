<template>
	<table>
		<thead>
			<tr>
				<th
					@click="historySort(title, title.type)"
					v-for="title in historyTitles"
					:key="title.title"
				>
					{{ title.title }}
					<i v-if="!title.hideArrow" class="material-icons">{{
						title.toggler ? "arrow_drop_down" : "arrow_drop_up"
					}}</i>
				</th>
			</tr>
		</thead>

		<transition-group name="flip-list" tag="tbody">
			<tr v-for="(record, idx) in records" :key="record.id">
				<td>{{ idx + 1 }}</td>
				<td>{{ record.amount | currencyFilter() }}</td>
				<td>{{ record.date | date("datetime") }}</td>
				<td>{{ record.categoryName }}</td>
				<td>
					<span :class="[record.typeClass]" class="white-text badge">{{
						record.typeText
					}}</span>
				</td>
				<td>
					<button
						v-tooltip:left="'OpenRecord'"
						class="btn-small btn"
						@click="$router.push('/detail/' + record.id)"
					>
						<i class="material-icons">open_in_new</i>
					</button>
				</td>
			</tr>
		</transition-group>
	</table>
</template>

<script>
import localizeFilter from "../filters/localize.filter";

export default {
	name: "HistoryTable",
	props: {
		records: {
			required: true,
			type: Array
		}
	},
	data: () => ({
		historyTitles: [
			{
				title: "#",
				hideArrow: true
			},
			{
				title: localizeFilter("Amount"),
				toggler: true,
				type: "amount"
			},
			{
				title: localizeFilter("Date"),
				toggler: true,
				type: "date"
			},
			{
				title: localizeFilter("Category"),
				toggler: true,
				type: "categoryName"
			},
			{
				title: localizeFilter("Type"),
				toggler: true,
				type: "type"
			},
			{
				title: localizeFilter("Open"),
				hideArrow: true
			}
		]
	}),
	methods: {
		historySort(titleObj, type) {
			if (titleObj.toggler) {
				this.records.sort((a, b) => {
					if (a[type] < b[type]) return -1;
					if (a[type] > b[type]) return 1;
					return 0;
				});
			} else {
				this.records.sort((a, b) => {
					if (a[type] > b[type]) return -1;
					if (a[type] < b[type]) return 1;
					return 0;
				});
			}
			titleObj.toggler = !titleObj.toggler;
		}
	}
};
</script>

<style scoped>
.flip-list-move {
	transition: transform 1s;
}

th {
	cursor: pointer;
}

i {
	vertical-align: middle;
}
</style>
