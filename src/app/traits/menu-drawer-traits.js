import { SpyneTrait, ViewStream } from 'spyne';
import MenuDrawerNavTmpl from 'components/ui/templates/ui-menu-drawer-nav.tmpl.html';

import {
  compose,
  head,
  keys,
  filter,
  equals,
  isEmpty,
  isNil,
  not,
  either,
} from 'ramda';

export class MenuDrawerTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'menuDrawer$';
    super(context, traitPrefix);
  }

  static menuDrawer$addContent(e) {
    const { payload } = e;
    const { navLinks, uiText } = payload;

    const data = navLinks;

    console.log('LINKS DATA IS ', { data, uiText, payload, e });

    this.appendView(
      new ViewStream({
        id: 'menu-drawer-content',
        tagName: 'nav',
        data,
        template: MenuDrawerNavTmpl,
      }),
    );
    this.props.el$('.site-title-text').el.innerText = uiText.header;
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
    console.log('SHOW DRAWER ', showDrawer);
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

  static menuDrawer$OnWindowShadeEvent(e) {
    const { scrollY, scrollDir } = e.payload;
    const showHeader = scrollDir === 'up' || scrollY < 50;
    this.props.el$.toggleClass('hide-header', !showHeader);
  }

  static menuDrawer$CreateCardStateMachine() {
    let prevPageId, prevCardId;
    let prevCardIdExists = false;
    let cardState, prevCardState;

    const exists = compose(not, either(isNil, isEmpty));

    // payload is route data
    const getCurrentState = (payload) => {
      const { isDeepLink, routeData, pathsRemoved } = payload;
      const isAppLink = !isDeepLink;
      const { pageId, cardId } = routeData;
      const cardIdExists = exists(cardId);
      const isNewCard = cardIdExists && prevCardIdExists;
      const pageChanged = pageId !== prevPageId;
      const prevCardStateIsExpanded = [
        'expand',
        'reveal',
        'crossFade',
      ].includes(prevCardState);

      const expand =
        cardIdExists &&
        isAppLink &&
        prevCardStateIsExpanded === false &&
        isNewCard === false;
      const minimize =
        isAppLink &&
        prevCardStateIsExpanded &&
        isNewCard === false &&
        pageChanged === false;
      const crossFade =
        prevCardStateIsExpanded && isNewCard && pageChanged === false;
      const reveal =
        (cardId && isDeepLink) ||
        (prevCardStateIsExpanded && isNewCard && pageChanged === true);

      cardState = compose(
        head,
        keys,
        filter(equals(true)),
      )({ expand, minimize, crossFade, reveal });
      /*console.log(" CARD VARIABLES ", {
        cardState,
        cardIdExists,
        isAppLink,
        prevCardStateIsExpanded,
        isNewCard,
        prevCardIdExists,
        prevCardState,
        cardId,
        prevCardId,
        pageId,
        prevPageId,
        expand,
        minimize,
        crossFade,
        reveal,
        isDeepLink

      });*/

      const previousCardId = prevCardId;

      prevPageId = pageId;
      prevCardId = cardId;
      prevCardState = cardState;
      prevCardIdExists = cardIdExists;

      return { pageChanged, pathsRemoved, cardState, previousCardId };
    };

    return getCurrentState;
  }
}
