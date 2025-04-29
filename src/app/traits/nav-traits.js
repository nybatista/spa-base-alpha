import { SpyneTrait } from 'spyne';
import { UIHeaderNavView } from 'components/ui/ui-header-nav-view.js';

export class NavTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'navTraits$';

    super(context, traitPrefix);
  }

  static navTraits$AddNavLinks(navLinks = []) {
    //const { navLinks } = e.payload;

    // PULL ONLY TOP PAGE LINKS;
    const data = navLinks.filter((o) => o.navLevel === 1);
    this.appendView(new UIHeaderNavView({ data }), '.header-content');
  }

  static navTraits$OnAppDataEvent(logoTxt = '') {
    this.props.el$('.branding h1 a').el.innerText = logoTxt;
  }

  static navTraits$onRouteNavEvent(e) {
    // Use 'home' if no route is specified
    const { change = 'home' } = e.payload.routeData;

    // Mark the active nav link with .selected class
    this.props.el$('nav a').setActiveItem('selected', `.link-${change}`);
  }
}
