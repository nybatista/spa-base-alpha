import { SpyneApp, SpyneAppProperties, Channel, ChannelFetch } from 'spyne';
import { ChannelMenuDrawer } from 'channels/channel-menu-drawer';
import AppContentData from 'data/app-data.json';
import AppContentDataDebug from 'data/debug-app-data.json';
import { SpynePluginJSONCms } from "@franciscobatista/spyne-plugin-json-cms";

import { AppView } from './app/app-view.js';

import * as R from 'ramda';
window.R = R;

const setOld = false;
//import './scss/main-old.scss';
import './scss/main.scss';
import { ChannelApp } from 'channels/channel-app.js';
const hamburgerBreakpoint = 768;
import { spyneJSConfig } from './debug-spynejs-config.js';

const useLocalStorage = false;
const useDebuggerMode = false;

const AppContentDataURL = useDebuggerMode
  ? AppContentDataDebug
  : AppContentData;

const ai_gen_appData = JSON.parse(
  window.localStorage.getItem('ai_gen_appData'),
);
const ai_gen_SpyneJSConfig = JSON.parse(
  window.localStorage.getItem('ai_gen_SpyneJSConfig'),
);

console.log('ITEMS ', { ai_gen_appData, ai_gen_SpyneJSConfig });

const config = {
  debug: true,

  channels: {
    WINDOW: {
      mediaQueries: {
        showMenuDrawer: `(max-width: ${hamburgerBreakpoint}px)`,
      },
      events: ["click", "mouseover", "message"],
      listenForScroll: true,
      listenForOrientation: true,
      debounceMSTimeForScroll: 50,
    },

    ROUTE: {
      type: 'slash',
      isHash: false,
      isHidden: false,
      add404s: true,
      routes: {
        "routePath": {
          "routeName": "pageId",
          "home": "",
          "about": {
            "routePath": {
              "routeName": "cardId",
              "contact-us": "contact-us"
            }
          }
        }
      },
    },
  },
};

if (useDebuggerMode === true) {
  config.channels.ROUTE.routes = spyneJSConfig.channels.ROUTE.routes;
}

let dataMapper = (o) => o;

const config2 = { debug: true, channels: { ROUTE: { type: 'query' } } };

const appConfig =
  useLocalStorage === true && ai_gen_SpyneJSConfig !== null
    ? ai_gen_SpyneJSConfig
    : config;

console.log('APP CONFIG ', appConfig);

SpyneApp.init(appConfig);
SpyneApp.registerChannel(new ChannelApp());

if (process.env.NODE_ENV === 'development') {
  const cmsPluginConfig = {
    position: ['bottom', 'right'],
    openOnLoad: true,
    darkMode: true,
    maximize: true,
  };

   const spyneCmsPlugin = new SpynePluginJSONCms(cmsPluginConfig);
   SpyneApp.registerPlugin(spyneCmsPlugin);
   dataMapper = SpyneApp.pluginsFn.mapCmsData;
}

SpyneApp.registerChannel(new ChannelMenuDrawer());

if (useLocalStorage !== true) {
  SpyneApp.registerChannel(
    new ChannelFetch('CHANNEL_APP_API', {
      url: AppContentDataURL,
      map: dataMapper,

      map5: (d, meta = {}) => {
        if (useLocalStorage === true && ai_gen_appData !== null) {
          // d = ai_gen_appData;
        }

        return d;
      },
    }),
  );
} else {
  SpyneApp.registerChannel(
    new Channel('CHANNEL_APP_API', { data: ai_gen_appData }),
  );
}

//if (process.env.NODE_ENV === 'development') {
//import('./dev-tools.js');
//}

if (setOld) {
  new AppViewOld().prependToDom(document.querySelector('body'));
} else {
  new AppView().prependToDom(document.querySelector('body'));
}

const tester = () => {
  console.log('SpyneAppProperties ', SpyneAppProperties.navLinks);
};

//window.setTimeout(tester, 1000);
