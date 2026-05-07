# Backend API Endpoints Catalog (Starter)

> This is a starter catalog. Full endpoint-wise request/response/status-code documentation requires deeper extraction from each controller.

Base path:
- `GET/POST/PUT/PATCH/DELETE http(s)://<HOST>/api`

## 1) Auth
### POST `/api/auth/signup`
**Auth**: none

### POST `/api/auth/verify-otp`

### POST `/api/auth/login`

### POST `/api/auth/forgot-password`

### POST `/api/auth/verify-reset-otp`

### POST `/api/auth/reset-password`

### POST `/api/auth/resend-otp`

### POST `/api/auth/logout`

### POST `/api/auth/refresh-token`
**Body**:
- `refreshToken` (string)

## 2) Users (Patient-side)
Base: `/api/users`

- `GET /profile`
- `PUT /profile`
- `PUT /upload-photo` (multipart/form-data)
- `DELETE /profile-photo`

- `GET /hospitals/nearby/:addressId`
- `GET /doctors?specialization&location&type`
- `GET /doctors/:doctorId`
- `GET /doctors/:doctorId/slots?date=`

- Cart:
  - `POST /cart`
  - `GET /cart`
  - `PATCH /cart/:id/quantity`
  - `DELETE /cart/:id`

- Checkout:
  - `POST /checkout`

- Appointments:
  - `GET /appointments`

- Diagnostic:
  - `GET /diagnostic/tests?type=`
  - `GET /diagnostic/slots?testId&mode&date=`

- Medicines:
  - `GET /medicines?search=`

- Pharmacy cart/order:
  - `POST /pharmacy/cart`
  - `GET /pharmacy/cart`
  - `POST /pharmacy/checkout`

- Reviews:
  - `POST /review`

- Prescriptions upload/view:
  - `POST /pharmacy/prescription` (multipart file upload)
  - `GET /prescription/:id/view`

- Patient search:
  - `GET /patients/search?query=`

- Wallet:
  - `GET /wallet`
  - `GET /wallet/transactions?type=`

- Clinics:
  - `GET /clinics`

- Bills/reports:
  - `GET /pharmacy-bills`
  - `GET /prescriptions`
  - `GET /bills`
  - `GET /reports?type=`
  - `GET /pharmacy-bill/:id`
  - `GET /pharmacy-bill/:id/download`
  - `GET /orders?type=`

## 3) Doctor portal
Base: `/api/doctor`

- `POST /login`
- `POST /logout`

- Availability:
  - `POST /availability`
  - `GET /availability`
  - `DELETE /availability/:id`

- Exceptions:
  - `POST /exceptions`
  - `GET /exceptions`
  - `DELETE /exceptions/:id`

- Slots:
  - `GET /doctors/:doctorId/slots`

- Appointments/Calendar:
  - `GET /appointments`
  - `GET /dashboard`
  - `POST /events`
  - `GET /calendar`
  - `GET /calendar/events?startDate&endDate=`
  - `GET /upcoming`

- Patient & Rx:
  - `GET /patients/search?search=`
  - `GET /patient/:id`
  - `GET /patient/:id/prescriptions`
  - `POST /prescription`
  - `GET /patient/:id/header`
  - `GET /patient/:id/current-rx`
  - `GET /patient/:id/files`

## 4) Lab portal
Base: `/api/lab`

- `POST /login`
- `POST /lab-availability`
- `GET /`
- `POST /logout`
- `POST /tests` (upload image)
- `POST /slots`
- `GET /dashboard-stats`
- `GET /orders`
- `GET /orders/:id`
- `PUT /update-status`
- `POST /upload-report` (upload file)
- `GET /report/:orderId`
- `GET /patients`
- `GET /patients/:patientId/reports`
- `PUT /update-report/:orderId` (upload report file)
- `GET /report/view/:orderId`
- `GET /report/download/:orderId`

## 5) Front Desk portal
Base: `/api/frontdesk`

- Partial routes exist; full enumeration depends on scanning `src/modules/frontdesk/frontdesk.routes.js` and controller.

## 6) Admin portal
Base: `/api/admin`

- `POST /login`
- `POST /logout`

- Hospitals CRUD:
  - `POST /hospitals`
  - `GET /hospitals`
  - `GET /hospitals/:id`
  - `PUT /hospitals/:id`
  - `DELETE /hospitals/:id`

- Doctors CRUD:
  - `POST /doctors`
  - `GET /doctors`
  - `GET /doctors/:id`
  - `PUT /doctors/:id`
  - `DELETE /doctors/:id`

- Frontdesks CRUD:
  - `POST /frontdesks`
  - `GET /frontdesks`
  - `GET /frontdesks/:id`
  - `PUT /frontdesks/:id`
  - `DELETE /frontdesks/:id`

- Pharmacies CRUD:
  - `POST /pharmacies`
  - `GET /pharmacies`
  - `GET /pharmacies/:id`
  - `PUT /pharmacies/:id`
  - `DELETE /pharmacies/:id`

- Labs CRUD:
  - `POST /labs`
  - `GET /labs`
  - `GET /labs/:id`
  - `PUT /labs/:id`
  - `DELETE /labs/:id`

## 7) EMR
Base: `/api/emr`

- `GET /prescriptions`
- `GET /prescriptions/:id`
- `GET /reports`
- `GET /pharmacy-bills`
- `GET /bills`
- `POST /reports/upload` (upload file)
- `POST /prescriptions/upload` (upload file)

## 8) Addresses
Base: `/api/addresses`

- `POST /`
- `GET /`
- `GET /:id`
- `PUT /:id`
- `DELETE /:id`

