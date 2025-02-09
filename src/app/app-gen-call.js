import { ViewStream, ChannelFetchUtil } from 'spyne';

export class AppGenCall extends ViewStream {
  constructor(props = {}) {
    super(props);
  }

  addActionListeners() {
    return [];
  }

  broadcastEvents() {
    return [];
  }

  onSubscribe(e) {}

  onChannelConfigEvent(siteName = 'enterprise1') {
    // const {payload} = e.clone();
    // payload.requestType = "configToData";

    const onSubscribe = (d) => {
      // const dataPrep = JSON.stringify(d);
      console.log('D1 IS ', d);

      const data = JSON.parse(d);

      const body = data?.body ?? data;

      const { spyneJSConfig, appData } = body;

      if (spyneJSConfig !== undefined) {
        window.localStorage.setItem(
          'ai_gen_SpyneJSConfig',
          JSON.stringify(spyneJSConfig),
        );
      }

      if (appData !== undefined) {
        window.localStorage.setItem('ai_gen_appData', JSON.stringify(appData));
      }

      console.log('data returned ', { spyneJSConfig, appData, data });
    };

    const requestType = 'selectConfigToData';

    const url = '//127.0.0.1:3000/train';

    const payload = { siteName, requestType };

    console.log('the payload config is ', { payload });

    const onThen = (d) => onSubscribe(d);

    const appGenFetch = new ChannelFetchUtil(
      {
        url,
        method: 'POST',
        debug: true,
        responseType: 'text',
        body: JSON.stringify(payload),
      },
      onSubscribe,
    );
  }

  onRendered() {
    console.log('app gen called ');

    window.appGenInit = this.onChannelConfigEvent;
  }
}
