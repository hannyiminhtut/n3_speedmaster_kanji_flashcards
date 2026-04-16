# N3 Speed Master Kanji Flashcards 🎯

A beautiful, mobile-first, highly interactive flashcard application designed to help you master Japanese N3 Kanji vocabulary. Built with modern web technologies, this app provides an excellent offline-first study experience.

## ✨ Core Features
- **3D Flip Animations**: Smooth, hardware-accelerated card flips powered by `framer-motion` to keep studying engaging.
- **Dynamic Combinations**: A single kanji card can hold infinite combinations (Word, Pronunciation/Ruby, and Burmese Meaning) seamlessly integrated into the back face of the card.
- **Local Storage Engine**: 100% offline-friendly. Data is securely saved directly in your local browser, meaning it practically loads instantly with zero backend setup required.
- **JSON Import/Export**: Easily backup your progress, move your entire deck to another device, or share your custom Kanji decks with friends using the built-in backup tools.
- **Mobile-Optimized UX**: Fully responsive layouts ensuring the flashcards, buttons, and combination lists are comfortably sized for single-handed mobile use.
- **Inline Editing**: Fix typos or expand your combinations seamlessly via an inline editing interface on the Manage Data dashboard.

## 🛠️ Technology Stack
- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com/) (For responsive, glassmorphism UI design)
- [Framer Motion](https://www.framer.com/motion/) (For interactive components and 3D gestures)
- [Lucide React](https://lucide.dev/) (For beautiful SVG icons)

## 🚀 Getting Started (System Flow)

If you have just cloned the repository, getting the app running locally is extremely simple.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Installation
Clone the repository, open the directory in your terminal, and install the dependencies:
```bash
git clone https://github.com/YOUR-USERNAME/n3-kanji-flashcards.git
cd n3-kanji-flashcards
npm install
```

### 2. Running the Development Server
Start the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the live application.

### 3. Usage Flow
1. Navigate to the **Manage Data** tab from the top navigation bar.
2. Begin building your Flashcard deck by entering a Main Kanji, its base meaning, and creating rows for its word combinations and pronunciations.
3. Click `Save Card`. (Data is automatically preserved instantly in `localStorage`).
4. Navigate to the **Study Units** tab.
5. Select the specific Unit you want to practice and begin flipping through your beautifully rendered flashcards! You can shuffle the active deck at any given time.
6. Once finished, back up your deck as a `.json` file by returning to **Manage Data** and clicking **Export JSON**. 

### 4. Deployment
Because this project utilizes the standard Next.js App Router architecture without database environment variables, you can immediately deploy it to [Vercel](https://vercel.com/) by connecting this Git repository to your Vercel dashboard. Vercel will automatically build and host the live application.
