# Vastu Harmony Scorer (Home Vastu Score Calculator)

A fully functional, production-ready MERN stack application that calculates a Home Vastu Score based on directional alignments and analyzes property blueprint layouts. The UI design is styled using the premium **Google Stitch 2271474309470982088** tokens (Deep Forest Green, Terracotta, Soft Sand, and Warm Off-White).

## Features

- **5-Step Form Wizard**: A state-driven questionnaire gathering personal profile details and orientation inputs across compass directions.
- **Directional Compass Selector**: A premium 3x3 visual compass grid representing the 8 directions for intuitive spatial selection.
- **Vastu Scoring Engine**: A backend algorithm evaluating alignments using traditional Vedic rules:
  - **Main Entrance (25% weight)**: Ideal in North, East, North-East.
  - **Kitchen (20% weight)**: Ideal in South-East (Agni corner).
  - **Master Bedroom (20% weight)**: Ideal in South-West.
  - **Bathrooms (15% weight)**: Ideal in North-West.
  - **Remaining Zones (20% weight)**: Average of Pooja Room (Ideal: North-East), Living Room (Ideal: East/North), Staircase (Ideal: South/West/South-West), and Balcony (Ideal: East/North/North-East).
- **Blueprint Image Uploader**: Handles multipart blueprint image uploads using Multer and streams them directly to Cloudinary (with local folder fallback support).
- **Interactive Results Dashboard**: Animates a semi-circular score gauge (sand to green gradient), summaries of room orientations, severe defect alerts, and actionable Vastu remedies.

## Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, Multer.
- **Database**: MongoDB, Mongoose.
- **File Storage**: Cloudinary (SDK integration) / Local disk fallback.

---

## Getting Started

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v16+ recommended) and [MongoDB](https://www.mongodb.com/) installed and running on your system.

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory (or edit the existing one):
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/vastu_score
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
*Note: If Cloudinary keys are left as placeholders, the server automatically saves uploaded blueprints to the local `backend/uploads/` directory and serves them from there.*

### 3. Launching the Application

Run the convenient startup helper script from the root directory:
```bash
bash start-app.sh
```

Alternatively, start them manually:

#### Start Express Backend:
```bash
cd backend
npm start
```

#### Start React Frontend:
```bash
cd frontend
npm run dev
```

Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)** to use the application!

---

## Deploying to Vercel

This repository is pre-configured for seamless deployment to **Vercel** as a full-stack project using Vercel Serverless Functions and Vite Static Assets.

### Option A: Deploy via GitHub & Vercel Dashboard (Recommended)

1. **Push your code** to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new) and select **Import Repository**.
3. Keep the **Root Directory** as `./` (default).
4. Add your **Environment Variables** under Project Settings > Environment Variables:
   - `MONGO_URI` (MongoDB Atlas Connection String, e.g. `mongodb+srv://<user>:<password>@cluster.mongodb.net/vastu_score?retryWrites=true&w=majority`)
   - `CLOUDINARY_CLOUD_NAME` (Optional for image storage)
   - `CLOUDINARY_API_KEY` (Optional)
   - `CLOUDINARY_API_SECRET` (Optional)
5. Click **Deploy**. Vercel will build the frontend dist and serve both the static web app and `/api/*` serverless backend endpoints live!

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

