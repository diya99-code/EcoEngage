# 🌿 EcoEngage: AI-Powered Environmental Awareness

EcoEngage is a cutting-edge platform designed to bridge the gap between AI and environmental conservation. It features an intelligent **EcoToken Agent** that verifies user contributions using Elasticsearch and rewards them with tokens for sustainable actions.

![EcoEngage Header](https://raw.githubusercontent.com/username/repo/main/public/banner.png) *(Note: Replace with actual image after deployment)*

---

## ✨ Key Features

- **🛡️ EcoToken AI Agent**: A Gemini-powered intelligent assistant that verifies your environmental impact in real-time.
- **📊 Real-time Analytics**: Built-in Elasticsearch integration for lightning-fast data retrieval and verification.
- **🎁 Impact Rewards**: Earn tokens by posting conservation content, commenting, and participating in challenges.
- **🌍 Sustainable Marketplace**: Redeem your tokens for real-world rewards like tree-planting initiatives or sustainability vouchers.
- **🔐 Secure Authentication**: Firebase-backed secure login and project management.

---

## 🏗️ Project Architecture

The project is structured as a modern monorepo-style application:

- **`/client`**: Built with **Next.js 14**, featuring a sleek, responsive UI with Tailwind CSS and Lucide icons.
- **`/server`**: A robust **Node.js/Express** backend integrated with Elasticsearch and Google Gemini AI.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- An Elasticsearch Cloud account
- A Google AI Studio (Gemini) API Key
- A Firebase project for authentication

### 2. Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your Environment Variables:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `GEMINI_API_KEY`, and `FIREBASE_SERVICE_ACCOUNT`.

4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Client Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your backend URL:
   Create a `.env.local` or use `.env.example`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Lucide React, Axios
- **Backend**: Express, Node.js, @google/generative-ai
- **Database/Search**: Elasticsearch Cloud
- **Security**: Firebase Admin SDK
- **Deployment**: Railway (Backend), Vercel (Frontend)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Developed with ❤️ for the 🌍 by the EcoEngage Team.
