import { ViewStream } from 'spyne';
import MenuDrawerTmpl from './templates/ui-menu-drawer.tmpl.html';
import { MenuDrawerTraits } from 'traits/menu-drawer-traits.js';
import { AppTraits } from 'traits/app-traits.js';

export class UIMenuDrawerView extends ViewStream {
  constructor(props = {}) {
    props.id = 'menu-drawer';
    props.class = 'menu-drawer hide';
    props.traits = [MenuDrawerTraits];
    props.channels = ['CHANNEL_ROUTE', 'CHANNEL_MENU_DRAWER', 'CHANNEL_APP'];
    props.template = MenuDrawerTmpl;
    super(props);
  }

  addActionListeners() {
    return [
      ['CHANNEL_MENU_DRAWER_INIT_EVENT', 'menuDrawer$addContent'],
      ['CHANNEL_ROUTE_CHANGE_EVENT', 'menuDrawer$SetActiveLink'],
      ['CHANNEL_MENU_DRAWER__.*_EVENT', 'menuDrawer$onShowMenuDrawerEvent'],
    ];
  }

  broadcastEvents() {
    // return nested array(s)
    return [['a', 'click']];
  }

  onRendered() {}
}
