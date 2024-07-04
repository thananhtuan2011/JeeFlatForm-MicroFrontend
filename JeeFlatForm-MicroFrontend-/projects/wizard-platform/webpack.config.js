const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, "../../tsconfig.json"), [
  /* mapped paths to share */
]);

module.exports = {
  output: {
    uniqueName: "wizardPlatform",
    publicPath: "http://localhost:1213/",
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      // For remotes (please adjust)
      name: "wizardPlatform",
      filename: "remoteEntry.js",
      exposes: {
        // './Component': './projects/wizard-platform/src/app/app.component.ts',
        "./Wizard":
          "./projects/wizard-platform/src/app/page/DashboardModule/dashboard.module.ts",
        "./WizardHR":
          "./projects/wizard-platform/src/app/page/HRModule/hr.module.ts",
        "./WizardTicket":
          "./projects/wizard-platform/src/app/page/TicketModule/ticket.module.ts",
        "./WizardWork":
          "./projects/wizard-platform/src/app/page/WorkModule/work.module.ts",
        "./WizardSale":
          "./projects/wizard-platform/src/app/page/SaleModule/sale.module.ts",
      },

      shared: share({
        "@angular/core": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        "@angular/common": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        "@angular/common/http": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },
        "@angular/router": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
        },

        ...sharedMappings.getDescriptors(),
      }),
    }),
    sharedMappings.getPlugin(),
  ],
};
