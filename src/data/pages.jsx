// Maps every sidebar sub-menu to a page configuration.
import { Badge, Progress } from '../components/ui'
import { ROLES } from './roles'
import {
  BOOKINGS, PASSENGERS, BRANCHES, EMPLOYEES, USERS, HOTELS, ROOMS, ROOM_TYPES, CHECKINS, VEHICLES, DRIVERS, TRIPS,
  EXPENSES, INCOME, SUPPLIERS, BILLS, ACCOUNTS, JOURNALS, LEDGER, APPROVAL_HISTORY, AUDIT, DOCUMENTS, PACKAGES, fmt,
} from './mock'

const B = (v) => <Badge>{v}</Badge>
const M = (v) => fmt(v)
const S = { key: 'status', label: 'Status', render: B }
const col = (key, label, extra = {}) => ({ key, label, ...extra })

/* ------------------------------------------------------------------ */
/* Datasets                                                           */
/* ------------------------------------------------------------------ */
const groups = Object.values(PASSENGERS.reduce((acc, p) => {
  if (p.group === '—') return acc
  acc[p.group] ??= { group: p.group, lead: p.name, members: 0, branch: p.branch, docs: 'Complete' }
  acc[p.group].members += 1
  if (p.docs !== 'Complete') acc[p.group].docs = 'Pending Review'
  return acc
}, {})).map((g) => ({ ...g, members: g.members + 3 }))

export const DATASETS = {
  bookings: {
    rows: BOOKINGS, view: 'booking',
    columns: [col('id', 'Booking ID', { strong: true }), col('passenger', 'Passenger'), col('type', 'Type'), col('pax', 'Pax', { align: 'end' }), col('package', 'Package'), col('date', 'Travel Date'), col('branch', 'Branch'), S],
  },
  bookingPayments: {
    rows: BOOKINGS, view: 'booking',
    columns: [col('id', 'Booking ID', { strong: true }), col('passenger', 'Customer'), col('total', 'Total', { align: 'end', render: M }), col('paid', 'Received', { align: 'end', render: M }), col('due', 'Outstanding', { align: 'end', render: (v) => <span className={v ? 'font-semibold text-rose-600' : 'text-emerald-600'}>{fmt(v)}</span> }), col('payment', 'Payment', { render: B })],
  },
  bookingHotel: {
    rows: BOOKINGS, view: 'booking',
    columns: [col('id', 'Booking ID', { strong: true }), col('passenger', 'Passenger'), col('pax', 'Pax', { align: 'end' }), col('pkg', 'Package'), col('date', 'Check-in'), col('hotel', 'Hotel Allocation', { render: B })],
  },
  bookingTransport: {
    rows: BOOKINGS, view: 'booking',
    columns: [col('id', 'Booking ID', { strong: true }), col('passenger', 'Passenger'), col('pax', 'Pax', { align: 'end' }), col('date', 'Arrival'), col('transport', 'Transport Assignment', { render: B })],
  },
  bookingHistory: {
    rows: BOOKINGS.map((b, i) => ({ ...b, changed: `${(i % 27) + 1} Oct 2026`, change: ['Created', 'Status → Confirmed', 'Payment recorded', 'Package changed', 'Passenger added'][i % 5] })),
    columns: [col('id', 'Booking ID', { strong: true }), col('passenger', 'Passenger'), col('change', 'Change'), col('officer', 'By'), col('changed', 'Date'), S],
  },
  passengers: {
    rows: PASSENGERS, view: 'passenger',
    columns: [col('id', 'Passenger ID', { strong: true }), col('name', 'Name'), col('gender', 'Gender'), col('passport', 'Passport'), col('nationality', 'Nationality'), col('phone', 'Phone'), col('branch', 'Branch'), col('docs', 'Documents', { render: B })],
  },
  passengerHistory: {
    rows: PASSENGERS, view: 'passenger',
    columns: [col('id', 'Passenger ID', { strong: true }), col('name', 'Name'), col('trips', 'Total Trips', { align: 'end' }), col('group', 'Group'), col('branch', 'Branch'), col('expiry', 'Passport Expiry')],
  },
  duplicates: {
    rows: PASSENGERS.slice(0, 6).map((p, i) => ({ a: p.name, apass: p.passport, b: i % 2 ? p.name : p.name.replace(/a/, 'aa'), bpass: i % 3 ? p.passport : p.passport.slice(0, -1) + '9', match: `${96 - i * 7}%`, status: i % 3 ? 'Pending Review' : 'Verified' })),
    columns: [col('a', 'Record A', { strong: true }), col('apass', 'Passport A'), col('b', 'Record B'), col('bpass', 'Passport B'), col('match', 'Match'), S],
  },
  groups: {
    rows: groups,
    columns: [col('group', 'Group ID', { strong: true }), col('lead', 'Group Lead'), col('members', 'Members', { align: 'end' }), col('branch', 'Branch'), col('docs', 'Documents', { render: B })],
  },
  packages: {
    rows: PACKAGES,
    columns: [col('code', 'Code', { strong: true }), col('name', 'Package'), col('days', 'Days', { align: 'end' }), col('start', 'Start Date'), col('price', 'Price', { align: 'end', render: M }), col('makkah', 'Makkah Hotel'), col('madinah', 'Madinah Hotel'),
      col('capacity', 'Capacity', { render: (v, r) => <div className="w-36"><div className="mb-1 text-xs text-slate-500">{r.booked} / {v}</div><Progress value={r.booked} max={v} /></div> })],
  },
  branches: {
    rows: BRANCHES,
    columns: [col('code', 'Code', { strong: true }), col('name', 'Branch'), col('city', 'City'), col('country', 'Country'), col('manager', 'Manager'), col('staff', 'Staff', { align: 'end' }), col('bookings', 'Bookings', { align: 'end' }), S],
  },
  branchFinance: {
    rows: BRANCHES.map((b) => ({ ...b, profit: b.income - b.expense })),
    columns: [col('name', 'Branch', { strong: true }), col('bookings', 'Bookings', { align: 'end' }), col('income', 'Income', { align: 'end', render: M }), col('expense', 'Expenses', { align: 'end', render: M }), col('profit', 'Net Profit', { align: 'end', render: (v) => <b className="text-emerald-600">{fmt(v)}</b> })],
  },
  managers: {
    rows: BRANCHES,
    columns: [col('name', 'Branch', { strong: true }), col('manager', 'Branch Manager'), col('city', 'City'), col('staff', 'Team Size', { align: 'end' }), S],
  },
  costCentres: {
    rows: BRANCHES.flatMap((b, i) => ['Operations', 'Sales'].map((c, j) => ({ code: `CC-${b.code}-${j + 1}`, name: `${b.city} ${c}`, branch: b.name, budget: 40000 + ((i * 7 + j) * 9131) % 90000, used: 20000 + ((i * 5 + j) * 7121) % 60000, status: b.status }))),
    columns: [col('code', 'Code', { strong: true }), col('name', 'Cost Centre'), col('branch', 'Branch'), col('budget', 'Budget', { align: 'end', render: M }), col('used', 'Used', { align: 'end', render: M }), S],
  },
  employees: {
    rows: EMPLOYEES,
    columns: [col('id', 'Emp ID', { strong: true }), col('name', 'Name'), col('role', 'Role'), col('branch', 'Branch'), col('email', 'Email'), col('phone', 'Phone'), col('joined', 'Joined'), S],
  },
  employeeActivity: {
    rows: EMPLOYEES,
    columns: [col('name', 'Employee', { strong: true }), col('role', 'Role'), col('branch', 'Branch'), col('activity', 'Actions (period)', { render: (v) => <div className="w-40"><div className="mb-1 text-xs text-slate-500">{v}</div><Progress value={v} /></div> })],
  },
  users: {
    rows: USERS,
    columns: [col('username', 'Username', { strong: true }), col('name', 'Name'), col('role', 'Role'), col('branches', 'Authorised Branches'), col('mfa', 'MFA', { render: B }), col('last', 'Last Login'), S],
  },
  accessRequests: {
    rows: EMPLOYEES.slice(0, 5).map((e, i) => ({ name: e.name, requested: e.role, branch: e.branch, date: `${i + 1} Nov 2026`, status: i % 2 ? 'Pending' : 'Approved' })),
    columns: [col('name', 'User', { strong: true }), col('requested', 'Requested Role'), col('branch', 'Branch'), col('date', 'Requested On'), S],
  },
  roles: {
    rows: ROLES.map((r, i) => ({ name: r.name, desc: r.desc, dashboard: r.dashboard, users: [1, 3, 2, 7, 6, 14, 5, 4][i], modules: r.menu.length, status: 'Active' })),
    columns: [col('name', 'Role', { strong: true }), col('desc', 'Description'), col('dashboard', 'Dashboard'), col('users', 'Users', { align: 'end' }), col('modules', 'Menus', { align: 'end' }), S],
  },
  audit: {
    rows: AUDIT,
    columns: [col('time', 'Time', { strong: true }), col('user', 'User'), col('module', 'Module'), col('action', 'Action'), col('record', 'Record'), col('ip', 'IP Address')],
  },
  loginLogs: {
    rows: AUDIT.map((a, i) => ({ ...a, device: ['Chrome / Windows', 'Safari / iOS', 'Edge / Windows', 'Chrome / Android'][i % 4], result: i % 6 === 3 ? 'Failed' : 'Success' })),
    columns: [col('time', 'Time', { strong: true }), col('user', 'User'), col('device', 'Device'), col('ip', 'IP Address'), col('result', 'Result', { render: (v) => <Badge tone={v === 'Success' ? 'green' : 'red'}>{v}</Badge> })],
  },
  hotels: {
    rows: HOTELS,
    columns: [col('code', 'Code', { strong: true }), col('name', 'Hotel'), col('city', 'City'), col('distance', 'Distance to Haram'), col('stars', 'Stars', { render: (v) => '★'.repeat(v) }), col('rooms', 'Rooms', { align: 'end' }), col('available', 'Available', { align: 'end' })],
  },
  hotelSuppliers: {
    rows: HOTELS,
    columns: [col('name', 'Hotel', { strong: true }), col('supplier', 'Supplier'), col('phone', 'Contact'), col('city', 'City'), col('rooms', 'Contracted Rooms', { align: 'end' })],
  },
  hotelLocations: {
    rows: HOTELS,
    columns: [col('name', 'Hotel', { strong: true }), col('city', 'City'), col('distance', 'Distance to Haram'), col('phone', 'Phone')],
  },
  rooms: {
    rows: ROOMS,
    columns: [col('room', 'Room', { strong: true }), col('hotel', 'Hotel'), col('type', 'Type'), col('capacity', 'Capacity', { align: 'end' }), col('occupied', 'Occupied', { align: 'end' }), col('booking', 'Booking'), S],
  },
  rooming: {
    rows: ROOMS.filter((r) => r.occupied).map((r, i) => ({ ...r, guests: PASSENGERS.slice(i, i + r.occupied).map((p) => p.name).join(', ') })),
    columns: [col('booking', 'Booking / Group', { strong: true }), col('hotel', 'Hotel'), col('room', 'Room'), col('type', 'Type'), col('guests', 'Guests')],
  },
  roomTypes: {
    rows: ROOM_TYPES.map((r) => ({ ...r, available: r.total - r.occupied })),
    columns: [col('type', 'Room Type', { strong: true }), col('capacity', 'Capacity (pax)', { align: 'end' }), col('total', 'Total Rooms', { align: 'end' }), col('occupied', 'Occupied', { align: 'end' }), col('available', 'Available', { align: 'end' }), col('rate', 'Rate / night', { align: 'end', render: M })],
  },
  roomChanges: {
    rows: ROOMS.slice(0, 6).map((r, i) => ({ booking: BOOKINGS[i].id, from: r.room, to: ROOMS[i + 6].room, hotel: r.hotel, reason: ['Guest request', 'Family together', 'Maintenance', 'Upgrade'][i % 4], status: i % 2 ? 'Approved' : 'Pending' })),
    columns: [col('booking', 'Booking', { strong: true }), col('hotel', 'Hotel'), col('from', 'From Room'), col('to', 'To Room'), col('reason', 'Reason'), S],
  },
  checkins: {
    rows: CHECKINS,
    columns: [col('passenger', 'Passenger', { strong: true }), col('booking', 'Booking'), col('hotel', 'Hotel'), col('room', 'Room'), col('guests', 'Guests', { align: 'end' }), col('checkin', 'Check-in'), col('checkout', 'Check-out'), S],
  },
  vehicles: {
    rows: VEHICLES,
    columns: [col('plate', 'Plate', { strong: true }), col('type', 'Type'), col('capacity', 'Capacity', { align: 'end' }), col('supplier', 'Supplier'), col('driver', 'Driver'), S],
  },
  vehicleTypes: {
    rows: ['Luxury Coach', 'Coaster Bus', 'Hiace Van', 'GMC Yukon'].map((t) => ({ type: t, capacity: VEHICLES.find((v) => v.type === t).capacity, count: VEHICLES.filter((v) => v.type === t).length, available: VEHICLES.filter((v) => v.type === t && v.status === 'Available').length })),
    columns: [col('type', 'Vehicle Type', { strong: true }), col('capacity', 'Seats', { align: 'end' }), col('count', 'Fleet', { align: 'end' }), col('available', 'Available', { align: 'end' })],
  },
  drivers: {
    rows: DRIVERS,
    columns: [col('id', 'Driver ID', { strong: true }), col('name', 'Name'), col('licence', 'Licence'), col('phone', 'Phone'), col('vehicle', 'Vehicle'), col('trips', 'Trips', { align: 'end' }), S],
  },
  trips: {
    rows: TRIPS,
    columns: [col('id', 'Trip ID', { strong: true }), col('route', 'Route'), col('type', 'Type'), col('date', 'Date'), col('time', 'Time'), col('vehicle', 'Vehicle'), col('driver', 'Driver'), col('passengers', 'Pax', { align: 'end' }), S],
  },
  tripAssign: {
    rows: TRIPS,
    columns: [col('group', 'Booking / Group', { strong: true }), col('id', 'Trip'), col('route', 'Route'), col('passengers', 'Seats', { align: 'end' }),
      col('capacity', 'Capacity', { render: (v, r) => <div className="w-36"><div className="mb-1 text-xs text-slate-500">{r.passengers} / {v}</div><Progress value={r.passengers} max={v} /></div> })],
  },
  routes: {
    rows: [...new Set(TRIPS.map((t) => t.route))].map((r, i) => ({ code: `RT-${i + 1}`, route: r, distance: ['95 km', '450 km', '20 km', '35 km', '30 km', '95 km'][i], duration: ['1h 30m', '4h 45m', '30m', '3h', '2h 30m', '1h 30m'][i], trips: TRIPS.filter((t) => t.route === r).length })),
    columns: [col('code', 'Code', { strong: true }), col('route', 'Route'), col('distance', 'Distance'), col('duration', 'Est. Duration'), col('trips', 'Trips', { align: 'end' })],
  },
  expenses: {
    rows: EXPENSES, view: 'expense',
    columns: [col('id', 'Request', { strong: true }), col('branch', 'Branch'), col('category', 'Category'), col('supplier', 'Supplier'), col('submittedBy', 'Submitted By'), col('date', 'Date'), col('amount', 'Amount', { align: 'end', render: M }), S],
  },
  income: {
    rows: INCOME,
    columns: [col('receipt', 'Receipt', { strong: true }), col('date', 'Date'), col('booking', 'Booking'), col('customer', 'Customer'), col('method', 'Method'), col('branch', 'Branch'), col('amount', 'Amount', { align: 'end', render: M }), S],
  },
  suppliers: {
    rows: SUPPLIERS,
    columns: [col('code', 'Code', { strong: true }), col('name', 'Supplier'), col('type', 'Type'), col('contact', 'Contact'), col('phone', 'Phone'), col('bills', 'Bills', { align: 'end' }), col('balance', 'Balance', { align: 'end', render: M })],
  },
  bills: {
    rows: BILLS,
    columns: [col('bill', 'Bill No.', { strong: true }), col('supplier', 'Supplier'), col('branch', 'Branch'), col('date', 'Bill Date'), col('due', 'Due Date'), col('amount', 'Amount', { align: 'end', render: M }), col('paid', 'Payment', { render: B })],
  },
  accounts: {
    rows: ACCOUNTS,
    columns: [col('code', 'Code', { strong: true }), col('name', 'Account', { render: (v, r) => <span className={r.type === 'Header' ? 'font-bold text-slate-900' : 'ps-4'}>{v}</span> }), col('type', 'Type'), col('balance', 'Balance', { align: 'end', render: (v, r) => (r.type === 'Header' ? '' : fmt(v)) })],
  },
  journals: {
    rows: JOURNALS,
    columns: [col('ref', 'Voucher', { strong: true }), col('date', 'Date'), col('narration', 'Narration'), col('debit', 'Debit'), col('credit', 'Credit'), col('amount', 'Amount', { align: 'end', render: M }), col('by', 'Posted By'), S],
  },
  ledger: {
    rows: LEDGER,
    columns: [col('date', 'Date', { strong: true }), col('ref', 'Ref'), col('account', 'Account'), col('narration', 'Narration'), col('debit', 'Debit', { align: 'end', render: (v) => (v ? fmt(v) : '—') }), col('credit', 'Credit', { align: 'end', render: (v) => (v ? fmt(v) : '—') })],
  },
  periods: {
    rows: ['Nov 2026', 'Oct 2026', 'Sep 2026', 'Aug 2026', 'Jul 2026', 'Jun 2026'].map((p, i) => ({ period: p, start: `01 ${p}`, end: `${[30, 31, 30, 31, 31, 30][i]} ${p}`, status: i === 0 ? 'Open' : i === 1 ? 'Pending' : 'Closed', closedBy: i > 1 ? 'Head Office Accountant' : '—' })),
    columns: [col('period', 'Period', { strong: true }), col('start', 'Start'), col('end', 'End'), col('closedBy', 'Closed By'), S],
  },
  approvals: {
    rows: APPROVAL_HISTORY,
    columns: [col('request', 'Request', { strong: true }), col('branch', 'Branch'), col('amount', 'Amount', { align: 'end', render: M }), col('action', 'Decision', { render: B }), col('by', 'By'), col('date', 'Date'), col('remark', 'Remark')],
  },
  documents: {
    rows: DOCUMENTS,
    columns: [col('name', 'Document', { strong: true }), col('owner', 'Passenger'), col('ref', 'Ref'), col('type', 'Type'), col('size', 'Size'), col('uploaded', 'Uploaded'), S],
  },
}

/* ------------------------------------------------------------------ */
/* Forms                                                              */
/* ------------------------------------------------------------------ */
const branches = BRANCHES.map((b) => b.name)
const roleNames = ROLES.map((r) => r.name)
export const FORMS = {
  passenger: [
    { title: 'Personal Information', fields: [['Full Name (as in passport)'], ['Gender', ['Male', 'Female']], ['Date of Birth', 'date'], ['Nationality', ['Bangladesh', 'India', 'Pakistan', 'United Kingdom']], ['Phone'], ['Email', 'email'], ['Address', 'textarea', 3]] },
    { title: 'Passport Details', fields: [['Passport Number'], ['Issue Date', 'date'], ['Expiry Date', 'date'], ['Place of Issue']] },
    { title: 'Branch & Group', fields: [['Branch', branches], ['Family / Group', ['None', 'GRP-310', 'GRP-311', 'GRP-312', '+ Create new group']], ['Mahram Name'], ['Emergency Contact']] },
    { title: 'Documents', fields: [['Passport Scan', 'file'], ['Photo', 'file'], ['Vaccination Card', 'file']] },
  ],
  employee: [
    { title: 'Employee Details', fields: [['Full Name'], ['Employee ID', 'auto'], ['Email', 'email'], ['Phone'], ['Designation'], ['Joining Date', 'date']] },
    { title: 'Assignment', fields: [['Branch', branches], ['Role', roleNames], ['Reporting To'], ['Status', ['Active', 'On Leave', 'Inactive']]] },
  ],
  branch: [
    { title: 'Branch Details', fields: [['Branch Name'], ['Branch Code'], ['City'], ['Country', ['Bangladesh', 'Saudi Arabia', 'United Kingdom']], ['Phone'], ['Email', 'email'], ['Address', 'textarea', 3]] },
    { title: 'Settings', fields: [['Branch Manager', EMPLOYEES.map((e) => e.name)], ['Base Currency', ['SAR', 'BDT', 'USD', 'GBP']], ['Cost Centre'], ['Status', ['Active', 'Inactive']]] },
  ],
  vehicle: [
    { title: 'Vehicle Details', fields: [['Plate Number'], ['Vehicle Type', ['Luxury Coach', 'Coaster Bus', 'Hiace Van', 'GMC Yukon']], ['Seat Capacity', 'number'], ['Model / Year'], ['Supplier', SUPPLIERS.filter((s) => s.type === 'Transport').map((s) => s.name)], ['Default Driver', DRIVERS.map((d) => d.name)], ['Insurance Expiry', 'date'], ['Status', ['Available', 'Assigned', 'Maintenance']]] },
  ],
  income: [
    { title: 'Income Entry', fields: [['Receipt No.', 'auto'], ['Date', 'date'], ['Booking', BOOKINGS.map((b) => b.id)], ['Customer', BOOKINGS.map((b) => b.passenger)], ['Amount (SAR)', 'number'], ['Payment Method', ['Cash', 'Bank Transfer', 'Card', 'bKash']], ['Deposit Account', ['Cash in Hand', 'Bank – Islami Bank', 'Bank – Al Rajhi']], ['Remarks', 'textarea', 3]] },
  ],
  expense: [
    { title: 'Expense Request', fields: [['Request No.', 'auto'], ['Expense Date', 'date'], ['Branch', branches], ['Expense Category', ['Hotel Advance', 'Transport Hire', 'Visa Processing', 'Office Rent', 'Utilities', 'Marketing', 'Staff Travel']], ['Supplier', SUPPLIERS.map((s) => s.name)], ['Amount (SAR)', 'number'], ['Cost Centre'], ['Description', 'textarea', 3], ['Supporting Receipt', 'file', 3]] },
  ],
  company: [
    { title: 'Company Profile', fields: [['Company Name', 'text', 1, 'Al Noor Hajj & Umrah Travels Ltd.'], ['Trade Licence No.'], ['Ministry of Hajj Licence No.'], ['VAT / TIN'], ['Email', 'email'], ['Phone'], ['Head Office Address', 'textarea', 3], ['Company Logo', 'file']] },
  ],
  docUpload: [
    { title: 'Upload Document', fields: [['Passenger', PASSENGERS.map((p) => `${p.name} (${p.id})`)], ['Document Type', ['Passport Scan', 'Visa Copy', 'Photo', 'Vaccination Card', 'Other']], ['Expiry Date', 'date'], ['File', 'file'], ['Notes', 'textarea', 3]] },
  ],
  'General Settings': [{ title: 'General', fields: [['System Name', 'text', 1, 'UmrahOS ERP'], ['Default Branch', branches], ['Date Format', ['DD MMM YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']], ['Records per page', ['10', '25', '50', '100']], ['Support Email', 'email'], ['Maintenance Mode', ['Off', 'On']]] }],
  Languages: [{ title: 'Languages', fields: [['Default Language', ['English', 'العربية (Arabic, RTL)', 'বাংলা (Bengali)']], ['Enable Arabic (RTL)', ['Yes', 'No']], ['Enable Bengali', ['Yes', 'No']], ['Allow users to change language', ['Yes', 'No']]] }],
  'Currency & Time Zone': [{ title: 'Currency & Time Zone', fields: [['Base Currency', ['SAR – Saudi Riyal', 'BDT – Bangladeshi Taka', 'USD – US Dollar']], ['Secondary Currency', ['BDT – Bangladeshi Taka', 'USD – US Dollar', 'GBP – Pound']], ['Exchange Rate (1 SAR =)', 'number'], ['Time Zone', ['Asia/Riyadh (UTC+3)', 'Asia/Dhaka (UTC+6)', 'Europe/London']], ['Week Starts On', ['Saturday', 'Sunday', 'Monday']]] }],
  'Financial Settings': [{ title: 'Financial Settings', fields: [['Financial Year Start', ['January', 'July']], ['Approval Threshold (SAR)', 'number'], ['Auto-post approved expenses', ['Yes (once only)', 'No']], ['Default Receivable A/c', ['1300 – Accounts Receivable']], ['Default Payable A/c', ['2100 – Accounts Payable']], ['VAT %', 'number']] }],
  'Numbering Sequences': [{ title: 'Numbering Sequences', fields: [['Booking prefix', 'text', 1, 'UM-'], ['Passenger prefix', 'text', 1, 'PSG-'], ['Expense prefix', 'text', 1, 'EXP-'], ['Receipt prefix', 'text', 1, 'RCT-'], ['Trip prefix', 'text', 1, 'TRP-'], ['Journal prefix', 'text', 1, 'JV-']] }],
  'Security Settings': [{ title: 'Security', fields: [['Require MFA', ['For all users', 'For admins only', 'Off']], ['Password min length', 'number'], ['Session timeout (minutes)', 'number'], ['Lock after failed attempts', ['3', '5', '10']], ['Allowed IP ranges', 'textarea', 3]] }],
  'Backup & Restore': [{ title: 'Backup', fields: [['Automatic Backup', ['Daily', 'Weekly', 'Off']], ['Backup Time', 'time'], ['Retention (days)', 'number'], ['Restore from file', 'file']] }],
  profile: [
    { title: 'Personal Information', fields: [['Full Name', 'text', 1, 'Abdul Karim'], ['Email', 'email', 1, 'abdul.karim@umrahos.com'], ['Phone', 'text', 1, '+880 1711 000000'], ['Preferred Language', ['English', 'العربية', 'বাংলা']]] },
    { title: 'Change Password', fields: [['Current Password', 'password'], ['New Password', 'password'], ['Confirm Password', 'password']] },
  ],
}

/* ------------------------------------------------------------------ */
/* Resolver                                                           */
/* ------------------------------------------------------------------ */
const st = (...s) => (r) => s.includes(r.status)
const T = (dataset, filter, extra = {}) => ({ kind: 'table', dataset, filter, ...extra })
const F = (form, extra = {}) => ({ kind: 'form', form, ...extra })
const R = (report, dataset, extra = {}) => ({ kind: 'report', report, dataset, ...extra })

// [regex (tested on lower-case label), config | (section) => config]
const RULES = [
  // special screens
  [/^(create booking|new booking)$/, { kind: 'newBooking' }],
  [/^edit booking$/, { kind: 'newBooking', title: 'Edit Booking' }],
  [/^(expense details|approve \/ reject)$/, { kind: 'expenseDetail' }],
  [/^assign rooms$/, { kind: 'roomAllocation' }],
  [/^create trip$/, { kind: 'createTrip' }],
  [/^assign booking \/ group$/, { kind: 'createTrip', title: 'Assign Booking / Group' }],
  [/^passenger profile$/, { kind: 'passengerProfile' }],
  [/^passport details$/, { kind: 'passengerProfile', tab: 1 }],
  [/^permission matrix$/, { kind: 'matrix' }],
  [/^notifications$/, { kind: 'notifications' }],
  [/^profile & settings$/, { kind: 'profile' }],
  [/^trip calendar$/, { kind: 'tripCalendar' }],
  [/^export reports$/, { kind: 'export' }],

  // forms
  [/^add passenger$/, F('passenger', { title: 'Add Passenger' })],
  [/^(add employee|add \/ edit employee)$/, F('employee')],
  [/^add \/ edit branch$/, F('branch')],
  [/^add \/ edit vehicle$/, F('vehicle')],
  [/^record income$/, F('income')],
  [/^create expense request$/, F('expense')],
  [/^company profile$/, F('company')],
  [/^document upload$/, F('docUpload', { below: T('documents') })],
  [/^(general settings|languages|currency & time zone|financial settings|numbering sequences|security settings|backup & restore)$/, (l, s, orig) => F(orig, { settings: true })],

  // reports & analytics
  [/^(profit & loss|revenue & expenses|consolidated income|consolidated expenses|financial reports|branch financial report|income report|expense report|payment report|branch income summary|income overview)$/, R('finance', 'branchFinance')],
  [/^(ledger report)$/, R('finance', 'ledger')],
  [/^(company overview|all branch performance|branch reports|branch performance|branch activity|branch overview)$/, R('branches', 'branchFinance')],
  [/^(booking analytics|booking reports|booking performance|booking summary)$/, R('bookings', 'bookings')],
  [/^(passenger reports)$/, R('bookings', 'passengers')],
  [/^(hotel reports|occupancy report|room allocation report|availability report)$/, R('hotels', 'rooms')],
  [/^(transport reports|trip reports|vehicle utilisation|assignment reports)$/, R('transport', 'trips')],
  [/^(employee activity|staff activity|employee overview)$/, R('employees', 'employeeActivity')],
  [/^(outstanding balance report|receivables)$/, R('receivables', 'bookingPayments', { filter: (r) => r.due > 0 })],
  [/^(payables|outstanding payables)$/, R('payables', 'bills', { filter: (r) => r.paid !== 'Paid' })],
  [/^(approval summary)$/, R('approvals', 'approvals')],

  // tables — operations
  [/^(all bookings|all branch bookings|individual bookings|bookings|today's bookings)$/, (l) => T('bookings', l === 'individual bookings' ? (r) => r.type === 'Individual' : l === "today's bookings" ? (_, i) => i < 7 : null)],
  [/^group bookings$/, T('bookings', (r) => r.type === 'Group')],
  [/^(booking status)$/, T('bookings', null, { statusTabs: ['Confirmed', 'Pending', 'In Progress', 'Cancelled', 'Completed'] })],
  [/^pending bookings$/, T('bookings', st('Pending'))],
  [/^confirmed bookings$/, T('bookings', st('Confirmed'))],
  [/^(booking confirmations)$/, T('bookings', st('Confirmed'), { rowAction: 'Print' })],
  [/^(departures|upcoming departures)$/, T('bookings', st('Confirmed', 'In Progress'))],
  [/^(payment status|outstanding payments|customer balances|accounts receivable|outstanding balances)$/, T('bookingPayments', (r) => r.due > 0)],
  [/^booking history$/, T('bookingHistory')],
  [/^(hotel allocation status|hotel stay status)$/, T('bookingHotel')],
  [/^(transport assignment status)$/, T('bookingTransport')],
  [/^pending allocations$/, T('bookingHotel', (r) => r.hotel !== 'Allocated', { rowAction: 'Allocate', rowLink: '/m/room-allocation/assign-rooms' })],
  [/^(all passengers|branch passengers|all authorised passengers|passengers|total passengers)$/, T('passengers')],
  [/^passenger lists$/, (l, s) => (/transport|assignment/i.test(s) ? T('tripAssign') : T('passengers'))],
  [/^passenger history$/, T('passengerHistory')],
  [/^(passenger documents|missing documents|printable documents|receipt attachments)$/, (l) => T('documents', l === 'missing documents' ? (r) => r.status !== 'Verified' : null, { rowAction: l === 'printable documents' ? 'Print' : 'Download' })],
  [/^duplicate check$/, T('duplicates', null, { rowAction: 'Merge' })],
  [/^family \/ group records$/, T('groups')],
  [/^(packages|available packages|package details|package capacity)$/, T('packages')],

  // company / people
  [/^(branch directory|all authorised branches|branch details)$/, T('branches')],
  [/^(branch managers|branch manager assignment)$/, T('managers', null, { rowAction: 'Assign' })],
  [/^cost centres$/, T('costCentres')],
  [/^(all employees|employee directory|staff directory|employee status|employee assignments|branch assignment|staff assignments)$/, (l) => T('employees', null, { rowAction: /assign/.test(l) ? 'Reassign' : null, statusTabs: l === 'employee status' ? ['Active', 'On Leave', 'Inactive'] : null })],
  [/^(user accounts|role assignment)$/, (l) => T('users', null, { rowAction: l === 'role assignment' ? 'Change Role' : null })],
  [/^access requests$/, T('accessRequests', null, { rowAction: 'Approve' })],
  [/^roles$/, T('roles')],
  [/^login & security logs$/, T('loginLogs')],
  [/^audit logs$/, T('audit')],

  // hotels
  [/^(hotels|hotel details)$/, T('hotels')],
  [/^hotel suppliers$/, T('hotelSuppliers')],
  [/^hotel locations$/, T('hotelLocations')],
  [/^(room inventory|total rooms)$/, T('rooms')],
  [/^available rooms$/, T('rooms', st('Available', 'Partially Occupied'))],
  [/^occupied rooms$/, T('rooms', st('Occupied', 'Partially Occupied'))],
  [/^(room types|room availability|room capacity|room rates)$/, T('roomTypes')],
  [/^(room allocations|hotel allocations|booking rooming lists|group rooming lists)$/, T('rooming')],
  [/^room changes$/, T('roomChanges', null, { rowAction: 'Approve' })],
  [/^(hotel reservations|expected arrivals|upcoming check-ins|current occupancy)$/, (l) => T('checkins', l === 'current occupancy' ? st('Checked In') : l === 'hotel reservations' ? null : st('Expected'))],
  [/^check-in records$/, T('checkins', st('Checked In', 'Checked Out'))],
  [/^(check-out records|upcoming check-outs)$/, T('checkins', (r) => r.status !== 'Expected')],

  // transport
  [/^(vehicles|vehicle directory|vehicle capacity|vehicle availability|available vehicles|assigned vehicles)$/, (l) => T('vehicles', l === 'available vehicles' ? st('Available') : l === 'assigned vehicles' ? st('Assigned') : null, { statusTabs: l === 'vehicle availability' ? ['Available', 'Assigned', 'Maintenance'] : null })],
  [/^vehicle types$/, T('vehicleTypes')],
  [/^(drivers|driver directory|driver details|driver assignments)$/, T('drivers')],
  [/^(trips|scheduled trips|assigned trips|trip status|today's trips|transport trips|pickup \/ drop-off)$/, (l) => T('trips', l === "today's trips" ? (r) => r.date === '3 Nov 2026' || r.date === '4 Nov 2026' : null, { statusTabs: l === 'trip status' ? ['Scheduled', 'In Progress', 'Completed', 'Delayed'] : null })],
  [/^trip alerts$/, T('trips', st('Delayed', 'In Progress'))],
  [/^routes$/, T('routes')],
  [/^(passenger assignments|capacity validation)$/, T('tripAssign')],
  [/^(supplier directory|transport supplier details|supplier balances)$/, (l, s) => T('suppliers', /transport/i.test(s) ? (r) => r.type === 'Transport' : null)],

  // finance
  [/^chart of accounts$/, T('accounts')],
  [/^general ledger$/, T('ledger')],
  [/^journal entries$/, T('journals')],
  [/^(cash & bank accounts|cash accounts|bank accounts)$/, (l) => T('accounts', (r) => (l === 'cash accounts' ? /cash/i.test(r.name) : l === 'bank accounts' ? /bank/i.test(r.name) : /cash|bank/i.test(r.name)))],
  [/^(financial periods|financial period closing)$/, T('periods', null, { rowAction: 'Close Period' })],
  [/^(income & receipts|income records|payment receipts|booking receipts|receipt history|daily income)$/, T('income')],
  [/^refunds$/, T('income', st('Refunded', 'Pending'))],
  [/^(supplier bills|supplier payments|accounts payable)$/, T('bills')],
  [/^(expenses|expense requests|daily expenses)$/, T('expenses')],
  [/^(pending requests|pending expenses|pending approvals)$/, T('expenses', st('Pending'), { approve: true })],
  [/^(approved requests|approved expenses)$/, T('expenses', st('Approved'))],
  [/^(rejected requests|rejected expenses)$/, T('expenses', st('Rejected'))],
  [/^return for correction$/, T('expenses', st('Returned'))],
  [/^draft expenses$/, T('expenses', st('Draft'))],
  [/^submitted expenses$/, T('expenses', st('Pending', 'Returned'))],
  [/^(expense status|expense request status)$/, T('expenses', null, { statusTabs: ['Draft', 'Pending', 'Approved', 'Rejected', 'Returned'] })],
  [/^approval history$/, T('approvals')],
  [/^operational alerts$/, { kind: 'notifications' }],
]

export function resolvePage(section, child) {
  const label = (child || section).toLowerCase()
  for (const [re, cfg] of RULES) {
    if (re.test(label)) return typeof cfg === 'function' ? cfg(label, section, child || section) : cfg
  }
  return T('bookings')
}
