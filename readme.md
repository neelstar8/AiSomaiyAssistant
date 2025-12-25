# Somaiya Campus AI 🎓🤖

A dual-purpose AI intelligence platform designed for **KJSCE (K. J. Somaiya College of Engineering)** students. This application combines Retrieval-Augmented Generation (RAG) for academic assistance with AI-powered computer vision for campus infrastructure maintenance.

## 🌟 Key Features

### 1. Academic AI Assistant (RAG)
- **Verified Curriculum**: Access official syllabus details for COMP, IT, and EXTC branches across various semesters.
- **Link Integration**: Directly provides links to official PDF resources from the KJSCE repository.
- **Context-Aware**: Uses Google Gemini to answer complex questions about course content and campus policies.

### 2. Infrastructure Auditor (Vision)
- **Visual Reporting**: Take photos of campus issues (leaks, broken tiles, loose wires) and upload them.
- **AI Verification**: The system uses computer vision to confirm damage and categorize the priority for maintenance.
- **Automatic Logging**: Reports are recorded and "verified" by the AI to prevent spam.

### 3. Student Rewards Portal
- **Earn Credits**: Get rewarded with 10 credits for every confirmed infrastructure report.
- **Redeemable Balance**: Monitor your impact and initiate redemption requests to your bank account.
- **Contributor Profile**: Track your history of campus improvements.

## 🛠 Tech Stack

- **Frontend**: React (ES6 Modules), Tailwind CSS
- **AI Core**: Google Gemini API (`@google/genai`)
  - Model: `gemini-3-flash-preview`
- **Backend/Auth**: Firebase
  - **Authentication**: Google/Somaiya ID Sign-in
  - **Firestore**: User profiles, rewards, and report tracking
  - **Storage**: RAG data payloads and user-uploaded images

## 🚀 Getting Started

### Prerequisites
1.  **Google AI API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/).
2.  **Firebase Project**: Create a project in the [Firebase Console](https://console.firebase.google.com/).

### Environment Variables
The application expects the following environment variable:
- `process.env.API_KEY`: Your Google Gemini API Key.

### Firebase Configuration
Update `firebase.ts` with your specific project credentials:
- `apiKey`, `authDomain`, `projectId`, `storageBucket`, etc.

## ⚠️ Troubleshooting: `auth/unauthorized-domain`

If you encounter a `Firebase: Error (auth/unauthorized-domain)` during sign-in:

1.  Copy the domain name shown in the app's error message.
2.  Go to **Firebase Console** > **Authentication** > **Settings**.
3.  Click on **Authorized domains**.
4.  Add the copied domain (e.g., `localhost` or your hosting URL) to the list.
5.  **Alternative**: Use the **"Guest Mode"** button implemented in the login screen to test the app without Firebase configuration.

## 📁 Project Structure

- `/components`: UI modules (Sidebar, ChatView, ProfileView).
- `/services`: API logic for Gemini and Firebase interactions.
- `constants.tsx`: Hardcoded campus data and AI system instructions.
- `types.ts`: TypeScript interfaces for the domain model.

## ⚖️ Campus Policy
This tool is intended for KJSCE students only. Data provided in the syllabus section is synced with official departmental repositories. Infrastructure reports are shared with the maintenance department.

---
**Developed for Somaiya Vidyavihar University**