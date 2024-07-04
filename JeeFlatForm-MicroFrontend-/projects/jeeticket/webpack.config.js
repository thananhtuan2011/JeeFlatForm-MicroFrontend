const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "jeeticket",
    publicPath: "http://localhost:1205/"
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
      
        // For remotes (please adjust)
        name: "jeeticket",
        filename: "remoteEntry.js",
        exposes: {
            './Ticket': './projects/jeeticket/src/app/pages/jeeticket/jeeticket.module.ts',
        },      
        
        // For hosts (please adjust)
        // remotes: {
        //     "demo1": "demo1@http://localhost:1200/remoteEntry.js",
        //     "jeehr": "jeehr@http://localhost:1201/remoteEntry.js",
        //     "jeework": "jeework@http://localhost:1202/remoteEntry.js",
        //     "jeeadmin": "jeeadmin@http://localhost:1210/remoteEntry.js",
        //     "jeechat": "jeechat@http://localhost:1203/remoteEntry.js",
        //     "jeeteam": "jeeteam@http://localhost:1204/remoteEntry.js",

        // },

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
