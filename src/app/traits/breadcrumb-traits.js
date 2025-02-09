import { SpyneTrait } from 'spyne';
import { BreadcrumbView } from '../components/ui/breadcrumb-view.js';

export class BreadcrumbTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'breadcrumb$';

    super(context, traitPrefix);
  }

  static breadcrumb$HelloWorld() {
    return 'Hello World';
  }

  static breadcrumb$getBreadcrumbObjs(navLinks) {
    const OMIT_KEYS = new Set(['title', 'href', 'navLevel']);
    const encountered = new Set(); // track which properties we've already assigned
    const bcMap = new Map(); // maps navLevel -> { navLevel, bcProps: [] }

    // Sort by navLevel ascending
    const sortedLinks = [...navLinks].sort((a, b) => a.navLevel - b.navLevel);

    for (const link of sortedLinks) {
      const { navLevel } = link;

      // If we haven't seen this navLevel yet, create an entry
      if (!bcMap.has(navLevel)) {
        bcMap.set(navLevel, { navLevel, bcProps: [] });
      }

      // Check each property in the link object
      for (const [key, value] of Object.entries(link)) {
        // Skip if it's an omitted key or already encountered or empty string
        if (OMIT_KEYS.has(key) || encountered.has(key) || value === '') {
          continue;
        }

        // Otherwise, mark this key as encountered
        encountered.add(key);
        // Add it to the bcProps array for this navLevel
        bcMap.get(navLevel).bcProps.push(key);
      }
    }

    // Convert the map to an array sorted by navLevel
    return Array.from(bcMap.values()).sort((a, b) => a.navLevel - b.navLevel);
  }

  static breadcrumb$initBreadcrumbs(e, props = this.props) {
    const { navLinks, routeData } = e.payload;

    const breacrumbObjs = this.breadcrumb$getBreadcrumbObjs(navLinks);
    console.log('ROUTE DATA ', { navLinks, routeData, e });
    const addBreadcrumbs = (bcObj) => {
      const { bcProps, navLevel } = bcObj;
      this.appendView(
        new BreadcrumbView({
          bcProps,
          navLevel,
          navLinks,
          initPayload: e.payload,
          routeData,
        }),
        '.breadcrumbs-list',
      );
    };

    breacrumbObjs.forEach(addBreadcrumbs);
  }

  static breadcrumb$GetRouteState(payload, props = this.props) {
    const { bcProps, navLevel, navLinks } = props;
    const { paths = [], pathInnermost } = payload;
    const { pageId, cardId } = payload?.routeData || {};

    const isHome = pageId === 'home';

    // Check if ANY bcProp is present in `paths`
    const isCurrentPath = bcProps.some((prop) => paths.includes(prop));

    // The "selected" prop is whichever bcProp matches pathInnermost
    const isSelectedProp = isCurrentPath && bcProps.includes(pathInnermost);

    // isActiveLevel could mean we're on the correct path and there is a deeper path level available
    const isActiveLevel = isCurrentPath && paths.length > navLevel;

    return {
      isHome,
      isCurrentPath,
      isSelectedProp,
      isActiveLevel,
      bcProps,
      navLevel,
      navLinks,
      pageId,
      cardId,
    };
  }

  static breadcrumb$GetState(payload, props = this.props) {
    const {
      isHome,
      isCurrentPath,
      isActiveLevel,
      bcProps,
      navLevel,
      navLinks,
    } = this.breadcrumb$GetRouteState(payload, props);

    // Visible if not home and the route includes any of our bcProps
    const isVisible = !isHome && isCurrentPath;
    // Active if it's visible AND the nav level suggests we're not at the deepest route
    const isActive = isVisible && isActiveLevel;

    // If it's not visible, no need to find a navLink
    if (!isVisible) {
      return { isVisible, isActive };
    }

    // Gather all values for the bcProps from the route data
    const bcValues = bcProps.map((prop) => payload?.routeData?.[prop]);

    // Look up the corresponding nav link in navLinks
    const navLink = this.breadcrumb$FindNavLink(
      { bcProps, bcValues, navLevel },
      navLinks,
    );

    return { isVisible, isActive, bcProps, bcValues, navLevel, navLink };
  }

  static breadcrumb$FindNavLink(filterData, navLinks = this.props.navLinks) {
    const { bcProps, bcValues, navLevel } = filterData;
    console.log('FILTER ', { bcProps, bcValues, navLevel });
    return navLinks.find((link) => {
      if (link.navLevel !== navLevel) return false;
      // All bcProps must match the corresponding bcValues for this link
      return bcProps.every((prop, i) => link[prop] === bcValues[i]);
    });
  }

  static breadcrumb$getBreadcrumbLinkClass({
    isVisible = true,
    isActive = true,
  } = {}) {
    return [
      'breadcrumb-item', // Base class
      !isVisible && 'breadcrumb-item--hidden', // Hides the link if false
      isActive ? 'breadcrumb-item--active' : 'breadcrumb-item--inactive',
    ]
      .filter(Boolean)
      .join(' ');
  }

  static breadcrumb$UpdateLink(e, props = this.prop) {
    const { payload } = e;
    const bcState = this.breadcrumb$GetState(payload);
    const { isVisible, isActive, navLink, bcProps, bcValues } = bcState;
    const breadcrumbClass = this.breadcrumb$getBreadcrumbLinkClass({
      isVisible,
      isActive,
    });
    console.log('BC IS ', {
      bcState,
      payload,
      navLink,
      isVisible,
      isActive,
      breadcrumbClass,
    });

    this.props.el$.setClass(breadcrumbClass);

    const updateLink = () => {
      console.log('nav link data ', { bcProps, navLink });

      if (navLink === undefined) {
        return;
      }
      this.props.link$.el.innerText = navLink.title;
      this.props.link$.el.href = navLink.href;

      bcProps.forEach((prop) => {
        const value = payload.routeData?.[prop] || '';
        this.props.linkData[prop] = value;
        // Optionally, also update the DOM dataset:
        // this.props.link$.el.dataset[prop] = value;
      });
    };

    if (isVisible) {
      updateLink();
    } else {
      this.props.link$.el.innerText = '';
    }
  }
}
