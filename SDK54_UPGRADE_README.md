# Expo Go SDK Mismatch Fix (Upgrade to SDK 54)

This guide documents the exact process used to upgrade this project from Expo SDK 51 to SDK 54.

Use this whenever you see:

- "Project is incompatible with this version of Expo Go"
- "Installed Expo Go is for SDK 54, project uses SDK 51"

## What was changed in this project

- Updated `frontend/package.json` to Expo SDK 54 compatible versions:
  - `expo` -> `^54.0.0`
  - `expo-router` -> `~6.0.23`
  - `react` -> `19.1.0`
  - `react-native` -> `0.81.5`
  - plus matching SDK 54 package versions
- Updated `frontend/app.json`:
  - `sdkVersion` from `51.0.0` to `54.0.0`
  - removed invalid `icon` path (`./assets/icon.png`) because file did not exist
- Added missing peer dependencies required by SDK 54 stack:
  - `expo-constants`
  - `expo-linking`
  - `react-native-worklets`
- Added `frontend/.gitignore` with `.expo/`, `node_modules/`, and npm log ignores.

## Exact step-by-step commands

Run all commands from `frontend` folder:

```bash
npx expo install expo@^54.0.0
npx expo install --fix
```

If dependency resolution errors appear, install compatible versions directly:

```bash
npm install expo-font@~14.0.11 expo-linear-gradient@~15.0.8 expo-router@~6.0.23 expo-status-bar@~3.0.9 react@19.1.0 react-native@0.81.5 react-native-gesture-handler@~2.28.0 react-native-reanimated@~4.1.1 react-native-safe-area-context@~5.6.0 react-native-screens@~4.16.0
npx expo install expo-constants expo-linking react-native-worklets
npm install react-dom@19.1.0
npm install -D typescript@~5.9.2
npm install -D babel-preset-expo@~54.0.10
```

Then verify:

```bash
npx expo-doctor
```

Start app:

```bash
npx expo start --lan
```

## Manual Expo Go URL format

Use this format on your phone browser if QR is not working:

```text
exp://<YOUR_LOCAL_IP>:8081
```

For this project setup, example:

```text
exp://192.168.100.55:8081
```

## Common errors and fixes

1. `expo upgrade is not supported in the local CLI`
   - Fix: use `npx expo install expo@^54.0.0` and then `npx expo install --fix`.

2. `ERESOLVE could not resolve` while updating packages
   - Fix: install Expo SDK 54 expected versions explicitly (command block above).

3. Missing peer dependencies (`expo-constants`, `expo-linking`, `react-native-worklets`)
   - Fix: `npx expo install expo-constants expo-linking react-native-worklets`

4. App config schema error for icon path
   - Fix: either add the file at the path, or remove/fix the `icon` field in `app.json`.

5. Development server returns 500 with:
   - `Cannot find module 'babel-preset-expo'`
   - Fix:
     1. Install matching preset version:
        `npm install -D babel-preset-expo@~54.0.10`
     2. Clear Metro cache and restart:
        `npx expo start --lan -c`
     3. If port conflict appears (`8081 is being used`), stop old process and restart Expo.

6. Expo Go opens black screen with red loading spinner
   - Cause: app is waiting for font loading in `app/_layout.js`.
   - Fix options:
     1. Restart bundler with clean cache: `npx expo start --lan -c`
     2. Ensure backend URL in `frontend/src/config.js` uses your current LAN IP.
     3. Add a font-load fallback timeout in `app/_layout.js` so app can continue even if fonts stall.

## Quick future checklist

1. Update Expo package (`expo`) first.
2. Set correct `sdkVersion` in `app.json`.
3. Install all SDK-matching dependencies.
4. Install missing peer dependencies.
5. Run `npx expo-doctor`.
6. Ensure `babel-preset-expo` is installed (`~54.0.10` for SDK 54).
7. Start with `npx expo start --lan -c`.
8. If spinner hangs, force-close Expo Go and reopen the same `exp://` URL.

