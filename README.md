# NewLevelHub Mobile (React Native)

Expo + TypeScript mobile client for the NewLevelHub coworking platform.

## Requirements

- Node.js 20 or 22 LTS
- npm (bundled with Node.js)
- iOS Simulator (Xcode) or Android Emulator for local runs via Expo Go

API requests go to the production backend only — local Django is not used.

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

All builds (local dev and EAS) use the production API.

Copy `.env.example` to `.env` for local development:

```bash
cp .env.example .env
```

| Variable | Value |
|----------|-------|
| `EXPO_PUBLIC_API_BASE_URL` | `https://production.newlevelhub.kz/api/v1` |
| `EXPO_PUBLIC_MEDIA_BASE_URL` | `https://production.newlevelhub.kz` |
| `EXPO_PUBLIC_APP_NAME` | `NewLevelHub` |

EAS production builds read the same values from `eas.json` (`build.production.env`). See `.env.production` for the reference template.

Config is centralized in `src/core/config/env.ts` and `src/core/config/apiConfig.ts` — do not hardcode API URLs in feature modules.

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
