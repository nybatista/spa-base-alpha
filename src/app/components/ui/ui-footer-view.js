import { ViewStream } from 'spyne';
import UIFooterTmpl from './templates/ui-footer-view.tmpl.html';

export class UIFooterView extends ViewStream {
  constructor(props = {}) {
    props.tagName = 'footer';
    props.id = 'site-footer';
    props.channels = ['CHANNEL_APP'];
    //props.template = UIFooterTmpl;
    super(props);
  }

  addActionListeners() {
    return [['CHANNEL_APP_INIT_EVENT', 'onAppDataEvent']];
  }

  onAppDataEvent(e) {
    this.appendView(
      new ViewStream({
        data: e.payload,
        class: 'footer-content',
        template: '<p>{{uiText.footer}}</p>',
      }),
    );
  }

  broadcastEvents() {
    return [];
  }

  onRendered() {}
}
