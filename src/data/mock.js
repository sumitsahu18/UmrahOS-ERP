// Demo data used across the UI (replace with API calls later)

const pick = (arr, i) => arr[i % arr.length]
const pad = (n, l = 4) => String(n).padStart(l, '0')
const money = (n) => 'SAR ' + n.toLocaleString('en-US')
export const fmt = money

export const BRANCHES = [
  { code: 'HO', name: 'Head Office – Dhaka', city: 'Dhaka', country: 'Bangladesh', manager: 'Abdul Karim', staff: 42, bookings: 412, income: 410000, expense: 268000, status: 'Active' },
  { code: 'CTG', name: 'Chattogram Branch', city: 'Chattogram', country: 'Bangladesh', manager: 'Rafiq Hasan', staff: 18, bookings: 196, income: 205000, expense: 131000, status: 'Active' },
  { code: 'SYL', name: 'Sylhet Branch', city: 'Sylhet', country: 'Bangladesh', manager: 'Nusrat Jahan', staff: 14, bookings: 171, income: 168000, expense: 112000, status: 'Active' },
  { code: 'RAJ', name: 'Rajshahi Branch', city: 'Rajshahi', country: 'Bangladesh', manager: 'Tanvir Ahmed', staff: 11, bookings: 98, income: 112000, expense: 79000, status: 'Active' },
  { code: 'MKK', name: 'Makkah Operations', city: 'Makkah', country: 'Saudi Arabia', manager: 'Yusuf Al-Harbi', staff: 26, bookings: 154, income: 186000, expense: 142000, status: 'Active' },
  { code: 'MED', name: 'Madinah Operations', city: 'Madinah', country: 'Saudi Arabia', manager: 'Omar Al-Qahtani', staff: 19, bookings: 77, income: 98000, expense: 74000, status: 'Active' },
  { code: 'JED', name: 'Jeddah Liaison', city: 'Jeddah', country: 'Saudi Arabia', manager: 'Saad Al-Otaibi', staff: 8, bookings: 41, income: 71000, expense: 54000, status: 'Inactive' },
]

const FIRST = ['Ahmed', 'Fatima', 'Mohammad', 'Ayesha', 'Abdullah', 'Khadija', 'Hasan', 'Maryam', 'Ibrahim', 'Zainab', 'Yusuf', 'Rokeya', 'Imran', 'Sumaiya', 'Rahim', 'Nadia']
const LAST = ['Khan', 'Ali', 'Rahman', 'Hossain', 'Uddin', 'Begum', 'Chowdhury', 'Islam', 'Siddiqui', 'Akter', 'Sarkar', 'Miah']
export const PACKAGES = [
  { code: 'PKG-10E', name: '10 Days Economy Umrah', days: 10, price: 5200, capacity: 120, booked: 96, makkah: 'Al Safwah Royal', madinah: 'Dar Al Taqwa', start: '05 Dec 2026' },
  { code: 'PKG-15S', name: '15 Days Standard Umrah', days: 15, price: 7400, capacity: 160, booked: 151, makkah: 'Hilton Suites Makkah', madinah: 'Anwar Al Madinah', start: '10 Dec 2026' },
  { code: 'PKG-20P', name: '20 Days Premium Umrah', days: 20, price: 11800, capacity: 80, booked: 52, makkah: 'Swissôtel Makkah', madinah: 'Pullman Zamzam', start: '15 Dec 2026' },
  { code: 'PKG-7R', name: '7 Days Ramadan Express', days: 7, price: 6900, capacity: 60, booked: 60, makkah: 'Le Méridien Towers', madinah: 'Shaza Al Madina', start: '20 Feb 2027' },
  { code: 'PKG-14F', name: '14 Days Family Package', days: 14, price: 8900, capacity: 100, booked: 41, makkah: 'Al Marwa Rayhaan', madinah: 'Crowne Plaza', start: '02 Jan 2027' },
]
const STATUS = ['Confirmed', 'Pending', 'Confirmed', 'In Progress', 'Confirmed', 'Cancelled', 'Completed', 'Confirmed']
const PAY = ['Paid', 'Partial', 'Unpaid', 'Paid', 'Partial']
const NAT = ['Bangladesh', 'Bangladesh', 'India', 'Pakistan', 'Bangladesh', 'United Kingdom']

export const PASSENGERS = Array.from({ length: 24 }, (_, i) => {
  const name = `${pick(FIRST, i)} ${pick(LAST, i * 3 + 1)}`
  return {
    id: `PSG-${pad(2100 + i)}`,
    name,
    gender: i % 2 ? 'Female' : 'Male',
    passport: `${['M', 'A', 'B', 'E'][i % 4]}${1234567 + i * 731}`,
    expiry: `${(i % 27) + 1} ${pick(['Jan', 'Mar', 'Jun', 'Sep', 'Dec'], i)} ${2027 + (i % 5)}`,
    nationality: pick(NAT, i),
    phone: `+880 17${pad(10000000 + i * 4567, 8)}`,
    branch: pick(BRANCHES, i).name,
    group: i % 3 === 0 ? `GRP-${pad(310 + Math.floor(i / 3), 3)}` : '—',
    docs: i % 5 === 2 ? 'Missing Visa' : i % 7 === 3 ? 'Missing Photo' : 'Complete',
    trips: (i % 4) + 1,
  }
})

export const BOOKINGS = Array.from({ length: 24 }, (_, i) => {
  const pkg = pick(PACKAGES, i)
  const total = pkg.price * ((i % 3) + 1)
  const pay = pick(PAY, i)
  const paid = pay === 'Paid' ? total : pay === 'Partial' ? Math.round(total * 0.4) : 0
  return {
    id: `UM-${1001 + i}`,
    passenger: i % 6 === 2 ? `${pick(LAST, i)} Group` : PASSENGERS[i].name,
    type: i % 6 === 2 ? 'Group' : 'Individual',
    pax: i % 6 === 2 ? 8 + (i % 5) : (i % 3) + 1,
    package: `${pkg.days} Days Umrah`,
    pkg: pkg.name,
    date: `${(i % 20) + 5} ${i < 14 ? 'Dec' : 'Jan'} ${i < 14 ? 2026 : 2027}`,
    branch: pick(BRANCHES, i).name,
    officer: pick(['Sadia Rahman', 'Karim Uddin', 'Farhana Akter', 'Jamal Hossain'], i),
    status: pick(STATUS, i),
    payment: pay,
    total,
    paid,
    due: total - paid,
    hotel: pick(['Allocated', 'Pending', 'Allocated', 'Partially Allocated'], i),
    transport: pick(['Assigned', 'Pending', 'Assigned'], i),
  }
})

export const EMPLOYEES = Array.from({ length: 16 }, (_, i) => ({
  id: `EMP-${pad(301 + i, 3)}`,
  name: `${pick(FIRST, i + 5)} ${pick(LAST, i + 2)}`,
  role: pick(['Branch Manager', 'Booking Officer', 'Branch Accountant', 'Hotel Operator', 'Transport Officer', 'Booking Officer'], i),
  branch: pick(BRANCHES, i).name,
  email: `${pick(FIRST, i + 5).toLowerCase()}.${pick(LAST, i + 2).toLowerCase()}@umrahos.com`,
  phone: `+880 18${pad(20000000 + i * 3121, 8)}`,
  joined: `${(i % 26) + 1} ${pick(['Feb', 'Apr', 'Jul', 'Oct'], i)} ${2021 + (i % 5)}`,
  status: i % 7 === 4 ? 'On Leave' : i % 9 === 8 ? 'Inactive' : 'Active',
  activity: 20 + ((i * 17) % 70),
}))

export const USERS = EMPLOYEES.map((e, i) => ({
  username: e.email.split('@')[0],
  name: e.name,
  role: e.role,
  branches: i % 4 === 0 ? 'All Branches' : e.branch,
  mfa: i % 3 ? 'Enabled' : 'Disabled',
  last: `${(i % 9) + 1} hours ago`,
  status: e.status === 'Inactive' ? 'Locked' : 'Active',
}))

export const HOTELS = [
  { code: 'HTL-01', name: 'Swissôtel Makkah', city: 'Makkah', distance: '50 m', stars: 5, rooms: 120, available: 18, supplier: 'Al Bait Hospitality', phone: '+966 12 571 0000' },
  { code: 'HTL-02', name: 'Hilton Suites Makkah', city: 'Makkah', distance: '150 m', stars: 5, rooms: 160, available: 34, supplier: 'Hilton KSA', phone: '+966 12 545 0000' },
  { code: 'HTL-03', name: 'Al Safwah Royal Orchid', city: 'Makkah', distance: '100 m', stars: 4, rooms: 90, available: 11, supplier: 'Safwah Group', phone: '+966 12 571 4444' },
  { code: 'HTL-04', name: 'Pullman Zamzam Madinah', city: 'Madinah', distance: '200 m', stars: 5, rooms: 110, available: 27, supplier: 'Accor Arabia', phone: '+966 14 820 0000' },
  { code: 'HTL-05', name: 'Anwar Al Madinah Mövenpick', city: 'Madinah', distance: '80 m', stars: 5, rooms: 140, available: 22, supplier: 'Mövenpick ME', phone: '+966 14 818 1000' },
  { code: 'HTL-06', name: 'Dar Al Taqwa', city: 'Madinah', distance: '30 m', stars: 4, rooms: 70, available: 9, supplier: 'Taqwa Hotels', phone: '+966 14 823 0000' },
]

export const ROOM_TYPES = [
  { type: 'Double', capacity: 2, total: 180, occupied: 142, rate: 650 },
  { type: 'Triple', capacity: 3, total: 220, occupied: 188, rate: 780 },
  { type: 'Quad', capacity: 4, total: 260, occupied: 231, rate: 880 },
  { type: 'Quint', capacity: 5, total: 30, occupied: 22, rate: 990 },
]

export const ROOMS = Array.from({ length: 18 }, (_, i) => {
  const rt = pick(ROOM_TYPES, i)
  const occ = i % 4 === 1 ? 0 : Math.min(rt.capacity, (i % rt.capacity) + 1)
  return {
    room: `${pick(['7', '8', '9', '12'], i)}${pad(i + 1, 2)}`,
    hotel: pick(HOTELS, i).name,
    type: rt.type,
    capacity: rt.capacity,
    occupied: occ,
    status: occ === 0 ? 'Available' : occ === rt.capacity ? 'Occupied' : 'Partially Occupied',
    booking: occ ? BOOKINGS[i].id : '—',
    rate: rt.rate,
  }
})

export const CHECKINS = BOOKINGS.slice(0, 10).map((b, i) => ({
  passenger: b.passenger, booking: b.id, hotel: pick(HOTELS, i).name, room: ROOMS[i].room,
  checkin: `${(i % 6) + 4} Nov 2026`, checkout: `${(i % 6) + 14} Nov 2026`, guests: b.pax,
  status: pick(['Expected', 'Checked In', 'Expected', 'Checked Out'], i),
}))

export const VEHICLES = Array.from({ length: 12 }, (_, i) => ({
  plate: `${pick(['KSA', 'MKK', 'MED'], i)} ${pad(4100 + i * 37)}`,
  type: pick(['Coaster Bus', 'Luxury Coach', 'GMC Yukon', 'Hiace Van', 'Luxury Coach'], i),
  capacity: pick([28, 49, 7, 13, 49], i),
  supplier: pick(['Saptco', 'Al Rajhi Transport', 'Rawaf Mina', 'Dallah Transport'], i),
  status: pick(['Available', 'Assigned', 'Available', 'Maintenance', 'Assigned'], i),
  driver: pick(['Khalid Saeed', 'Bilal Ahmed', 'Faisal Noor', 'Tariq Mahmood', 'Hamza Ali', 'Nasir Iqbal'], i),
}))

export const DRIVERS = ['Khalid Saeed', 'Bilal Ahmed', 'Faisal Noor', 'Tariq Mahmood', 'Hamza Ali', 'Nasir Iqbal', 'Waleed Hassan', 'Sami Al-Zahrani'].map((n, i) => ({
  id: `DRV-${pad(41 + i, 3)}`, name: n, licence: `LIC-${pad(889100 + i * 77, 7)}`, phone: `+966 5${pad(51230000 + i * 991, 8)}`,
  vehicle: VEHICLES[i].plate, trips: 12 + i * 3, status: pick(['On Duty', 'Available', 'On Duty', 'Off Duty'], i),
}))

const ROUTES = ['Jeddah Airport → Makkah Hotel', 'Makkah Hotel → Madinah Hotel', 'Madinah Hotel → Madinah Airport', 'Makkah → Ziyarat Tour', 'Madinah → Ziyarat Tour', 'Makkah Hotel → Jeddah Airport']
export const TRIPS = Array.from({ length: 14 }, (_, i) => {
  const v = pick(VEHICLES, i)
  const pax = Math.min(v.capacity, 5 + ((i * 7) % v.capacity))
  return {
    id: `TRP-${pad(5501 + i)}`,
    route: pick(ROUTES, i),
    type: pick(['Arrival', 'Intercity', 'Departure', 'Ziyarat', 'Ziyarat', 'Departure'], i),
    date: `${(i % 7) + 3} Nov 2026`,
    time: `${pad(6 + (i % 14), 2)}:${i % 2 ? '30' : '00'}`,
    vehicle: v.plate,
    vtype: v.type,
    driver: v.driver,
    passengers: pax,
    capacity: v.capacity,
    group: BOOKINGS[i].id,
    status: pick(['Scheduled', 'In Progress', 'Completed', 'Scheduled', 'Delayed'], i),
  }
})

const EXP_CAT = ['Hotel Advance', 'Transport Hire', 'Visa Processing', 'Office Rent', 'Utilities', 'Marketing', 'Ziyarat Guide', 'Staff Travel']
export const EXPENSES = Array.from({ length: 16 }, (_, i) => ({
  id: `EXP-${pad(7801 + i)}`,
  branch: pick(BRANCHES, i + 1).name,
  category: pick(EXP_CAT, i),
  supplier: pick(['Al Bait Hospitality', 'Saptco', 'MOFA Services', 'Bashundhara Properties', 'DESCO', 'Meta Ads', 'Rawaf Mina'], i),
  submittedBy: pick(['Rafiq Hasan', 'Nusrat Jahan', 'Tanvir Ahmed', 'Yusuf Al-Harbi'], i),
  amount: 2400 + ((i * 3779) % 42000),
  date: `${(i % 27) + 1} Oct 2026`,
  status: pick(['Pending', 'Approved', 'Pending', 'Rejected', 'Returned', 'Draft', 'Approved'], i),
  description: `${pick(EXP_CAT, i)} for ${pick(PACKAGES, i).name} group departure`,
}))

export const INCOME = Array.from({ length: 16 }, (_, i) => ({
  receipt: `RCT-${pad(9101 + i)}`,
  date: `${(i % 27) + 1} Oct 2026`,
  booking: BOOKINGS[i].id,
  customer: BOOKINGS[i].passenger,
  method: pick(['Bank Transfer', 'Cash', 'Card', 'bKash', 'Bank Transfer'], i),
  amount: 1800 + ((i * 2731) % 22000),
  branch: BOOKINGS[i].branch,
  status: pick(['Posted', 'Posted', 'Pending', 'Refunded'], i),
}))

export const SUPPLIERS = [
  { code: 'SUP-01', name: 'Al Bait Hospitality', type: 'Hotel', contact: 'Majed Al-Ghamdi', phone: '+966 12 571 0000', bills: 14, balance: 84000 },
  { code: 'SUP-02', name: 'Saptco', type: 'Transport', contact: 'Fahad Al-Mutairi', phone: '+966 11 454 5000', bills: 9, balance: 31500 },
  { code: 'SUP-03', name: 'Rawaf Mina', type: 'Transport', contact: 'Ali Bakr', phone: '+966 12 560 9000', bills: 6, balance: 18200 },
  { code: 'SUP-04', name: 'MOFA Services', type: 'Visa', contact: 'Rashed Kabir', phone: '+880 2 955 2000', bills: 21, balance: 9600 },
  { code: 'SUP-05', name: 'Accor Arabia', type: 'Hotel', contact: 'Lina Haddad', phone: '+966 14 820 0000', bills: 11, balance: 52700 },
  { code: 'SUP-06', name: 'Biman Bangladesh Airlines', type: 'Airline', contact: 'Group Desk', phone: '+880 2 890 1600', bills: 7, balance: 126000 },
]

export const BILLS = Array.from({ length: 12 }, (_, i) => ({
  bill: `BILL-${pad(3301 + i)}`, supplier: pick(SUPPLIERS, i).name, date: `${(i % 27) + 1} Oct 2026`, due: `${(i % 27) + 1} Nov 2026`,
  amount: 4500 + ((i * 5113) % 48000), paid: i % 3 === 0 ? 'Paid' : i % 3 === 1 ? 'Partial' : 'Unpaid', branch: pick(BRANCHES, i).name,
}))

export const ACCOUNTS = [
  ['1000', 'Assets', 'Header', 0], ['1100', 'Cash in Hand', 'Asset', 84500], ['1200', 'Bank – Islami Bank', 'Asset', 912000], ['1210', 'Bank – Al Rajhi', 'Asset', 455000],
  ['1300', 'Accounts Receivable', 'Asset', 268000], ['2000', 'Liabilities', 'Header', 0], ['2100', 'Accounts Payable', 'Liability', 322000], ['2200', 'Customer Advances', 'Liability', 148000],
  ['3000', 'Equity', 'Header', 0], ['3100', "Owner's Capital", 'Equity', 1200000], ['4000', 'Income', 'Header', 0], ['4100', 'Package Sales', 'Income', 1150000],
  ['4200', 'Visa Service Fees', 'Income', 100000], ['5000', 'Expenses', 'Header', 0], ['5100', 'Hotel Costs', 'Expense', 420000], ['5200', 'Transport Costs', 'Expense', 186000],
  ['5300', 'Visa Costs', 'Expense', 98000], ['5400', 'Salaries', 'Expense', 112000], ['5500', 'Office & Admin', 'Expense', 44000],
].map(([code, name, type, balance]) => ({ code, name, type, balance }))

export const JOURNALS = Array.from({ length: 12 }, (_, i) => ({
  ref: `JV-${pad(4401 + i)}`, date: `${(i % 27) + 1} Oct 2026`,
  narration: pick(['Booking receipt UM-1003', 'Hotel advance – Swissôtel', 'Transport hire – Saptco', 'Visa fees batch 41', 'Office rent October', 'Refund UM-1011'], i),
  debit: pick(ACCOUNTS.filter((a) => a.type !== 'Header'), i + 1).name,
  credit: pick(ACCOUNTS.filter((a) => a.type !== 'Header'), i + 6).name,
  amount: 3000 + ((i * 4127) % 40000), by: pick(['Head Office Accountant', 'Branch Accountant'], i), status: pick(['Posted', 'Posted', 'Draft'], i),
}))

export const LEDGER = Array.from({ length: 12 }, (_, i) => {
  const dr = i % 2 ? 0 : 2000 + ((i * 3517) % 30000)
  const cr = i % 2 ? 1500 + ((i * 2213) % 25000) : 0
  return { date: `${i + 2} Oct 2026`, ref: JOURNALS[i].ref, account: pick(['Bank – Islami Bank', 'Cash in Hand', 'Accounts Receivable'], i), narration: JOURNALS[i].narration, debit: dr, credit: cr }
})

export const APPROVAL_HISTORY = Array.from({ length: 12 }, (_, i) => ({
  request: EXPENSES[i].id, branch: EXPENSES[i].branch, amount: EXPENSES[i].amount,
  action: pick(['Approved', 'Rejected', 'Returned for Correction', 'Approved'], i),
  by: pick(['Head Office Accountant', 'Super Admin'], i), date: `${(i % 27) + 2} Oct 2026`,
  remark: pick(['Within budget', 'Receipt missing', 'Wrong cost centre', 'OK — posted to ledger'], i),
}))

export const AUDIT = Array.from({ length: 14 }, (_, i) => ({
  time: `03 Nov 2026 ${pad(8 + (i % 10), 2)}:${pad((i * 7) % 60, 2)}`,
  user: USERS[i % USERS.length].username,
  module: pick(['Bookings', 'Finance', 'Hotels', 'Users', 'Transport', 'Settings'], i),
  action: pick(['Created', 'Updated', 'Approved', 'Deleted', 'Logged in', 'Exported'], i),
  record: pick([BOOKINGS[i].id, EXPENSES[i].id, TRIPS[i].id, 'ROLE-04'], i),
  ip: `103.${(i * 13) % 255}.${(i * 7) % 255}.${(i * 29) % 255}`,
}))

export const DOCUMENTS = Array.from({ length: 12 }, (_, i) => ({
  name: pick(['Passport Scan', 'Visa Copy', 'Photo', 'Vaccination Card', 'Booking Confirmation', 'Payment Receipt'], i),
  owner: PASSENGERS[i].name, ref: PASSENGERS[i].id, type: pick(['PDF', 'JPG', 'PNG'], i),
  size: `${(i % 9) + 1}.${i % 10} MB`, uploaded: `${(i % 27) + 1} Oct 2026`, status: i % 5 === 2 ? 'Missing' : i % 4 === 1 ? 'Pending Review' : 'Verified',
}))

export const NOTIFICATIONS = [
  { title: '5 expense requests awaiting approval', body: 'Chattogram and Sylhet branches submitted new requests.', time: '10 min ago', type: 'approval', unread: true },
  { title: 'Booking UM-1004 confirmed', body: 'Payment received in full via bank transfer.', time: '42 min ago', type: 'booking', unread: true },
  { title: 'Missing documents: 3 passengers', body: 'Visa copies missing for group GRP-312.', time: '1 hour ago', type: 'alert', unread: true },
  { title: 'Trip TRP-5503 delayed', body: 'Vehicle KSA 4174 delayed by 40 minutes.', time: '2 hours ago', type: 'transport', unread: false },
  { title: 'Room allocation completed', body: 'Group GRP-311 allocated at Hilton Suites Makkah.', time: 'Yesterday', type: 'hotel', unread: false },
  { title: 'Financial period October closing', body: 'Close the period before 10 Nov 2026.', time: 'Yesterday', type: 'finance', unread: false },
  { title: 'New login from new device', body: 'User farhana.akter signed in from Chrome / Windows.', time: '2 days ago', type: 'security', unread: false },
]

export const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
export const TREND = MONTHS.map((m, i) => ({
  month: m,
  bookings: [62, 88, 104, 121, 152, 178][i],
  passengers: [140, 190, 262, 241, 300, 340][i],
  income: [142000, 168000, 191000, 205000, 254000, 290000][i],
  expenses: [101000, 118000, 132000, 141000, 176000, 192000][i],
  departures: [8, 11, 14, 13, 18, 21][i],
}))
export const DAILY = Array.from({ length: 14 }, (_, i) => ({
  day: i + 21 <= 31 ? `${i + 21} Oct` : `${i - 10} Nov`,
  income: 6000 + ((i * 3911) % 14000),
  expenses: 3000 + ((i * 2719) % 9000),
}))

export const BOOKING_STATUS = [
  { name: 'Confirmed', value: 240, color: '#16a34a' },
  { name: 'Pending', value: 52, color: '#3b82f6' },
  { name: 'In Progress', value: 24, color: '#f59e0b' },
  { name: 'Cancelled', value: 12, color: '#ef4444' },
  { name: 'Completed', value: 86, color: '#8b5cf6' },
]

export const PERMISSIONS = {
  modules: ['Dashboard', 'Branches', 'Employees', 'Users', 'Passengers', 'Bookings', 'Hotels', 'Transport', 'Finance', 'Approvals', 'Reports', 'Settings'],
  // v=view c=create e=edit a=approve
  matrix: {
    'Super Admin / Owner': 'vcea vcea vcea vcea vcea vcea vcea vcea vcea vcea vcea vcea',
    'Head Office Admin': 'v vce vce vce v v v v - - v v',
    'Head Office Accountant / Approver': 'v v - - - v - - vcea vcea v -',
    'Branch Manager': 'v v v - vce vce v v v - v -',
    'Branch Accountant': 'v - - - - v - - vce - v -',
    'Booking Officer': 'v - - - vce vce v v - - - -',
    'Hotel Operator': 'v - - - v v vce - - - v -',
    'Transport Officer': 'v - - - v v - vce - - v -',
  },
}

export const money$ = money
