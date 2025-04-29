import { ViewStream, safeClone } from 'spyne';
import { PageTraits } from 'traits/page-traits.js';
import PageTmpl from './templates/page.tmpl.html';
import PageHomeTmpl from './templates/page-home.tmpl.html';
import PageCardTmpl from './templates/page-card-expanded.tmpl.html';

export class PageView extends ViewStream {
  constructor(props = {}) {
    props.class = `page-view page-view-${props?.data?.pageId}`;
    props.channels = [['CHANNEL_ROUTE', true]];
    props.traits = [PageTraits];
    props.data = safeClone(props.data);
    props.data.imgUrl = props.data?.img?.imgUrl || props.data.img?.src?.large;
    props.data.__cms__isProxy = true;
    props.template = props.data.cardId
      ? PageCardTmpl
      : props.data.pageId === 'home'
        ? PageHomeTmpl
        : PageTmpl;
    props.template2 = `<div class="page-content">
                        <h2>{{title}}</h2>
                        <p>{{text}}</p>
                      </div>
                      `;
    super(props);
  }
  addActionListeners() {
    return [['CHANNEL_ROUTE_CHANGE_EVENT', 'disposeViewStream']];
  }

  onRendered() {
    if (this.props.data.content) {
      this.pageTraits$AddCards();
    }
  }
}
