import { ViewStream } from 'spyne';
import HamburgerTmpl from './templates/ui-hamburger.tmpl.html';

export class UIHeaderHamburgerView extends ViewStream {
  constructor(props = {}) {
    props.id = 'menu_toggle';
    props.dataset = {
      eventType: 'menuDrawer',
      isHamburger: 'true',
    };
    props.template = HamburgerTmpl;
    super(props);
  }

  addActionListeners() {
    // return nexted array(s)
    return [['CHANNEL_MENU_DRAWER_.*_EVENT', 'onShowMenuDrawerEvent']];
  }

  onShowMenuDrawerEvent(e) {
    const { action } = e;
    const isActiveBurger = action === 'CHANNEL_MENU_DRAWER__SHOW_EVENT';
    this.props.el$.toggleClass('open', isActiveBurger);
  }

  broadcastEvents() {
    // return nexted array(s)
    return [['#menu_toggle', 'click']];
  }

  onRendered() {
    this.addChannel('CHANNEL_MENU_DRAWER');
  }
}
