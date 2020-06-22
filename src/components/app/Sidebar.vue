<template>
	<ul class="sidenav app-sidenav" :class="{ open: value }">
		<router-link
			v-for="link in links"
			:key="link.url"
			tag="li"
			active-class="active"
			:to="link.url"
			:exact="link.exact"
		>
			<a href="#" class="waves-effect waves-orange">{{ link.title }}</a>
		</router-link>
	</ul>
</template>

<script>
import localizeFilter from "@/filters/localize.filter";

export default {
	name: "Sidebar",
	props: {
		value: Boolean
	},
	data: () => {
		return {
			links: [
				{ title: localizeFilter("MenuBill"), url: "/", exact: true },
				{ title: localizeFilter("MenuHistory"), url: "/history" },
				{ title: localizeFilter("MenuPlaning"), url: "/planning" },
				{ title: localizeFilter("MenuNewRecord"), url: "/record" },
				{ title: localizeFilter("MenuCategories"), url: "/categories" }
			]
		};
	}
};
</script>

<style scoped></style>
