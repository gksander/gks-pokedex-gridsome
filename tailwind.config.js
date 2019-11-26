const { colors } = require("tailwindcss/defaultTheme");

module.exports = {
	theme: {
		extend: {
			colors: {
				primary: {
					...colors.blue,
				},
				owhite: {
					default: "rgba(255,255,255, 0.95)",
				},
			},
		},
		container: {
			center: true,
			padding: "1rem",
		},
		fill: theme => ({
			primary: theme("colors.primary"),
		}),
	},
	variants: {},
	plugins: [],
};