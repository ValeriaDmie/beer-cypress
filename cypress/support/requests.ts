export const interceptGetBeersRequest = () => {
    const interceptName = 'getBeersRequest';
    cy.intercept('GET', '/v2/beers*').as(interceptName)
    return `@${interceptName}`;
}

/**
 * Clears favorites directly on backend
 */
export const clearFavorites = () => {
    // Clear favorites left from previous tests
    // Send a GET request to retrieve all favorite beers
    cy.request('GET', '/v2/beers?favorite=true').then((response) => {
        response.body.content.forEach(beer => {
            // send PATCH request to clear favorites flag
            cy.request('PATCH', `/v2/beers/${beer.id}/favorite/false`)
            cy.log(`Removed from favorites beer '${beer.name}' (${beer.id})`);
        });
    });
}

