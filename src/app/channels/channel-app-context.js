import { Channel } from 'spyne';
import { AppTraits } from 'traits/app-traits.js';

export class ChannelAppContext extends Channel {
  constructor(name, props = {}) {
    name = 'CHANNEL_APP_CONTEXT';
    props.sendCachedPayload = true;
    props.traits = [AppTraits];
    super(name, props);
  }

  onRegistered() {
    this.appTraits$GetChannels();
  }

  addRegisteredActions() {
    return ['CHANNEL_APP_CONTEXT_INIT_EVENT', 'CHANNEL_APP_CONTEXT_DATA_EVENT'];
  }

  onViewStreamInfo() {}
}
