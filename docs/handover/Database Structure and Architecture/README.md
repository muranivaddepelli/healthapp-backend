# Database Structure and Architecture — Technical Handover

## 1. Overview
This project uses **MongoDB** with **Mongoose** schemas.

Database setup:
- Connection: `src/config/db.js` uses `process.env.MONGO_URI`.

## 2. Mongoose Model Architecture
Models exist under `src/models/*`.

> Note: MongoDB does not use SQL-style stored procedures. If your original requirement expects stored procedures, this backend does not appear to define any.

## 3. Model Inventory
Documented from the repository file list:
- `User` (`src/models/User.js`)
- `Admin`, `Doctor`, `Frontdesk`, `Lab`, `Phlebotomist`, `Hospital`, `Address`, etc.
- Domain order models:
  - `Cart`, `Appointment`
  - `DiagnosticOrder`, `LabOrder`, `LabReport`
  - `Prescription`, `DoctorPrescription`
  - `PharmacyCart`, `PharmacyOrder`, `Wallet`, `WalletTransaction`
- Scheduling models:
  - `DoctorAvailability`, `DoctorException`, `DoctorEvent`
  - `TestSlot`
  - `LabAvailability`

## 4. Relationships and Populates
Controllers commonly use `.populate()` to link references, e.g.:
- appointments populate doctor/hospital
- orders populate medicine/test/slot

## 5. Stored Procedures
- Not applicable for MongoDB/Mongoose in this repository.

## 6. Versioning
Mongoose version: `^9.2.4`.

## 7. Next steps for complete table mapping
For a fully “A-to-Z” database table/field mapping, we should iterate through each model file and generate a field-by-field schema map.

