import './scss/main.scss';

import { SpyneApp, ChannelFetch } from 'spyne';
import { ChannelMenuDrawer } from 'channels/channel-menu-drawer';
import { AppView } from './app/app-view.js';
import { ChannelApp } from 'channels/channel-app.js';
import AppContentData from 'data/app-data.json';

const config = {
  debug: true,

  channels: {
    WINDOW: {
      mediaQueries: {
        showMenuDrawer: `(max-width: 768px)`,
      },
      events: ['click', 'mouseover', 'message'],
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
        routePath: {
          routeName: 'pageId',
          home: '',
          about: {
            routePath: {
              routeName: 'cardId',
              'contact-us': 'contact-us',
            },
          },
        },
      },
    },
  },
};

SpyneApp.init(config);
SpyneApp.registerChannel(new ChannelApp());

SpyneApp.registerChannel(new ChannelMenuDrawer());

SpyneApp.registerChannel(
  new ChannelFetch('CHANNEL_APP_API', {
    url: AppContentData,
  }),
);

if (process.env.NODE_ENV === 'development') {
  import('./dev-tools.js');
}

new AppView().prependToDom(document.querySelector('body'));
