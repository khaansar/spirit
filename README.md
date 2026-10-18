# Salaar Mobile App (ClearIt)

This is the mobile application for **ClearIt** (built with React Native & Expo), sharing the backend API and Redux architecture with the web application.

---

## 📁 Project Structure

```
mobile/
├── App.js                   # Starter component & Redux provider setup
├── app.json                 # Expo app configuration (name, bundle id, splash)
├── babel.config.js          # Babel preset config
├── package.json             # Mobile app dependencies (Expo 51, RTK, Axios, Navigation)
├── .env.example             # Environment variables template
├── .gitignore               # Ignored build & node_modules directories
└── src/
    ├── api/
    │   ├── client.js        # Axios instance configured with Bearer JWT injection
    │   └── authService.js   # Auth API calls mapping to /auth-api endpoints
    ├── config/
    │   └── env.js           # Platform-aware backend URL resolver (Android vs iOS vs Web)
    ├── store/
    │   ├── index.js         # Redux Toolkit store setup
    │   └── slices/
    │       └── authSlice.js # Authentication state slice
    └── utils/
        └── storage.js       # SecureStore helper for access/refresh tokens
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

> **Note on Backend URLs for Mobile:**
> - **Android Emulator**: `http://10.0.2.2:8080` (points to your machine's `localhost:8080`).
> - **iOS Simulator**: `http://localhost:8080`.
> - **Physical Phone (Expo Go)**: `http://<YOUR_COMPUTER_LOCAL_IP>:8080` (e.g. `http://192.168.1.15:8080`).

### 3. Run the Development Server
```bash
npm start
```
From the Expo interactive CLI:
- Press `a` to run on Android emulator or connected device.
- Press `i` to run on iOS simulator (macOS only).
- Scan the displayed QR code with the **Expo Go** app on your physical device.

---

## 📋 Roadmap
- **Phase 0 (Completed):** Scaffolding & basic setup ready for GitHub.
- **Phase 1:** Authentication UI (Login, Register, Forgot Password, Token storage).
- **Phase 2:** Test Catalog, Categories, and Test Series screen.
- **Phase 3:** Real-time Mock Test Attempt Engine (Question viewer, palette, timer, auto-sync).
- **Phase 4:** Analytics, Scorecard, and Solution review.
- **Phase 5:** Production build (EAS Build / Play Store & App Store).
