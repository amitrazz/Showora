# 📑 Showora - API Requirements & Specifications Document

This document outlines the detailed API endpoints, schemas, and implementation requirements needed to support the **Showora** Showroom Management Platform. It serves as a contract between the frontend React application and the backend service layer to transition from mock service providers to real REST API endpoints.

---

## 🛠 1. Global API Standards

### 1.1 Base Configuration
* **Base URL:** Controlled via frontend environment variable `VITE_API_URL` (default: `https://api.amitrazz.in`).
* **Protocol:** HTTP/1.1 or HTTP/2 over TLS 1.3.
* **Content-Type:** `application/json` for all requests and responses.

### 1.2 Authentication & Session State
* **Mechanism:** Stateless, JSON Web Token (JWT) authorization.
* **Flow:** 
  1. Frontend submits credentials to `/auth/login`.
  2. Backend returns `accessToken` (short-lived JWT).
  3. Frontend stores token in memory (Zustand state) and attaches it as a Bearer token in the `Authorization` header for all requests:
     `Authorization: Bearer <token>`
  4. Access cookies (httpOnly, Secure, SameSite=Strict) are recommended for refresh tokens.
  5. The API client will intercept responses: any `401 Unauthorized` or `403 Forbidden` response will trigger an automatic state-clearing logout.

### 1.3 Standard Error Payload
All non-2xx responses must return a standardized JSON error envelope:
```json
{
  "error": "Short error code or summary",
  "message": "Human-readable description of what went wrong.",
  "timestamp": "2026-07-18T00:05:44Z",
  "details": [
    {
      "path": "vehicleInfo.vin",
      "message": "VIN must be exactly 17 characters"
    }
  ]
}
```

---

## 🔑 2. Authentication API (`/auth`)

### 2.1 Authenticate User (Login)
* **Endpoint:** `POST /auth/login`
* **Request Headers:** `Content-Type: application/json`
* **Request Payload:**
  ```json
  {
    "email": "admin@showora.com",
    "password": "strongPassword123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
  *(Note: The frontend decodes the JWT payload to extract `id`, `name`, `email`, and `role` to populate user store).*

### 2.2 Invalidate Session (Logout)
* **Endpoint:** `POST /auth/logout`
* **Request Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully."
  }
  ```

---

## 📊 3. Dashboard API (`/dashboard`)

### 3.1 Fetch Dashboard Metrics
* **Endpoint:** `GET /dashboard/metrics`
* **Request Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):**
  ```json
  {
    "totalRevenue": 2450000.00,
    "revenueTrend": 12.5,
    "bikesSold": 48,
    "bikesSoldTrend": 8.3,
    "activeCustomers": 182,
    "activeCustomersTrend": 4.2,
    "pendingInvoices": 14,
    "recentSales": [
      {
        "id": "sale_1",
        "customerName": "Rohan Sharma",
        "customerEmail": "rohan@example.com",
        "bikeModel": "Dominar 400",
        "amount": 230000.00,
        "date": "2026-07-17T10:15:30Z"
      }
    ],
    "revenueByMonth": [
      { "name": "Jan", "total": 1200000.00 },
      { "name": "Feb", "total": 1450000.00 }
    ]
  }
  ```

---

## 📦 4. Inventory Management API (`/inventory`)

### 4.1 Fetch Inventory Vehicles
* **Endpoint:** `GET /inventory`
* **Query Parameters:**
  * `status` (optional): `Available` | `Reserved` | `Allocated` | `Sold` | `Delivered` | `In Transit` | `Under Service` | `Returned`
  * `location` (optional): `Showroom` | `Warehouse` | `Branch`
  * `search` (optional): string (VIN, Make, Model, Variant)
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": "inv_1",
      "make": "Bajaj",
      "model": "Dominar 400",
      "variant": "UG Black",
      "color": "Aurora Green",
      "fuelType": "Petrol",
      "transmission": "Manual",
      "manufacturingYear": 2026,
      "vin": "ME3BR999928374921",
      "engineNumber": "DMNR-928347",
      "chassisNumber": "CHS-88374289",
      "supplier": "Bajaj Auto Ltd",
      "purchaseDate": "2026-05-15T00:00:00Z",
      "purchaseOrderNumber": "PO-2026-1029",
      "invoiceNumber": "SUP-INV-9921",
      "purchaseCost": 195000.00,
      "gstAmount": 35100.00,
      "mrp": 240000.00,
      "sellingPrice": 230000.00,
      "roadTax": 23000.00,
      "accessoriesCost": 4500.00,
      "status": "Available",
      "location": "Showroom",
      "rackOrBin": "Row A - Rack 3",
      "daysInInventory": 64,
      "warrantyInfo": "5 Years Extended Warranty",
      "allocation": null,
      "movementHistory": [
        {
          "id": "mv_1",
          "date": "2026-05-16T10:00:00Z",
          "type": "Received",
          "user": "System Admin",
          "toLocation": "Warehouse",
          "notes": "Initial receipt at Warehouse"
        }
      ],
      "serviceHistory": [],
      "documents": [],
      "timeline": []
    }
  ]
  ```

### 4.2 Fetch Single Vehicle
* **Endpoint:** `GET /inventory/:id`
* **Success Response (200 OK):** Returns single `InventoryVehicle` JSON object as structured in `GET /inventory`.

### 4.3 Fetch Inventory Metrics
* **Endpoint:** `GET /inventory/metrics`
* **Success Response (200 OK):**
  ```json
  {
    "totalVehicles": 125,
    "availableStock": 82,
    "reservedStock": 18,
    "deliveredToday": 4,
    "lowStockModels": 3,
    "incomingStock": 15,
    "inventoryValue": 24500000.00,
    "averageInventoryAge": 28.5,
    "monthlyStockMovement": 42
  }
  ```

### 4.4 Receive Inventory (Add Vehicle)
* **Endpoint:** `POST /inventory`
* **Request Payload:**
  ```json
  {
    "supplierInfo": {
      "supplier": "Bajaj Auto Ltd",
      "purchaseOrderNumber": "PO-2026-1029",
      "purchaseDate": "2026-07-18T00:00:00.000Z",
      "invoiceNumber": "SUP-INV-9921"
    },
    "vehicleInfo": {
      "make": "Bajaj",
      "model": "Dominar 400",
      "variant": "UG Black",
      "color": "Charcoal Grey",
      "vin": "ME3BR999928374921",
      "engineNumber": "DMNR-928347",
      "chassisNumber": "CHS-88374289",
      "manufacturingYear": 2026,
      "fuelType": "Petrol",
      "transmission": "Manual"
    },
    "pricing": {
      "purchaseCost": 195000.00,
      "gstAmount": 35100.00,
      "mrp": 240000.00,
      "sellingPrice": 230000.00,
      "roadTax": 23000.00,
      "accessoriesCost": 4500.00
    },
    "locationInfo": {
      "location": "Warehouse",
      "rackOrBin": "Rack B3",
      "storageNotes": "Received without damage"
    }
  }
  ```
* **Success Response (201 Created):** Returns the newly generated `InventoryVehicle` object containing backend generated `id`, `movementHistory` with `'Received'` event type, and `timeline`.

### 4.5 Transfer Vehicle Location
* **Endpoint:** `POST /inventory/:id/transfer`
* **Request Payload:**
  ```json
  {
    "toLocation": "Showroom",
    "notes": "Moving to display area"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Vehicle transfer successfully logged."
  }
  ```

---

## 👥 5. Customer Management API (`/customers`)

### 5.1 Fetch Customer List
* **Endpoint:** `GET /customers`
* **Query Parameters:**
  * `status` (optional): `active` | `inactive` | `lead`
  * `search` (optional): name, email, or phone matching string
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": "cust_1",
      "firstName": "Amit",
      "lastName": "Razz",
      "email": "amit@example.com",
      "phone": "+91 9999888877",
      "dob": "1994-08-15",
      "gender": "male",
      "address": {
        "line1": "123 Green Avenue, Sector 4",
        "city": "Gurugram",
        "state": "Haryana",
        "pincode": "122001"
      },
      "panNumber": "ABCDE1234F",
      "aadharNumber": "123456789012",
      "drivingLicense": "DL-9928347182",
      "gstNumber": "06ABCDE1234F1Z5",
      "finance": {
        "required": true,
        "company": "HDFC Bank",
        "loanAmount": 150000.00,
        "emi": 4800.00,
        "tenureMonths": 36,
        "downPayment": 50000.00,
        "status": "approved"
      },
      "status": "active",
      "customerSince": "2026-01-10T14:30:00Z",
      "salesExecutive": "Rajesh Kumar",
      "leadSource": "Direct Walk-in",
      "tags": ["Premium", "Financed"],
      "totalPurchases": 1,
      "lifetimeValue": 230000.00,
      "outstandingAmount": 0.00,
      "purchases": [],
      "payments": [],
      "documents": [],
      "notes": [],
      "timeline": []
    }
  ]
  ```

### 5.2 Fetch Customer By ID
* **Endpoint:** `GET /customers/:id`
* **Success Response (200 OK):** Detailed `Customer` entity including nested arrays (`purchases`, `payments`, `documents`, `notes`, `timeline`).

### 5.3 Fetch Customer Metrics
* **Endpoint:** `GET /customers/metrics`
* **Success Response (200 OK):**
  ```json
  {
    "totalCustomers": 450,
    "activeCustomers": 312,
    "newThisMonth": 48,
    "outstandingAmount": 425000.00,
    "totalRevenue": 9850000.00,
    "repeatCustomers": 18
  }
  ```

### 5.4 Create Customer Profile
* **Endpoint:** `POST /customers`
* **Request Payload:**
  ```json
  {
    "basic": {
      "firstName": "Amit",
      "lastName": "Razz",
      "email": "amit@example.com",
      "phone": "+91 9999888877",
      "dob": "1994-08-15",
      "gender": "male"
    },
    "address": {
      "line1": "123 Green Avenue, Sector 4",
      "city": "Gurugram",
      "state": "Haryana",
      "pincode": "122001"
    },
    "identity": {
      "panNumber": "ABCDE1234F",
      "aadharNumber": "123456789012",
      "drivingLicense": "DL-9928347182",
      "gstNumber": "06ABCDE1234F1Z5"
    },
    "finance": {
      "required": true,
      "company": "HDFC Bank",
      "loanAmount": 150000.00,
      "emi": 4800.00,
      "tenureMonths": 36,
      "downPayment": 50000.00
    },
    "additional": {
      "salesExecutive": "Rajesh Kumar",
      "leadSource": "Direct Walk-in",
      "tags": ["Premium"],
      "internalNotes": "Customer requested delivery by next Friday."
    }
  }
  ```
* **Success Response (201 Created):** Returns complete, generated `Customer` object.

### 5.5 Update Customer Details
* **Endpoint:** `PATCH /customers/:id`
* **Request Payload:** A JSON partial containing fields to update.
* **Success Response (200 OK):** Returns the fully updated `Customer` record.

---

## 🛒 6. Purchase (Supplier Procurement) API (`/purchases`)

### 6.1 Fetch Purchase Orders (PO)
* **Endpoint:** `GET /purchases`
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": "po_1",
      "poNumber": "PO-2026-004",
      "orderDate": "2026-07-10T12:00:00Z",
      "expectedDelivery": "2026-07-25T00:00:00Z",
      "status": "Ordered",
      "supplierId": "sup_1",
      "supplierName": "Bajaj Auto Distributing",
      "items": [
        {
          "id": "pi_1",
          "make": "Bajaj",
          "model": "Pulsar NS200",
          "variant": "Standard",
          "color": "Pewter Grey",
          "quantityOrdered": 10,
          "quantityReceived": 0,
          "unitCost": 125000.00,
          "totalCost": 1250000.00
        }
      ],
      "subtotal": 1250000.00,
      "discount": 25000.00,
      "gstAmount": 220500.00,
      "transportation": 15000.00,
      "insurance": 8500.00,
      "otherCharges": 0.00,
      "grandTotal": 1469000.00,
      "paymentTerms": "Net 30",
      "paymentStatus": "Partially Paid",
      "amountPaid": 500000.00,
      "outstandingAmount": 969000.00,
      "payments": [
        {
          "id": "pay_po_1",
          "date": "2026-07-11T16:00:00Z",
          "amount": 500000.00,
          "method": "Bank Transfer",
          "referenceId": "TXN-99882233",
          "status": "Completed"
        }
      ],
      "warehouse": "Main Warehouse",
      "deliveryNotes": "Forklift assistance requested.",
      "createdBy": "Finance Manager",
      "timeline": []
    }
  ]
  ```

### 6.2 Fetch Single Purchase Order
* **Endpoint:** `GET /purchases/:id`
* **Success Response (200 OK):** Detailed `PurchaseOrder` structure.

### 6.3 Fetch Purchase Metrics
* **Endpoint:** `GET /purchases/metrics`
* **Success Response (200 OK):**
  ```json
  {
    "totalOrders": 32,
    "pendingDeliveries": 4,
    "receivedThisMonth": 18,
    "outstandingPayments": 1250000.00,
    "totalPurchaseValue": 45600000.00,
    "inventoryAdded": 180,
    "averageProcurementCost": 142000.00,
    "activeSuppliers": 6
  }
  ```

### 6.4 Create Purchase Order
* **Endpoint:** `POST /purchases`
* **Request Payload:**
  ```json
  {
    "supplier": {
      "supplierId": "sup_1",
      "terms": "Net 30"
    },
    "items": [
      {
        "make": "Bajaj",
        "model": "Pulsar NS200",
        "variant": "Standard",
        "color": "Pewter Grey",
        "quantityOrdered": 10,
        "unitCost": 125000.00
      }
    ],
    "pricing": {
      "subtotal": 1250000.00,
      "discount": 25000.00,
      "gstAmount": 220500.00,
      "transportation": 15000.00,
      "insurance": 8500.00,
      "otherCharges": 0.00
    },
    "payment": {
      "terms": "Net 30",
      "method": "Bank Transfer",
      "advancePayment": 500000.00,
      "referenceId": "TXN-99882233"
    },
    "delivery": {
      "expectedDeliveryDate": "2026-07-25T00:00:00Z",
      "warehouse": "Main Warehouse",
      "notes": "Verify battery status on delivery."
    }
  }
  ```
* **Success Response (201 Created):** Returns generated `PurchaseOrder` record.

---

## 💰 7. Sales (Deals & Bookings) API (`/sales`)

### 7.1 Fetch Sales Records
* **Endpoint:** `GET /sales`
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": "sale_1",
      "invoiceNumber": "INV-2026-0043",
      "saleDate": "2026-07-16T11:45:00Z",
      "status": "Ready For Delivery",
      "customerId": "cust_1",
      "customerName": "Amit Razz",
      "customerPhone": "+91 9999888877",
      "inventoryId": "inv_1",
      "vehicleMake": "Bajaj",
      "vehicleModel": "Dominar 400",
      "vehicleVariant": "UG Black",
      "vehicleColor": "Aurora Green",
      "vin": "ME3BR999928374921",
      "salesExecutive": "Rajesh Kumar",
      "branch": "Main Showroom",
      "basePrice": 195000.00,
      "accessoriesPrice": 4500.00,
      "registrationTax": 1200.00,
      "roadTax": 23000.00,
      "insurance": 8500.00,
      "gstAmount": 35100.00,
      "discount": 5000.00,
      "exchangeBonus": 0.00,
      "grandTotal": 262300.00,
      "totalPaid": 262300.00,
      "outstandingBalance": 0.00,
      "profitMargin": 34500.00,
      "payments": [
        {
          "id": "pay_sale_1",
          "date": "2026-07-16T11:50:00Z",
          "amount": 262300.00,
          "method": "UPI",
          "referenceId": "UPI-9922881177",
          "status": "Completed"
        }
      ],
      "finance": {
        "required": false
      },
      "delivery": {
        "expectedDate": "2026-07-20T17:00:00Z",
        "executive": "Suresh Dev",
        "status": "Scheduled",
        "checklistCompleted": false,
        "notes": "Customer requested ribbon decoration."
      },
      "timeline": []
    }
  ]
  ```

### 7.2 Fetch Single Sale Deal
* **Endpoint:** `GET /sales/:id`
* **Success Response (200 OK):** Returns single `SalesRecord` JSON model.

### 7.3 Fetch Sales KPI Metrics
* **Endpoint:** `GET /sales/metrics`
* **Success Response (200 OK):**
  ```json
  {
    "todaysSales": 6,
    "todaysRevenue": 1420000.00,
    "monthlyRevenue": 42800000.00,
    "unitsSold": 154,
    "pendingDeliveries": 18,
    "pendingPayments": 12,
    "financePending": 8,
    "averageDealValue": 278000.00,
    "totalProfit": 6420000.00
  }
  ```

### 7.4 Create Sales Transaction
* **Endpoint:** `POST /sales`
* **Request Payload:**
  ```json
  {
    "customer": {
      "customerId": "cust_1",
      "isNewCustomer": false
    },
    "vehicle": {
      "inventoryId": "inv_1",
      "reserveVehicle": true
    },
    "pricing": {
      "basePrice": 195000.00,
      "accessoriesPrice": 4500.00,
      "registrationTax": 1200.00,
      "roadTax": 23000.00,
      "insurance": 8500.00,
      "gstAmount": 35100.00,
      "discount": 5000.00,
      "exchangeBonus": 0.00
    },
    "payment": {
      "method": "UPI",
      "initialPaymentAmount": 262300.00,
      "referenceId": "UPI-9922881177"
    },
    "finance": {
      "required": false
    },
    "delivery": {
      "expectedDate": "2026-07-20T17:00:00Z",
      "executive": "Suresh Dev",
      "notes": "Ribbon requested."
    }
  }
  ```
* **Success Response (201 Created):** Returns generated `SalesRecord` block.

---

## 🧾 8. Invoice Management API (`/invoices`)

### 8.1 Fetch Tax Invoices
* **Endpoint:** `GET /invoices`
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": "inv_rec_1",
      "invoiceNumber": "INV-2026-1029",
      "invoiceDate": "2026-07-16",
      "dueDate": "2026-07-16",
      "status": "Paid",
      "saleId": "sale_1",
      "customerId": "cust_1",
      "customerName": "Amit Razz",
      "customerPhone": "+91 9999888877",
      "customerAddress": "123 Green Avenue, Sector 4, Gurugram, Haryana",
      "inventoryId": "inv_1",
      "vehicleMake": "Bajaj",
      "vehicleModel": "Dominar 400",
      "vehicleVariant": "UG Black",
      "vehicleColor": "Aurora Green",
      "vin": "ME3BR999928374921",
      "engineNumber": "DMNR-928347",
      "salesExecutive": "Rajesh Kumar",
      "branch": "Main Showroom",
      "basePrice": 195000.00,
      "accessoriesPrice": 4500.00,
      "registrationTax": 1200.00,
      "insurance": 8500.00,
      "otherCharges": 0.00,
      "discount": 5000.00,
      "taxableAmount": 194500.00,
      "cgstRate": 14.0,
      "cgstAmount": 27230.00,
      "sgstRate": 14.0,
      "sgstAmount": 27230.00,
      "totalGst": 54460.00,
      "grandTotal": 262300,
      "amountPaid": 262300.00,
      "outstandingAmount": 0.00,
      "payments": [
        {
          "id": "pay_inv_1",
          "date": "2026-07-16T11:50:00Z",
          "amount": 262300.00,
          "method": "UPI",
          "referenceId": "UPI-9922881177",
          "status": "Completed"
        }
      ],
      "timeline": []
    }
  ]
  ```

### 8.2 Fetch Single Invoice Details
* **Endpoint:** `GET /invoices/:id`
* **Success Response (200 OK):** Detailed `InvoiceRecord` entity.

### 8.3 Fetch Invoice Statistics
* **Endpoint:** `GET /invoices/metrics`
* **Success Response (200 OK):**
  ```json
  {
    "totalInvoices": 182,
    "invoicesThisMonth": 46,
    "paidAmount": 42500000.00,
    "outstandingAmount": 820000.00,
    "overdueInvoices": 5,
    "averageInvoiceValue": 245000.00,
    "gstCollected": 7820000.00,
    "todaysBilling": 640000.00
  }
  ```

### 8.4 Generate Tax Invoice
* **Endpoint:** `POST /invoices`
* **Request Payload:**
  ```json
  {
    "sale": {
      "saleId": "sale_1"
    },
    "metadata": {
      "invoiceDate": "2026-07-18",
      "dueDate": "2026-07-18",
      "salesExecutive": "Rajesh Kumar",
      "branch": "Main Showroom"
    },
    "pricing": {
      "basePrice": 195000.00,
      "accessoriesPrice": 4500.00,
      "registrationTax": 1200.00,
      "insurance": 8500.00,
      "otherCharges": 0.00,
      "discount": 5000.00,
      "gstRate": 28.0
    },
    "payment": {
      "method": "UPI",
      "amountPaid": 262300.00,
      "referenceId": "UPI-9922881177"
    }
  }
  ```
* **Success Response (201 Created):** Returns generated `InvoiceRecord` containing CGST/SGST breakdowns and round-offs.

---

## 💳 9. Expense Management API (`/expenses`)

### 9.1 Fetch Expense List
* **Endpoint:** `GET /expenses`
* **Success Response (200 OK):**
  ```json
  [
    {
      "id": "exp_1",
      "expenseId": "EXP-2026-0812",
      "title": "Showroom Electricity Bill - June",
      "category": "Utilities",
      "vendor": "State Electricity Board",
      "description": "Electricity charges for sector 4 showroom.",
      "branch": "Main Showroom",
      "status": "Approved",
      "paymentStatus": "Paid",
      "expenseDate": "2026-07-05",
      "dueDate": "2026-07-20",
      "createdBy": "Operations Exec",
      "subtotal": 12000.00,
      "gstAmount": 2160.00,
      "discount": 0.00,
      "totalAmount": 14160.00,
      "paidAmount": 14160.00,
      "outstandingAmount": 0.00,
      "payments": [
        {
          "id": "pay_exp_1",
          "date": "2026-07-06T11:00:00Z",
          "amount": 14160.00,
          "method": "Bank Transfer",
          "referenceId": "TXN-77665511",
          "status": "Completed"
        }
      ],
      "timeline": [],
      "hasReceipts": true,
      "isRecurring": true,
      "recurringFrequency": "Monthly"
    }
  ]
  ```

### 9.2 Fetch Expense Statistics
* **Endpoint:** `GET /expenses/metrics`
* **Success Response (200 OK):**
  ```json
  {
    "totalExpenses": 84,
    "todaysExpenses": 0.00,
    "monthlyExpenses": 182000.00,
    "pendingApproval": 3,
    "pendingPaymentAmount": 34000.00,
    "activeRecurring": 6,
    "monthlyBudget": 250000.00,
    "budgetUtilization": 72.8,
    "averageDailyExpense": 6066.66
  }
  ```

### 9.3 Draft / Log Expense
* **Endpoint:** `POST /expenses`
* **Request Payload:**
  ```json
  {
    "info": {
      "title": "Showroom Electricity Bill - June",
      "category": "Utilities",
      "vendor": "State Electricity Board",
      "description": "June commercial charges.",
      "branch": "Main Showroom",
      "expenseDate": "2026-07-05",
      "isRecurring": true,
      "recurringFrequency": "Monthly"
    },
    "amount": {
      "subtotal": 12000.00,
      "gstAmount": 2160.00,
      "discount": 0.00
    },
    "payment": {
      "dueDate": "2026-07-20",
      "paidAmount": 14160.00,
      "method": "Bank Transfer",
      "referenceId": "TXN-77665511"
    }
  }
  ```
* **Success Response (201 Created):** Returns generated `ExpenseRecord` object.

---

## 📈 10. Reports & Analytics API (`/reports`)

### 10.1 Fetch KPI Panel Summary
* **Endpoint:** `GET /reports/kpis`
* **Query Parameters:** Supports `FilterState` query params (`dateRange`, `branch`, `brand`, `salesExecutive`).
* **Success Response (200 OK):**
  ```json
  {
    "revenue": 42800000.00,
    "revenueGrowth": 14.2,
    "profit": 6420000.00,
    "profitGrowth": 11.5,
    "unitsSold": 154,
    "unitsSoldGrowth": 8.9,
    "inventoryValue": 24500000.00,
    "outstandingPayments": 820000.00,
    "expenses": 182000.00,
    "expenseGrowth": -4.2,
    "netProfit": 6238000.00,
    "netProfitMargin": 14.57,
    "averageDealValue": 278000.00,
    "customerGrowth": 12.3,
    "repeatCustomers": 18,
    "gstCollected": 7820000.00,
    "gstPaid": 4250000.00
  }
  ```

### 10.2 Charts & Distributions Endpoints
Each of these endpoints returns timeseries or category breakdown matrices:

* **`GET /reports/revenue-trend`**
  * *Response:* `Array<{ date: string, revenue: number, profit: number, expenses: number }>`
* **`GET /reports/sales-by-model`**
  * *Response:* `Array<{ name: string, value: number }>`
* **`GET /reports/inventory-distribution`**
  * *Response:* `Array<{ name: string, value: number }>`
* **`GET /reports/expense-categories`**
  * *Response:* `Array<{ name: string, value: number }>`
* **`GET /reports/sales-executives`**
  * *Response:* `Array<{ name: string, revenue: number, units: number, target: number }>`
* **`GET /reports/inventory-health`**
  * *Response:* `Array<{ model: string, available: number, reserved: number, allocated: number }>`
* **`GET /reports/insights`**
  * *Response:* `Array<{ id: string, type: "success"|"warning"|"info"|"danger", title: string, description: string, metric?: string }>`
* **`GET /reports/customer-acquisition`**
  * *Response:* `Array<{ date: string, sales: number, target: number }>`
* **`GET /reports/supplier-performance`**
  * *Response:* `Array<{ name: string, value: number }>`
* **`GET /reports/tax-register`**
  * *Response:* Returns listing of taxable GST sales transactions and GST input credit tax logs.

---

## ⚙️ 11. Settings & Policy API (`/settings`)

### 11.1 General Settings
* **`GET /settings/general`** -> Returns `GeneralSettings` object.
* **`PATCH /settings/general`** -> Updates general configuration.

### 11.2 Legal Organization settings
* **`GET /settings/organization`** -> Returns `OrganizationSettings` containing company GST, PAN, and contact details.
* **`PATCH /settings/organization`** -> Updates corporate configuration details.

### 11.3 Preferences and Theme settings
* **`GET /settings/notifications`** -> Returns `NotificationPreferences` settings.
* **`PATCH /settings/notifications`** -> Updates notification preferences.
* **`GET /settings/appearance`** -> Returns `AppearanceConfig` theme configuration settings.
* **`PATCH /settings/appearance`** -> Updates appearance configurations.

### 11.4 Branches & Team members (Admin only)
* **`GET /settings/branches`**
  * *Response:*
    ```json
    [
      {
        "id": "branch_1",
        "name": "Main Showroom",
        "manager": "Sanjay Verma",
        "phone": "+91 9999111222",
        "email": "showroom.main@showora.com",
        "address": "Sector 4, Gurugram, Haryana",
        "status": "active",
        "createdAt": "2026-01-01T00:00:00Z"
      }
    ]
    ```
* **`GET /settings/users`**
  * *Response:*
    ```json
    [
      {
        "id": "user_1",
        "name": "Rajesh Kumar",
        "email": "rajesh@showora.com",
        "role": "Sales Executive",
        "branch": "Main Showroom",
        "status": "active",
        "lastActive": "2026-07-17T18:20:00Z"
      }
    ]
    ```

### 11.5 Audit & Activity Logs
* **`GET /settings/audit-logs`**
  * *Response:*
    ```json
    [
      {
        "id": "audit_1",
        "user": "Rajesh Kumar",
        "action": "Created Customer Profile (cust_1)",
        "module": "Customers",
        "timestamp": "2026-07-17T18:15:30Z",
        "ipAddress": "192.168.1.42"
      }
    ]
    ```
