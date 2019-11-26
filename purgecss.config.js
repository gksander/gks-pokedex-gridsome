module.exports = {
	content: [
		"./src/**/*.vue",
		"./src/**/*.js",
		"./src/**/*.jsx",
		"./src/**/*.html",
		"./src/**/*.pug",
		"./src/**/*.md",
		"./src/**/*.css",
	],
	whitelist: ["svg:not(:root).svg-inline--fa"],
	whitelistPatterns: [/^fa-/, /^svg-inline--fa/],
	whitelistPatternsChildren: [/^token/, /^pre/, /^code/],
	defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
};