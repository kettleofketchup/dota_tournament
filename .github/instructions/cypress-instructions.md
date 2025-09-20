---
applyTo: "frontend/tests/cypresss/**/*.ts*", "frontend/tests/cypress/**/*", "frontend/tests/cypress/e2e/**/*
---
This file contains guidance for writing Cypress tests that target the frontend code in this repository.

Placement
 - Put Cypress test specs under: `frontend/tests/cypress`.
 - Keep fixtures in `frontend/tests/cypress/fixtures` and support files in `frontend/tests/cypress/support` when needed.

API and base path
 - The frontend API wrappers live in `frontend/app/components/api`.
 - The shared axios base path is defined in `frontend/app/components/api/axios.ts`. Use this base path when you need to construct direct HTTP requests in your Cypress tests so they match the app's API host and prefix.

Authentication helpers
 - The backend exposes test login endpoints used by the Django test suite. See `backend/tests/urls.py` for the test login routes for `user`, `staff`, and `admin`.
 - Cypress custom commands for authentication already exist in the project and are named `loginUser`, `loginStaff`, and `loginAdmin`.
	 - Use `cy.loginUser()` to sign in a regular user.
	 - Use `cy.loginStaff()` to sign in a staff user.
	 - Use `cy.loginAdmin()` to sign in an admin user.
 - These commands handle the necessary API calls and session setup. Prefer them over manually hitting backend endpoints unless you need special setup.

Writing tests — quick examples
 - Example: simple protected page smoke test (place as `frontend/tests/cypress/integration/protected.spec.ts`):

	```ts
	// ...existing code...
	describe('Protected page access', () => {
		it('redirects anonymous users to login', () => {
			cy.visit('/protected-route')
			cy.url().should('include', '/login')
		})

		it('allows logged-in users', () => {
			cy.loginUser()
			cy.visit('/protected-route')
			cy.contains('Welcome').should('be.visible')
		})
	})
	```

 - Example: testing an API-driven component end-to-end against the real backend. Use the project's axios base path so test requests target the same host/prefix as the app.

	```ts
	// ...existing code...
	import { apiBasePath } from '../../../../frontend/app/components/api/axios'

	describe('API driven list (e2e)', () => {
		it('shows items returned by the real backend', () => {
			// Ensure server-side data exists using cy.request, then visit the page.
			cy.loginAdmin().then(() => {
				// Create a test item via the API using the same base path the app uses
				cy.request('POST', `${apiBasePath}/items/`, { name: 'E2E Item' })
				cy.visit('/')
				cy.get('[data-test=items-list]').should('contain', 'E2E Item')
			})
		})
	})
	```

Notes and best practices
 - This project prefers end-to-end tests that exercise the real backend. Do not stub API calls with `cy.intercept()` for e2e specs. Instead:
	 - Use the Cypress custom commands `cy.loginUser()`, `cy.loginStaff()`, or `cy.loginAdmin()` to authenticate.
	 - Use `cy.request()` to create, modify, or clean up server-side state before visiting pages. Import the axios base path from `frontend/app/components/api/axios.ts` so your test requests use the same host and prefix as the frontend.
	 - Example pattern:

	```ts
	import { apiBasePath } from '../../../../frontend/app/components/api/axios'

	cy.loginStaff().then(() => {
		cy.request('POST', `${apiBasePath}/some-resource/`, { ...payload })
		cy.visit('/page-that-shows-resource')
		cy.contains('Expected text').should('exist')
	})
	```
 - Keep time-sensitive/e2e tests isolated and mark them so they can be run separately from fast unit-like cypress specs.

Where to add tests in repo
 - Add spec files to `frontend/tests/cypress`. The test runner is configured to pick specs from there.

If anything in this guidance becomes outdated (for example, if the axios base path moves), update this file with the new paths and a short example showing how to import the base path.

Related files to check
 - `frontend/app/components/api/axios.ts` (axios base path)
 - `frontend/app/components/api/*` (API wrappers)
 - `backend/tests/urls.py` (test login endpoints)

Keeping form selectors in sync with xForm/editForm
 - Many forms in this project are generated or structured by the `xForm`/`editForm` pattern (for example `frontend/app/components/tournament/create/editForm.tsx`). When those files change they can rename labels, IDs, or the visible submit text. To reduce brittle tests:
	 - Prefer selecting by stable IDs (for example `#state-select` or `#tournament-type-select`) when they exist.
	 - For Shadecn custom selects, interact with the visible trigger and choose the option text rather than relying on internal DOM structure.
	 - When labels are used, target the label's parent and find the input to keep tests resilient to small markup changes: `cy.contains('label', 'Name:').parent().find('input')`.
	 - Add a short checklist in PRs that modify `xForm` or `editForm` files to update related Cypress specs (search for matching `data-testid`, `id`, or label text).


Happy testing!
