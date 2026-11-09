# Milestone

Milestone is a responsive account dashboard built with React, Vite, and Firebase. It provides account access, balance and activity views, transfers, withdrawals, profile management, customer support, and admin tools.

## Features

- Firebase email/password authentication.
- Account dashboard with recent spending trends and transaction summaries.
- Searchable transaction history with income/expense filters and paginated loading.
- Transfer and withdrawal flows.
- Profile, support, and admin screens.

Dashboard summaries use recent Firestore activity, while the history page can load older transactions on demand. Empty accounts show an honest empty state rather than sample activity.

## Development

Install dependencies and start the local development server:

```sh
npm install
npm run dev
```

Create a production build with:

```sh
npm run build
```

Run the repository linter with:

```sh
npm run lint
```
