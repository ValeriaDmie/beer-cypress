class BeerCard {
    private cardElement: JQuery<HTMLElement>

    constructor(cardElement: JQuery<HTMLElement>) {
        this.cardElement = cardElement
    }

    getCard = () => cy.wrap(this.cardElement)

    getFrontside = () => this.getCard().find('.frontside')

    getBackside = () => this.getCard().find('.backside')

    // Front side

    getFrontsideTitle = () => {
        return this.getCard().find('.frontside .card-title');
    }

    getFrontsideTagline = () => this.getCard().find('.frontside p.tagline')

    getFrontsideCardText = (lineNumber: number) => this.getCard().find('.frontside .card-text').eq(lineNumber - 1)

    getImage = () => this.getCard().find('.img-square-wrapper img')

    getFrontsideCardTextList = () => this.getCard().find('.frontside .card-text')

    getFavorite = () => this.getCard().find('.frontside .fa-heart')

    // Back side

    getFavoriteButton = () => this.getCard().find('.backside button.fav-button')

    //  i.fa-heart

    getBacksideTitle = () => this.getCard().find('.backside .card-title')

    getBacksideCardText = () => this.getCard().find('.backside .card-text')

}

export {BeerCard};