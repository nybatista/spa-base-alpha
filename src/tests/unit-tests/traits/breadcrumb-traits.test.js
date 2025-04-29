import { expect } from 'chai';
import {
  navLinks,
  payloadHome,
  payloadAbout,
  payloadCardFlyingTech,
} from '../mocks/route-mocks.js';
import { BreadcrumbTraits } from '../../../app/traits/breadcrumb-traits.js';

const propsPage = {
  bcProps: ['pageId'],
  navLevel: 1,
  navLinks: navLinks,
};

const propsCard = {
  bcProps: ['cardId'],
  navLevel: 2,
  navLinks: navLinks,
};

describe('should test that breadrumb traits exists ', () => {
  it('should return hw from breadrumb traits', () => {
    const hw = BreadcrumbTraits.breadcrumb$HelloWorld();
    expect(hw).to.eq('Hello World');
  });

  it('should init breadcrumb objects based on navLinks', () => {
    const breadcrumbObjs =
      BreadcrumbTraits.breadcrumb$getBreadcrumbObjs(navLinks);
  });

  it('should find home visible states', () => {
    const isVisiblePage = BreadcrumbTraits.breadcrumb$GetState(
      payloadHome,
      propsPage,
    );

    const isVisibleCard = BreadcrumbTraits.breadcrumb$GetState(
      payloadHome,
      propsCard,
    );

    expect(isVisiblePage.isVisible).to.be.false;
    expect(isVisibleCard.isVisible).to.be.false;
  });

  it('should find about visible states', () => {
    const isVisiblePage = BreadcrumbTraits.breadcrumb$GetState(
      payloadAbout,
      propsPage,
    );

    const isVisibleCard = BreadcrumbTraits.breadcrumb$GetState(
      payloadAbout,
      propsCard,
    );

    expect(isVisiblePage.isVisible).to.be.true;
    expect(isVisibleCard.isVisible).to.be.false;
  });

  it('should find card visible states', () => {
    const isVisiblePage = BreadcrumbTraits.breadcrumb$GetState(
      payloadCardFlyingTech,
      propsPage,
    );

    const isVisibleCard = BreadcrumbTraits.breadcrumb$GetState(
      payloadCardFlyingTech,
      propsCard,
    );

    expect(isVisiblePage.isVisible).to.be.true;
    expect(isVisibleCard.isVisible).to.be.true;
  });

  it('should find page home active states', () => {
    const isActivePage = BreadcrumbTraits.breadcrumb$GetState(
      payloadHome,
      propsPage,
    );

    const isActiveCard = BreadcrumbTraits.breadcrumb$GetState(
      payloadHome,
      propsCard,
    );

    expect(isActivePage.isActive).to.be.false;
    expect(isActiveCard.isActive).to.be.false;
  });

  it('should find page about active states', () => {
    const isActivePage = BreadcrumbTraits.breadcrumb$GetState(
      payloadAbout,
      propsPage,
    );

    const isActiveCard = BreadcrumbTraits.breadcrumb$GetState(
      payloadAbout,
      propsCard,
    );

    expect(isActivePage.isActive).to.be.false;
    expect(isActiveCard.isActive).to.be.false;
  });

  it('should find card  active state', () => {
    const isActivePage = BreadcrumbTraits.breadcrumb$GetState(
      payloadCardFlyingTech,
      propsPage,
    );

    const isActiveCard = BreadcrumbTraits.breadcrumb$GetState(
      payloadCardFlyingTech,
      propsCard,
    );

    expect(isActivePage.isActive).to.be.true;
    expect(isActiveCard.isActive).to.be.false;
  });

  it('should get page home linkData', () => {
    const bcPageData = BreadcrumbTraits.breadcrumb$GetState(
      payloadHome,
      propsPage,
    );

    const bcCardData = BreadcrumbTraits.breadcrumb$GetState(
      payloadHome,
      propsCard,
    );

    //console.log("LINK home DATA PAGE ",bcPageData);
    //console.log("LINK home DATA CARD ",bcCardData);

    expect(bcPageData.navLink).to.be.undefined;
    expect(bcCardData.navLink).to.be.undefined;
  });

  it('should get page about linkData', () => {
    const bcPageData = BreadcrumbTraits.breadcrumb$GetState(
      payloadAbout,
      propsPage,
    );

    const bcCardData = BreadcrumbTraits.breadcrumb$GetState(
      payloadAbout,
      propsCard,
    );

    //console.log("LINK about DATA PAGE ",bcPageData);
    //console.log("LINK about DATA CARD ",bcCardData);

    expect(bcPageData.navLink.title).to.eq('ABOUT');
    expect(bcCardData.navLink).to.be.undefined;
  });

  it('should get card linkData', () => {
    const bcPageData = BreadcrumbTraits.breadcrumb$GetState(
      payloadCardFlyingTech,
      propsPage,
    );

    const bcCardData = BreadcrumbTraits.breadcrumb$GetState(
      payloadCardFlyingTech,
      propsCard,
    );

    //console.log("LINK DATA PAGE ",bcPageData);
    //console.log("LINK DATA CARD ",bcCardData);

    expect(bcPageData.navLink.title).to.eq('FLYING CARS');
    expect(bcCardData.navLink.title).to.eq('FLYING TECH');
  });

  it('should return the correct breadcrumb class', () => {
    const isHiddenBC = BreadcrumbTraits.breadcrumb$getBreadcrumbLinkClass({
      isVisible: false,
      isActive: false,
    });
    const isVisibleBC = BreadcrumbTraits.breadcrumb$getBreadcrumbLinkClass({
      isVisible: true,
      isActive: false,
    });
    const isVisibleAndActiveBC =
      BreadcrumbTraits.breadcrumb$getBreadcrumbLinkClass({
        isVisible: true,
        isActive: true,
      });

    expect(isHiddenBC).to.eq(
      'breadcrumb-link breadcrumb-link--hidden breadcrumb-link--inactive',
    );
    expect(isVisibleBC).to.eq('breadcrumb-link breadcrumb-link--inactive');
    expect(isVisibleAndActiveBC).to.eq(
      'breadcrumb-link breadcrumb-link--active',
    );
  });
});
