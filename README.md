# StartupHub

A comprehensive AI-powered platform combining intelligent funding advisory for Indian startups with advanced document ingestion and RAG (Retrieval-Augmented Generation) capabilities.

## 🌟 Features

### Startup Funding Intelligence
- **AI Funding Co-Founder**: Personalized funding advice using Google Gemini
- **Founder Profile Management**: Save and manage startup context (stage, sector, location, funding goals)
- **Funding Readiness Score**: Get a 0-100 score based on your startup's profile
- **Actionable Checklists**: Receive 5-step recommendations tailored to your funding journey
- **Multi-language Support**: Get advice in preferred Indian languages
- **India-focused**: Tailored specifically for the Indian startup ecosystem

### Document Intelligence System
- **PDF Ingestion Pipeline**: Process and clean PDF documents
- **Vector Database**: ChromaDB-powered semantic search
- **RAG Engine**: Advanced question-answering with context retrieval
- **Semantic Search**: Find relevant information across documents
- **OCR Support**: Extract text from image-based PDFs

### Modern Web Application
- **React Frontend**: Built with Vite and TypeScript
- **Responsive UI**: Shadcn/ui components with Radix UI primitives
- **Real-time Updates**: React Query for efficient data fetching
- **Smooth Animations**: Framer Motion for engaging user experience
- **Multi-page Navigation**: Dashboard, Onboarding, and more

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui + Radix UI
- **State Management**: React Context API
- **Data Fetching**: TanStack React Query
- **Animations**: Framer Motion
- **Routing**: Wouter

### Backend
- **Main Server**: Express.js with TypeScript
- **RAG Backend**: FastAPI (Python)
- **Database**: PostgreSQL with Drizzle ORM
- **Vector Database**: ChromaDB
- **Session Management**: connect-pg-simple

### AI/ML
- **Primary LLM**: Google Gemini 1.5 Pro
- **Alternative LLM**: GROQ API
- **Embeddings**: ChromaDB embeddings
- **OCR**: Integrated OCR for document processing

### Deployment
- **Platform**: Vercel-ready
- **Alternative**: Render (for Python backend)

## 📁 Project Structure

```
ai-verse/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Application pages
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utilities and API clients
│   └── public/              # Static assets
│
├── server/                    # Express.js backend
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   └── storage.ts           # Database logic
│
├── startup-rag/               # AI Funding Advisory System
│   └── backend/
│       ├── app/
│       │   ├── main.py      # FastAPI application
│       │   ├── rag.py       # RAG implementation
│       │   ├── gemini_client.py  # Gemini integration
│       │   └── prompts.py   # LLM prompts
│       └── requirements.txt
│
├── Data Ingestion/            # Document Processing Pipeline
│   ├── app.py               # Main control center
│   ├── ingestion/           # PDF processing modules
│   ├── vector_store/        # Vector DB management
│   ├── rag/                 # RAG engine
│   └── data/
│       ├── raw/             # Original PDFs
│       ├── processed/       # Cleaned text
│       ├── chunks/          # Text chunks
│       └── vector_db/       # ChromaDB storage
│
└── shared/                    # Shared TypeScript schemas
```

## ⚡ Quick Commands

### Run Backend (Python 3.10)
```powershell
cd startup-rag/backend
py -3.10 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Run Frontend
```powershell
cd ai-verse
npm run dev:client
```

**Access:**
- Backend: http://localhost:8000
- Frontend: http://localhost:5001
- Health Check: http://localhost:8000/health

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18 or higher
- **Python**: 3.10 or higher (3.10 recommended for RAG compatibility)
- **PostgreSQL**: For main database (optional for MVP)
- **API Keys**:
  - Google Gemini API key (required)
  - GROQ API key (optional - for Data Ingestion)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-verse
```

### 2. Frontend & Main Backend Setup

```bash
# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# DATABASE_URL=postgresql://user:password@localhost:5432/aiverse
# SESSION_SECRET=your-session-secret

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### 3. Startup RAG Backend Setup

```bash
cd startup-rag/backend

# Install Python dependencies (use Python 3.10)
py -3.10 -m pip install -r requirements.txt

# Install RAG dependencies
py -3.10 -m pip install sentence-transformers==2.2.2 "numpy<2.0" chromadb langdetect python-multipart

# Configure environment
# Create .env file with:
# GEMINI_API_KEY=your_gemini_api_key_here

# Start the FastAPI server (Python 3.10)
py -3.10 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Get Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `startup-rag/backend/.env` file
4. See [GEMINI_API_KEY_SETUP.md](GEMINI_API_KEY_SETUP.md) for detailed instructions

### 4. Data Ingestion System Setup

```bash
cd "Data Ingestion"

# Install Python dependencies
pip install -r requirements.txt

# Configure GROQ API Key (PowerShell)
$env:GROQ_API_KEY="your_groq_api_key_here"

# Run the ingestion pipeline
python app.py
```

## 📖 Usage

### Startup Funding Advisory

1. **Create Founder Profile**:
   ```bash
   POST http://localhost:8000/founder/profile
   ```
   Provide startup stage, sector, location, and funding goals

2. **Get Funding Advice**:
   ```bash
   POST http://localhost:8000/funding/advice
   ```
   Ask questions about funding strategy and receive personalized recommendations

### Document Intelligence

1. **Ingest PDFs**: Place PDF files in `Data Ingestion/data/raw/`
2. **Process Documents**: Run the pipeline to extract and clean text
3. **Build Vector DB**: Create embeddings for semantic search
4. **Query System**: Ask questions and get context-aware answers

## 🔧 Development

### Available Scripts

```bash
# Frontend development
npm run dev:client          # Start Vite dev server

# Full stack development
npm run dev                 # Start Express server with hot reload

# Production build
npm run build              # Build for production
npm start                  # Start production server

# Database
npm run db:push            # Push schema changes to database

# Type checking
npm run check              # Run TypeScript compiler checks
```

### Testing

#### Backend API Tests
```bash
cd startup-rag/backend

# Quick test
python test_api_quick.py

# Full test suite
python test_api.py

# Gemini integration test
python test_gemini_integration.py
```

## 🌐 API Endpoints

### Startup RAG Backend (Port 8000)

#### Save Founder Profile
```
POST /founder/profile
```

#### Get Funding Advice
```
POST /funding/advice
```

### Main Application (Port 5000)

See [server/routes.ts](server/routes.ts) for complete API documentation.

## 🔑 Environment Variables

### Main Application (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/aiverse
SESSION_SECRET=your-session-secret-here
NODE_ENV=development
```

### Startup RAG Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Data Ingestion System
```env
GROQ_API_KEY=your_groq_api_key_here
```

## 📦 Deployment

### ✅ Deployment Status: PRODUCTION READY

See [FINAL_DEPLOYMENT_READINESS.md](FINAL_DEPLOYMENT_READINESS.md) for complete deployment verification.

### Vercel (Frontend)

```bash
# Deploy to Vercel
cd client
vercel deploy --prod
```

**Environment Variables (Vercel):**
```env
VITE_API_URL=https://your-backend.onrender.com
```

### Render (Python Backend)

1. Push to GitHub: https://github.com/akhil151/ai-verse
2. Connect repository to Render
3. Use [render.yaml](startup-rag/backend/render.yaml) configuration
4. Add environment variables in Render dashboard:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
5. Render will auto-deploy on push

**Important:** Backend requires Python 3.10+ runtime in Render settings.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini**: AI-powered funding advice
- **ChromaDB**: Vector database for semantic search
- **Shadcn/ui**: Beautiful UI components
- **FastAPI**: High-performance Python backend
- **Vercel**: Deployment platform

## 📞 Support

For questions and support:
- Open an issue in the repository
- Check existing documentation in `/startup-rag/backend/README.md`
- Review setup guides in `/Data Ingestion/SETUP_API_KEY.md`

---

Built with ❤️ for the Indian startup ecosystem
