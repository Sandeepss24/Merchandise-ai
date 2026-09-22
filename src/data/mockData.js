export const USERS = [
  {
    id: 'u1',
    email: 'alex@merch.ai',
    password: 'password', // Demo purpose
    firstName: 'Alex',
    lastName: 'Ng',
    role: 'MERCHANDISER',
    employeeId: 'EMP-7742',
    phone: '+65 9123 4567',
    avatar: 'https://imgh.in/host/dgc0yq',
    assignedLocations: ['store1', 'store2', 'store3']
  },
  {
    id: 'u2',
    email: 'sarah@merch.ai',
    password: 'password', // Demo purpose
    firstName: 'Sarah',
    lastName: 'Lee',
    role: 'RETAIL_OPS_HEAD',
    employeeId: 'EMP-1102',
    phone: '+65 8123 4567',
    avatar: 'https://imgh.in/host/203hlp',
    assignedLocations: ['all']
  }
];

export const STORES = [
  {
    id: 'store1',
    code: 'FP-TAM',
    name: 'FairPrice Tampines Mall',
    type: 'Supermarket',
    address: '4 Tampines Central 5, #B1-12',
    city: 'Singapore',
    region: 'East',
    country: 'Singapore',
    contactPerson: 'Manager Tan',
    contactNumber: '6789 0123',
    operatingHours: '08:00 - 22:00',
    lastVisit: '2023-10-25',
    nextVisit: '2023-11-01',
    status: 'Active',
    assignedMerchandiser: 'Alex Ng',
    visitFrequency: 'Weekly',
    metrics: {
      totalAudits: 24,
      skuAvailability: 92,
      displayIssues: 2,
      stockIssues: 1,
      compliance: 95
    }
  },
  {
    id: 'store2',
    code: 'CS-VIV',
    name: 'Cold Storage VivoCity',
    type: 'Hypermarket',
    address: '1 HarbourFront Walk, #B2-23',
    city: 'Singapore',
    region: 'South',
    country: 'Singapore',
    contactPerson: 'Manager Lim',
    contactNumber: '6278 1234',
    operatingHours: '09:00 - 22:00',
    lastVisit: '2023-10-24',
    nextVisit: '2023-10-31',
    status: 'Active',
    assignedMerchandiser: 'Alex Ng',
    visitFrequency: 'Weekly',
    metrics: {
      totalAudits: 32,
      skuAvailability: 88,
      displayIssues: 5,
      stockIssues: 3,
      compliance: 89
    }
  },
  {
    id: 'store3',
    code: 'SNG-JUR',
    name: 'Sheng Siong Jurong Point',
    type: 'Supermarket',
    address: '1 Jurong West Central 2, #B1-09',
    city: 'Singapore',
    region: 'West',
    country: 'Singapore',
    contactPerson: 'Manager Wong',
    contactNumber: '6790 5678',
    operatingHours: '24 Hours',
    lastVisit: '2023-10-20',
    nextVisit: '2023-10-28',
    status: 'Inactive',
    assignedMerchandiser: 'Alex Ng',
    visitFrequency: 'Bi-Weekly',
    metrics: {
      totalAudits: 12,
      skuAvailability: 95,
      displayIssues: 1,
      stockIssues: 0,
      compliance: 98
    }
  }
];

export const SCHEDULES = [
  {
    id: 'sch1',
    storeId: 'store1',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    assignedTo: 'u1',
    activityType: 'Regular Audit',
    status: 'Scheduled'
  },
  {
    id: 'sch2',
    storeId: 'store2',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    assignedTo: 'u1',
    activityType: 'Restocking Focus',
    status: 'In Progress'
  },
  {
    id: 'sch3',
    storeId: 'store3',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '10:00',
    assignedTo: 'u1',
    activityType: 'Regular Audit',
    status: 'Completed'
  },
  {
    id: 'sch4',
    storeId: 'store1',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    time: '15:00',
    assignedTo: 'u1',
    activityType: 'Promotion Setup',
    status: 'Missed'
  }
];

export const PRODUCTS = [
  {
    id: 'p1',
    sku: 'JV-CHS-500',
    name: 'Johnsonville Chicken Sausage 500g',
    category: 'Chilled',
    brand: 'Johnsonville'
  },
  {
    id: 'p2',
    sku: 'CP-BKS-300',
    name: 'CP Breaded Chicken Strips 300g',
    category: 'Frozen',
    brand: 'CP'
  },
  {
    id: 'p3',
    sku: 'MG-CRM-2L',
    name: 'Magnolia Fresh Milk 2L',
    category: 'Dairy',
    brand: 'Magnolia'
  }
];

export const AUDITS = [
  {
    id: 'AUD-9921',
    storeId: 'store3',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    time: '10:30',
    merchandiserId: 'u1',
    displayArea: 'Frozen Section Aisle 3',
    status: 'Approved',
    aiMetadata: {
      extractionStatus: 'Success',
      overallConfidence: 94,
      correctedFields: ['qtyAfter']
    },
    products: [
      {
        sku: 'CP-BKS-300',
        qtyBefore: 5,
        qtyAfter: 25,
        condition: 'Good'
      }
    ],
    checklist: {
      restocked: true,
      cleaned: true,
      priceUpdated: false,
      removedExpired: false
    },
    comments: 'All good, restocked CP chicken.'
  },
  {
    id: 'AUD-9922',
    storeId: 'store1',
    date: new Date().toISOString().split('T')[0],
    time: '09:45',
    merchandiserId: 'u1',
    displayArea: 'Dairy Endcap',
    status: 'Pending Validation',
    aiMetadata: {
      extractionStatus: 'Low Confidence',
      overallConfidence: 72,
      correctedFields: []
    },
    products: [
      {
        sku: 'MG-CRM-2L',
        qtyBefore: 2,
        qtyAfter: 12,
        condition: 'Damaged'
      }
    ],
    checklist: {
      restocked: true,
      cleaned: false,
      priceUpdated: true,
      removedExpired: true
    },
    comments: 'Found 3 leaking milk cartons, removed them.'
  }
];

export const NOTIFICATIONS = [
  {
    id: 'n1',
    userId: 'u2', // Retail Ops Head
    title: 'Missed Store Visit',
    message: 'Alex Ng missed the scheduled visit at FairPrice Tampines.',
    time: '2 hours ago',
    read: false,
    type: 'warning'
  },
  {
    id: 'n2',
    userId: 'u2',
    title: 'Low AI Confidence',
    message: 'Audit AUD-9922 requires manual review.',
    time: '3 hours ago',
    read: false,
    type: 'error'
  },
  {
    id: 'n3',
    userId: 'u1', // Merchandiser
    title: 'Upcoming Store Visit',
    message: 'You have a visit at Cold Storage VivoCity in 1 hour.',
    time: 'Just now',
    read: false,
    type: 'info'
  },
  {
    id: 'n4',
    userId: 'u1',
    title: 'Audit Requires Correction',
    message: 'Audit AUD-9915 was rejected by OPS.',
    time: '1 day ago',
    read: true,
    type: 'error'
  }
];
