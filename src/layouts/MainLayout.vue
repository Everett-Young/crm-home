<template>
	<div>
		<div class="app-main-layout">
			<loader v-if="loading" />
			<template v-else>
				<nav-bar @sidebar-toggler="isOpen = !isOpen" />

				<sidebar v-model="isOpen" :key="locale" />

				<main class="app-content" :class="{ full: !isOpen }">
					<div class="app-page">
						<router-view />
					</div>
				</main>

				<div class="fixed-action-btn">
					<router-link
						v-tooltip:left="'ButtonCreateTooltip'"
						class="btn-floating btn-large blue"
						to="/record"
					>
						<i class="large material-icons">add</i>
					</router-link>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import NavBar from "../components/app/NavBar";
import Sidebar from "../components/app/Sidebar";
import Loader from "../components/app/Loader";
import messages from "../utils/message";
import localizeFilter from "../filters/localize.filter";

export default {
	name: "MainLayout",
	data: () => ({
		isOpen: true,
		loading: true
	}),
	components: {
		Loader,
		NavBar,
		Sidebar
	},
	async mounted() {
		if (!Object.keys(this.$store.getters.info).length) {
			await this.$store.dispatch("getUserInfo");
		}
		this.loading = false;
	},
	computed: {
		error() {
			return this.$store.getters.error;
		},
		locale() {
			return this.$store.getters.info.locale;
		}
	},
	watch: {
		error(fbError) {
			this.$error(messages[fbError.code] || localizeFilter("BaseErrorMessage"));
		}
	}
};
</script>

<style scoped></style>
