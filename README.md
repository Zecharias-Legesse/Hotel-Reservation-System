# Kereyu Hill Resort Hotel — Reservation System

A full-stack hotel reservation management system for Kereyu Hill Resort Hotel. Built with Spring Boot (backend) and Angular (frontend), styled to match the resort's brand.

---

## Features

**Guest**
- Browse and search rooms with filters (type, floor, capacity, price, status)
- Check room availability by date range
- Make, view, and cancel reservations
- Profile page — update name, username, email, and password
- Google sign-in via Firebase

**Admin**
- Dashboard with live stats (total rooms, available, occupied, pending)
- Approve, reject, check-in, and check-out reservations
- Assign reservations to guests
- Create guest accounts inline
- Add, edit, delete rooms and update room status

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.4.3 |
| Database | MySQL 8+ |
| Auth | JWT, Firebase Authentication |
| Frontend | Angular 19, Angular Material |
| Build | Maven |

---

## Getting Started

### Prerequisites
- Java 21
- MySQL 8+
- Node.js 18+ and Angular CLI
- Firebase project (for Google sign-in)

### Backend Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Zecharias-Legesse/Hotel-Reservation-System.git
   cd Hotel-Reservation-System
   ```

2. **Configure application.properties**
   ```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```
   Fill in your MySQL password and JWT secret.

3. **Add Firebase credentials**
   Place your `firebase-service-account.json` in `src/main/resources/`.

4. **Run the backend**
   ```bash
   ./mvnw spring-boot:run
   ```
   The API runs on `http://localhost:8080`.

   On first run, the app automatically creates:
   - `ROLE_CUSTOMER` and `ROLE_ADMIN` roles
   - Default admin account: `admin` / `admin123`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the frontend**
   ```bash
   ng serve
   ```
   Open `http://localhost:4200` in your browser.

---

## Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |

---

## Project Structure

```
HotelReservation/
├── src/main/java/com/kereyu/hotel/
│   ├── config/          # Security, Firebase, DataLoader
│   ├── controller/      # REST controllers
│   ├── dto/             # Request/Response DTOs
│   ├── model/           # JPA entities
│   ├── repository/      # Spring Data repositories
│   ├── security/        # JWT filter and utilities
│   └── service/         # Business logic
├── src/main/resources/
│   ├── application.properties.example
│   └── firebase-service-account.json  (not committed)
└── frontend/
    └── src/app/
        ├── components/  # Angular components
        ├── models/      # TypeScript interfaces
        ├── services/    # HTTP services
        ├── guards/      # Route guards
        └── interceptors/# HTTP interceptors
```

---

## Environment Variables / Secrets

The following files are excluded from git and must be created locally:

- `src/main/resources/application.properties` — database credentials and JWT secret
- `src/main/resources/firebase-service-account.json` — Firebase admin SDK credentials

See `application.properties.example` for the required format.
