# PlacementGPT - AI Interview Coach 🚀

<div align="center">

[![Vercel Deploy](https://img.shields.io/badge/Live%20Demo-Active-violet?style=for-the-badge&logo=vercel&logoColor=white&color=6366f1)](https://placementgpt.vercel.app)
[![GitHub License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&color=475569)](https://github.com/ShivanshPandey2005/PlacementGPT)

</div>

---

## ✨ Core Product Modules

### 🔐 1. Complete Secure Authentication
- **Edge-Safe Session middleware**: Inspects HTTP-only cookies using edge-compatible JWT decodes to protect all private portals (`/dashboard`, `/interview`, `/resume`, `/roadmap`, `/history`).
- **Cryptographic Security**: Password hashing with `bcryptjs` and edge-safe Web Crypto HMAC SHA-256 signatures.
- **Route Toggling**: Automatically redirects authenticated sessions away from `/login` or `/signup` straight to the `/dashboard`.

### 📊 2. Dynamic Performance Analytics Dashboard
- **Executive Metrics**: Four glowing stat cards tracking *Total mock runs*, *Average Score*, *Personal Best*, and *Performance Drift* (comparison index).
- **Progress charts**: Chronological Area progress graphs powered by `recharts` with beautiful violet gradients, linear animations, and dynamic tooltips.
- **Recent sessions**: Quick-access listing tables with score colored indicators routing straight to graded scorecards.

### 💬 3. AI Mock Interview & Multidimensional Grading
- **Custom Setup**: Candidates customize parameters by choosing a **Role** (text input), **Difficulty** (Easy, Medium, Hard), and **Interview Style** (HR, Technical, or Behavioral).
- **Simulated Dialogue**: Displays one question at a time inside a premium glassmorphic card with a step-by-step progress meter and an active session timer.
- **5-Axis Evaluator**: Gemini AI audits completed transcripts across five key metrics (Technical Accuracy, Communication, Relevance, Confidence, and Logic) returning:
  - Granular scores out of 10 for each question.
  - Bulleted **Strengths** and **Areas of Improvement** per answer.
  - Custom descriptive critiques.
  - A highly professional, recommended **Better Sample Answer** comparison.
- **Report card URL (`/interview/[id]`)**: Dynamic saved endpoints to bookmark, review, or share evaluations.

### 📄 4. Secure PDF Resume ATS Auditor
- **Upload Dragzone**: drag-and-drop PDF upload uploader featuring file progress tracking and validation guards.
- **Resilient Parsing**: Server-side binary stream parsing with ASCII fallbacks to prevent runtime crashes.
- **ATS compatibility ring**: Circular SVG progress gauge auditing keywords, layouts, summary feedback, and growth tips.

### 🗺️ 5. Skill Gap Analyzer & Weekly Training Roadmap
- **Holistic Skills Audit**: Combines the user's *parsed resume missing skills* and *latest mock interview weaknesses* to compile an prioritized missing skills scoreboard.
- **Chronological timeline checklist**: Stateful, weeks-based learning timelines (Weeks 1 to 4). Clicking a week expands it, revealing goals, suggest core topics, and actionable checkbox tasks (which pop progress toast notifications on completion!).

### 💼 6. Product Manager Case Study Portfolio Page
- A dedicated route (`/case-study`) designed to look like an elite PM portfolio project of PlacementGPT itself, showcasing:
  - **Problem Statement** vs **Vision** with stress/delay stats.
  - **User Personas**: Beautiful profiling cards for Shiva (technical focus) and Anya (behavioral focus).
  - **User Journey Map**: 5-step grid detailing thoughts, pain points, and actions from discovery to landing the job.
  - **Competitor comparison matrix**: Comparative tables indexing variables across LeetCode, Interviewing.io, MockMate, and PlacementGPT.
  - **RICE Prioritization Framework**: Reach, Impact, Confidence, and Effort prioritizing scores for MVP lockouts.
  - **KPIs & Funnel Metrics**: North Star Metric (Weekly Active Graded Sessions) and activation metrics.
  - **Product Roadmap**: "Now / Next / Later" visual Gantt charts.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15 / 16 (App Router)](https://nextjs.org/)
- **Compiler**: [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styles**: [Tailwind CSS v4 (Glassmorphism & Glowing backdrops)](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Database**: [MongoDB / Mongoose](https://mongoosejs.com/)
- **Generative Model**: [Google Gemini AI SDK (`@google/generative-ai`)](https://ai.google.dev/)
- **PDF Parser**: [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- **Authentication**: JWT cookies with edge-compatible Web Crypto

---

## 🌟 Resilient Sandbox Mode (Zero-Config Testing)

PlacementGPT is built with high-fidelity, resilient developer backups:
- If no `MONGODB_URI` or `GEMINI_API_KEY` are defined in the environment variables, the application **automatically switches to a beautiful mock sandbox mode**.
- The dashboard pre-populates with realistic historical scores and Area charts, the mock interview generates customized role questions, the PDF resume scanner returns ATS scores, and the roadmap compiles timelines instantly!
- This ensures the application is **fully interactive and auditable out-of-the-box** immediately upon booting local servers.

---

## 💻 Developer Installation Guide

### 1. Clone & Setup
```bash
# Clone the repository
git clone https://github.com/ShivanshPandey2005/PlacementGPT.git
cd PlacementGPT

# Install node dependencies
npm install
```

### 2. Environment Setup
Copy the example file to `.env.local` and add your secrets to unlock live integrations:
```bash
cp .env.example .env.local
```
Inside `.env.local`:
```env
# MongoDB Atlas Database URI (Optional - sandbox fallback active)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/placementgpt

# Google AI Studio API Key (Optional - sandbox fallback active)
GEMINI_API_KEY=AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxx

# JWT secret phrase
JWT_SECRET=placement-gpt-super-secret-key-2026
```

### 3. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser to evaluate the portal!

### 4. Build Production Bundle
Verify TypeScript validation and Turbopack page generation:
```bash
npm run build
```

---

## 🚀 Deployment on Vercel

PlacementGPT is fully optimized for **1-click deployments on Vercel**:
1. Connect your GitHub repository to Vercel.
2. Under **Environment Variables**, add:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
3. Click **Deploy**. Vercel will compile and host the app statically/dynamically on the Edge runtime seamlessly!
