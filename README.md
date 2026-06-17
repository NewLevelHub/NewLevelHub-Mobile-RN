# NewLevelHub Mobile (React Native)

Expo + TypeScript mobile client for the NewLevelHub coworking platform.

## Requirements

- Node.js 20 or 22 LTS
- npm (bundled with Node.js)
- iOS Simulator (Xcode) or Android Emulator for local runs via Expo Go

API requests go to staging or production — local Django is not used.

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

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### `EXPO_PUBLIC_API_BASE_URL`

Base URL for the Django REST API (must include `/api/v1`).

| Environment | Example |
|-------------|---------|
| Production | `https://production.newlevelhub.kz/api/v1` |
| Staging | use your staging API URL |

Default in `.env.example` points to production. Change it before `npm run start` if you need another backend.

Other optional variables: `EXPO_PUBLIC_MEDIA_BASE_URL`, `EXPO_PUBLIC_APP_NAME`.

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
