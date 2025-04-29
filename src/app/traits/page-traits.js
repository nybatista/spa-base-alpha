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



  static pageTraits$onRouteEvent(e) {
    const { pageId = '404' } = e?.payload;

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

}
