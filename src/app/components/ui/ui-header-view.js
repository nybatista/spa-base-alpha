import { ViewStream } from 'spyne';
import { NavTraits } from 'traits/nav-traits.js';
import UIHeaderTmpl from './templates/ui-header-view.tmpl.html';
import { UIHeaderHamburgerView } from 'components/ui/ui-header-hamburger-view.js';

export class UIHeaderView extends ViewStream {
  constructor(props = {}) {
    props.tagName = 'header';
    props.id = 'site-header';
    props.traits = [NavTraits];
    props.channels = ['CHANNEL_APP_CONTEXT'];
    props.template = UIHeaderTmpl;
    super(props);
  }

  addActionListeners() {
    return [['CHANNEL_APP_CONTEXT_INIT_EVENT', 'onAppInitEvent']];
  }

  onAppInitEvent(e) {
    const { initData } = e.payload;
    const { navLinks, header } = initData;
    this.navTraits$AddNavLinks(navLinks);
    this.navTraits$OnAppDataEvent(header);
  }

  broadcastEvents() {
    return [['a.logo-link', 'click']];
  }

  onRendered() {
    this.appendView(new UIHeaderHamburgerView());
  }
}
