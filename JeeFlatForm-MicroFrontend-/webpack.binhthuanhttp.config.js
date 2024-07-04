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
        publicPath: "http://app.egov.binhthuan.gov.vn/"
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
                "jeework": "jeework@http://work-mfe.egov.binhthuan.gov.vn/remoteEntry.js",
                "jeemeet": "jeemeet@http://meet-mfe.egov.binhthuan.gov.vn/remoteEntry.js",
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
