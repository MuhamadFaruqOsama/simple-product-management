<div align="center">
  <img src="./public/img/logo.png" alt="Taksara's logo" width="120" />

# Taksara

Asimple application for managing products, inventory, restocking, and sales.

</div>

---

## 📋 About

**Taksara** is an application designed to simplify product and inventory management.

The application allows users to manage products, record restocking transactions, monitor stock, and record product sales in one place.

### Features

* Product management
* Product stock management
* Product restocking
* Product sales
* Income and spending tracking
* Product image management
* Authentication
* Soft delete for products

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MuhamadFaruqOsama/simple-product-management.git
```

Move into the project directory:

```bash
cd simple-product-management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on the `.env.example` file.

```bash
copy .env.example .env
```

Then, configure the required environment variables inside the `.env` file.

> Make sure your database and other required services are properly configured before running the application.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

If you need to synchronize the database schema:

```bash
npx prisma db push
```

### 5. Create a User

User accounts are currently created **manually through the database**.

Before inserting a user, make sure the password is hashed using `bcryptjs`.

```javascript
const bcrypt = require("bcryptjs");

const hashedPassword = await bcrypt.hash(new_password, 10);
```

Use the generated hash as the user's password when inserting the user into the database.

> **Important:** Never store the user's password as plain text.

### 6. Run the Application

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 📌 Notes

Before running the application, make sure:

* Dependencies have been installed.
* The `.env` file has been configured.
* The database connection is working.
* Prisma Client has been generated.
* The database schema has been synchronized.
* At least one user has been manually inserted into the database.
* The user's password has been stored as a bcrypt hash.

---

## 📄 License

This project is intended for personal and development purposes.

---

<div align="center">

**Taksara**

</div>