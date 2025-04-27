import { SpyneApp } from 'spyne';
import { SpynePluginConsole } from 'spyne-plugin-console';
// Register console plugin
SpyneApp.registerPlugin(
  new SpynePluginConsole({
    position: ['bottom', 'right'],
    minimize: false,
  }),
);
