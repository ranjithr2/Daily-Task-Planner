# Daily Task Planner 🚀

A modern, responsive, and intuitive daily task planner built for students and professionals to manage schedules, track deadlines, and maintain productive momentum.

![Daily Task Planner Screenshot](https://raw.githubusercontent.com/placeholder-demo.png) *(Preview)*

---

## ✨ Features

- **📊 Comprehensive Dashboard**: Real-time overview of Total Tasks, Completed Tasks, Pending Tasks, and Overdue Tasks with instant status filtering.
- **📝 Full Task CRUD**: Add, edit, delete, complete, and reopen tasks with input validation.
- **🏷️ Categories & Priorities**:
  - Categories: *Study, Work, Projects, Personal, Other*
  - Priorities: *High, Medium, Low*
- **📅 Interactive Calendar View**: Monthly interactive planner showing scheduled tasks by date, with day-specific task creation.
- **🔍 Search, Filter & Sort**: Real-time search across titles and notes, plus filtering by category, priority, and status, and flexible sorting.
- **📈 Daily Progress & Motivation**:
  - Circular SVG gauge and progress bar for today's agenda.
  - Dynamic motivational quotes and feedback that adapt as you complete tasks throughout the day.
  - Upcoming deadlines widget with relative countdowns.
  - Category balance distribution chart.
- **🌓 Light & Dark Modes**: Seamless theme switching with persistent local storage.
- **💾 Local Storage & Backup**:
  - Automatic persistence in the browser.
  - Reset to recommended demo sample tasks anytime.
  - One-click JSON backup export and import.
- **📱 Fully Responsive**: Tailored layouts for desktop, tablet, and mobile with a slide-in navigation drawer.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Persistence**: Browser LocalStorage API

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/daily-task-planner.git
   cd daily-task-planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the URL shown in your terminal) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Run unit tests**:
   ```bash
   npm test
   ```

---

## 📦 How to Upload to GitHub

Follow these steps from your terminal inside the project directory:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files
git add .

# 3. Commit files
git commit -m "Initial commit: Daily Task Planner"

# 4. Rename default branch to main
git branch -M main

# 5. Add your GitHub repository remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/daily-task-planner.git

# 6. Push to GitHub
git push -u origin main
```

---

## ⚡ How to Deploy on Vercel

This repository includes `vercel.json` preconfigured for Vite and SPA routing.

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** > **Project**.
3. Import your **daily-task-planner** repository from GitHub.
4. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your app will be live with a free SSL domain within seconds!

### Method 2: Via Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the interactive prompts to deploy.

---

## 📄 License

This project is licensed under the Apache 2.0 License.
