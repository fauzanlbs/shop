const path = require("path");
module.exports = {
	i18n: {
		locales: ["en", "de", "es", "ar", "he", "zh", "id"],
		defaultLocale: "id",
		domains: [
			{
				domain: 'andromarket.id',
				defaultLocale: 'id'
			},
		]
	},
	localePath: path.resolve("./public/locales"),
};
