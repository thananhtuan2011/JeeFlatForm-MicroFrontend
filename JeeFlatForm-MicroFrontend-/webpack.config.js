const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
    path.join(__dirname, 'tsconfig.json'), [ /* mapped paths to share */ ]);

module.exports = {
    output: {
        uniqueName: "demo1",
        publicPath: "http://localhost:1200/"
    },
    optimization: {
        runtimeChunk: false
    },
    resolve: {
        alias: {
            ...sharedMappings.getAliases(),
        }
    },
    plugins: [
        new ModuleFederationPlugin({

            // For hosts (please adjust)
            remotes: {
                "jeehr": "jeehr@//localhost:1201/remoteEntry.js",
                "jeework": "jeework@//localhost:1202/remoteEntry.js",
                "jeeadmin": "jeeadmin@//localhost:1210/remoteEntry.js",
                "jeechat": "jeechat@//localhost:1203/remoteEntry.js",
                "jeeteam": "jeeteam@//localhost:1204/remoteEntry.js",
                "jeeticket": "jeeticket@//localhost:1205/remoteEntry.js",
                "jeesupport": "jeesupport@//localhost:1207/remoteEntry.js",
                "jeeworkflow": "jeeworkflow@//localhost:1206/remoteEntry.js",
                "jeerequest": "jeerequest@//localhost:1208/remoteEntry.js",
                "jeemeeting": "jeemeeting@//localhost:1209/remoteEntry.js",
                "jeeworkv1": "jeeworkV1@//localhost:1212/remoteEntry.js",
                "jeemeet": "jeemeet@//localhost:1211/remoteEntry.js",
                "wizardplatform": "wizardPlatform@//localhost:1213/remoteEntry.js",
            },

            shared: share({
                "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                "@angular/common/": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },

                ...sharedMappings.getDescriptors()
            })

        }),
        sharedMappings.getPlugin()
    ],
};
