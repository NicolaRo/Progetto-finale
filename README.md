# PackBack

A full-stack sustainable commerce application built around reusable packaging logic, managing user and producer environments with secure payments, container lifecycle management, and AI-powered support.

The platform enables a circular commerce workflow where users can purchase products delivered in reusable containers, while producers manage inventory, orders, packaging assignments, and container returns.

Built to demonstrate full-stack architecture, complex business workflows, payment integration, AI assistance, and state-driven application design.

---

## Features

### User Environment

- 🛒 Browse products from multiple producers
- 🔎 Explore product details and availability
- 🛍️ Manage shopping cart and orders
- 💳 Complete secure payments through Stripe
- 📦 Track order status
- ♻️ Manage container return workflow
- 🤖 Access AI-powered companion
---

### Producer Environment

- 📦 Create and manage products
- ⚖️ Define quantity, unit of measurement, and pricing
- 📋 Process incoming orders
- 🧺 Assign reusable containers to ordered products
- 🚚 Manage delivery status
- ♻️ Verify returned containers and complete check-in operations
- 🤖 AI assistant for App guidance & FAQs and sustainable logistic guidance

---

## Circular Commerce Workflow

```
User
 │
 ▼
Product Selection
 │
 ▼
Cart Calculates Container Deposit Amount
 │
 ▼
Payment
 │
 ▼
Order Created
 │
 ▼
Producer Assignment
 │
 ▼
Container Allocation
 │
 ▼
Delivery
 │
 ▼
Container Return Request
 │
 ▼
Producer Verification
 │
 ▼
Container Deposit Refund Processing

```

---

## Container Lifecycle

Reusable containers are treated as an independent workflow entity.

```
Container vailable
    │
    ▼
Assigned to Order
    │
    ▼
In Delivery
    │
    ▼
Ready to Collect
    │
    ▼
Returned & Verified
    │
    ▼
Available Again
```

---

## AI Assistance

Each application environment includes an AI assistant powered by OpenAI API.

The assistants provide:

- Platform guidance
- FAQ support
- Sustainable purchasing recommendations
- User assistance throughout the workflow & tips on how to adopt green habits
- Producer logistics assistance & tips on how to reduce carbon footprint along delivery procedures

---

## Tech Stack

### Frontend

- React
- Vite

### Backend

- Node.js
- MongoDB

### Integrations

- Stripe API
- OpenAI API
- Spoonacular API
- Google Authentication

---

## Architecture Highlights

- Role-based application environments
- Full-stack separation between frontend and backend
- Secure payment processing
- External API integrations
- Complex workflow and state management
- Reusable container lifecycle modeling
- AI-powered user interaction

---

## Use Case

PackBack demonstrates the implementation of a circular commerce platform where product transactions and reusable packaging management are connected in a single digital workflow.

The system handles the complete lifecycle, from product creation and purchase to delivery, container return, verification, and automated refund processing.

---

## Demo

https://packback-greengrocery.netlify.app/

<img width="1552" height="982" alt="Screenshot 2026-08-04 alle 15 53 35" src="https://github.com/user-attachments/assets/c2065b2d-18cc-4cc4-b0fc-4495c14f13da" />
<img width="1552" height="982" alt="Screenshot 2026-08-04 alle 15 52 48" src="https://github.com/user-attachments/assets/a08d5492-9d82-4e7d-a0c1-f27c8ef95b0a" />

