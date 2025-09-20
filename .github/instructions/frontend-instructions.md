---
applyTo: "**/*.ts,**/*.tsx"
---

Guidelines for frontend Copilot usage and project conventions

Overview
 - Individual components/features live under `frontend/app/components/<feature>`.
 - Example feature: `frontend/app/components/user`.
 - Edit forms and create forms should be placed near the component and split into a form and a modal when appropriate:
   - `edit/Form.tsx` or `create/Form.tsx` (form logic and inputs)
   - `edit/Modal.tsx` or `create/Modal.tsx` (modal wrapper that opens the form)

Hooks
 - Hooks should be colocated inside the component's folder in a `hooks/` subfolder when practical (see `frontend/app/components/draft/hooks` for an example).
 - Name hooks in the pattern <what><action>Hook.tsx — e.g. `rebuildTeamsHook.tsx`, `useUserProfileHook.tsx`, `fetchPostsHook.tsx`.
 - Keep hooks focused: one responsibility, well-typed params, and clear return values.

POSTs and server mutations
 - For server-side mutations (POST/PUT/DELETE), use `toast.promise` from `sonner` to surface progress and results to the user.
 - Use the project's API helpers in `frontend/app/components/api/*` when available. Example pattern inside a hook or action file:

  ```ts
  import { toast } from 'sonner'
  import { DraftRebuild } from '~/components/api/api'
  import type { RebuildDraftRoundsAPI } from '~/components/api/types'
  import type { TournamentType } from '~/index'
  import { getLogger } from '~/lib/logger'

  const log = getLogger('Rebuild Teams Hook')

  type HookParams = {
    tournament: TournamentType
    setTournament: (t: TournamentType) => void
  }

  export const rebuildTeamsHook = async ({ tournament, setTournament }: HookParams) => {
    log.debug('Rebuilding teams', { tournament })

    if (!tournament?.pk) {
      log.error('No tournament primary key found')
      return
    }

    const data: RebuildDraftRoundsAPI = { tournament_pk: tournament.pk }

    toast.promise(DraftRebuild(data), {
      loading: `Rebuilding teams...`,
      success: (resp) => {
        setTournament(resp)
        return `Tournament Draft has been rebuilt!`
      },
      error: (err) => {
        const val = err?.response?.data ?? String(err)
        log.error('Tournament Draft failed to rebuild', err)
        return `Failed to rebuild: ${val}`
      },
    })
  }
  ```

GETs and read-only requests
 - For data fetching (GET requests), do not use toasts. Fetch quietly and show loading states in the UI itself (spinners, skeletons, disabled buttons).

Reusable components
 - Shared components should live in `frontend/app/components/reusable/` and be generic and well-documented.
 - Example: `frontend/app/components/reusable/adminButton.tsx` is used to display admin-only actions and leverages `useUserStaff` or `useUserStore` to check roles.

Shadecn UI components
 - UI primitives and themed components live in `frontend/app/components/ui` and are imported with `~/components/ui/...`.

State management
 - Use zustand for local/feature state. Prefer small, focused stores per component or feature rather than a single global store for everything.
 - `useUserStore` stores most user-related information; other feature stores should follow a similar convention (e.g. `useDraftStore`, `useTournamentStore`).

Additional best practices
 - Type everything: prefer TypeScript types for API payloads and component props (use `frontend/app/components/api/types` where types are defined).
 - Keep components small and focused; extract repeated UI into `reusable/` components.
 - Place complex logic into hooks or utility functions under `utils/` to keep components declarative.
 - Add unit tests for hooks and pure components when possible; e2e tests should live in `frontend/tests/cypress` and exercise the real backend per project policy.

Routing and pages
 - The project uses React Router. The root route configuration lives in `frontend/app/routes.tsx`.
 - Individual route files live in `frontend/app/routes/`. Follow the pattern `frontend/app/routes/<route_name>.tsx` which maps to the top-level route `/<route_name>`.
 - Each route should have a corresponding page under `frontend/app/pages/` named for the route. For example:
   - `frontend/app/routes/users.tsx` -> `frontend/app/pages/users.tsx` (or `frontend/app/pages/users/index.tsx`)
 - Pages should be the place where route-level data fetching, layout decisions, and top-level composition happen. Keep page components focused on composition, not low-level UI.
 - Complex pages should be split into subfolders inside `frontend/app/pages/<page>/` for clarity and reusability. Example:
   - `frontend/app/pages/tournament/`
     - `index.tsx` (page entry)
     - `tabs/` (tabbed subcomponents)
     - `components/` (page-specific components used only by the tournament page)
 - Page subcomponents should import and reuse shared components from `frontend/app/components/<feature>` where appropriate — for instance, a `UserCard` used in a users page should live in `frontend/app/components/user/UserCard.tsx` and be imported into the page.
 - Keep a clear separation between `routes/` (routing glue), `pages/` (route-level composition), and `components/` (reusable building blocks). This separation makes code generation and Copilot prompts more reliable.

Examples and patterns
 - Minimal route -> page mapping:

  ```tsx
  // frontend/app/routes/users.tsx
  import UsersPage from '~/pages/users'
  export default function UsersRoute() {
    return <UsersPage />
  }
  ```

  ```tsx
  // frontend/app/pages/users/index.tsx
  import UserCard from '~/components/user/UserCard'
  export default function UsersPage() {
    return (
      <main>
        <h1>Users</h1>
        <UserCard />
      </main>
    )
  }
  ```

 - Larger pages should move subviews into `tabs/` or `components/` directories so each part can be developed and tested independently.

 - When generating code with Copilot or templates, prefer generating:
   - A `routes/<route>.tsx` file wired to the page
   - A `pages/<route>/index.tsx` page entry
   - A `components/` folder for page-specific UI when the page will be non-trivial
