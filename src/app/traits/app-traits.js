import {
  SpyneTrait,
  ChannelPayloadFilter,
  SpyneAppProperties,
  safeClone,
} from 'spyne';

export class AppTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'appTraits$';
    super(context, traitPrefix);
  }

  static appTraits$OnDataReturned(e) {
    this.props.data = e['CHANNEL_APP_API'].payload;
    this.props.uiText = this.props.data?.text;

    const {navLinks, isDeepLink, routeData} = e['CHANNEL_ROUTE'].payload;
    const {footer, header} = e['CHANNEL_APP_API'].payload.text;
    this.props.initData = {navLinks, isDeepLink, routeData, footer, header};


    try {
      this.appTraits$SendDataEvent(routeData, true);
    } catch (e) {
      console.log('ERROR FOR ROUTE', e);
    }

    /**
     * TODO: CHANNEL_APP_STATE, listens to CHANNEL_APP_DATA
     * TODO: payloadFIlter, CHANNEL_ROUTE_CHANGE_EVENT, add 2nd subscribe
     *
     * */
  }

  static appTraits$OnRouteEvent(e) {
    const { routeData } = e.payload;
    this.appTraits$SendDataEvent(routeData);
  }

  static appTraits$GetChannels() {
    this.mergeChannels(['CHANNEL_ROUTE', 'CHANNEL_APP_API']).subscribe(
      this.appTraits$OnDataReturned.bind(this),
    );

    const routePayloadFilter = new ChannelPayloadFilter({
      action: 'CHANNEL_ROUTE_CHANGE_EVENT',
    });

    this.getChannel('CHANNEL_ROUTE', routePayloadFilter).subscribe(
      this.appTraits$OnRouteEvent.bind(this),
    );
  }

  static appTraits$SendDataEvent(routeData, isInitialData = false) {
    const pageData = this.appTraits$GetCurrentPageData(routeData) || {
      pageId: '404',
    };
    const action = isInitialData
      ? 'CHANNEL_APP_INIT_EVENT'
      : 'CHANNEL_APP_DATA_EVENT';

    const { initData } = this.props;
    const payload = safeClone(pageData);
    payload['initData'] = initData;


    this.sendChannelPayload(action, payload);
  }

  static appTraits$GetCurrentPageData(
    routeData = {},
    data = this.props.data,
    keys = ['pageId', 'cardId'],
  ) {
    if (!data || !data.content) return null;

    return keys.reduce(
      (current, key) => {
        if (!current) return null; // Early exit if not found

        const value = routeData[key];
        if (!value) return current; // If no value for this key, stay at current level

        // Assume nested `content` array at each step
        if (current.content && Array.isArray(current.content)) {
          return current.content.find((obj) => obj[key] === value);
        }

        return null;
      },
      { content: data.content },
    ); // Start with a fake top-level wrapper
  }
}
