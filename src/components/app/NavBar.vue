<template>
	<nav class="navbar orange lighten-1">
		<div class="nav-wrapper">
			<div class="navbar-left">
				<a href="#" @click.prevent="$emit('sidebar-toggler')">
					<i class="material-icons black-text">dehaze</i>
				</a>
				<span class="black-text">{{ date | date("datetime") }}</span>
			</div>

			<ul class="right hide-on-small-and-down">
				<li>
					<a
						class="dropdown-trigger black-text"
						href="#"
						data-target="dropdown"
						ref="dropdown"
					>
						<avatar
							:username="name"
							:inline="true"
							:size="40"
							:src="avatar"
							:customStyle="avatarStyleObj"
						></avatar>
						{{ name || "Undefined" }}
						<i class="material-icons right">arrow_drop_down</i>
					</a>

					<ul id="dropdown" class="dropdown-content">
						<li>
							<router-link to="/profile" class="black-text">
								<i class="material-icons">account_circle</i
								>{{ "profileTitle" | localize }}
							</router-link>
						</li>
						<li class="divider" tabindex="-1"></li>
						<li>
							<a href="#" class="black-text" @click.prevent="logout">
								<i class="material-icons">assignment_return</i
								>{{ "ProfileLogout" | localize }}
							</a>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script>
import Avatar from "vue-avatar";

export default {
	name: "NavBar",
	components: {
		Avatar
	},
	data: () => ({
		date: new Date(),
		interval: null,
		dropdown: null,
		avatarStyleObj: {
			verticalAlign: "middle",
			marginRight: "10px",
			backgroundSize: "cover",
			backgroundPosition: "center",
		}
	}),
	computed: {
		name() {
			return this.$store.getters.info.name;
		},
		avatar() {
			return this.$store.getters.info.avatar;
		}
	},
	mounted: function() {
		this.interval = setInterval(() => {
			this.date = new Date();
		}, 1000);
		// eslint-disable-next-line no-undef
		this.dropdown = M.Dropdown.init(this.$refs.dropdown, {
			constrainWidth: false,
			alignment: "right"
		});
	},
	beforeDestroy() {
		clearInterval(this.interval);
		this.dropdown && this.dropdown.destroy();
	},
	methods: {
		async logout() {
			await this.$store.dispatch("logout");
			this.$router.push("/login?message=logout");
		}
	}
};
</script>

<style scoped></style>
