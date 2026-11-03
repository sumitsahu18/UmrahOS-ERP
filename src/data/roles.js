import {
  LayoutDashboard, Building2, Users, ShieldCheck, UserRound, Plane, Hotel, Bus, Landmark,
  CheckCircle2, BarChart3, Bell, ScrollText, Settings, Activity, UserCog, Wallet, Receipt,
  FileText, Truck, Contact, Package, BookOpen, ClipboardList, BedDouble, CalendarCheck,
  Car, Route, UsersRound, Store, FileBarChart, UserCircle, Banknote,
} from 'lucide-react'

export const slug = (s) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const sec = (label, icon, children = [], opts = {}) => ({ label, icon, children, ...opts })

export const ROLES = [
  {
    id: 'super-admin',
    name: 'Super Admin / Owner',
    desc: 'Full authorised system oversight',
    dashboard: 'Executive Dashboard',
    icon: '👑',
    menu: [
      sec('Executive Dashboard', LayoutDashboard, ['Company Overview', 'All Branch Performance', 'Booking Analytics', 'Revenue & Expenses', 'Profit & Loss', 'Pending Approvals'], { dashboard: true }),
      sec('Company Management', Building2, ['Company Profile', 'Branch Directory', 'Add / Edit Branch', 'Branch Managers', 'Cost Centres']),
      sec('Employee Management', Users, ['All Employees', 'Add Employee', 'Employee Assignments', 'Employee Status']),
      sec('Users & Permissions', ShieldCheck, ['User Accounts', 'Roles', 'Permission Matrix', 'Login & Security Logs']),
      sec('Passenger Management', UserRound, ['All Passengers', 'Passenger Documents', 'Passenger History']),
      sec('Umrah Operations', Plane, ['Packages', 'All Bookings', 'Group Bookings', 'Booking Status', 'Departures']),
      sec('Hotel Management', Hotel, ['Hotels', 'Room Inventory', 'Room Allocations', 'Hotel Reservations']),
      sec('Transport Management', Bus, ['Vehicles', 'Drivers', 'Trips', 'Passenger Assignments']),
      sec('Finance & Accounting', Landmark, ['Chart of Accounts', 'General Ledger', 'Journal Entries', 'Income & Receipts', 'Expenses', 'Supplier Bills', 'Accounts Receivable', 'Accounts Payable', 'Cash & Bank Accounts', 'Financial Periods']),
      sec('Expense Approvals', CheckCircle2, ['Pending Requests', 'Approved Requests', 'Rejected Requests', 'Approval History']),
      sec('Reports & Analytics', BarChart3, ['Branch Reports', 'Booking Reports', 'Passenger Reports', 'Hotel Reports', 'Transport Reports', 'Financial Reports', 'Export Reports']),
      sec('Notifications', Bell),
      sec('Audit Logs', ScrollText),
      sec('System Settings', Settings, ['General Settings', 'Languages', 'Currency & Time Zone', 'Financial Settings', 'Numbering Sequences', 'Security Settings', 'Backup & Restore']),
    ],
  },
  {
    id: 'head-office-admin',
    name: 'Head Office Admin',
    desc: 'Company, branches & employees',
    dashboard: 'Head Office Dashboard',
    icon: '🏢',
    restriction: 'Head Office Admin does not automatically receive unrestricted financial posting or approval permissions.',
    menu: [
      sec('Dashboard', LayoutDashboard, ['Branch Overview', 'Employee Overview', 'Booking Summary', 'Operational Alerts'], { dashboard: true }),
      sec('Branch Management', Building2, ['All Authorised Branches', 'Branch Details', 'Branch Manager Assignment']),
      sec('Employee Management', Users, ['Employee Directory', 'Add / Edit Employee', 'Branch Assignment', 'Employee Status']),
      sec('User Administration', UserCog, ['User Accounts', 'Role Assignment', 'Access Requests']),
      sec('Operations Monitoring', Activity, ['Bookings', 'Passengers', 'Hotel Allocations', 'Transport Trips']),
      sec('Operational Reports', FileBarChart, ['Branch Activity', 'Employee Activity', 'Booking Performance']),
      sec('Notifications', Bell),
      sec('Profile & Settings', UserCircle),
    ],
  },
  {
    id: 'ho-accountant',
    name: 'Head Office Accountant / Approver',
    desc: 'Finance, approvals & accounting',
    dashboard: 'Finance & Approval Dashboard',
    icon: '🧾',
    menu: [
      sec('Finance Dashboard', LayoutDashboard, ['Consolidated Income', 'Consolidated Expenses', 'Outstanding Balances', 'Approval Summary'], { dashboard: true }),
      sec('Expense Approvals', CheckCircle2, ['Pending Expenses', 'Expense Details', 'Approve / Reject', 'Return for Correction', 'Approval History']),
      sec('Accounting', Landmark, ['Chart of Accounts', 'General Ledger', 'Journal Entries', 'Cash Accounts', 'Bank Accounts', 'Financial Period Closing']),
      sec('Income & Receipts', Wallet, ['Income Records', 'Payment Receipts', 'Refunds']),
      sec('Expenses & Payables', Receipt, ['Approved Expenses', 'Supplier Bills', 'Supplier Payments', 'Outstanding Payables']),
      sec('Financial Reports', BarChart3, ['Profit & Loss', 'Branch Financial Report', 'Ledger Report', 'Receivables', 'Payables']),
      sec('Notifications', Bell),
    ],
  },
  {
    id: 'branch-manager',
    name: 'Branch Manager',
    desc: 'Branch operations & team',
    dashboard: 'Branch Dashboard',
    icon: '👤',
    restriction: 'Branch Manager can only access assigned branches and cannot approve their own expense requests.',
    menu: [
      sec('Branch Dashboard', LayoutDashboard, ["Today's Bookings", 'Total Passengers', 'Branch Income Summary', 'Outstanding Payments', 'Pending Expenses'], { dashboard: true }),
      sec('Branch Employees', Users, ['Staff Directory', 'Staff Assignments', 'Staff Activity']),
      sec('Passenger Management', UserRound, ['Branch Passengers', 'Add Passenger', 'Passenger Documents', 'Family / Group Records']),
      sec('Booking Management', BookOpen, ['New Booking', 'All Branch Bookings', 'Group Bookings', 'Booking Status', 'Booking Confirmations']),
      sec('Hotel Operations', Hotel, ['Room Allocations', 'Booking Rooming Lists', 'Hotel Stay Status']),
      sec('Transport Operations', Bus, ['Assigned Trips', 'Passenger Assignments', 'Trip Status']),
      sec('Branch Finance', Wallet, ['Income Overview', 'Outstanding Payments', 'Expense Requests', 'Expense Status']),
      sec('Branch Reports', BarChart3, ['Booking Reports', 'Passenger Reports', 'Branch Performance']),
      sec('Notifications', Bell),
    ],
  },
  {
    id: 'branch-accountant',
    name: 'Branch Accountant',
    desc: 'Branch finance, income & expenses',
    dashboard: 'Branch Finance Dashboard',
    icon: '💵',
    menu: [
      sec('Branch Finance Dashboard', LayoutDashboard, ['Daily Income', 'Daily Expenses', 'Outstanding Payments', 'Expense Request Status'], { dashboard: true }),
      sec('Income Management', Banknote, ['Record Income', 'Booking Receipts', 'Receipt History', 'Customer Balances']),
      sec('Expense Management', Receipt, ['Create Expense Request', 'Draft Expenses', 'Submitted Expenses', 'Approved Expenses', 'Rejected Expenses', 'Receipt Attachments']),
      sec('Supplier Records', Store, ['Supplier Directory', 'Supplier Bills', 'Supplier Balances']),
      sec('Branch Financial Reports', BarChart3, ['Income Report', 'Expense Report', 'Payment Report', 'Outstanding Balance Report']),
      sec('Notifications', Bell),
    ],
  },
  {
    id: 'booking-officer',
    name: 'Booking Officer',
    desc: 'Passengers, packages & bookings',
    dashboard: 'Booking Operations Dashboard',
    icon: '🧕',
    menu: [
      sec('Booking Dashboard', LayoutDashboard, ["Today's Bookings", 'Pending Bookings', 'Confirmed Bookings', 'Upcoming Departures', 'Missing Documents'], { dashboard: true }),
      sec('Passenger Management', UserRound, ['All Authorised Passengers', 'Add Passenger', 'Passenger Profile', 'Passport Details', 'Document Upload', 'Family / Group Records', 'Duplicate Check']),
      sec('Umrah Packages', Package, ['Available Packages', 'Package Details', 'Package Capacity']),
      sec('Booking Management', BookOpen, ['Create Booking', 'Individual Bookings', 'Group Bookings', 'Edit Booking', 'Booking Status', 'Payment Status', 'Booking History']),
      sec('Booking Documents', FileText, ['Booking Confirmations', 'Passenger Lists', 'Printable Documents']),
      sec('Operational Assignments', ClipboardList, ['Hotel Allocation Status', 'Transport Assignment Status']),
      sec('Notifications', Bell),
    ],
  },
  {
    id: 'hotel-operator',
    name: 'Hotel Operator',
    desc: 'Hotels, rooms & allocations',
    dashboard: 'Hotel Operations Dashboard',
    icon: '🏨',
    menu: [
      sec('Hotel Dashboard', LayoutDashboard, ['Total Rooms', 'Available Rooms', 'Occupied Rooms', 'Upcoming Check-ins', 'Upcoming Check-outs'], { dashboard: true }),
      sec('Hotel Directory', Hotel, ['Hotels', 'Hotel Details', 'Hotel Suppliers', 'Hotel Locations']),
      sec('Room Management', BedDouble, ['Room Types', 'Room Inventory', 'Room Availability', 'Room Capacity', 'Room Rates']),
      sec('Room Allocation', ClipboardList, ['Pending Allocations', 'Assign Rooms', 'Group Rooming Lists', 'Room Changes']),
      sec('Guest Stay Management', CalendarCheck, ['Expected Arrivals', 'Check-in Records', 'Check-out Records', 'Current Occupancy']),
      sec('Hotel Reports', BarChart3, ['Occupancy Report', 'Room Allocation Report', 'Availability Report']),
      sec('Notifications', Bell),
    ],
  },
  {
    id: 'transport-officer',
    name: 'Transport Officer',
    desc: 'Vehicles, drivers & trip management',
    dashboard: 'Transport Operations Dashboard',
    icon: '🚌',
    menu: [
      sec('Transport Dashboard', LayoutDashboard, ["Today's Trips", 'Scheduled Trips', 'Available Vehicles', 'Assigned Vehicles', 'Trip Alerts'], { dashboard: true }),
      sec('Vehicle Management', Car, ['Vehicle Directory', 'Add / Edit Vehicle', 'Vehicle Types', 'Vehicle Capacity', 'Vehicle Availability']),
      sec('Driver Management', Contact, ['Driver Directory', 'Driver Details', 'Driver Assignments']),
      sec('Trip Management', Route, ['Create Trip', 'Scheduled Trips', 'Trip Calendar', 'Pickup / Drop-off', 'Routes', 'Trip Status']),
      sec('Passenger Assignments', UsersRound, ['Assign Booking / Group', 'Passenger Lists', 'Capacity Validation']),
      sec('Transport Suppliers', Truck, ['Supplier Directory', 'Transport Supplier Details']),
      sec('Transport Reports', BarChart3, ['Trip Reports', 'Vehicle Utilisation', 'Assignment Reports']),
      sec('Notifications', Bell),
    ],
  },
]

/** Path helpers */
export const sectionPath = (s) => (s.dashboard ? '/dashboard' : `/m/${slug(s.label)}`)
export const childPath = (s, c) => `/m/${slug(s.label)}/${slug(c)}`

export const getRole = (id) => ROLES.find((r) => r.id === id) || ROLES[0]

/** Find a section + child label for a given URL slug pair within a role */
export function resolveMenu(role, secSlug, childSlug) {
  for (const s of role.menu) {
    if (slug(s.label) !== secSlug) continue
    if (!childSlug) return { section: s, child: null }
    const c = s.children.find((x) => slug(x) === childSlug)
    if (c) return { section: s, child: c }
  }
  return null
}
