import * as React from 'react';

// page metadata interface
interface IPageMeta {
  title: string;
}

const pageTitleSuffix = 'GOL Truck';

// base component for GOL. All page-level components should be derived from this class
export class BasePageComponent<P, S> extends React.Component<any, any> {
  pageMeta: IPageMeta;

  constructor(props: P, state?: S) {
    super(props, state);
  }

  // update page meta data. Only page title at the moment
  public updatePageMeta(pageMeta: IPageMeta) {
    if (pageMeta.title) {
      document.title = (pageMeta.title.length > 0) ? pageMeta.title + ' | ' + pageTitleSuffix
                                                   : pageTitleSuffix;
    }
  }

  public componentDidMount() {
    // set page meta data on mount
    if (this.pageMeta) {
      this.updatePageMeta(this.pageMeta);
    }
  }

}
