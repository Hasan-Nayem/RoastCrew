<div align="center">

<img src="screenshots/Admin%20Logo.png" alt="RoastCrew Logo" width="220" />

# RoastCrew

### A social community platform for runners — feed, reels, activity tracking, and marketplace

**Backend API + Admin Dashboard** for the RoastCrew mobile app (Flutter)

[![Laravel](https://img.shields.io/badge/Laravel-13.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.3+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-3-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Sanctum](https://img.shields.io/badge/Auth-Sanctum-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/docs/sanctum)
[![Reverb](https://img.shields.io/badge/Realtime-Reverb-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/docs/reverb)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [API Overview](#-api-overview)
- [API Reference (Examples)](#-api-reference-examples)
- [Data Model](#-data-model)
- [Admin Dashboard](#-admin-dashboard)
- [Mobile Application](#-mobile-application-flutter)
- [Getting Started](#-getting-started)
- [Testing & Code Quality](#-testing--code-quality)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🚀 About the Project

**RoastCrew** is a mobile-first social community for runners and outdoor activity enthusiasts. It blends a **social feed**, **short-form video (Reels)**, **GPS activity tracking**, and a **peer-to-peer marketplace** into a single app experience.

This repository is the **backend** that powers the RoastCrew mobile app. It provides:

- A **versioned REST API** (`/api/v1/*`) secured with **Laravel Sanctum** tokens and consumed by the Flutter client.
- A fully-featured **admin dashboard** built with **Inertia.js + React 19** for managing users, content, and platform settings.
- **Real-time messaging** via **Laravel Reverb** WebSockets.
- **OTP-based authentication**, social login (Google / Apple), two-factor auth, and passkeys via **Laravel Fortify**.

> The companion mobile client (Flutter, project name `jackjaron_app`) lives in a separate repository and talks exclusively to this API.

---

## 📸 Screenshots

### Admin Dashboard

<p align="center">
  <img src="screenshots/Admin%20Dashboard.png" alt="Admin Dashboard — analytics, user growth and content insights" width="100%" />
</p>

### Reels & Reel Ads Management

<table>
  <tr>
    <td width="50%">
      <img src="screenshots/Admin%20Reels.png" alt="Admin Reels management" width="100%" />
      <p align="center"><em>Reels management & moderation</em></p>
    </td>
    <td width="50%">
      <img src="screenshots/Admin%20Reels%20Ads%20Settings.png" alt="Reel Ads settings" width="100%" />
      <p align="center"><em>Reel Ads configuration & analytics</em></p>
    </td>
  </tr>
</table>

### Mobile App

<p align="center">
  <img src="screenshots/Mobile%20APK%20Screenshot.jpg" alt="RoastCrew mobile app" width="320" />
</p>

---

## ✨ Features

### 👥 Social Feed & Profiles
- Create, edit, and delete **posts** with multi-image uploads.
- Attach **route/location details** to posts (address, distance, duration, pace, elevation, start/end coordinates).
- **Likes (reactions)**, **comments**, and shareable **explore** feed.
- Rich **user profiles** with avatar, bio, address, and social links.
- **Follow / unfollow** relationships with followers & following lists.
- **Notifications** (in-app + push) with unread counts and mark-as-read.

### 🎬 Reels
- Short-form **video reels** with thumbnails, captions, and hashtags.
- **Likes, comments, views, and shares** tracking.
- **Reel Ads** — sponsored reels with configurable placement and click/impression analytics.
- Admin moderation with bulk actions.

### 🏃 Activity Tracking
- Save and browse **tracks** (running/walking routes).
- Store distance, duration, pace, elevation, and start/end GPS coordinates.
- Multiple **route images** per track, plus an address and featured flag.

### 🛍️ Marketplace
- **Products** organized by **categories** with multiple images and pricing.
- **My Shop** — sellers manage their own listings.
- **Make an offer / chat about a product** — conversations can be tied to a specific listing.
- **Seller reviews & ratings** from buyers.

### 💬 Real-time Chat
- 1-to-1 and product-linked conversations with **chat members**.
- **Message attachments**, read receipts, and last-message previews.
- **Laravel Reverb** WebSocket broadcasting (`chat.{id}` channel).

### 🛡️ Moderation & Safety
- **Block / unblock users** and view blocked lists.
- **Report users** with reasons; admins review and resolve reports.
- Rate limiting on auth and profile endpoints.

### ⚙️ Platform Settings
- Global system settings (branding, contact, social links, currency, timezone, maintenance mode).
- **SMTP**, **Stripe**, and **Reels Ads** configuration from the admin panel.
- **FAQs** and dynamic **pages** (Privacy Policy, Terms & Conditions) served to the app.
- Log viewer and queue / failed-jobs management.

---

## 🧰 Tech Stack

### Backend & Admin Panel
| Layer | Technology |
|---|---|
| Language | PHP 8.3+ |
| Framework | Laravel 13.24 |
| API Auth | Laravel Sanctum (personal access tokens) |
| Web Auth | Laravel Fortify (2FA, passkeys) + social login (Google / Apple) |
| OTP | `ichtrojan/laravel-otp` |
| Real-time | Laravel Reverb + Laravel Echo + Pusher JS |
| Frontend | Inertia.js 3 + React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4, Radix UI, Lucide icons, `tw-animate-css` |
| Charts | ApexCharts / Recharts |
| Notifications | `react-hot-toast`, `sonner`, SweetAlert2 |
| Video | Mux (service layer ready) |
| Payments | Stripe |
| Tooling | Laravel Pint, ESLint, Prettier, PHPUnit |

### Mobile Client (Flutter)
| Concern | Package |
|---|---|
| State / DI | `get` (GetX), `provider`, `get_it` |
| Networking | `dio`, `http`, `rxdart` |
| Storage | `get_storage`, `shared_preferences` |
| Push | `firebase_messaging`, `firebase_core` |
| Media | `image_picker`, `video_player`, `file_picker`, `cached_network_image`, `photo_view` |
| Location / Maps | `google_maps_flutter`, `geolocator`, `geocoding` |
| Payments | `flutter_stripe` |
| UI | `flutter_screenutil`, `carousel_slider`, `flutter_svg`, `google_fonts`, `shimmer`/spinkit |

---

## 🏗️ Architecture

The backend follows a clean, layered architecture:

```
HTTP Request
   │
   ├─► routes/api/v1/*        (thin route definitions, versioned under /api/v1)
   │
   ├─► Controller             (validation + orchestration only)
   │        │
   │        ├─► Service        (app/Services/*)   business logic
   │        │
   │        └─► Repository     (app/Repositories/*) data access
   │
   └─► API Resource / JSON response
```

- **Controllers** stay thin and delegate to **Services**.
- **Services** encapsulate business rules (`AuthService`, `ChatService`, `PostService`, `ReelsServices`, `MuxVideoService`, …).
- **Repositories** isolate Eloquent queries, making them testable and reusable.
- **Events** (`MessageEvent`, `SendMessage`) broadcast chat updates over Reverb.
- **Jobs** and **Notifications** handle asynchronous work and push delivery.

---

## 📁 Project Structure

```
Jackjaron_Backend/
├── app/
│   ├── Actions/                 # Single-purpose action classes
│   ├── Events/                  # Broadcastable events (chat)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── API/             # Mobile REST API controllers (v1)
│   │   │   ├── Notification/    # Notification endpoints
│   │   │   └── Web/Backend/     # Admin dashboard controllers (Inertia)
│   │   └── Middleware/          # AdminMiddleware, HandleInertiaRequests, ...
│   ├── Models/                  # Eloquent models
│   ├── Repositories/            # Data-access layer
│   ├── Services/                # Business logic (API, Auth, Backend, Reels)
│   └── Notifications/
├── database/
│   ├── migrations/              # 40+ migrations
│   └── seeders/
├── resources/js/
│   ├── pages/                   # Inertia React pages (backend + frontend)
│   └── components/              # Shared UI components
├── routes/
│   ├── api.php                  # API entry (→ /api/v1/*)
│   ├── api/v1/                  # Feature route files (auth, post, reels, chat, ...)
│   ├── backend.php              # Admin dashboard routes (/admin/*)
│   ├── web.php                  # Web + frontend pages
│   └── channels.php             # Broadcast channel authorization
├── screenshots/                 # README assets
├── tests/                       # PHPUnit feature & unit tests
├── .github/workflows/           # CI / deployment workflow
├── composer.json
└── package.json
```

---

## 🔌 API Overview

Base URL: `{APP_URL}/api/v1` — all endpoints (except public settings/auth) require a Sanctum bearer token.

| Group | Method & Endpoint | Description |
|---|---|---|
| **Auth** | `POST /auth/register` | Register + send OTP |
| | `POST /auth/verify/register` | Verify registration OTP |
| | `POST /auth/resend/register-otp` | Resend registration OTP |
| | `POST /auth/login` | Login, returns access token |
| | `POST /auth/logout` | Revoke current token |
| | `POST /auth/forgetpass` / `verify-email` / `change-password` | OTP password reset flow |
| | `POST /auth/social/login`, `/google/callback`, `/apple/callback` | Social authentication |
| **User** | `GET /user/details` · `POST /user/update` | Profile read / update |
| | `POST /user/update-password` · `DELETE /user/delete` | Account management |
| | `GET /user/overview` · `/recent-tracks` · `/recent-images` | Dashboard data |
| **Posts** | `GET /post` · `GET /post/show/{id}` | Public feed |
| | `GET|POST|PATCH|DELETE /my-post/*` | CRUD for own posts |
| | `POST /post/{id}/toggle-like` | Like / unlike |
| | `GET|POST|PATCH|DELETE /post/{postId}/comments/*` | Comments |
| **Reels** | `GET /reels` · `GET /reels/my-list` | Feed / own reels |
| | `POST /reels/store` · `POST /reels/update/{id}` · `DELETE /reels/delete/{id}` | Reel CRUD |
| | `POST /reels/{id}/like` · `/view` · `/share` | Engagement |
| | `GET|POST /reels/{id}/comments` | Comments |
| **Chat** | `GET /chat` · `POST /chat/create` | List / create conversations |
| | `POST /chat/send-message` · `/{chat}/messages` | Send message (incl. product chat) |
| | `GET /chat/{chat}/messages` | Message history |
| **Marketplace** | `GET /products` · `GET /products/show/{id}` | Browse products |
| | `GET|POST|PUT|DELETE /my-products/*` | Manage own listings |
| | `GET /category` · `GET /categorized-product/{id}` | Categories |
| **Tracks** | `GET /track` · `GET /track/show/{id}` | Browse activity tracks |
| **Follow** | `GET /follow/follower-list` · `following-list` | Social graph |
| | `POST /follow/toggle/{id}` · `/unfollow/{id}` | Follow actions |
| **Reviews** | `GET /seller-review/{id}` · `POST /seller-review/store` | Seller ratings |
| **Notifications** | `GET /notifications` · `/unread` · `/unread/count` | In-app notifications |
| | `GET /notifications/{id}/mark-as-read` · `/mark-all-as-read` | Read state |
| **Safety** | `POST /block/block-user` · `/unblock-user` · `GET /block/get-blocked-users` | Blocking |
| | `POST /report/report-user` · `GET /report/get-report/{id}` | Reporting |
| **Settings** | `GET /settings/system` · `/faqs` · `/page/{slug}` | Public app config, FAQs, pages |

---

## 📚 API Reference (Examples)

### Conventions

- **Base URL:** `{APP_URL}/api/v1`
- **Headers:** every request should send `Accept: application/json`. Protected routes also require<br/>`Authorization: Bearer {access_token}`.
- **Response envelope:** all endpoints return the same wrapper.

**Success**
```json
{
  "success": true,
  "code": 200,
  "message": "Data fetched successfully",
  "data": { }
}
```

**Error / validation failure**
```json
{
  "success": false,
  "code": 422,
  "message": "Validation failed",
  "errors": { "email": ["The email field is required."] }
}
```

| Status | Meaning |
|---|---|
| `200` / `201` | Success / resource created |
| `401` | Missing or invalid token |
| `403` | Authenticated but not allowed (e.g. email not verified, suspended) |
| `404` | Resource not found |
| `422` | Validation error |

---

### 🔐 Authentication

#### 1. Register (send OTP)
`POST /auth/register`

```json
{
  "first_name": "Alex",
  "last_name": "Carter",
  "email": "alex@example.com",
  "password": "secret123",
  "password_confirmation": "secret123",
  "phone": "+8801700000000",
  "date_of_birth": "1998-04-12"
}
```

**`201 Created`**
```json
{
  "success": true,
  "code": 201,
  "message": "Otp Send to Email",
  "data": {
    "token": "4821",
    "user": { "id": 12, "email": "alex@example.com", "user_name": "alexcarter8291" }
  }
}
```

#### 2. Verify registration OTP
`POST /auth/verify/register`

```json
{ "email": "alex@example.com", "otp": "4821" }
```

**`200 OK`** — returns the Sanctum API token used for all future requests.
```json
{
  "success": true,
  "code": 200,
  "message": "Email verified successfully",
  "data": {
    "token": "12|aBcD...plainTextToken",
    "user": { "id": 12, "email": "alex@example.com", "email_verified_at": "2026-07-12T09:20:00.000000Z" }
  }
}
```

#### 3. Login
`POST /auth/login`

```json
{ "email": "alex@example.com", "password": "secret123" }
```

**`200 OK`**
```json
{
  "success": true,
  "code": 200,
  "message": "Login successful",
  "data": { "token": "13|ZxYw...plainTextToken", "user": { "id": 12, "name": "Alex Carter" } }
}
```

#### 4. Forgot password flow

| Step | Endpoint | Body |
|---|---|---|
| Request OTP | `POST /auth/forgetpass` | `{ "email": "alex@example.com" }` |
| Verify OTP | `POST /auth/verify-email` | `{ "email": "alex@example.com", "otp": "4821" }` → returns `reset_token` |
| Reset password | `POST /auth/change-password` | `{ "email": "...", "reset_token": "...", "password": "newsecret", "password_confirmation": "newsecret" }` |

#### 5. Logout
`POST /auth/logout` — revokes the current access token (`Authorization` header required).

---

### 📝 Posts

#### List the feed
`GET /post`

```bash
curl -H "Accept: application/json" \
     -H "Authorization: Bearer 13|ZxYw..." \
     "{APP_URL}/api/v1/post"
```

**`200 OK`**
```json
{
  "success": true,
  "code": 200,
  "message": "Data fetched successfully",
  "data": [
    {
      "id": 41,
      "user_id": 12,
      "title": "Morning 5K along the river",
      "descriptions": "Great pace today!",
      "address": "Gulshan Lake, Dhaka",
      "distance": "5.02",
      "duration": "28:14",
      "pace": "5:37",
      "elevation": "32",
      "comment_count": 3,
      "react_count": 17,
      "is_liked": false,
      "is_mine": true,
      "images": [
        { "id": 88, "image": "storage/posts/abc123.jpg" }
      ],
      "created_at": "Today at 6:40 AM"
    }
  ]
}
```

#### Create a post
`POST /my-post/store` — `multipart/form-data`

| Field | Type | Rules |
|---|---|---|
| `title` | string | **required**, max 255 |
| `descriptions` | string | nullable |
| `track_id` | integer | nullable, must exist |
| `address` | string | nullable, max 255 |
| `distance` / `duration` / `pace` / `elevation` | string | nullable |
| `is_published` | boolean | nullable |
| `images[]` | file | nullable, image, max 10 MB each |

```bash
curl -X POST "{APP_URL}/api/v1/my-post/store" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer 13|ZxYw..." \
  -F "title=Morning 5K along the river" \
  -F "address=Gulshan Lake, Dhaka" \
  -F "distance=5.02" \
  -F "images[]=@/path/to/photo.jpg"
```

**`200 OK`**
```json
{ "success": true, "code": 200, "message": "Post created successfully", "data": { "id": 42, "title": "Morning 5K along the river" } }
```

#### Toggle like
`POST /post/{id}/toggle-like`

**`200 OK`**
```json
{ "success": true, "code": 200, "message": "Post liked successfully", "data": { "is_liked": true, "total_likes": 18 } }
```

#### Comments

| Method | Endpoint | Body |
|---|---|---|
| `GET` | `/post/{postId}/comments` | — |
| `POST` | `/post/{postId}/comments/store` | `{ "comment": "Nice run!" }` |
| `PATCH` | `/post/{postId}/comments/update/{id}` | `{ "comment": "Updated text" }` |
| `DELETE` | `/post/{postId}/comments/delete/{id}` | — |

---

### 🎬 Reels

#### List reels
`GET /reels`

**`200 OK`**
```json
{
  "success": true,
  "code": 200,
  "message": "Reels fetched successfully.",
  "data": [
    {
      "id": 7,
      "type": "reel",
      "caption": "Sunset sprint 🔥",
      "hashtags": ["running", "sunset"],
      "video_url": "http://localhost/storage/uploads/reel-7.mp4",
      "thumbnail_url": "http://localhost/storage/uploads/reel-7.jpg",
      "status": true,
      "views": 1240,
      "likes": 96,
      "comments": 12,
      "shares": 8,
      "is_liked": false,
      "is_mine": true,
      "user": { "id": 12, "name": "Alex Carter", "user_name": "alexcarter8291" },
      "created_at": "2026-07-20T18:05:00.000000Z"
    }
  ]
}
```

#### Upload a reel
`POST /reels/store` — `multipart/form-data`

| Field | Type | Rules |
|---|---|---|
| `video` | file | **required**, mp4/mov/avi/mkv/webm, max 100 MB |
| `thumbnail` | file | nullable, image, max 5 MB |
| `caption` | string | nullable, max 1000 |
| `hashtags[]` | string[] | nullable |

```bash
curl -X POST "{APP_URL}/api/v1/reels/store" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer 13|ZxYw..." \
  -F "video=@/path/to/reel.mp4" \
  -F "thumbnail=@/path/to/thumb.jpg" \
  -F "caption=Sunset sprint" \
  -F "hashtags[]=running"
```

**`201 Created`** → returns a single `ReelResource` object.

#### Engagement

| Method | Endpoint | Response `data` |
|---|---|---|
| `POST` | `/reels/{id}/like` | `{ "liked": true, "likes": 97 }` |
| `POST` | `/reels/{id}/view` | `{ "views": 1241 }` |
| `POST` | `/reels/{id}/share` | `{ "shares": 9 }` |
| `GET` | `/reels/{id}/comments` | array of `ReelCommentResource` |
| `POST` | `/reels/{id}/comments` | created comment |

---

### 💬 Chat

#### Start / open a conversation
`POST /chat/create`

```json
{ "user_id": 34, "product_id": 9 }
```

**`200 OK`**
```json
{
  "success": true,
  "code": 200,
  "message": "Chat created successfully",
  "data": { "id": 5, "creator_id": 12, "product_id": 9, "type": "single" }
}
```

#### Send a message
`POST /chat/{chat}/messages` — `multipart/form-data` (send `message` **or** `attachments[]`)

| Field | Type | Rules |
|---|---|---|
| `message` | string | required if no attachments |
| `attachments[]` | file | jpg/jpeg/png/pdf/docx/zip, max 10 MB each |

```bash
curl -X POST "{APP_URL}/api/v1/chat/5/messages" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer 13|ZxYw..." \
  -F "message=Is this still available?"
```

> Real-time delivery is broadcast on the private channel `chat.{id}` via **Laravel Reverb**.

#### Read history
`GET /chat/{chat}/messages` · `GET /chat` (conversation list)

---

### 🛍️ Marketplace

#### Create a product
`POST /my-products/store` — `multipart/form-data`

| Field | Type | Rules |
|---|---|---|
| `title` | string | **required**, max 255 |
| `category_id` | integer | nullable, must exist |
| `description` | string | nullable |
| `price` | number | **required**, min 0 |
| `status` | boolean | nullable |
| `images[]` | file | **required**, array, max 5, max 5 MB each |

```bash
curl -X POST "{APP_URL}/api/v1/my-products/store" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer 13|ZxYw..." \
  -F "title=Running Shoes (Size 42)" \
  -F "category_id=3" \
  -F "price=45.00" \
  -F "images[]=@/path/to/shoe.jpg"
```

**`200 OK`**
```json
{ "success": true, "code": 200, "message": "Product created successfully", "data": { "id": 9, "title": "Running Shoes (Size 42)", "price": "45.00" } }
```

#### Other marketplace endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` · `/products/show/{id}` | Browse catalog |
| `GET` | `/my-products` | Own listings |
| `PUT` | `/my-products/update/{id}` | Update listing |
| `DELETE` | `/my-products/delete/{id}` | Remove listing |
| `GET` | `/category` · `/categorized-product/{id}` | Categories & filtering |

---

### ⭐ Reviews, Reports & Blocks

| Action | Endpoint | Body |
|---|---|---|
| Rate a seller | `POST /seller-review/store` | `{ "seller_id": 34, "rating": 5, "review": "Fast shipping!" }` |
| List seller reviews | `GET /seller-review/{id}` | — |
| Report a user | `POST /report/report-user` | `{ "reported_user_id": 34, "description": "Spam account" }` |
| Block a user | `POST /block/block-user` | `{ "blocked_user_id": 34 }` |
| Unblock | `POST /block/unblock-user` | `{ "blocked_user_id": 34 }` |
| Blocked list | `GET /block/get-blocked-users` | — |

---

### ⚙️ Public Settings (no auth required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/settings/system` | Branding, currency, timezone, social links, maintenance mode |
| `GET` | `/settings/faqs` | Active FAQ list |
| `GET` | `/settings/page/{slug}` | Dynamic page (e.g. `privacy-policy`, `terms-and-conditions`) |

**`GET /settings/system` → `200 OK`**
```json
{
  "success": true,
  "code": 200,
  "message": "System settings",
  "data": {
    "id": 1,
    "site_name": "RoastCrew",
    "site_email": "support@roastcrew.app",
    "currency": "USD",
    "timezone": "Asia/Dhaka",
    "maintenance_mode": false,
    "facebook": "https://facebook.com/roastcrew",
    "instagram": "https://instagram.com/roastcrew"
  }
}
```

---

## 🗃️ Data Model

Key entities and relationships:

- **User** — has many posts, products, reels, comments, chats; belongs-to-many follows; seller reviews.
- **Post** — belongs to user; has many images, reactions, comments, locations.
- **Reel** — belongs to user; has many likes & comments; cast `hashtags` as array.
- **Product** — belongs to user + category; has many images; linked to chats.
- **Chat** — has many members & messages; optionally tied to a product.
- **Track / TrackImage** — activity routes with GPS metrics and images.
- **UserReview** — buyer → seller rating.
- **Setting / Faq / Page** — platform configuration and content.
- **UserBlock / UserReport** — safety and moderation.

---

## 🖥️ Admin Dashboard

Accessible at `/admin` (guarded by `auth:sanctum` + `admin` middleware). Built with Inertia + React.

| Module | Capabilities |
|---|---|
| **Dashboard** | Monthly user growth, content volume trends, post/reel interactions, top-liked posts & reels, weekly trends |
| **Users** | CRUD, profile view, active sessions |
| **Products & Categories** | Full catalog management |
| **Posts & Tracks** | Content moderation |
| **Reels** | List, create, edit, bulk delete |
| **Reel Ads** | Ad inventory, targeting metadata, views/clicks |
| **Reports** | Review and resolve user reports |
| **Settings** | System, SMTP, Stripe, Reels Ads, branding & social links |
| **FAQs & Pages** | Manage help content and legal pages |
| **Logs & Queues** | Log viewer, queue overview, failed-job retry/delete |

---

## 📱 Mobile Application (Flutter)

The companion client (`jackjaron_app`) is a Flutter app with a 5-tab bottom navigation:

| Tab | Screen | Purpose |
|---|---|---|
| 🏠 | **Home** | Social feed, explore, comments, notifications, report user |
| 🎥 | **Reels** | Short-video feed, upload, likes & comments |
| 🏃 | **Track** | Create/finish activity tracks with maps & GPS |
| 🛍️ | **Shop** | Marketplace, add/edit product, my shop, product details |
| 👤 | **Profile** | Profile, edit, my reels, followers/following, settings |

**Additional mobile features:** onboarding, email/OTP sign-up, forgot-password flow, profile setup, real-time chat, account center, blocked users, address book, help, privacy policy, and terms.

---

## 🛠️ Getting Started

### Prerequisites
- PHP **8.3+** with Composer
- Node.js **18+** and npm
- A database (MySQL/MariaDB or SQLite)
- (Optional) Redis for queues & cache

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd Jackjaron_Backend

# 2. Install PHP dependencies
composer install

# 3. Install frontend dependencies
npm install

# 4. Configure environment
cp .env.example .env
php artisan key:generate
# Edit .env → set APP_NAME=RoastCrew, DB_*, MAIL_*, STRIPE_*, REVERB_*, MUX_* as needed

# 5. Run migrations (and seed optional demo data)
php artisan migrate --seed

# 6. Build frontend assets
npm run build
```

### Running in Development

```bash
# One command starts server + queue listener + Vite (see composer.json "dev")
composer dev
```

Or run each process separately:

```bash
php artisan serve          # Application server
php artisan queue:listen   # Queue worker
php artisan reverb:start   # WebSocket server (real-time chat)
npm run dev                # Vite dev server (HMR)
```

The admin dashboard is then available at **`http://localhost:8000/admin`**.

---

## 🧪 Testing & Code Quality

```bash
# PHP formatting (Laravel Pint)
composer lint
composer lint:check

# Frontend lint / format / type checks
npm run lint:check
npm run format:check
npm run types:check

# Run the test suite
php artisan test        # or: composer test

# Full CI check (lint + format + types + tests)
composer ci:check
```

---

## 🔒 Security

- **Sanctum** token-based authentication for all mobile API routes.
- **Fortify** two-factor authentication and **passkeys** for web/admin access.
- **Rate limiting** on auth (`throttle:auth-api`) and profile (`throttle:profile-api`) endpoints.
- Role-based **`admin` middleware** guarding the dashboard.
- Password hashing via bcrypt.

> ⚠️ **Note for maintainers:** never commit real credentials. Rotate any secrets that may have been exposed in configuration files, and keep `.env` out of version control. The deployment workflow in `.github/workflows/main.yml` should read credentials from GitHub **Secrets** rather than inline values.

---

## 🗺️ Roadmap

- [ ] Full Mux direct/chunked video upload pipeline (service layer already scaffolded).
- [ ] Push notification delivery hardening (Firebase Cloud Messaging).
- [ ] Public API documentation (OpenAPI / Swagger).
- [ ] Expanded automated test coverage.
- [ ] Internationalization (i18n) for the mobile app.

---

## 📄 License

This project is proprietary software developed for **RoastCrew**. See the repository owner for licensing details.

---

<div align="center">

**Built with ❤️ using Laravel, Inertia, React, and Flutter**

</div>
