Based on the structure shown in your image and our previous discussion about Feature-First architecture, here is a comprehensive `README.md` template you can use as a boilerplate for your future projects. 
```markdown
# 🏗️ Frontend Architecture Guide

This project follows a **Feature-First Architecture** using **React**, **TypeScript**, and **Vite**. 

The primary goal of this structure is to keep code as close as possible to where it is used. This improves developer experience, prevents circular dependencies, and makes the codebase highly scalable.

---

## 📁 Directory Structure

```text
src/ 
├── app/                        # Application routing (React Navigation)
├── assets/                     # Static assets (images, fonts, splash screens)
├── FEATURES/                   # Core business logic & domain-specific code
│   ├── FEATURE1/               # First feature module
│   ├── FEATURE2/               # Second feature module
│   │   ├── api/                # Feature-specific API calls
│   │   ├── components/         # Feature-specific UI components
│   │   │   ├── screens/        # Screen-level components
│   │   │   └── SubComponent/   # Co-located sub-component (generic placeholder)
│   │   └── lib/                # Feature-specific utilities, types, and helpers
│   └── FEATURE3/               # Third feature module
├── components/                 # Shared components used across multiple features
│   ├── Common/                 # App-aware shared components (Layout, Navbar, DataList)
│   ├── Global/                 # "Dumb" / purely generic UI (CustomButton, Input)
│   └── ui/                     # Base UI primitives & global screens (Login, Landing)
├── theme/                      # Global styling: colors, spacing, typography
├── hooks/                      # Global custom hooks
├── lib/                        # Global utilities, API client, constants
├── App.tsx                     # Root component (Providers, NavigationContainer)
└── index.js                    # Entry point (AppRegistry)
```

---

## 🧩 Folder Breakdown & Rules

### 1. `src/components/` (Shared Layer)
This is where UI components live when they are needed by **more than one feature**. It is divided into three distinct tiers:

*   **`Global/`**: Purely generic components. They have no business logic and could be copy-pasted into any React project (e.g., `ExcelButton`, `Button`, `Input`).
*   **`Common/`**: Shared components that are aware of *this specific app's* architecture. They might know about routing, layout, or global data structures (e.g., `Layout`, `Navbar`, `ModuleSidebar`, `DataTable`, `ComingSoon`).
*   **`ui/`**: Base UI primitives or global entry pages. *(Note: `Landing` and `Login` are here because they are global entry points that don't belong to a specific feature module).*

### 2. `src/FEATURES/` (Domain Layer)
This is the heart of the application. Each folder represents a distinct business domain (e.g., `FEATURE1`, `FEATURE2`, `FEATURE3`). 
**Rule:** A feature should be self-contained. It should not import from another feature. If it needs something from another feature, that thing should be promoted to `src/components/` or `src/lib/`.

Inside a feature, you will find:
*   **`api/`**: API calls specific *only* to this feature. Do not put these in a global `lib`.
*   **`components/`**: UI components specific *only* to this feature.
    *   **`pages/`**: Sub-folders for page-level components that map to routes.
*   **`lib/`**: Feature-specific business logic, constants, types, and helpers  

### 3. `src/Routes/`
Centralized routing. The `AppRoutes.tsx` acts as the single source of truth for how features are stitched together. 

---

## 🧬 Component Pattern (The "Folder-per-Component" Approach)

For complex components, we do not use a single file. We use a folder to co-locate everything that component needs. 

for example a `CommentsField` in folder `src/FEATURES/FEATURE2/components/`:

```text
CommentsField/
├── CommentsField.tsx           # Component logic and JSX with Tailwind for Styling
├── CommentsField.types.ts      # TypeScript interfaces/types local to this component
└── index.ts                    # Barrel file for clean imports
```

---

## 🛠️ Best Practices & Golden Rules

1.  **The "Rule of 2"**: If a piece of code (component, hook, utility) is used in **one** feature, keep it inside that feature's folder. If it is needed by **two or more** features, promote it to `src/components/` or `src/lib/`.
2.  **No Cross-Feature Imports**: `FEATURE2` should never import directly from `FEATURE1`. If they need to share something, move it to `src/components/Common/`.
3.  **Keep APIs Local**: Feature-specific API calls belong in `FEATURES/<FeatureName>/api/`. Only the base Axios/Fetch instance belongs in a global location.
4.  **Types Co-location**: If a type is only used inside `CommentsField`, it goes in `CommentsField.types.ts`. If it's used across the `FEATURE2` feature, it goes in `FEATURE2/lib/types.ts`. If it's used globally, it goes in a global types folder.
5.  **Consistent Naming**: 
    *   Folders representing features are capitalized (`FEATURE1`, `FEATURE3`).
    *   Folder names for complex components are PascalCase (`CommentsField`, `DataTable`).
    *   Files are named after the component they export (`CommentsField.tsx`).

---