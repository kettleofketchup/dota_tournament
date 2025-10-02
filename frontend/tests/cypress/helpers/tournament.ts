import type { cyType } from './types';
import { getUserCard } from './users';

export const getAddPlayerButton = (cy: cyType) => {
  return cy.get(`[data-testid="tournamentAddPlayerBtn"]`);
};

export const addPlayerToTournament = (cy: cyType, username: string) => {
  getAddPlayerButton(cy)
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true });

  cy.get('[data-testid="playerSearchInput"]').type(username, {
    force: true,
  });

  cy.get(`[data-testid="playerOption-${username}"]`)
    .should('be.visible')
    .click({ force: true });

  cy.get('[data-testid="playerSearchInput"]').type(username, {
    force: true,
  });

  cy.get(`[data-testid="playerOption-${username}"]`)
    .should('be.visible')
    .click({ force: true });

  cy.contains(/added|created/i, { timeout: 5000 }).should('be.visible');

  getUserCard(cy, username).scrollIntoView().should('exist').and('be.visible');
};
