# UmrahOS ERP – Frontend UI

Multi-Branch Umrah Management System. React 18 + Vite + Tailwind CSS + Recharts + React Router.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Pages
- `/` Landing page (glass theme, header + footer)
- `/login` Sign in + all 8 dashboards as cards (click a card to open it)

## Login (demo)
Click any dashboard card on the Sign in page, or press Sign in (opens the highlighted dashboard).
Use the avatar menu → *Switch Role* to change role.

## What's inside
- **8 roles**, each with its own sidebar menu (exactly as the wireframe) and its own dashboard:
  Super Admin (Executive), Head Office Admin, HO Accountant/Approver (Finance & Approval),
  Branch Manager, Branch Accountant, Booking Officer, Hotel Operator, Transport Officer.
- **Every sub-menu opens a page** (tables with search/filter/export/add/edit, forms, reports with charts, settings).
- **Special screens**: Create Booking (5-step wizard), Expense Request Details (Approve / Reject with reason / Return),
  Room Allocation (capacity validation), Create Transport Trip (vehicle/driver/seat checks), Passenger Profile,
  Permission Matrix.
- **Common screens**: Login + MFA, My Profile, Notifications, Search, Documents, Help, Session & Security.
- **Languages**: English, Arabic (full RTL layout), Bengali — switch from the globe button.
- Collapsible sidebar, mobile drawer, responsive layout.

## Structure
```
src/
  data/roles.js      → 8 roles & their sidebar menus
  data/pages.jsx     → maps every sub-menu to a page (table/form/report/screen)
  data/mock.js       → demo data (replace with API calls)
  data/i18n.js       → EN / AR / BN translations
  components/        → Layout (sidebar + topbar), UI kit, charts, form renderer
  pages/dashboards/  → 8 role dashboards
  pages/screens/     → booking wizard, expense detail, room allocation, create trip, passenger profile
  pages/common/      → login, profile, notifications, search, documents, help, security
```
All data is mock data in `src/data/mock.js` — connect your backend APIs there.
