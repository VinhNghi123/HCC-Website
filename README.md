# 🎮 HCC Website

A retro pixel-art themed private club website built for **HCC (Hanoi Card Club / Homie Crew Club)** — a group of friends who game, hang out, and adventure together. The site acts as a central hub for members to stay connected, plan sessions, and share memories.

---

## ✨ Features

### 🏠 Home
- Animated landing page with a retro pixel-art aesthetic
- Floating animated icons for visual flair
- Navigation to all main sections of the site

### 👥 Members
- Displays all registered club members with their pixel avatars
- Shows member nicknames, roles, and profile info
- Members are linked to their Supabase accounts

### 🖼️ Memory Gallery
- Members can upload and share photos from their adventures
- Each photo shows the uploader's name, avatar, and upload date
- Full-screen lightbox viewer for each photo
- Owners can delete their own photos
- Photos are stored in Supabase Storage

### 📅 Availability / Quest Planner
- Interactive calendar where members mark which days they're available
- Displays member avatars on the days they've indicated availability
- Helps the group coordinate game or hangout sessions
- Fully responsive layout for mobile devices

### 🗳️ Vote
- Members can create and vote on polls/decisions for the group
- Retro-styled voting interface

### 🏆 Leaderboard
- Tracks and displays member scores or rankings
- Pixel-art styled ranking board

### 🔐 Sign In / Sign Up
- Authentication powered by Supabase Auth
- Members select their character (member profile) on sign-up
- Secure session management with React Context

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React](https://react.dev/) | Frontend UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Supabase](https://supabase.com/) | Backend: database, auth & file storage |
| Vanilla CSS | Custom retro pixel-art styling |
| React Router | Client-side page routing |

---

## 📁 Project Structure

```
hcc-home/
├── public/
├── src/
│   ├── assets/          # Member pixel avatar images
│   ├── components/
│   │   ├── AuthContext.jsx      # Global auth state provider
│   │   ├── FloatingIcons.jsx    # Animated background icons
│   │   └── Navbar.jsx           # Navigation bar
│   ├── lib/
│   │   ├── members.js   # Member data (names, avatars, colors)
│   │   └── supabase.js  # Supabase client config
│   ├── pages/
│   │   ├── Availability.jsx  # Quest planner / calendar
│   │   ├── Gallery.jsx       # Memory photo gallery
│   │   ├── Home.jsx          # Landing page
│   │   ├── Leaderboard.jsx   # Rankings page
│   │   ├── Members.jsx       # Member profiles
│   │   ├── SignIn.jsx         # Login & sign-up
│   │   └── Vote.jsx          # Group voting
│   ├── App.jsx          # Root component & routing
│   └── index.css        # Global retro pixel-art styles
├── .env                 # Environment variables (not committed)
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A [Supabase](https://supabase.com/) project

### Installation

```bash
# Clone the repository
git clone https://github.com/VinhNghi123/HCC-Website.git
cd HCC-Website

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

---

## 🗄️ Supabase Setup

The following tables are required in your Supabase project:

| Table | Description |
|---|---|
| `profiles` | Stores member profile info (member_name, etc.) |
| `photos` | Stores gallery photo metadata (url, path, caption, uploaded_by) |
| `availability` | Stores which dates each member is available |
| `votes` / `polls` | Stores poll data for the voting page |

Supabase Storage bucket `photos` must be created and set to public read access.

---

## 👾 Design

The site uses a **retro pixel-art / RPG game** theme throughout:
- Pixel fonts and blocky borders
- A yellow, red, and dark navy color palette
- Hover animations and box-shadow effects that mimic old-school game UI
- Floating animated icons (game controllers, swords, etc.) on key pages

---

## 🔒 Security Note

> **Never commit your `.env` file.** It contains your Supabase credentials. Make sure `.env` is listed in your `.gitignore`.

---

*Made with ❤️ by the HCC crew.*
