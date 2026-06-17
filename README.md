# NewLevelHub Mobile (React Native)

Expo + TypeScript mobile client for the NewLevelHub coworking platform.

## Stack

- Expo SDK 56
- React Navigation
- Axios (Django REST API)
- Zustand (auth)
- TanStack React Query
- expo-secure-store (JWT)

## Commands

```bash
npm install
npm run start
npm run typecheck
npm test
```

## Environment

Copy `.env.example` to `.env` and adjust `EXPO_PUBLIC_*` variables if needed.

## Structure

```
src/
  app/           # App shell and navigation
  core/          # config, network, auth, theme
  features/      # feature screens
  shared/        # API endpoints, types, UI kit
```

## Backend contract

Aligned with `NewLevelHub-Web-Frontend` and `NewLevelHub-Backend`:

- Trailing slashes on all API paths
- Django error envelope: `{ success: false, error: { code, message, details } }`
- Mobile stores JWT access + refresh in secure storage (not httpOnly cookies)
