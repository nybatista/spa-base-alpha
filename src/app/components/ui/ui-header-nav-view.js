import { ViewStream } from 'spyne';
import UIHeaderNavTmpl from './templates/ui-header-nav-view.tmpl.html';
export class UIHeaderNavView extends ViewStream {
  constructor(props = {}) {
    props.class = 'site-nav';
    props.tagName = 'nav';
    props['aria-label'] = 'Main Navigation';
    props.template = UIHeaderNavTmpl;
    props.channels = ['CHANNEL_ROUTE'];
    super(props);
  }

  addActionListeners() {
    // return nested array(s)
    return [['CHANNEL_ROUTE_.*EVENT', 'onRouteChangeEvent']];
  }

  onRouteChangeEvent(e) {
    const { routeData } = e.payload;
    if (routeData === undefined) {
      return;
    }

    const { pageId } = routeData;

    const activeSel = `a.nav[data-page-id='${pageId}']`;
    this.props.el$('a.nav').setActiveItem('selected', activeSel);
  }

  broadcastEvents() {
    // return nested array(s)
    return [['a', 'click']];
  }

  onRendered() {}
}
