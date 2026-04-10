# BhumiSeva — Full Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** April 10, 2026  
**Author:** Aditya (Founder & CEO)  
**Product:** BhumiSeva — Property Documentation Marketplace, Patna

---

## 1. Product Overview

BhumiSeva is a fintech-grade property documentation marketplace exclusively for Patna, Bihar. It connects property owners with expert document services like Jamabandi, Land Registry, Encumbrance Certificates, Rent Agreements, and more — all bookable online.

---

## 2. User Roles

### 2.1 Customer (End User)
- Property owners, buyers, tenants in Patna
- Visits website → browses services → fills enquiry form → gets callback → pays → receives document

### 2.2 Admin (BhumiSeva Team)
- Aditya + team members
- Manages leads, tracks orders, updates status, views analytics

---

## 3. Customer Side — Features & Flow

### 3.1 Current Features (Live)
| Feature | Status |
|---------|--------|
| Homepage with service cards | ✅ Live |
| Service detail pages with enquiry forms | ✅ Live |
| Contact page with form + map | ✅ Live |
| WhatsApp floating button | ✅ Live |
| City page (Patna) | ✅ Live |
| Pricing/FAQ page | ✅ Live |
| About page | ✅ Live |
| Blog page | ✅ Live |
| Lead submission to database | ✅ Live |
| Cookie consent | ✅ Live |
| Trust bar (social proof) | ✅ Live |
| Reviews section | ✅ Live |

### 3.2 Planned Features
| Feature | Priority | Description |
|---------|----------|-------------|
| Online Payment (Razorpay) | 🔴 High | Pay advance/full amount when booking a service |
| Order Tracking Page | 🔴 High | Customer enters phone/order ID to check status |
| SMS/Email Confirmation | 🟡 Medium | Auto-send confirmation when lead is received |
| Customer Login (Optional) | 🟢 Low | Track all orders in one dashboard |
| Multi-city expansion | 🟢 Low | Add Gaya, Muzaffarpur, etc. |

### 3.3 Customer Journey
1. **Discovery** → Google search / WhatsApp referral / social media
2. **Browse** → Homepage → Service detail page
3. **Enquire** → Fill multi-step form (name, phone, city, service details)
4. **Callback** → BhumiSeva team calls within 2 hours
5. **Payment** → Online (Razorpay) or cash
6. **Processing** → Team processes the document
7. **Delivery** → Document delivered (digital + physical)
8. **Review** → Customer leaves a review

---

## 4. Admin Side — Dashboard Plan

### 4.1 Admin Dashboard Pages

#### A. Login Page
- Email + password login (admin-only, no public signup)
- Protected routes — only authenticated admins can access

#### B. Dashboard Home
- **Today's Leads:** Count of new leads today
- **Total Leads:** All-time count
- **Leads by Service:** Bar/pie chart
- **Leads by Status:** New / Contacted / Converted / Closed
- **Revenue This Month:** (if payment integrated)

#### C. Lead Management
- **Table view** with columns: Name, Phone, Service, City, Status, Date
- **Filters:** By service type, status, date range
- **Search:** By name or phone number
- **Actions per lead:**
  - Change status (New → Contacted → In Progress → Delivered → Closed)
  - Add internal notes
  - View full details (all form fields)
  - WhatsApp quick link (opens wa.me with customer number)
- **CSV Export:** Download filtered leads as CSV

#### D. Service Management (Phase 2)
- Enable/disable services
- Update pricing
- Edit service descriptions

#### E. Settings
- Change admin password
- Manage notification preferences

### 4.2 Database Changes Needed

| Table | Change | Purpose |
|-------|--------|---------|
| `leads` | Add `status` column | Track lead progress |
| `leads` | Add `admin_notes` column | Internal notes |
| `leads` | Add `assigned_to` column | Who's handling this lead |
| `leads` | Add `amount` column | Payment amount |
| `leads` | Add `payment_status` column | paid/unpaid/partial |
| `admin_users` | New table | Store admin login credentials |
| `user_roles` | New table | Role-based access (admin, moderator) |

---

## 5. Integrations Plan

### 5.1 Razorpay (Payment Gateway)
- **What:** Accept online payments for services
- **How:** Razorpay checkout on service booking page
- **Flow:** Customer books → Razorpay payment page → Payment confirmation → Lead marked as "Paid"
- **Cost:** 2% per transaction
- **Setup:** Need Razorpay account → API keys → Edge function for order creation + verification

### 5.2 WhatsApp Business API (Automation)
- **What:** Auto-send messages to customers on lead events
- **Options:**
  - **Interakt** (₹999/mo) — Indian WhatsApp BSP, easy webhook integration
  - **Wati** (₹2,499/mo) — More features, templates, chatbot
  - **WhatsApp Cloud API** (Free, DIY) — Direct Meta API, needs tech setup
- **Auto-messages:**
  - Lead received: "Namaste {name}! Aapki {service} enquiry mil gayi. Hamare expert 2 ghante mein call karenge."
  - Status update: "Aapka {service} ka kaam shuru ho gaya hai. Estimated delivery: {date}"
  - Delivery: "Aapka document ready hai! Download link: {link}"

### 5.3 SMS Notifications
- **What:** Backup notifications via SMS
- **Options:** MSG91, Twilio, or Textlocal
- **When:** Lead confirmation, status change, delivery

### 5.4 Google Analytics (GA4)
- **What:** Track website traffic, conversions, user behavior
- **How:** Add GA4 measurement ID → inject tracking script
- **Track:** Page views, form submissions, WhatsApp clicks

### 5.5 Meta Pixel (Facebook/Instagram Ads)
- **What:** Track ad conversions for social media campaigns
- **How:** Add pixel ID → track lead form submissions as conversions

### 5.6 Email Notifications (Optional)
- **What:** Send email receipts/confirmations
- **How:** Lovable Cloud email or Resend API
- **When:** Lead confirmation, payment receipt

---

## 6. Revenue Model

| Source | Description |
|--------|------------|
| Service fees | ₹500–₹10,000 per document service |
| Convenience fee | Small markup on government fees |
| Maintenance (from client) | ₹3,000–₹10,000/month recurring |

---

## 7. Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Lovable Cloud (Supabase) |
| Database | PostgreSQL (via Lovable Cloud) |
| Auth | Lovable Cloud Auth (email/password for admin) |
| Payments | Razorpay |
| Hosting | Lovable (lovable.app) |
| WhatsApp | Interakt / Wati API |
| Analytics | Google Analytics GA4 |

---

## 8. Milestones

| Phase | Deliverable | Timeline |
|-------|------------|----------|
| Phase 1 ✅ | Customer website + lead forms + database | Done |
| Phase 2 | Admin dashboard (lead management) | 1-2 weeks |
| Phase 3 | Razorpay payment integration | 1 week |
| Phase 4 | WhatsApp automation | 1 week |
| Phase 5 | Analytics + Meta Pixel | 2-3 days |
| Phase 6 | Order tracking for customers | 1 week |

---

## 9. Security Requirements

- Admin dashboard behind authentication
- Role-based access control (admin vs moderator)
- RLS policies on all tables
- No public read access to leads
- HTTPS everywhere
- Input validation on all forms
