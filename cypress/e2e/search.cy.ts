import {BeerListPageObject} from "../support/page-objects/beer-list.po";
import {interceptGetBeersRequest} from "../support/requests";
import {BeerCard} from "../support/page-objects/beer-card.po";

const homePage = new BeerListPageObject()

describe('Search on home page', () => {

  let getBeersIntercept: string;

  beforeEach(() => {
    getBeersIntercept = interceptGetBeersRequest();
    cy.visit('/home')
    cy.wait(getBeersIntercept, {timeout: 10000}); // wait for page to load data from the backend
    cy.url().should('include', '/home')
    cy.get('ngx-spinner').should('not.be.visible', { timeout: 10000 })
  });

  it('should exist and be visible', () => {
    homePage.getSearch().should('be.visible')
  })

  it('should search beer by name', () => {
    homePage.getSearch().type('Pilsen Lager')
    cy.wait(getBeersIntercept, {timeout: 5000});

    homePage.getBeerCards().should("have.length", 1)
    homePage.getBeerCards().first().then(cardElement => {
      const beerCard = new BeerCard(cardElement)

      beerCard.getFrontsideTitle()
          .should('be.visible')
          .should('have.text', 'Pilsen Lager')
    })
  })

  it('should search beer by description', () => {
    homePage.getSearch().type('crushed peppercorns')
    cy.wait(getBeersIntercept, {timeout: 5000});

    homePage.getBeerCards().should("have.length", 1)
    homePage.getBeerCards().first().then(cardElement => {
      const beerCard = new BeerCard(cardElement)
      beerCard.getCard().realHover()
      cy.wait(1500)
      beerCard.getBacksideCardText().should('contain.text', 'crushed peppercorns')
    })
  })
})