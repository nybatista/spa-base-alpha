import { ViewStream } from 'spyne';
import { BreadcrumbTraits } from 'traits/breadcrumb-traits.js';
import BreadcrumbTmpl from './templates/breadcrumb-view.tmpl.html';
export class BreadcrumbView extends ViewStream {
  constructor(props = {}) {
    props.tagName = 'li';
    props.class = 'breadcrumb-item';
    props.traits = [BreadcrumbTraits];
    props.channels = ['CHANNEL_ROUTE'];
    props.template = BreadcrumbTmpl;
    super(props);
  }

  addActionListeners() {
    return [['CHANNEL_ROUTE_.*_EVENT', 'breadcrumb$UpdateLink']];
  }

  broadcastEvents() {
    return [['a', 'click']];
  }

  onRendered() {
    this.props.link$ = this.props.el$('a');
    this.props.linkData = this.props.link$.el.dataset;

    if (this.props.initPayload) {
      this.breadcrumb$UpdateLink({ payload: this.props.initPayload });
    }
  }
}
