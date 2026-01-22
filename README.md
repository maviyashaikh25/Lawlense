# Lawlense

## Overview

Lawlense is a comprehensive platform designed to streamline legal document management, semantic search, and AI-powered chat for law professionals. It integrates a Node.js backend, a React frontend, and a Python-based machine learning service for advanced document analysis and natural language processing.

## Features

- Secure user authentication and profile management
- Upload, parse, and view legal documents (PDF support)
- Semantic search across documents using embeddings
- AI-powered chat for legal queries
- Document summarization and clause extraction
- Modern, responsive UI with Tailwind CSS

## Folder Structure

```
LawProject/
├── backend/         # Node.js Express API, controllers, models, services
├── frontend/        # React app, UI components, pages
├── ml-service/      # Python ML service (NLP, embeddings, summarization)
```

### Backend

- REST API for authentication, document management, chat, and search
- Integrates with Pinecone for vector search
- PDF parsing and chunking

### Frontend

- Built with React and Vite
- Modern UI components (Tailwind CSS)
- Pages for dashboard, document upload/view, semantic search, chat, profile

### ML Service

- Python FastAPI service for NLP tasks
- BERT-based models for embedding and classification
- Clause extraction and document summarization

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.10+
- pip (for Python dependencies)

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
python main.py
```

## Usage

1. Start backend, frontend, and ML service as described above.
2. Access the frontend at `http://localhost:5173` (default Vite port).
3. Register/login, upload documents, use semantic search and chat features.

## Contribution Guidelines

1. Fork the repository and create your branch.
2. Make changes with clear commit messages.
3. Submit a pull request for review.

## License

This project is licensed under the MIT License.
