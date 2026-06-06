# Product Requirements Document (PRD)

## 1. Project Overview

- **Name**: HT - Care (Inventory Management System)
- **Description**: A modern Inventory Management System integrating a web-based management dashboard.
- **Goal**: To streamline inventory operations by allowing business owners with real-time inventory management, specifically focused on Handy Talkies (HT).
- **Target Users**: Business owners, Admins, Operators.
- **Version**: v1.0.0-dev

## 2. Core Features

### 2.1 Dashboard
- Provides a high-level overview of HT inventory.
- Key metrics:
  - Total HT
  - Available in Warehouse (Tersedia di Gudang)
  - Currently Borrowed (Sedang Dipinjam)
  - Damaged HT (HT Rusak)
- Recent transaction logs showing HT ID, Borrower Name, Borrow Time, and Status.

### 2.2 Master Data HT
- Manage the core inventory of HT units.
- **Fields**: ID HT, Merk / Tipe, Kondisi (Baik, Rusak), Status (Tersedia, Dipinjam).
- **Actions**: Add new HT, View/Generate QR Code for HT, Edit HT details, Delete HT.
- Search and filtering functionality.

### 2.3 Master Data Peminjam (Borrowers)
- Manage personnel or departments that can borrow HTs.
- **Fields**: ID Peminjam, Nama Lengkap, Departemen (e.g., Keamanan, Event Organizer, Logistik).
- **Actions**: Add new Borrower, Edit Borrower details, Delete Borrower.
- Search by Borrower Name.

### 2.4 Transaction Management
- **Scan Pinjam (Borrow)**: 
  - Scan HT QR Code using the device camera.
  - Fallback: Manual input of HT ID (e.g., HT-001).
  - Assign the HT to a specific Borrower ID.
- **Scan Kembali (Return)**: 
  - Scan HT QR Code to register the return.
  - Update HT condition upon return (if damaged).

### 2.5 Reports and Logs
- **Riwayat Log (Log History)**: Detailed view of all past transactions (borrow and return timestamps, durations, and conditions).
- Export capabilities for reporting (Planned).

### 2.6 System Settings
- User Profile Management.
- General Settings.
- Dark Mode toggle and Language Switcher (ID/EN).

## 3. Supported Platforms
- **Web Dashboard**: Optimized for desktop and responsive for tablet/mobile browsers.
- **Hardware Integrations**: Camera for QR code scanning.
