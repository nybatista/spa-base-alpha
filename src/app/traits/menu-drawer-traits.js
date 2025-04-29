import { SpyneTrait, ViewStream } from 'spyne';
import MenuDrawerNavTmpl from 'components/ui/templates/ui-menu-drawer-nav.tmpl.html';

export class MenuDrawerTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'menuDrawer$';
    super(context, traitPrefix);
  }

  static menuDrawer$addContent(e) {
    const { navLinks, header } = e.payload.initData;

    this.appendView(
      new ViewStream({
        id: 'menu-drawer-content',
        tagName: 'nav',
        data: navLinks,
        template: MenuDrawerNavTmpl,
      }),
    );
    this.props.el$('.site-title-text').el.innerText = header;
    this.menuDrawer$SetActiveLink(e);
  }

  static menuDrawer$HideNav(hideBool = true, props = this.props) {
    const delayTime = hideBool ? 500 : 0;
    const hideFn = () => props.el$.toggleClass('hide', hideBool);
    this.setTimeout(hideFn, delayTime);
  }

  static menuDrawer$onShowMenuDrawerEvent(e) {
    const { action } = e;
    const showDrawer = action === 'CHANNEL_MENU_DRAWER__SHOW_EVENT';
    this.props.el$.toggleClass('open', showDrawer);
    this.menuDrawer$SetActiveLink(e);
    this.menuDrawer$HideNav(!showDrawer);
  }

  static menuDrawer$SetActiveLink(e) {
    const { isDeepLink, routeData } = e.payload;
    if (routeData === undefined) {
      return;
    }

    const { pageId, cardId = '' } = routeData;
    if (isDeepLink === true) {
    }
    const activeSel = `a.nav[data-page-id='${pageId}'][data-card-id='${cardId}']`;
    this.props.el$('a.nav').setActiveItem('selected', activeSel);
  }
}
