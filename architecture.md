# Volunteer Task Management System – Frontend Architecture

## Overview

The frontend is a React Single Page Application for managing volunteer tasks. It supports two main users: Volunteers and Coordinators.

The main parts of the application are:

- Authentication and password recovery
- Available tasks and task details
- My Tasks
- Coordinator task management
- Volunteer and Coordinator profiles
- Notifications
- Task filtering and search
- Map and location-related features

The application is designed primarily for mobile use. `MobileLayout` is used for the main mobile experience, while `TabBarLayout` provides the bottom navigation structure used in the application.

The project uses a practical, feature-oriented structure rather than a strict Clean Architecture implementation.

---

## Project Structure

```text
src/
├── assets/
├── components/
├── contexts/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── stores/
├── theme/
├── types/
├── utils/
├── index.css
└── main.tsx
```

### `components`

Contains reusable UI components. Components are grouped by feature where possible.

Examples:

- `Login`
- `SignUp`
- `ForgotPassword`
- `tasks`
- `coordinatorTasks`
- `myTasks`
- `VolunteerProfile`
- `CoordinatorProfile`
- `common`

The `common` directory contains components used in different parts of the application, such as `Inputbox`, `PasswordBox`, `MainButton`, `Header`, `Map`, and `TabBar`.

### `pages`

Contains route-level components. Pages are responsible for combining layouts and feature components into complete screens.

Current page groups include:

- `Auth`
- `Tasks`
- `MyTasks`
- `Profile`

For example, `ForgotPassword.tsx` uses `MobileLayout` and renders `ForgotPasswordCard`.

### `layouts`

Contains shared page layouts.

- `MobileLayout` is used for the mobile-oriented application layout.
- `TabBarLayout` is used where bottom-tab navigation is required.

Layouts are kept separate from the content of each page so that the same page structure can be reused without duplicating layout code.

### `hooks`

Contains custom hooks used to keep asynchronous and feature-specific logic outside UI components.

Examples include hooks for:

- Loading tasks
- Loading task details
- Assigning and unassigning tasks
- Starting, completing, confirming, and cancelling tasks
- Loading profile options
- Loading notifications
- Loading task images

A hook usually coordinates a service call, loading state, error handling, and updates to a store when necessary.

### `services`

Contains communication with the backend and other external services.

Examples include:

- `api.ts` for the shared Axios instance
- `auth.service.ts` for authentication and password operations
- `profileService.ts` for profile requests
- `taskService.ts` for task requests
- `notificationService.ts` and `notificationSocket.ts` for notifications
- `neighborhood.ts` and `reverseGeocodingService.ts` for location-related operations

Components do not create Axios instances themselves. They call a service directly or use a custom hook that calls the service.

### `stores`

Contains Zustand stores for shared state.

The stores are separated by feature, including:

- Tasks
- Coordinator tasks
- My Tasks
- Notifications
- Profile
- Options
- Task filters

This keeps shared feature state separate instead of placing every state value in one large global store.

### `contexts`

Contains React Context providers. `AuthContext` manages the current user, authentication status, login, and logout behavior.

Authentication is kept in Context because it is needed by different parts of the application, especially route guards, the header, and authentication pages.

### `routes`

Contains routing-related logic.

`RouteGuards.tsx` separates public routes from protected routes:

- Public routes include Login, Signup, and Forgot Password.
- Protected routes include Tasks, Task Details, Profiles, and My Tasks.

### `types`

Contains TypeScript types shared between pages, services, hooks, and stores.

The types describe data such as:

- Authentication responses
- Profiles
- Tasks
- Notifications
- Options
- Neighborhoods
- Map data

### `theme`, `assets`, and `utils`

- `theme` contains Chakra UI system configuration and design tokens.
- `assets` contains images and the Vazirmatn font files.
- `utils` contains shared helpers such as error extraction, formatters, task filter helpers, toaster configuration, and notification sounds.

---

## Main Application Flow

```text
main.tsx
    │
    ├── ChakraProvider
    ├── BrowserRouter
    └── AuthProvider
            │
            ▼
       RouteGuards
            │
            ▼
          Pages
            │
            ├── Layouts
            ├── Components
            ├── Custom Hooks
            └── Zustand Stores
                    │
                    ▼
                 Services
                    │
                    ▼
                 Axios API
                    │
                    ▼
                Backend API
```

A typical feature request follows this flow:

1. A page renders a feature component.
2. The component calls a custom hook or service.
3. The hook manages loading and error states.
4. The service sends the request through the shared Axios instance.
5. The response is returned to the hook or store.
6. React re-renders the component with the updated data.

---

## Authentication and Routing

Authentication is managed by `AuthContext` and `authStorage`.

After a successful login:

1. The login service sends the username and password to the backend.
2. The access token and refresh token are stored.
3. User information is stored in the authentication context.
4. Protected routes become available.
5. The user is redirected to the main application page.

The Axios request interceptor adds the access token to authenticated requests.

When the user logs out:

1. Stored tokens are removed.
2. Stored user data is removed.
3. The authentication context is reset.
4. Protected routes redirect the user to Login.

The Forgot Password flow is a public flow. It includes:

- Username submission
- A four-digit code entry step
- New password and confirmation
- A success state

The code entry is currently handled on the frontend and does not have a separate verification API.

---

## State Management

Different types of state are handled in different places.

### Local component state

Used for temporary UI state, such as:

- Form values
- Loading state
- Modal visibility
- Active tabs
- Password recovery steps
- Countdown timers

### React Context

Used for authentication state that is required across the application.

### Zustand stores

Used for shared feature state. For example, task filters and notification data may be used by more than one component, so they are kept in dedicated stores.

This combination avoids putting all state into one global store and keeps feature-specific logic easier to locate.

---

## Design Patterns and Architectural Decisions

### Component-Based Design

The UI is split into small React components instead of putting all markup inside page files.

This is useful for elements such as buttons, inputs, task cards, profile cards, and tabs because the same behavior or visual style can be reused in multiple places.

### Layout Composition

Pages are composed with shared layouts such as `MobileLayout` and `TabBarLayout`.

This keeps navigation and page structure consistent without coupling each feature component to the entire application shell.

### Custom Hook Pattern

Custom hooks are used for repeated feature logic, especially API calls and task operations.

This keeps components focused on rendering and user interaction while the hook handles loading, errors, and data updates.

### Service Layer Pattern

Backend calls are kept inside service files. This prevents components from depending on endpoint URLs and Axios configuration directly.

It also makes it easier to change an endpoint without changing every component that uses it.

### Provider Pattern

`AuthProvider` exposes authentication state and actions through React Context.

This prevents prop drilling and gives route guards, headers, and pages access to the same session state.

### Route Guard Pattern

`ProtectedRoute` and `PublicOnlyRoute` centralize access rules.

Without route guards, every page would need to check the token independently. Keeping this logic in one place makes navigation behavior more predictable.

### Feature-Based Stores

Zustand stores are separated by feature instead of having one large store.

For example, task filters, notification state, profile state, and coordinator task state are maintained independently. This reduces coupling between unrelated features.

### Interceptor Pattern

The shared Axios instance uses an interceptor to attach the access token to requests.

This avoids repeating authorization-header logic in every service.

---

## UI and Mobile Design

The application is designed mobile-first.

The UI uses:

- Chakra UI components
- Vazirmatn font files
- Reusable buttons and form controls
- Mobile layouts
- Bottom-tab navigation where needed
- Touch-friendly controls
- Responsive spacing and sizing

The interface is primarily optimized for phone screens, while the layouts can still adapt to larger screens.

---

## Error and Loading Handling

Loading and error handling are handled close to the feature that starts the request.

- Forms disable their submit button while a request is running.
- Toaster messages are used for user-facing feedback.
- `Extracterrormessage.ts` provides a shared way to extract useful messages from errors.
- Hooks can expose loading and error states to their components.
- Authentication failures can clear the local session and redirect to Login.

Keeping error handling close to the related feature makes the UI behavior easier to understand and prevents unrelated pages from depending on each other's error state.

---

## Technologies

| Category | Technology |
| --- | --- |
| UI Framework | React |
| Language | TypeScript |
| UI Library | Chakra UI |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Global Authentication State | React Context API |
| Feature State | Zustand |
| Authentication Storage | LocalStorage |
| Icons | React Icons |
| Font | Vazirmatn |
| Real-time Notifications | Notification socket service |
