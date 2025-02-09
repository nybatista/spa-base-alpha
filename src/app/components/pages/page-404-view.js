import { ViewStream } from 'spyne';
import PageTmpl from './templates/page-404.tmpl.html';

export class Page404View extends ViewStream {
  constructor(props = {}) {
    props.id = 'page-404';
    props.channels = [['CHANNEL_ROUTE', true]];
    props.template = PageTmpl;
    super(props);
  }

  addActionListeners() {
    // return nexted array(s)
    return [['CHANNEL_ROUTE_CHANGE_EVENT', 'disposeViewStream']];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {}
}
