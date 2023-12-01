import {BeerListPageObject} from "../support/page-objects/beer-list.po";
import {BeerCard} from "../support/page-objects/beer-card.po";
import {clearFavorites, interceptGetBeersRequest} from "../support/requests";

// for this assignment I use common page object, since both home and favorite pages are almost the same.
// In real life I'd use separate page object for each page
const beerListPage = new BeerListPageObject()

/**
 * Test cases for favorites:
 * - As a user I should be able to mark beers as my favourite
 * - As a user I should be able to unmark beers as my favourite
 * - As a user I want to view my favourite beers
 */
describe('Favorites', () => {

  let getBeersIntercept: string

  beforeEach(() => {
    clearFavorites()
    getBeersIntercept = interceptGetBeersRequest();

    cy.visit('/home')
    cy.wait(getBeersIntercept, {timeout: 10000}); // wait for page to load data from the backend
    cy.url().should('include', '/home')
    cy.get('ngx-spinner').should('not.be.visible', { timeout: 10000 })
  });

  it('should mark and show favorite beers', () => {
    // Add beer to favorites
    beerListPage.getBeerCardByName('Trashy Blonde').then(cardElement => {
      const beerCard = new BeerCard(cardElement)
      beerCard.getFavorite().should('not.exist')

      beerCard.getCard().realHover({ scrollBehavior: "top" })
      cy.wait(1500) // wait for animation to finish
      beerCard.getBackside().should('be.visible')

      beerCard.getFavoriteButton().should('contain.text', 'Add Favorite')
      beerCard.getFavoriteButton().click( { scrollBehavior: "nearest" })
      cy.wait(1000) // wait for animation to finish

      beerListPage.getAlertDialog()
          .should('be.visible')
          .and('contain.text', 'Beer Trashy Blonde added to favorites')
    })

    // Verify beer marked as favorite
    beerListPage.getBeerCardByName('Trashy Blonde').then(cardElement => {
      const beerCard = new BeerCard(cardElement)

      // verify favorite button
      beerCard.getBackside().should('be.visible')
      beerCard.getFavoriteButton().should('contain.text', 'Remove Favorite')

      // verify favorite icon
      cy.get('app-root').realHover({ scrollBehavior: "nearest" })
      beerCard.getBackside().should('not.be.visible')
      beerCard.getFavorite().should('be.visible')
    })

    // Verify the beer is shown on favorites page
    cy.visit('favorites')
    cy.url().should('include', '/favorites')

    beerListPage.getBeerCardByName('Trashy Blonde').then(cardElement => {
      const beerCard = new BeerCard(cardElement)
      beerCard.getCard().should('be.visible')
      beerCard.getFavorite().should('be.visible')
    })
  })

  it('should remove beer from favorites', () => {
    // add beer to favorites
    beerListPage.getBeerCardByName('Trashy Blonde').then(cardElement => {
      const beerCard = new BeerCard(cardElement)
      beerCard.getFavorite().should('not.exist')

      beerCard.getCard().realHover({ scrollBehavior: "top" })
      cy.wait(1500) // wait for animation for finish
      beerCard.getFavoriteButton().click( { scrollBehavior: "nearest", waitForAnimations: true, animationDistanceThreshold: 200 })
    })

    // remove beer from favorites
    cy.visit('/favorites')
    cy.wait(getBeersIntercept, {timeout: 5000}); // wait for page to load data from the backend
    cy.url().should('include', '/favorites')

    beerListPage.getBeerCardByName('Trashy Blonde').then(cardElement => {
      const beerCard = new BeerCard(cardElement)
      beerCard.getCard().should('be.visible')
      beerCard.getFavorite().should('be.visible')
      beerCard.getCard().realHover()
      beerCard.getFavoriteButton().click()
      beerListPage.getAlertDialog()
          .should('be.visible')
          .and('contain.text', 'Beer Trashy Blonde removed from favorites')
    })

    // verify the beer is not in favorites anymore
    beerListPage.getBeerCardByName('Trashy Blonde').should('not.exist')

    // Verify beer is not marked favorite
    cy.visit('/home')
    cy.wait(getBeersIntercept, {timeout: 5000}); // wait for page to load data from the backend

    beerListPage.getBeerCardByName('Trashy Blonde').then(cardElement => {
      const beerCard = new BeerCard(cardElement)
      beerCard.getFavorite().should('not.exist')
    })
  })
})