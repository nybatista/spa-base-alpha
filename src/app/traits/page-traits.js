import { SpyneTrait, DomElementTemplate } from 'spyne';
import { PageView } from 'components/pages/page-view.js';
import { CardView } from 'components/cards/card-view.js';
import CardTmpl from '../components/cards/templates/card.tmpl.html';
import { Page404View } from 'components/pages/page-404-view.js';

export class PageTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'pageTraits$';
    super(context, traitPrefix);
  }

  static pageTraits$AddMainNav(e) {
    const { navLinks } = e.payload;
  }

  static pageTraits$onRouteNavEvent(e) {
    // Use 'home' if no route is specified
    const { change = 'home' } = e.payload.routeData;

    // Mark the active nav link with .selected class
    this.props.el$('nav a').setActiveItem('selected', `.link-${change}`);
  }

  static pageTraits$onRouteEvent(e) {
    const { pageId = '404' } = e?.payload;
    console.log('DATA IS PAGE1 ', e, pageId);

    const pageLookupTable = {
      404: Page404View,
    };

    const PageClass = pageLookupTable[pageId] || PageView;

    //const { change = 'home' } = e.payload.routeData;

    // const data = this.pageTraits$GetDataByPageId(change);
    const data = e.payload;
    // Append a new PageView in the .stage-view area,
    this.appendView(new PageClass({ data }), '.page-container');
  }

  static pageTraits$AddCards() {
    const addCard = (data) => {
      // const card = new CardView({data});
      // const card = new DomElementTemplate(CardTmpl, data);
      // this.props.el$('.cards-container').el.appendChild(card.renderDocFrag());
      this.appendView(new CardView({ data }), '.cards-container');
    };
    this.props.data.content.forEach(addCard);
  }

  /**
   * Looks up the page object by its pageId.
   */
  static pageTraits$GetDataByPageId(pageId = 'home') {
    return (
      this.props.data.find((page) => page.pageId === pageId) ||
      this.props.data[0]
    );
  }

  /**
   * Provides an array of page objects used by pageTraits$GetDataByPageId().
   * This could be replaced by a dynamic data source or ChannelFetch in a larger app.
   */
  static pageTraits$GetPageData() {
    return [
      {
        pageId: 'home',
        title: 'Home',
        text: 'Welcome to our starter SpyneJS application! Here you’ll find basic instructions and links to other pages-old.',
      },
      {
        pageId: 'features',
        title: 'Features',
        text: 'Learn about our single active page pattern, dark mode styling, and other capabilities.',
      },
      {
        pageId: 'about',
        title: 'About Us',
        text: 'We are dedicated to building intuitive single-page applications with SpyneJS. Our team is passionate about modular, maintainable code.',
      },
      {
        pageId: 'contact',
        title: 'Contact',
        text: 'Got questions or feedback? Reach out via our contact page or follow us on social media.',
      },
    ];
  }
}
