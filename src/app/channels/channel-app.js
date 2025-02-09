import { Channel } from 'spyne';
import { AppTraits } from 'traits/app-traits.js';

export class ChannelApp extends Channel {
  constructor(name, props = {}) {
    name = 'CHANNEL_APP';
    props.sendCachedPayload = true;
    props.traits = [AppTraits];
    super(name, props);
  }

  onRegistered() {
    this.appTraits$GetAppData();
  }

  addRegisteredActions() {
    return ['CHANNEL_APP_INIT_EVENT', 'CHANNEL_APP_DATA_EVENT'];
  }

  onViewStreamInfo() {}
}
