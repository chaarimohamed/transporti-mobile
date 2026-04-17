# Transporti Mobile

Expo/React Native client for the Transporti sender and carrier flows.

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL`.
3. Start Expo on your local network:
   ```bash
   npm start
   ```

## Install location matters

If you are using **WSL**, do **not** run `npm install` from a Windows-mounted OneDrive path such as:

```bash
/mnt/c/Users/your-user/OneDrive/...
```

That setup commonly breaks npm package installs with errors like `ENOTEMPTY`, `rename`, or partially written `node_modules` folders.

Use one of these workflows instead:

| Workflow | Recommended command location |
| --- | --- |
| Windows checkout under `C:\Users\...` or `OneDrive` | Run `npm install` from **PowerShell / CMD** |
| WSL development | Keep the repo in your **WSL home** such as `~/projects/transporti_v0` |

## Recovering from `ENOTEMPTY` during `npm install`

If you already hit an error like:

```text
ENOTEMPTY: directory not empty, rename '.../node_modules/expo' -> '.../node_modules/.expo-xxxx'
```

clean the partial install, then rerun the install from a supported location/shell:

### PowerShell

```powershell
Remove-Item -Recurse -Force .\node_modules
Remove-Item -Recurse -Force .\package-lock.json
npm install
```

### Bash

```bash
rm -rf node_modules package-lock.json
npm install
```

If the project is inside **OneDrive** and you are working from **WSL**, the reliable fix is to either:

1. move the repo to your WSL filesystem and run `npm install` there, or
2. keep the repo where it is and run `npm install` from Windows PowerShell instead of WSL.

## Choosing `EXPO_PUBLIC_API_URL`

Use the backend base URL including `/api`.

| Environment | Value |
| --- | --- |
| Android emulator | `http://10.0.2.2:3000/api` |
| iOS simulator / local web | `http://localhost:3000/api` |
| Physical phone on same Wi-Fi | `http://YOUR_LAN_IP:3000/api` |
| Shared / deployed backend | `https://your-backend-host/api` |

## Available scripts

- `npm start` - Start Expo in LAN mode with a cleared cache
- `npm run start:lan` - Start Expo in LAN mode
- `npm run start:tunnel` - Start Expo with an Expo/ngrok tunnel
- `npm run android` - Open the Android target
- `npm run ios` - Open the iOS target
- `npm run web` - Run the web target
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript without emitting files

## Notes about tunnel mode

Expo tunnel only exposes the Metro bundler. It does **not** expose your local backend automatically.

If you use `npm run start:tunnel`, point `EXPO_PUBLIC_API_URL` to a backend URL the phone can actually reach:

- your machine LAN IP when the phone is on the same network
- or a separately deployed/public backend URL

The app no longer relies on a hardcoded ngrok backend URL, so each developer can use their own environment safely.
