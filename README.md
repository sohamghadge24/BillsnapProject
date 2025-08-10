
# BillsnapProject

# Smart Expense Management App with Firebase


A comprehensive expense tracking application with receipt scanning capabilities, built with **React**, **TypeScript**, **Tailwind CSS**, and **Firebase**.

**🚀 Live Demo:** [https://billsnap-project.vercel.app](https://billsnap-project.vercel.app)

---

## ✨ Features

- 🔐 **Firebase Authentication**: Secure user authentication with email/password
- 🔄 **Real-time Data Sync**: Expenses are synchronized in real-time using Firestore
- 📷 **Receipt Scanning**: Camera and file upload functionality with automatic data extraction
- ☁ **Receipt Storage**: Uploaded receipts are stored in Firebase Storage
- 📈 **Interactive Dashboard**: Charts and analytics showing spending patterns
- 📝 **Expense Management**: Add, edit, delete, and categorize expenses
- 🔍 **Advanced Filtering**: Search and filter expenses by category, date, and keywords
- 📊 **Reports & Analytics**: Detailed spending reports with visual charts
- 📤 **Export Functionality**: Export data to CSV and JSON formats
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop devices

---

## Setup Instructions

### 1. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable the following services:
   - **Authentication**: Enable Email/Password provider
   - **Firestore Database**: Create a database in production mode
   - **Storage**: Enable Firebase Storage for receipt uploads

### 2. Configuration

1. In your Firebase project settings, find your web app configuration
2. Replace the placeholder values in `src/config/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. Firestore Security Rules

Set up the following security rules in your Firestore Database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 4. Storage Security Rules

Set up the following security rules in your Firebase Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /receipts/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Usage

1. **Sign Up/Sign In**: Create an account or sign in with existing credentials
2. **Add Expenses**: Use the "Add Expense" button or scan receipts
3. **Scan Receipts**: Use the Scanner tab to capture or upload receipt images
4. **View Dashboard**: Monitor your spending with interactive charts
5. **Manage Expenses**: Edit, delete, and categorize your expenses
6. **Generate Reports**: Analyze spending patterns and export data

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: Lucide React
- **Build Tool**: Vite

## File Structure

```
src/
├── components/           # React components
│   ├── AuthForm.tsx     # Authentication form
│   ├── Dashboard.tsx    # Main dashboard with charts
│   ├── ExpenseList.tsx  # Expense management
│   ├── Scanner.tsx      # Receipt scanning
│   ├── Reports.tsx      # Analytics and reports
│   ├── Navigation.tsx   # App navigation
│   └── AddExpenseModal.tsx # Add expense modal
├── config/
│   └── firebase.ts      # Firebase configuration
├── services/
│   └── firebaseService.ts # Firebase service methods
├── hooks/
│   └── useAuth.ts       # Authentication hook
├── types/
│   └── expense.ts       # TypeScript interfaces
├── utils/
│   └── helpers.ts       # Utility functions
└── App.tsx             # Main app component
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Important Notes

- Replace the Firebase configuration with your actual project credentials
- The receipt scanning feature uses simulated OCR for demo purposes
- In production, consider implementing proper receipt OCR using services like Google Vision API
- Ensure proper Firebase security rules are configured before deployment
>>>>>>> cc9f78c (Initial commit)
