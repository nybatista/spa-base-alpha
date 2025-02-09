import { path, pathEq } from 'ramda';
import { Channel, ChannelPayloadFilter } from 'spyne';

export class ChannelMenuDrawer extends Channel {
  constructor(name, props = {}) {
    name = 'CHANNEL_MENU_DRAWER';
    props.sendCachedPayload = true;
    super(name, props);
    this.props.showMenu = false;
  }

  onRegistered() {
    const breakPointFilter = new ChannelPayloadFilter({
      mediaQueryName: 'showMenuDrawer',
    });

    const menuDrawerBtnFilter = new ChannelPayloadFilter({
      propFilters: {
        eventType: 'menuDrawer',
      },
    });

    const menuDrawerRouteFilter = new ChannelPayloadFilter({
      action: (val) => val === 'CHANNEL_ROUTE_CHANGE_EVENT',
      payload: (p) => p?.routeData?.eventType === 'menuDrawer',
    });

    const win$ = this.getChannel('CHANNEL_WINDOW', breakPointFilter);
    win$.subscribe(this.onWindowEvent.bind(this));

    const ui$ = this.getChannel('CHANNEL_UI', menuDrawerBtnFilter);
    ui$.subscribe(this.onUiClick.bind(this));

    const route$ = this.getChannel('CHANNEL_ROUTE', menuDrawerRouteFilter);
    route$.subscribe(this.onUiClick.bind(this));

    const app$ = this.getChannel('CHANNEL_APP', new ChannelPayloadFilter({action: "CHANNEL_APP_INIT_EVENT"})).subscribe(this.onMenuDrawerInit.bind(this));

    //const appRoute$ = this.getChannel('CHANNEL_APP_ROUTE');
    //appRoute$.subscribe(this.onAppRouteEvent.bind(this));
  }

  onMenuDrawerInit(e){
    const {deepLinkPayload, uiText} = e.payload;
    const {navLinks, isDeepLink, routeData} = deepLinkPayload;
    const action = "CHANNEL_MENU_DRAWER_INIT_EVENT";

      this.sendChannelPayload(action, {navLinks, isDeepLink, routeData, uiText})

  }

  onAppRouteEvent(e) {
    this.sendMenuDrawerEvent(false);
  }

  onUiClick(e) {
    const { isHamburger } = e.payload;
    const checkBurgerClassFn = path(['srcElement', 'el', 'classList'], e);
    const isHamburgerBtn = isHamburger === 'true';
    const showBurgerBool = checkBurgerClassFn?.contains('open') === false;

    console.log('MENU DRAWER ', {
      isHamburger,
      isHamburgerBtn,
      showBurgerBool,
      e,
    });
    if (isHamburgerBtn === true) {
      this.sendMenuDrawerEvent(showBurgerBool);
    } else {
      this.sendMenuDrawerEvent(false);
    }
  }

  sendMenuDrawerEvent(b = true) {
    const action =
      b === true
        ? 'CHANNEL_MENU_DRAWER__SHOW_EVENT'
        : 'CHANNEL_MENU_DRAWER__HIDE_EVENT';
    this.sendChannelPayload(action, { action });
  }

  onWindowEvent(e) {
    const { payload } = e;
    const { matches } = payload;
    if (matches === false) {
      this.sendMenuDrawerEvent(matches);
    }
  }

  addRegisteredActions() {
    return [
      'CHANNEL_MENU_DRAWER_INIT_EVENT',
      'CHANNEL_MENU_DRAWER__SHOW_EVENT', 'CHANNEL_MENU_DRAWER__HIDE_EVENT'];
  }

  onViewStreamInfo(obj) {
    //let data = obj.props();
  }
}
