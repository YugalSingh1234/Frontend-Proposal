# Energy Audit Proposal Generator - Frontend

A modern React application for generating professional energy audit proposals with dynamic content, payment schedules, and document generation capabilities.

## 🚀 Features

- ✅ **Professional Form Interface** - Clean, intuitive form design
- ✅ **Dynamic Payment Schedule** - Add/remove milestones with automatic percentage validation
- ✅ **Extra Points Management** - Dynamic bullet points with predefined suggestions  
- ✅ **Real-time Validation** - Form validation with helpful error messages
- ✅ **Word Count Tracking** - Project overview word limit enforcement
- ✅ **Document Generation** - Generate and download professional Word documents
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Modern UI/UX** - Built with Tailwind CSS and React Hook Form

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **React Hook Form** - Efficient form management
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library

## 📦 Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup Steps

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### API Integration
The frontend is configured to connect to your FastAPI backend at `http://localhost:8000`. 

If your backend runs on a different port, update the `API_BASE_URL` in `/src/services/api.js`:

```javascript
const API_BASE_URL = 'https://fastapi-backend-proposal.onrender.com/';
```

### Proxy Configuration
The `package.json` includes a proxy configuration to avoid CORS issues during development:

```json
"proxy": "http://localhost:8000"
```

## 📋 Usage Guide

### 1. Basic Information
- Fill in client name, contact person, date, cost, and currency
- All fields marked with * are required

### 2. Project Overview
- Add a brief description of the energy audit project
- Maximum 80 words (real-time word counter included)

### 3. Extra Points/Scope of Work
- Click "Add" to include specific project deliverables
- Use predefined suggestions or add custom points
- Edit or remove points as needed

### 4. Payment Schedule
- Default 4-milestone schedule provided
- Add or remove milestones using + and trash icons
- Percentages must total exactly 100%
- Real-time validation with color-coded feedback

### 5. Generate & Download
- Click "Generate Proposal" to create the document
- Download button appears after successful generation
- Documents are saved with timestamped filenames

## 🎨 UI Components

### Main Components:
- **EnergyAuditForm** - Main form container
- **PaymentSchedule** - Payment milestones management
- **ExtraPointsList** - Dynamic bullet points manager

### Key Features:
- **Form Validation** - Real-time error checking
- **Loading States** - User feedback during API calls
- **Toast Notifications** - Success/error messages
- **Responsive Layout** - Mobile-friendly design

## 🔍 Form Validation Rules

### Payment Schedule:
- ✅ Total percentages must equal 100%
- ✅ Individual percentages: 0-100%
- ✅ At least one milestone required
- ✅ Non-empty milestone titles

### Project Overview:
- ✅ Maximum 80 words
- ✅ Real-time word counting
- ✅ Optional field

### Basic Information:
- ✅ All fields required except project overview
- ✅ Date field with date picker
- ✅ Currency dropdown with common options

## 🚀 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🧪 Testing

```bash
npm test
```

Run the test suite in interactive watch mode.

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── EnergyAuditForm.js
│   │   ├── PaymentSchedule.js
│   │   └── ExtraPointsList.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🔗 API Endpoints Used

- **POST** `/api/process-proposal` - Generate proposal document
- **GET** `/api/download/{filename}` - Download generated document
- **GET** `/` - System status check

## 🎯 Sample Request Data

The frontend sends this JSON structure to your FastAPI backend:

```json
{
  "template_name": "Energy Audit (Industry).docx",
  "for_whom_proposal_is": "ABC Manufacturing Ltd",
  "submitted_to": "Mr. Rajesh Kumar",
  "date": "2025-09-26",
  "cost": "12,50,000",
  "currency": "₹ (Indian Rupees)",
  "project_overview": "Comprehensive energy audit...",
  "extra_points": [
    "Electrical systems assessment",
    "Thermal imaging analysis"
  ],
  "payment_items": [
    {
      "title": "Along with Work order",
      "percent": 25.0
    }
  ]
}
```

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your FastAPI backend includes CORS middleware
2. **Port Conflicts**: Check if ports 3000 (frontend) and 8000 (backend) are available
3. **API Connection**: Verify backend is running before starting frontend
4. **Dependencies**: Run `npm install` if you encounter module errors

### Backend CORS Setup:
Ensure your FastAPI backend has CORS configured:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📞 Support

- Check browser console for error messages
- Verify API endpoints match your backend
- Ensure all required dependencies are installed

---

**🎉 Your React frontend is ready to generate professional energy audit proposals!**