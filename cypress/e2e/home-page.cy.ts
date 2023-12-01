import {BeerListPageObject} from "../support/page-objects/beer-list.po"
import {clearFavorites, interceptGetBeersRequest} from '../support/requests'
import {slowCypressDown} from "cypress-slow-down";
import {BeerCard} from "../support/page-objects/beer-card.po";

const homePage = new BeerListPageObject()

// Add delay after each step for demo purposes
// slowCypressDown(100)

const BEER_LOAD_TIMEOUT = 5000;
describe('Home page', () => {

    let getBeersIntercept: string;

    beforeEach(() => {
        clearFavorites()
        getBeersIntercept = interceptGetBeersRequest();
        cy.visit('home')
        cy.wait(getBeersIntercept, {timeout: BEER_LOAD_TIMEOUT}); // wait for page to load data from the backend
    });

    describe('Beer card', () => {
        it('should show beer properties in front side', () => {
            homePage.getBeerCardByName('Buzz').then(cardElement => {
                const beerCard = new BeerCard(cardElement)

                beerCard.getFrontsideTitle()
                    .should('be.visible')
                    .and('have.text', 'Buzz')

                beerCard.getFrontsideTagline()
                    .should('be.visible')
                    .and('have.text', 'A Real Bitter Experience.')

                beerCard.getImage().should('be.visible')

                beerCard.getFrontsideCardText(1).should('be.visible')
                beerCard.getFrontsideCardText(2).should('be.visible')
                beerCard.getFrontsideCardText(3).should('be.visible')
                beerCard.getFrontsideCardText(4).should('be.visible')
            })
        })

        it('should show beer description on back side', () => {
            homePage.getBeerCardByName('Buzz').then(cardElement => {
                const beerCard = new BeerCard(cardElement)

                beerCard.getCard().realHover()
                beerCard.getFrontside().should('not.be.visible')
                beerCard.getBackside().should('be.visible')

                beerCard.getBacksideTitle()
                    .should('be.visible')
                    .and('have.text', 'Buzz')

                beerCard.getBacksideCardText()
                    .should('be.visible')
                    .and('have.text', 'A light, crisp and bitter IPA brewed with English and American hops. A small batch brewed only once.')

                beerCard.getFavoriteButton().should('be.visible')
            })
        })

        it('should flip on hover', () => {
            homePage.getBeerCards().first().then(cardElement => {
                const beerCard = new BeerCard(cardElement)

                beerCard.getFrontside().should('be.visible')
                beerCard.getBackside().should('not.be.visible')

                beerCard.getCard().realHover()

                beerCard.getFrontside().should('not.be.visible')
                beerCard.getBackside().should('be.visible')
            })
        })
    })

    it('should show a list of beer cards', () => {
        homePage.getBeerCards().should("have.length", 10)
        homePage.getBeerCards().each(($card) => {
            cy.wrap($card).should('be.visible');
        });
    })

    it.skip('should show a list of all available beers', () => {
        // In real life testing, I'd inject the test data before running the test(s).
        // For this particular test I'd use small amount of beers that will take 2-3 pages, e.g. 13
        // the test will be more simple: count 10 beers on the 1-st page and 3 beers on the second page
    })

    it('should show only 10 beers per page', () => {
        // Page 1
        homePage.getBeerCards().should("have.length", 10)

        // Page 2
        homePage.getPaginationList().eq(0).scrollIntoView()
        homePage.getPaginationNext().click()
        cy.wait(getBeersIntercept, {timeout: BEER_LOAD_TIMEOUT});
        homePage.getBeerCards().should("have.length", 10)

        // Page 3
        homePage.getPaginationList().eq(0).scrollIntoView()
        homePage.getPaginationNext().click()
        cy.wait(getBeersIntercept, {timeout: BEER_LOAD_TIMEOUT});
        homePage.getBeerCards().should("have.length", 10)

        // Last Page
        homePage.getPaginationList().eq(0).scrollIntoView()
        homePage.getPaginationPage(16).click();
        cy.wait(getBeersIntercept, {timeout: BEER_LOAD_TIMEOUT});
        homePage.getBeerCards().should("have.length.within", 1, 10)
    })
})
