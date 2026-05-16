# Loan Management System (LMS)

A full-stack Loan Management System built with Next.js, TypeScript, Express.js, and MongoDB.  
It supports borrower onboarding, BRE eligibility checks, salary slip upload, loan approval workflow, disbursement tracking, payment collection, and role-based dashboard access.

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

## Features

- Borrower sign up and login
- BRE eligibility check
- Salary slip upload
- Loan amount and tenure selection
- Live simple interest calculation
- Loan lifecycle tracking
- Role-based dashboard access for:
  - Admin
  - Sales
  - Sanction
  - Disbursement
  - Collection
  - Borrower
- Payment recording with unique UTR
- Auto-close loan after full repayment

---

## Project Flow

1. Borrower signs up / logs in
2. Enters personal details
3. BRE runs on server
4. Uploads salary slip
5. Selects loan amount and tenure
6. Loan is created with pending/applied status
7. Sanction executive approves or rejects
8. Disbursement executive marks loan as disbursed
9. Collection executive records payment
10. Loan auto-closes after full repayment

---

## Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
Create a `.env` file using `backend/.env.example`.

### 3. Seed the database
```bash
npm run seed
```

### 4. Start the backend server
```bash
npm run dev
```

---

## Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure environment
Create a `.env.local` file using `frontend/.env.example`.

### 3. Start the frontend
```bash
npm run dev
```

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.com | Admin@123 |
| Sales | sales@lms.com | Sales@123 |
| Sanction | sanction@lms.com | Sanction@123 |
| Disbursement | disburse@lms.com | Disburse@123 |
| Collection | collection@lms.com | Collection@123 |
| Borrower | borrower@lms.com | Borrower@123 |

---

## Submission Items

- GitHub Repository
- Working demo video
- Login credentials for all roles