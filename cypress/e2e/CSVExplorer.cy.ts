interface TestFile {
    readonly name: string
    readonly fileName: string
    readonly contents: string
}

const BASE_URL = "http://localhost:8080"
const FILES = {
    foo: {
        name: 'foo',
        fileName: 'foo.csv',
        contents: 'id,foo,bar\n1,foo-1,bar-1\n2,foo-2,bar-2',
    } as TestFile,
}

function importCSV(file: TestFile) {
    cy.get('#importCsvButton').click()
    cy.get('#importForm input[type=text]')
        .type(file.name)
    cy.get('#importForm input[type=file]')
        .selectFile({
            fileName: file.fileName,
            contents: Cypress.Buffer.from(file.contents),
        })
    cy.get('#importForm-importButton').click()
    cy.get('#importForm')
        .should('not.exist')
}

describe('CSV Explorer', () => {
    it('should have action buttons available', () => {
        cy.visit(BASE_URL)

        cy.get('#importCsvButton')
            .should('be.visible')
        cy.get('#saveButton')
            .should('be.visible')
        cy.get('#runButton')
            .should('be.visible')
    })

    it('should show import modal on import button click', () => {
        cy.visit(BASE_URL)

        cy.get('#importCsvButton').click()
        cy.get('#importForm')
            .should('be.visible')
    })

    it('should hide import modal on cancel', () => {
        cy.visit(BASE_URL)

        cy.get('#importCsvButton').click()
        cy.get('#importForm-cancelButton').click()
        cy.get('#importForm')
            .should('not.exist')
    })

    it('should import CSV document', () => {
        cy.visit(BASE_URL)

        importCSV(FILES.foo)

        cy.get('#entityList-foo')
            .should('be.visible')
        cy.get('#downloadButton-foo')
            .should('be.visible')
        cy.get('#dropButton-foo')
            .should('be.visible')
    })

    it('should select all from a table', () => {
        cy.visit(BASE_URL)

        importCSV(FILES.foo)

        cy.get('#editor')
            .click()
            .focused()
            .type(`select * from ${FILES.foo.name};`)
        cy.get('#runButton').click()

        cy.get('#spreadsheet thead > tr > td[title=id]')
            .should('be.visible')
        cy.get('#spreadsheet thead > tr > td[title=foo]')
            .should('be.visible')
        cy.get('#spreadsheet thead > tr > td[title=bar]')
            .should('be.visible')

        cy.get('#spreadsheet tbody > tr[data-y=0]')
            .should('be.visible')
        cy.get('#spreadsheet tbody > tr[data-y=1]')
            .should('be.visible')
        cy.get('#spreadsheet tbody > tr[data-y=2]')
            .should('not.exist')
    })
})
