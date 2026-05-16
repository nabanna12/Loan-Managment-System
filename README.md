# LMS Backend — Setup Guide

## 1. Install dependencies
```
npm install
```

## 2. Configure .env
Edit the .env file — your MongoDB URI is already filled in.
If your password contains special chars, URL-encode @ as %40.

## 3. Seed the database
```
npm run seed
```

## 4. Start the server
```
npm run dev
```

## Login Credentials
| Role         | Email                | Password       |
|--------------|----------------------|----------------|
| Admin        | admin@lms.com        | Admin@123      |
| Sales        | sales@lms.com        | Sales@123      |
| Sanction     | sanction@lms.com     | Sanction@123   |
| Disbursement | disburse@lms.com     | Disburse@123   |
| Collection   | collection@lms.com   | Collection@123 |
| Borrower     | borrower@lms.com     | Borrower@123   |
