import { SpyneTrait } from 'spyne';
import { PageView } from 'components/pages/page-view.js';
import { CardView } from 'components/cards/card-view.js';
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
    const data = e.payload;

    // Append a new PageView in the .stage-view area,
    this.appendView(new PageClass({ data }), '.page-container');
  }

  static pageTraits$AddCards() {
    const addCard = (data) => {
      this.appendView(new CardView({ data }), '.cards-container');
    };
    this.props.data.content.forEach(addCard);
  }


}
