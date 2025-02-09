import { ViewStream, SpyneApp, ChannelFetch } from 'spyne';
import HelloWorldData from 'data/hello-world.json';
import HelloWorldTmpl from 'components/templates/hello-world.tmpl.html';

export class HelloWorld extends ViewStream {
  constructor(props = {}) {
    props.channels = ['CHANNEL_HELLO_WORLD'];
    super(props);
  }

  addActionListeners() {
    return [['CHANNEL_HELLO_WORLD_DATA_EVENT', 'addHelloWorld']];
  }

  broadcastEvents() {
    return [];
  }

  addHelloWorld(e) {
    const data = e.payload;

    this.appendView(
      new ViewStream({
        id: 'hello-world',
        data,
        template: HelloWorldTmpl,
      }),
    );
  }

  onRendered() {
    SpyneApp.registerChannel(
      new ChannelFetch('CHANNEL_HELLO_WORLD', {
        url: HelloWorldData,
      }),
    );
  }
}
