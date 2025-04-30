import { ViewStream } from 'spyne';

export class UIFooterView extends ViewStream {
  constructor(props = {}) {
    props.tagName = 'footer';
    props.id = 'site-footer';
    props.channels = ['CHANNEL_APP_CONTEXT'];
    super(props);
  }

  addActionListeners() {
    return [['CHANNEL_APP_CONTEXT_INIT_EVENT', 'onAppDataEvent']];
  }

  onAppDataEvent(e) {
    this.appendView(
      new ViewStream({
        data: e.payload,
        class: 'footer-content',
        template: '<p>{{initData.footer}}</p>',
      }),
    );
  }

  broadcastEvents() {
    return [];
  }

  onRendered() {}
}
