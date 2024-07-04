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
        publicPath: "https://app.jee.vn/"
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
                "jeehr": "jeehr@https://hr-mfe.jee.vn/remoteEntry.js",
                "jeework": "jeework@https://work-mfe.jee.vn/remoteEntry.js",
                "jeeadmin": `jeeadmin@https://admin-mfe.jee.vn/remoteEntry.js`,
                "jeechat": "jeechat@https://chat.jee.vn/remoteEntry.js",
                "jeeteam": "jeeteam@https://team-mfe.jee.vn//remoteEntry.js",
                "jeeticket": "jeeticket@https://ticket-mfe.jee.vn/remoteEntry.js",
                "jeesupport": "jeesupport@https://support.jee.vn/remoteEntry.js",
                "jeeworkflow": "jeeworkflow@https://workflow-mfe.jee.vn/remoteEntry.js",
                "jeerequest": "jeerequest@https://request-mfe.jee.vn/remoteEntry.js",
                "jeemeeting": "jeemeeting@https://meeting-mfe.jee.vn/remoteEntry.js",
                "wizardplatform": "wizardPlatform@https://wizard-mfe.jee.vn//remoteEntry.js",
            },

            shared: share({
                "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
                "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },

                ...sharedMappings.getDescriptors()
            })

        }),
        sharedMappings.getPlugin()
    ],
};
