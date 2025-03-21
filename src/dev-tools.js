import { SpyneApp } from 'spyne';
import { SpynePluginConsole } from 'spyne-plugin-console';
import { AppGenCall } from './app/app-gen-call.js';
// Register console plugin
SpyneApp.registerPlugin(
  new SpynePluginConsole({
    position: ['bottom', 'left'],
    minimize: true,
  }),
);

new AppGenCall().appendToNull();
