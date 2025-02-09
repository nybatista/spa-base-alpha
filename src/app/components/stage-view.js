import { ViewStream } from 'spyne';
import { PageTraits } from 'traits/page-traits.js';
import { BreadcrumbTraits } from 'traits/breadcrumb-traits.js';

export class StageView extends ViewStream {
  constructor(props = {}) {
    props.id = 'stage-view';
    props.data = PageTraits.pageTraits$GetPageData();
    props.traits = [PageTraits, BreadcrumbTraits];
    props.channels = ['CHANNEL_APP', 'CHANNEL_ROUTE'];
    props.template = `<nav class='breadcrumbs' aria-label='breadcrumb'><ol class="breadcrumbs-list"></ol></nav><div class='page-container'></div>`;
    super(props);
  }

  addActionListeners() {
    return [
      ['CHANNEL_APP_INIT_EVENT', 'onAppInitEvent'],
      ['CHANNEL_APP_DATA_EVENT', 'pageTraits$onRouteEvent']
    ];
  }

  onAppInitEvent(e){
    const payload = e.payload.deepLinkPayload;
    this.breadcrumb$initBreadcrumbs({payload})
    this.pageTraits$onRouteEvent(e);
  }

  broadcastEvents() {
    return [];
  }

  onRendered() {}
}
