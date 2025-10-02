import {
  suppressHydrationErrors,
  visitAndWaitForHydration,
} from 'tests/cypress/support/utils';

import { addPlayerToTournament } from 'tests/cypress/helpers/tournament';
import { getUserCard, getUserRemoveButton } from 'tests/cypress/helpers/users';
import { playername } from './constants';
describe('Tournament UI Elements (e2e)', () => {
  beforeEach(() => {
    cy.loginAdmin();

    visitAndWaitForHydration('/tournament/1/players');
    suppressHydrationErrors();
  });

  it('should have all tournament page elements with proper test identifiers', () => {
    // Check main page elements
    cy.get('[data-testid="tournamentDetailPage"]').should('be.visible');
    cy.get('[data-testid="tournamentTitle"]').should('be.visible');

    // Check tab navigation
    cy.get('[data-testid="tournamentTabsList"]').should('be.visible');
    cy.get('[data-testid="playersTab"]').should('be.visible');
    cy.get('[data-testid="teamsTab"]').should('be.visible');
    cy.get('[data-testid="gamesTab"]').should('be.visible');

    // Default should be players tab
    cy.get('[data-testid="playersTabContent"]').should('be.visible');
  });

  it(`should ensure that ${playername} user is already in tournament`, () => {
    // Check if the specific user is already in the tournament

    if (!getUserCard(cy, playername).scrollIntoView().should('be.visible')) {
      addPlayerToTournament(cy, playername);
    }
  });

  it(`should remove ${playername} from tournament`, () => {
    // Find and click the specific remove button for kettleofketchup
    getUserRemoveButton(cy, playername)
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });

    // Check for success toast message
    cy.contains(/removed|deleted/i, { timeout: 5000 }).should('be.visible');
  });

  it(`should add ${playername} to tournament`, () => {
    // Find and click the specific add button for kettleofketchup
    addPlayerToTournament(cy, playername);
  });

  it(`should verify that ${playername} is back in the tournament`, () => {
    // Verify the user is back in the tournament
    getUserCard(cy, playername).scrollIntoView().should('be.visible');
  });
});
