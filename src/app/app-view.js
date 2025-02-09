import { ViewStream } from 'spyne';
import { UIHeaderView } from 'components/ui/ui-header-view.js';
import { UIMenuDrawerView } from 'components/ui/ui-menu-drawer-view.js';
import { StageView } from 'components/stage-view.js';
import { UIFooterView } from 'components/ui/ui-footer-view.js';

export class AppView extends ViewStream {
  constructor(props = {}) {
    props.tagName = 'main';
    props.id = 'app';
    super(props);
  }

  onRendered() {
    this.appendView(new UIHeaderView());
    this.appendView(new UIMenuDrawerView());
    this.appendView(new StageView());
    this.appendView(new UIFooterView());
  }
}
