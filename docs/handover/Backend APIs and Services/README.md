# Backend APIs and Services — Technical Handover

## 1. Overview
This backend is a Node.js + Express + Mongoose REST API that powers multiple roles in a healthcare scheduling/orders ecosystem (patients/users, doctors, labs, front desk, admin, pharmacy, etc.).

Base URL:
- `http://<HOST>:<PORT>/api`

## 2. Architecture Overview
### 2.1 High-level layering
- **Routes**: define HTTP endpoints per module
- **Controllers**: validate/transform request and call services
- **Services**: business logic (orchestration)
- **Repositories**: data access abstraction (when present)
- **Models**: Mongoose schemas/collections
- **Middleware**: auth, role checks, uploads, error handling

### 2.2 Middleware pipeline
1. `cors()`
2. `express.json()`
3. Route modules under `/api`
4. `src/middleware/errorHandler.js`

## 3. Technology Stack
- Node.js
- Express (v5)
- Mongoose
- JWT (`jsonwebtoken`)
- Multer + Cloudinary for file uploads
- PDFKit for PDF generation
- Axios for HTTP calls (including OpenFDA service if enabled)

## 4. Environment Setup
### 4.1 Required environment variables
Create `.env` at project root:
- `PORT` (optional; default 5000)
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_SECRET` (for staff JWT uses same key)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 4.2 Dev run
- `npm run dev`

### 4.3 Build & deployment
- `npm run start`

## 5. Authentication & Authorization
### 5.1 JWT access tokens
- Middleware: `src/middleware/authMiddleware.js`
- Header: `Authorization: Bearer <accessToken>`
- Token payload includes: `id`, `email`, `role`

### 5.2 Role authorization
- Middleware: `src/middleware/roleMiddleware.js`
- Enforces `req.user.role === <requiredRole>`

### 5.3 Refresh token flow
Endpoint:
- `POST /api/auth/refresh-token`

Flow:
1. Client sends `{ "refreshToken": "..." }`
2. Server verifies refresh token using `JWT_REFRESH_SECRET`
3. Server issues new access token via `generateAccessToken()`

### 5.4 OTP & password reset
Auth endpoints exist for:
- signup OTP verification
- forgot password OTP
- reset password OTP verification

(See Endpoint section for exact routes.)

## 6. Error Handling & Logging
### 6.1 Central error handler
`src/middleware/errorHandler.js`
- Logs via `console.error(err)`
- Returns JSON: `{ success:false, message:<err.message> }`

### 6.2 Controller-level handling
Many controllers implement `try/catch` and return:
- `status(err.statusCode || 400)` for auth-like flows
- `status(500)` for server errors

## 7. Third-party Integrations
- **Cloudinary**: profile photo, images, prescriptions, reports
- **Nodemailer**: OTP/email utilities (see `src/utils/sendEmail.js`, `src/utils/sendOtp.js`)
- **PDFKit**: PDF generation for downloads (e.g., pharmacy bills)
- **Axios + OpenFDA**: `services/openfda.service.js` (documented in detail below)

## 8. Backend Entry Routes & Modules
Mounted at `/api` in `src/routes/index.js`:
- `/auth` → `src/modules/auth/*`
- `/users` → `src/modules/users/*` (patient/user features)
- `/admin` → `src/modules/admin/*`
- `/doctor` → `src/modules/doctor/*`
- `/frontdesk` → `src/modules/frontdesk/*`
- `/lab` → `src/modules/lab/*`
- `/pharmacy` → `src/modules/pharmacy/*`
- `/addresses` → `src/modules/address/*`
- `/emr` → `src/modules/emr/*`

## 9. Endpoint-wise Documentation
> This section is expected to be expanded with full endpoint details (request/response samples, status codes, auth headers). The repository does contain route definitions, but automatic Swagger/OpenAPI is not present.

For maintainability, you should create a Postman collection from these routes (or extend docs manually).

### 9.1 Auth endpoints
Base: `POST /api/auth/*`
- `/signup`
- `/verify-otp`
- `/login`
- `/forgot-password`
- `/verify-reset-otp`
- `/reset-password`
- `/resend-otp`
- `/logout`
- `/refresh-token`

### 9.2 Users endpoints
Base: `/api/users/*`
Includes:
- profile: `GET /profile`, `PUT /profile`, upload/delete photo
- nearby hospitals, doctor search/details/slots
- cart, checkout, appointments
- diagnostic tests/slots
- medicines
- pharmacy cart + checkout
- reviews
- prescriptions upload/view
- wallet + transactions
- clinics
- bills + downloads

### 9.3 Doctor endpoints
Base: `/api/doctor/*`
Includes:
- `POST /login`, `POST /logout`
- availability: add/get/delete
- exceptions: add/get/delete
- slots
- appointments, dashboard
- events + calendar data
- patient search and prescriptions

### 9.4 Lab endpoints
Base: `/api/lab/*`
Includes:
- login/logout
- availability
- tests create (image upload)
- slots
- dashboard stats
- orders
- upload & update reports

### 9.5 Frontdesk endpoints
Base: `/api/frontdesk/*`
(Defined in `src/modules/frontdesk/frontdesk.routes.js`)

### 9.6 Admin endpoints
Base: `/api/admin/*`
Includes hospital, doctor, frontdesk, pharmacy CRUD.

### 9.7 Pharmacy endpoints
Base: `/api/pharmacy/*`
(Defined in `src/modules/pharmacy/pharmacy.routes.js`)

### 9.8 EMR endpoints
Base: `/api/emr/*`
Includes reports upload, prescriptions upload, and listing.

## 10. Development Notes / Known Documentation Gaps
- Automated Swagger/OpenAPI is not present.
- Endpoint-wise request/response samples require deeper extraction from controller methods.

Once all controllers are scanned, this file should be expanded into a full endpoint catalog.

