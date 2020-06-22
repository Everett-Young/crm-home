<template>
	<div>
		<div class="page-title">
			<h3>{{"MenuCategories" | localize}}</h3>
		</div>
		<section>
			<loader v-if="loading" />
			<div v-else class="row">
				<category-create @created="addNewCategory" />
				<category-edit
					v-if="categories.length"
					:categories="categories"
					:key="categories.length + updateCount"
					@catUpdated="updateCategories"
				/>
				<p v-else class="center">{{ "NoCategories" | localize }}</p>
			</div>
		</section>
	</div>
</template>

<script>
import CategoryCreate from "../components/CategoryCreate";
import CategoryEdit from "../components/CategoryEdit";
import Loader from "../components/app/Loader";

export default {
	name: "Categories",
	data: () => ({
		categories: [],
		loading: true,
		updateCount: 0
	}),
	metaInfo() {
		return {
			title: this.$metaTitle("MenuCategories")
		};
	},
	async mounted() {
		this.categories = await this.$store.dispatch("getCategories");
		this.loading = false;
	},
	components: {
		Loader,
		CategoryEdit,
		CategoryCreate
	},
	methods: {
		addNewCategory(category) {
			console.log(this.categories);
			this.categories.push(category);
		},
		updateCategories(category) {
			let idx = this.categories.findIndex(c => c.id === category.id);
			this.categories[idx].title = category.title;
			this.categories[idx].limit = category.limit;
			this.updateCount++;
		}
	}
};
</script>

<style scoped></style>
