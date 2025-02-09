import { SpyneTrait, ChannelPayloadFilter, SpyneAppProperties } from 'spyne';
import {
  whereEq,
  filter,
  propEq,
  path,
  head,
  prop,
  defaultTo,
  compose,
} from 'ramda';
export class AppTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'appTraits$';
    super(context, traitPrefix);
  }

  static appTraits$GetnavLinksset(propsObj) {
    const linkDatasets =
      SpyneAppProperties.getChannelConfig('ROUTE').routeDatasetsArr;
    return compose(
      head,
      defaultTo([{}]),
      filter(whereEq(propsObj)),
    )(linkDatasets);
  }

  static appTraits$GetAppData() {
    const onAppDataReturned = (e) => {
      this.props.data = e['CHANNEL_APP_API'].payload;
      const deepLinkPayload = e['CHANNEL_ROUTE'].payload;
      const {navLinks} = deepLinkPayload;
      const uiText = this.props.data?.text;
      console.log('APP DATA RETURNED ', e, {deepLinkPayload, uiText});
      const { routeData } = deepLinkPayload;


      try {
        this.appTraits$SendDataEvent(routeData, {uiText, deepLinkPayload});
      } catch (e) {
        console.log('ERROR FOR ROUTE', e);
      }
      this.appTraits$SubscribeToRouteChannel();
    };

    this.mergeChannels(['CHANNEL_ROUTE', 'CHANNEL_APP_API']).subscribe(
      onAppDataReturned,
    );
  }
  appTraits$SubscribeToRouteChannel() {
    const routePayloadFilter = new ChannelPayloadFilter({
      action: 'CHANNEL_ROUTE_CHANGE_EVENT',
    });

    this.getChannel('CHANNEL_ROUTE', routePayloadFilter).subscribe(
      this.appTraits$OnRouteEvent.bind(this),
    );
  }

  static appTraits$OnRouteEvent(e) {
    const { routeData } = e.payload;
    this.appTraits$SendDataEvent(routeData);
  }

  static appTraits$SendDataEvent(routeData, initialData) {
    const pageData = this.appTraits$GetCurrentPageData(routeData) || {
      pageId: '404',
    };
    const action = initialData
      ? 'CHANNEL_APP_INIT_EVENT'
      : 'CHANNEL_APP_DATA_EVENT';
    const payload = { ...pageData, ...(initialData || {}) };

    console.log('PAYLOAD PAGE CARD ', { payload, pageData, action, initialData });

    this.sendChannelPayload(action, payload);
  }

  static appTraits$GetCurrentPageData(routeData = {}, data = this.props.data) {
    let { pageId, cardId } = routeData;

    if (pageId === 'app-gen-base-private') {
      pageId = 'home';
    }

    // 1) Find the top-level item with matching pageId in data.content
    let item = data.content.find((obj) => obj.pageId === pageId);

    console.log('CHANNAL APP DATA IS ', { item, pageId, cardId, data });

    if (!item) return null; // Not found

    // 2) If no cardId is specified, return the found item
    if (!cardId) {
      return item;
    }

    // 3) If cardId is specified, return item.content only if it matches
    //    (adjust logic if your data is nested differently or if content is an array)
    if (item.content) {
      return item.content.find((obj) => obj.cardId === cardId);
    }

    // 4) Otherwise no match
    return null;
  }

  static appTraits$HelloWorld() {
    return 'Hello World';
  }
}
