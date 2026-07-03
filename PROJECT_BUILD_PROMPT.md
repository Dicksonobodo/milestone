# Milestone Bank - Complete Project Build Prompt

Build a full-featured mobile banking application called **Milestone Bank** using React, Firebase, and Tailwind CSS. This is a React-based SPA with user authentication, fund management, and admin capabilities.

---

## 📋 Project Overview

**Milestone Bank** is a modern mobile-first banking app featuring user authentication, account management, money transfers, withdrawals, and admin controls. Built with React 19, Vite, Firebase (Authentication + Firestore), Tailwind CSS 4, Lucide React icons, and Recharts for data visualization.

---

## 🛠 Technology Stack

### Core Framework & Build
- **React** 19.2.6 (ESM modules)
- **Vite** 8.0.12 (Build tool with HMR)
- **React Router DOM** 7.15.1 (Client-side routing)
- **TailwindCSS** 4.3.0 (Utility-first CSS) with @tailwindcss/vite plugin

### Backend & Database
- **Firebase** 12.13.0
  - Firebase Authentication (Email/Password)
  - Cloud Firestore (Real-time database)
  - Server-side timestamps for data consistency

### UI & Icons
- **Lucide React** 1.16.0 (Icon library)
- **Recharts** 3.8.1 (Chart visualization)

### Development Tools
- **ESLint** 10.3.0 with React hooks plugin
- **@vitejs/plugin-react** 6.0.1

### Environment Configuration
- **.env** file for Firebase configuration (use `import.meta.env.VITE_*` pattern)

---

## 📁 Project Structure

```
milestone/
├── index.html                          # Entry HTML with root div
├── vite.config.js                      # Vite config with React plugin
├── eslint.config.js                    # ESLint configuration
├── package.json                        # Dependencies and scripts
├── vercel.json                         # Vercel deployment config
├── public/                             # Static assets
├── src/
│   ├── main.jsx                        # React entry point
│   ├── App.jsx                         # Main router setup
│   ├── App.css                         # Global styles
│   ├── index.css                       # CSS variables & resets
│   ├── firebase/
│   │   ├── config.js                   # Firebase initialization
│   │   ├── auth.js                     # Auth functions
│   │   └── firestore.js                # Firestore CRUD operations
│   ├── context/
│   │   └── AuthContext.jsx             # Auth state & user data provider
│   ├── hooks/
│   │   ├── useAuth.js                  # Auth context consumer hook
│   │   └── useUser.js                  # User data & transactions hook
│   ├── routes/
│   │   ├── PrivateRoute.jsx            # Protected user routes
│   │   └── AdminRoute.jsx              # Admin-only route wrapper
│   ├── pages/
│   │   ├── Splash.jsx                  # Landing/splash page
│   │   ├── Login.jsx                   # Login form
│   │   ├── Register.jsx                # Registration form
│   │   ├── Dashboard.jsx               # Main dashboard with balance & transactions
│   │   ├── Transfer.jsx                # Send money to other users
│   │   ├── Withdraw.jsx                # Withdraw funds (tier-gated)
│   │   ├── Profile.jsx                 # User profile & settings
│   │   ├── Support.jsx                 # Real-time chat with admin
│   │   └── AdminPanel.jsx              # Admin controls (fund users, support)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── BottomNav.jsx           # Mobile bottom navigation
│   │   │   ├── Button.jsx              # Reusable button component
│   │   │   ├── Card.jsx                # Reusable card wrapper
│   │   │   ├── Modal.jsx               # Modal/sheet component
│   │   │   └── ChatBubble.jsx          # Chat message bubble
│   │   ├── dashboard/
│   │   │   ├── BankCard.jsx            # Animated bank card display
│   │   │   ├── TransactionItem.jsx     # Transaction list item
│   │   │   └── BalanceChart.jsx        # Recharts balance chart
│   │   └── admin/
│   │       ├── FundUserForm.jsx        # Admin: Fund user account form
│   │       └── AdminSupport.jsx        # Admin: Support/chat interface
│   └── assets/                         # Images, icons, etc.
```

---

## 🔐 Firebase Setup

### Environment Variables (.env)
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firestore Database Structure

**Collections:**
- `users/` - User documents
  - `{uid}` (user document)
    - `uid` (string)
    - `fullName` (string)
    - `email` (string)
    - `balance` (number) - Account balance
    - `tier` (number) - 1 or 2 (determines withdrawal eligibility)
    - `role` (string) - "user" or "admin"
    - `cardNumber` (number) - 4-digit virtual card number
    - `createdAt` (timestamp)
    - `transactions/` (subcollection)
      - `{txId}` (transaction document)
        - `type` (string) - "credit", "debit"
        - `description` (string) - "Admin Deposit", "Withdrawal", etc.
        - `amount` (number)
        - `date` (timestamp)

- `chats/` - Chat conversations (admin-user support)
  - `{userId}` (user chat document)
    - `messages/` (subcollection)
      - `{messageId}` (message document)
        - `text` (string)
        - `sender` (string) - "user" or "admin"
        - `timestamp` (timestamp)
        - `read` (boolean)

### Firebase Auth
- Email/Password authentication
- Auto-create Firestore user doc on registration with initial tier 1 and $0 balance

---

## 🔄 Authentication Flow

1. **Register**: User provides fullName, email, password
   - Creates Firebase Auth account
   - Creates Firestore user doc with `tier: 1`, `role: "user"`, `balance: 0`
   - Auto-navigates to Dashboard

2. **Login**: User provides email, password
   - Firebase Auth validates credentials
   - AuthContext loads user data from Firestore

3. **AuthContext**:
   - Uses `onAuthStateChanged` listener
   - Fetches user Firestore doc when auth state changes
   - Provides `currentUser` (Firebase auth), `userData` (Firestore doc), `loading` state
   - `refreshUserData()` function to manually sync Firestore doc

4. **Route Protection**:
   - `PrivateRoute` checks `currentUser` existence
   - `AdminRoute` (nested inside PrivateRoute) checks `userData.role === "admin"`

---

## 📱 Pages & Features

### 1. **Splash Page** (`/`)
- Landing/home page with app branding
- CTA buttons to navigate to Login/Register
- Unauthenticated users only

### 2. **Register** (`/register`)
- Form inputs: Full Name, Email, Password
- Password strength indicator (min 6 chars)
- Error handling for invalid inputs
- Redirect to Dashboard on success
- Unauthenticated users only

### 3. **Login** (`/login`)
- Form inputs: Email, Password
- Password visibility toggle
- "Remember me" optional
- Error handling for invalid credentials
- Redirect to Dashboard on success
- Unauthenticated users only

### 4. **Dashboard** (`/dashboard`) - Protected
- Welcome message with user's first name
- **BankCard Component**:
  - Display balance (formatted with commas/decimals)
  - Display masked card number (last 4 digits)
  - Visual bank card design
- **Action Buttons**:
  - Transfer (navigate to /transfer)
  - Withdraw (navigate to /withdraw)
  - Request (navigate to /support)
  - Other CTAs for tier upgrade, card details
- **Transaction List** (recent 10 transactions):
  - Transaction type (credit/debit)
  - Amount
  - Description
  - Date/time
  - Scrollable list
- **Balance Chart** (Recharts):
  - Visual representation of balance history or trends
- **Bottom Navigation** with active indicator

### 5. **Transfer** (`/transfer`) - Protected
- Search for recipient by name
- Display list of matching users (excluding self)
- Select recipient and enter amount
- Quick amount buttons: $50, $100, $250, $500
- Confirm modal before transfer
- Update both sender and recipient balances
- Record transaction for both parties
- Success/error messages
- Refresh user data after transfer

### 6. **Withdraw** (`/withdraw`) - Protected
- Numeric keypad interface or input field
- Quick amount buttons: $50, $100, $250, $500
- Tier gating: Only tier 2 users can withdraw
  - Tier 1: Modal explaining need to upgrade
  - Tier 2: Can withdraw
- Confirm sheet before withdrawal
- Deduct from balance and record transaction
- Success/error messages

### 7. **Profile** (`/profile`) - Protected
- User info display:
  - Full name
  - Email
  - Account tier
  - Card number
  - Account creation date
- **Menu Items**:
  - Account settings
  - Notifications
  - Security/Password change
  - Help & FAQ
  - Refer friends
  - Privacy policy
  - Verify account
  - Message support
  - Copy card number
- **Logout button** with danger styling
- Copy-to-clipboard functionality for sensitive items
- Bottom navigation

### 8. **Support** (`/support`) - Protected
- Real-time chat interface with admin
- Message list (Firestore subcollection)
- Message bubbles:
  - User messages (right-aligned, blue)
  - Admin messages (left-aligned, gray)
- Message input field with Send button
- Auto-scroll to latest message
- Mark admin messages as read
- Unread notification count in bottom nav
- Bottom navigation with unread badge

### 9. **Admin Panel** (`/admin`) - Protected + Admin Only
- Tab interface:
  - **Fund User Tab**: Form to fund user accounts by email/UID
    - Input field for user identifier
    - Input field for amount
    - Submit button
    - Success/error messages
    - Updates user balance and records transaction as "Admin Deposit"
  - **Support Tab**: Admin chat interface
    - Display chats from users
    - Real-time message sync
    - Send replies to users
- Back button to Dashboard
- Admin-only branding/header

---

## 🎨 UI/UX Components

### **Reusable Components**

1. **BottomNav** (`BottomNav.jsx`)
   - Fixed bottom navigation (5 tabs)
   - Tabs: Dashboard, Transfer, Withdraw, Support, Profile
   - Active state styling
   - Unread badge support for Support tab
   - Icon from Lucide React

2. **BankCard** (`BankCard.jsx`)
   - Display balance with currency formatting
   - Show masked card number
   - Animated/gradient design
   - Responsive to balance updates

3. **TransactionItem** (`TransactionItem.jsx`)
   - List item for transaction display
   - Type icon (up/down arrow)
   - Description, amount, date
   - Color-coded (green for credit, red for debit)

4. **BalanceChart** (`BalanceChart.jsx`)
   - Recharts implementation
   - Display balance trends or history
   - Responsive layout

5. **ChatBubble** (`ChatBubble.jsx`)
   - Message bubble styling
   - Different styles for user vs. admin
   - Timestamp display
   - Read status indicator

6. **Modal** (`Modal.jsx`)
   - Reusable modal/sheet component
   - Confirmation dialogs
   - Support backdrop dismissal
   - Flexible content

### **Styling Approach**
- **Inline styles** for component-specific styling (as per codebase pattern)
- **Tailwind CSS** for utility classes (min-h-screen, pb-24, etc.)
- **CSS variables** in `index.css` for theme colors
- **Mobile-first** design with max-width 430px container
- **Color Palette**:
  - Primary: #5b5bd6 (indigo)
  - Secondary: #4f46e5 (brighter indigo)
  - Accent: #ff6b35 (orange for notifications)
  - Backgrounds: #f8f8fb, #f0f1f8, #f9fafb
  - Cards: #ffffff
  - Text: #1a1a2e, #111827, #9ca3af
  - Borders: #e8eaf0, #e5e7eb

---

## 🔄 State Management

### **AuthContext** (`src/context/AuthContext.jsx`)
Provides:
- `currentUser` - Firebase Auth user object
- `userData` - User Firestore document
- `loading` - Loading state during auth check
- `refreshUserData()` - Function to manually sync Firestore data

### **useAuth Hook** (`src/hooks/useAuth.js`)
- Custom hook to consume AuthContext
- Used across protected pages

### **useUser Hook** (`src/hooks/useUser.js`)
- Fetch transactions for current user
- Real-time subscription to transactions subcollection
- Export `transactions` and `loading` state

---

## 🔐 Firebase Operations

### **Authentication** (`src/firebase/auth.js`)

```javascript
registerUser(email, password, fullName)
// Creates Firebase Auth account + Firestore user doc

loginUser(email, password)
// Firebase Auth login

logoutUser()
// Firebase Auth logout
```

### **Firestore Operations** (`src/firebase/firestore.js`)

```javascript
getUser(uid)
// Fetch single user document

getAllUsers()
// Fetch all users (admin only)

fundUserAccount(uid, amount)
// Increment user balance, record credit transaction

upgradeToTier2(uid)
// Update user tier to 2

deleteUserDoc(uid)
// Delete user document and all subcollections

getTransactions(uid)
// Fetch recent transactions for user

withdrawFunds(uid, amount)
// Decrement user balance, record debit transaction
```

---

## 🎯 Core Features

1. **User Authentication**
   - Register with full name, email, password
   - Login with email and password
   - Persistent session (Firebase persistence)
   - Logout with session clear

2. **Account Management**
   - View account balance
   - View transactions (last 10)
   - View user profile information
   - Account tier system (1 = limited, 2 = full access)
   - Virtual card number assigned at signup

3. **Money Transfer**
   - Search users by name
   - Transfer funds to other users
   - Real-time balance updates
   - Transaction history tracking
   - Confirmation before transfer

4. **Withdrawals**
   - Withdraw funds (tier 2 only)
   - Numeric keypad interface
   - Quick amount buttons
   - Confirmation modal
   - Transaction recording

5. **Support System**
   - Real-time chat with admin
   - Unread message tracking
   - Auto-scroll to latest message
   - Message persistence in Firestore

6. **Admin Features**
   - Fund user accounts
   - View all users
   - Respond to support messages
   - Upgrade user tier
   - Delete user documents

7. **Data Visualization**
   - Balance display with formatting
   - Transaction list with details
   - Balance chart (Recharts)
   - Transaction categorization

---

## 📦 NPM Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

---

## 🚀 Deployment

- **Vercel Configuration** (`vercel.json`):
  - React SPA routing configuration
  - Environment variables setup
  - Build and start scripts

---

## 🎨 Design System

- **Responsive**: Mobile-first, max-width 430px
- **Color Scheme**: Purple/indigo primary with orange accents
- **Spacing**: Consistent padding (20px sides, 16px gaps)
- **Border Radius**: 14px for inputs, 20-28px for cards
- **Typography**:
  - Headings: 22-24px, fontWeight 700-800
  - Body: 14px, fontWeight 400-600
  - Labels: 10px, fontWeight 600, uppercase
- **Icons**: Lucide React (18-20px size)
- **Animations**: Smooth transitions, auto-scroll behavior

---

## 🔄 User Workflows

### Registration → Dashboard
1. User clicks "Sign Up" on splash
2. Fills in fullName, email, password
3. System creates Firebase Auth + Firestore user (tier 1, $0 balance)
4. Auto-login and navigate to Dashboard

### Money Transfer
1. User clicks "Transfer" button on Dashboard
2. Searches for recipient by name
3. Selects recipient and enters amount
4. Confirms transfer
5. System deducts from sender, adds to recipient
6. Both see updated balance and transaction records

### Withdraw (Tier 1 Blocked)
1. Tier 1 user clicks "Withdraw"
2. Modal explains tier requirement
3. Option to contact support or upgrade
4. Tier 2 user can proceed with withdrawal

### Support Chat
1. User clicks "Support" in bottom nav
2. Opens chat interface with admin
3. Types message and sends
4. Messages appear in real-time
5. Admin responses update live
6. Read status auto-marks when admin responds

---

## ✅ Implementation Checklist

- [ ] Setup Vite + React 19 project
- [ ] Install all dependencies
- [ ] Configure Firebase (Authentication + Firestore)
- [ ] Setup Tailwind CSS with @tailwindcss/vite
- [ ] Create folder structure
- [ ] Build Firebase config and auth functions
- [ ] Create AuthContext and useAuth hook
- [ ] Setup React Router with PrivateRoute/AdminRoute
- [ ] Build all 9 pages
- [ ] Build UI components (BottomNav, BankCard, etc.)
- [ ] Implement Firestore CRUD operations
- [ ] Add real-time listeners for transactions and chat
- [ ] Style with inline styles and Tailwind
- [ ] Test authentication flow
- [ ] Test transfer, withdraw, and chat features
- [ ] Test admin panel functions
- [ ] Setup environment variables
- [ ] Deploy to Vercel

---

## 🎯 Key Technical Considerations

1. **Real-time Updates**: Use `onSnapshot` for transactions and chat messages
2. **Transaction Consistency**: Use Firestore `increment()` for balance updates
3. **Server Timestamps**: Always use `serverTimestamp()` for dates
4. **Error Handling**: Comprehensive try-catch with user-friendly error messages
5. **Loading States**: Show spinners during async operations
6. **Mobile Optimization**: Fixed bottom nav, max-width container, touch-friendly buttons
7. **Security**: 
   - Firestore rules limit users to their own data
   - Admin operations only accessible to role: "admin"
   - Tier checks on withdrawal feature
8. **Performance**:
   - Use `useCallback` for event handlers
   - Limit transaction queries (last 10)
   - Lazy load components if needed

---

This prompt provides complete specifications to rebuild **Milestone Bank** from scratch with all features, components, architecture, and design details included.
