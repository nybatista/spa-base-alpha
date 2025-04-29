import { ViewStream, safeClone } from 'spyne';
import CardTmpl from './templates/card.tmpl.html';

export class CardView extends ViewStream {
  constructor(props = {}) {
    props.tagName = 'li';
    props.class = 'card';
    props.data = safeClone(props.data);
    props.data.imgUrl = props.data?.img?.src?.medium;
    props.template = CardTmpl;

    super(props);
  }

  addActionListeners() {
    return [];
  }

  broadcastEvents() {
    return [['a', 'click']];
  }

  onRendered() {}
}
