class BeerListPageObject {

    getSearch = () => cy.get('input.form-control')

    /**
     * Returns a list of all cards on the page
     */
    getBeerCards = () => cy.get('app-card-beer')

    getBeerCardByName = (beerName: string) =>
        cy.contains('app-card-beer .frontside .card-title', beerName)
            .should('exist')
            .parents('app-card-beer') // Navigate to the parent card element


    // pagination
    getPaginationList = () => cy.get('ul.pagination > li.page-item')

    getPaginationPage = (pageIndex: number) => cy.get('ul.pagination > li.page-item a.page-link').contains(pageIndex)

    getPaginationPrevious = () => this.getPaginationList().find("[aria-label='Previous']")

    getPaginationNext = () => this.getPaginationList().find("[aria-label='Next']")

    getAlertDialog = () => cy.get('[role="alertdialog"]')
}

export {BeerListPageObject}