import {
  suppressHydrationErrors,
  visitAndWaitForHydration,
} from 'tests/cypress/support/utils';
import {
  dateYYYYMMDD,
  editedName,
  springChampionship,
  thisName,
} from './constants';

describe('Tournaments — create (e2e)', () => {
  beforeEach(() => {
    // Suppress hydration errors that don't affect functionality
    suppressHydrationErrors();

    cy.loginAdmin();
    visitAndWaitForHydration('/tournaments');
  });
  const getDate = () =>
    cy.contains('label', 'Date Played').parent().find('input');
  const getName = () => cy.contains('label', 'Name:').parent().find('input');

  it('logs in, creates a tournament via the UI and shows it in the list', () => {
    // Build local date in YYYY-MM-DD format (avoid UTC toISOString() shifting date in some timezones)

    // Click the top-level Create Tournament button (opens the form/modal)

    cy.contains('Create Tournament').click();

    // Fill the form fields. Labels and inputs are siblings, so find input via the label's parent.
    getName().clear().type(thisName);

    // Description may be an input or textarea — try both

    // Select a tournament type using the Shadecn Select trigger and item text
    cy.contains('Tournament Type')
      .parent()
      .find('button, [role="button"]')
      .first()
      .click();

    // Wait for dropdown to open and select the option from the dropdown menu
    cy.wait(2000); // Allow dropdown to open

    // Try to click on the option - use force click to handle potential overlay issues
    cy.get(
      '[role="option"], [data-radix-collection-item], .select-item, option',
    )
      .contains(/Single Elimination|single elimination/i)
      .should('be.visible')
      .click({ force: true });

    getDate().clear().type(dateYYYYMMDD);
    cy.get('button.btn.btn-primary')
      .contains(/Create|Create tourn|Saving.../)
      .first()
      .click();

    // After submission, the created tournament should appear in the list.
    // Wait up to 10s for backend work and UI update.
    cy.get('body').contains(thisName, { timeout: 10000 }).should('be.visible');
  });

  it('Can edit the form', () => {
    // Ensure the tournament exists
    cy.contains(thisName).should('exist');

    // Find the nearest card/container for the tournament and click the Edit button inside it
    cy.contains(thisName)
      .closest(
        '.tournament-card, [data-testid="tournament-card"], article, li, .card, .tournament, [role="article"]',
      )
      .within(() => {
        cy.contains('button', /edit/i).first().click();
      });

    cy.wait(1000);
    getName().clear().type(editedName);

    // Find and click the save button
    cy.contains('button', /save changes/i)
      .first()
      .click();

    cy.wait(1000);
    cy.contains(/successfully/i).should('be.visible');

    cy.contains(editedName).scrollIntoView().should('be.visible');
  });

  it('Can delete a tournament', () => {
    // Ensure the tournament exists
    cy.contains(editedName).should('exist').scrollIntoView();

    // Find the nearest card/container for the tournament and click the Delete button inside it
    cy.contains(editedName)
      .closest(
        '.tournament-card, [data-testid="tournament-card"], article, li, .card, .tournament, [role="article"]',
      )
      .within(() => {
        // Target the delete button by aria-label
        cy.get('[aria-label="Delete"]').click();
      });

    cy.wait(500);
    // Click the confirmation delete button
    cy.contains('button', 'Confirm Delete').click();

    cy.wait(500);
    cy.contains(/deleted|deleted successfully|removed/i, {
      timeout: 10000,
    }).should('be.visible');
  });

  it('View Button works', () => {
    // Ensure the tournament exists
    cy.contains(springChampionship).should('exist');

    // Find the nearest card/container for the tournament and click the View button inside it
    cy.contains(springChampionship)
      .closest(
        '.tournament-card, [data-testid="tournament-card"], article, li, .card, .tournament, [role="article"]',
      )
      .within(() => {
        // Target the view button by text
        cy.contains('button', 'View').click();
      });
    cy.wait(1000);
    cy.url().should('include', '/tournament/');
  });
});
