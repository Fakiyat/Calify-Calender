# Modern Calendar Application

A full-stack calendar application built with React and Django, featuring event management, multiple calendar views, and a modern UI.

## Features

- 📅 Multiple calendar views (Month, Week, Day, Agenda)
- ✨ Interactive event management
- 🎨 Color-coded event categories
- 🔄 Real-time updates
- 📱 Responsive design
- 🛠 Modern UI with Material-UI components

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v16 or higher)
- Python (v3.12 or higher)
- npm (comes with Node.js)
- Git

## Screenshot Preview

![Screenshot 2025-04-13 030816](https://github.com/user-attachments/assets/cb061e0a-3e49-4dd2-9c5a-80d335a4f727)
<br/>
![Screenshot 2025-04-13 030823](https://github.com/user-attachments/assets/6b348cd5-a6d3-4ca9-a4df-856500a13e4d)

<br/>

![Screenshot 2025-04-13 030839](https://github.com/user-attachments/assets/21770fcb-fbef-4a2c-9040-500434791143)








## Project Structure

```
my-calendar/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── backend/           # Django backend
    ├── events/
    ├── config/
    └── manage.py
```

## Setup Instructions

### Backend Setup

1. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

2. Install Django and dependencies:
```bash
cd backend
pip install django djangorestframework django-cors-headers
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start the Django server:
```bash
python manage.py runserver
```
The backend will be running at http://localhost:8000

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Required npm packages:
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install react-redux @reduxjs/toolkit
npm install react-big-calendar date-fns
npm install axios
```

3. Start the development server:
```bash
npm run dev
```
The frontend will be running at http://localhost:5173

## Dependencies

### Frontend Dependencies
```json
{
  "dependencies": {
    "@emotion/react": "^11.11.3",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.15.11",
    "@mui/material": "^5.15.11",
    "@reduxjs/toolkit": "^2.0.1",
    "axios": "^1.6.7",
    "date-fns": "^3.3.1",
    "react": "^18.2.0",
    "react-big-calendar": "^1.8.7",
    "react-dom": "^18.2.0",
    "react-redux": "^9.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.12"
  }
}
```

### Backend Dependencies
```python
# requirements.txt
Django==5.1.6
djangorestframework==3.14.0
django-cors-headers==4.3.1
```

## Usage

1. Create new events:
   - Click on any date in the calendar
   - Fill in event details (title, description, category)
   - Select start and end times
   - Click Save

2. Manage events:
   - Click on an event to edit or delete
   - Drag and drop events to reschedule
   - Use the toolbar to switch between views

3. View options:
   - Month: Traditional calendar view
   - Week: Detailed week view
   - Day: Single day schedule
   - Agenda: List view of all events

## Development

### Frontend Structure
- `components/`: React components
- `store/`: Redux state management
- `utils/`: Helper functions
- `App.jsx`: Main application component

### Backend Structure
- `events/`: Django app for event management
- `config/`: Project settings
- `api/`: REST API endpoints

## Troubleshooting

1. If you see module not found errors:
```bash
# Reinstall node modules
rm -rf node_modules
npm install
```

2. If the backend fails to start:
```bash
# Check Django installation
pip install django --upgrade
python manage.py check
```

3. If CORS errors occur:
- Ensure `corsheaders` is in INSTALLED_APPS
- Check CORS_ALLOWED_ORIGINS in settings.py

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request
