const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Metro resolves asset plugins via Node require() from the repo root;
// in workspaces expo-asset may only exist under apps/mobile/node_modules.
config.transformer.assetPlugins = [
  require.resolve("expo-asset/tools/hashAssetFiles", { paths: [projectRoot] }),
];

module.exports = config;
