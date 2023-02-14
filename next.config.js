const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

let plugin;
if(process.env.BUILD_AUTH)
	plugin = new WasmPackPlugin({
		crateDirectory: `${__dirname}/lib/auth`
	});

module.exports = {
	future: {
    	webpack5: true,
  	},
	webpack(config) {
		if(plugin)
			config.plugins.push(plugin);
		config.experiments = {
			syncWebAssembly: true
		};
		return config;
	},
};
