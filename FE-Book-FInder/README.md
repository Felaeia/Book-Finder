````markdown
# 🥧 PieShack - E-Commerce App

A mobile e-commerce app for pie lovers. This is the customer-facing app for ordering and browsing pies.

> **Note on Scope:** This is 1 of 3 apps in the full PieShack system. This app handles the **Customer** experience. Two more apps are planned:
>
> 1. **Rider App** - For delivery men
> 2. **Admin App** - For monitoring and managing products, orders, and users.

### Current Status: Frontend Focus

Backend is not yet connected. The app currently runs on static dummy data while the UI/UX is being built.

---

## 🚀 Get Started

### Prerequisites

- Node.js 18+ / 20+ LTS
- npm or yarn

### 1. Install dependencies

```bash
npm install
```
````

### 2. Start the app

```bash
npx expo start
```

To start with a clean cache (fixes most Metro bundler issues):

```bash
npx expo start -c
```

### 3. Run on your device

Once the dev server starts, choose your environment:

- **Android:** Press `a` to open Android Emulator, or scan QR with Expo Go
- **Web:** Press `w` to run in browser
- **iOS:** Not yet supported

---

## 🛠️ Tech Stack

| Category       | Technology                                       |
| :------------- | :----------------------------------------------- |
| **Language**   | TypeScript                                       |
| **Framework**  | React Native                                     |
| **Tooling**    | Expo                                             |
| **Navigation** | Expo Router (File-based routing)                 |
| **Styling**    | NativeWind (Tailwind CSS for React Native)       |
| **Backend**    | Supabase (Planned - currently using static data) |

---

## 📁 Project Architecture

```
app/
  (tabs)/
    _layout.tsx # Tab navigation definition
    index.tsx # Landing / Home Screen
    menuList.tsx # Menu list (Pie catalog)
    cart.tsx # Cart screen
    orders.tsx # Order history
    profile.tsx # User profile

assets/
  images/ # App images and icons

components/
  ui/ # Reusable components (Button, Card, etc.)
  home/ # Components used only on Landing
  menu/ # Components for Menu list
  cart/ # Components for Cart
  orders/ # Components for Orders
  profile/ # Components for Profile

constants/
  Theme.ts # Colors, spacing, typography
  Pies.ts # Dummy pie data

hooks/
  usePieRepository.ts # Logic for fetching/managing pies

.env.example
babel.config.js
tailwind.config.js
metro.config.js
```

## 🗺️ Roadmap

- Tab navigation and project structure[x]
- Landing page UI (Greetings, Hero, Our Story)[x]
- [ ] Menu List with filtering & search
- [ ] Cart functionality
- [ ] Supabase integration
- [ ] Rider App
- [ ] Admin Dashboard

```

```
