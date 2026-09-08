# Photo OSINT - TLN Cybersecurity Challenge 2026

![Photo OSINT](https://img.shields.io/badge/status-active-success)
![React](https://img.shields.io/badge/frontend-React-blue)
![FastAPI](https://img.shields.io/badge/backend-FastAPI-green)

A professional Photo Analysis & OSINT Search prototype combining FastAPI backend with React frontend for the TLN Cybersecurity Challenge 2026.

## 🎯 Features

- **Photo Upload & Analysis** - Upload images and extract metadata
- **EXIF Data Extraction** - Detailed camera and GPS information
- **Reverse Image Search** - Find similar images online
- **Location-Based OSINT** - Search for location intelligence
- **Real-time Processing** - Fast and responsive UI
- **Mobile Responsive** - Works on all devices

## 📋 Stack

### Backend
- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn
- **Image Processing**: Pillow (PIL)
- **API Client**: Aiohttp
- **Environment**: Python 3.11+

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **HTTP Client**: Axios
- **Styling**: Custom CSS with modern design

## 🚀 Quick Start

### Option 1: Local Development

**Backend Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
Backend runs at: `http://localhost:8000`

**Frontend Setup (new terminal):**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:3000`

### Option 2: Docker

```bash
docker-compose up
```

Both services start automatically:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

## 🔧 Environment Setup

1. Create `.env` file in backend directory:
```bash
cp backend/.env.example backend/.env
```

2. Update `.env` with your configuration (if needed)

## 📁 Project Structure

```
tln-photo-osint/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment template
│   └── Dockerfile            # Backend container
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.jsx          # Main app component
│   │   └── index.css        # Styling
│   ├── package.json         # NPM dependencies
│   ├── vite.config.js       # Vite configuration
│   └── Dockerfile           # Frontend container
│
├── docker-compose.yml       # Docker orchestration
├── netlify.toml             # Netlify deployment config
└── README.md                # This file
```

## 🌐 API Endpoints

### Health Check
- `GET /` - API information
- `GET /health` - Service status

### Photo Operations
- `POST /api/photos/upload` - Upload photo
- `POST /api/photos/metadata` - Analyze metadata

### Search Operations
- `POST /api/search/reverse` - Reverse image search
- `POST /api/search/location` - Location-based OSINT search

## 🚀 Deployment

### Deploy Frontend to Netlify

1. Connect your GitHub repository to Netlify
2. Fill in deployment settings:
   - **Branch to deploy**: `main`
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Click Deploy

### Deploy Backend (Recommendation: Railway or Render)

**Railway.app:**
1. Push repo to GitHub
2. Connect Railway to your GitHub account
3. Create new project → GitHub repo
4. Set root directory: `/backend`
5. Add environment variables
6. Deploy

**Render.com:**
1. Push repo to GitHub
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn main:app --host 0.0.0.0 --port 8000`
6. Deploy

## 🔌 Connecting Frontend to Backend

Update the API URL in your Netlify environment variables:
```
VITE_API_URL=https://your-backend-url.com
```

## 📝 Usage

1. **Upload a Photo**
   - Click upload area or drag & drop an image
   - Confirm the upload

2. **Analyze Metadata**
   - Switch to "Analyze Metadata" tab
   - View EXIF data, camera info, and location hints

3. **Search Results**
   - Run reverse image search
   - Perform location-based OSINT search
   - Review findings

## 🛠️ Development

### Backend Development
```bash
cd backend

# Run with auto-reload
python -m uvicorn main:app --reload

# View API docs
# http://localhost:8000/docs
```

### Frontend Development
```bash
cd frontend
npm run dev    # Development server
npm run build  # Production build
npm run preview # Preview build
```

## 📦 Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend is ready to deploy as-is
```

## 🤝 Contributing

Contributions welcome! Please follow the existing code style.

## 📄 License

MIT License - See LICENSE file for details

## 🏆 TLN Challenge 2026

Built for the TLN Cybersecurity Challenge 2026 - Photo OSINT & Search prototype.

## 📞 Support

For issues and questions, please open a GitHub issue.
