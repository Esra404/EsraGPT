# EsraGPT Frontend

Modern, professional AI chat interface built with React 19, TypeScript, and TailwindCSS.

## Features

- **Modern UI/UX**: Premium design inspired by ChatGPT, Claude, and Cursor IDE
- **Real-time Chat**: Seamless communication with AI backend
- **Profile Management**: View and manage user profile information
- **Memory System**: Store and retrieve important information
- **Markdown Support**: Rich text rendering with syntax highlighting
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered animations
- **Dark Theme**: Beautiful dark theme with custom color palette

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client
- **Zustand** - Lightweight state management
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code syntax highlighting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # React components
│   ├── chat/        # Chat-related components
│   ├── drawer/      # Drawer components
│   ├── layout/      # Layout components
│   └── ui/          # Reusable UI components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── layout/          # Layout components
├── pages/           # Page components
├── services/        # API services
├── store/           # Zustand stores
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Color Palette

- **Background**: #0F172A
- **Card**: #1E293B
- **Card Hover**: #334155
- **Primary**: #3B82F6
- **Secondary**: #8B5CF6
- **Success**: #22C55E
- **Warning**: #F59E0B
- **Danger**: #EF4444
- **Text**: #F8FAFC
- **Text Secondary**: #94A3B8

## Features Breakdown

### Chat System
- Real-time messaging with AI
- Message history
- Typing indicators
- Auto-scroll to latest message
- Markdown rendering
- Code syntax highlighting
- Copy code functionality

### Profile System
- View user profile
- Display education, skills, interests
- Project and goal tracking
- Beautiful card-based layout

### Memory System
- Add memory notes
- Search memories
- Categorize memories
- Delete memories
- Card-based display

### UI Components
- Toast notifications
- Modal drawers
- Responsive sidebar
- Header with status
- Beautiful buttons and cards

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Quality

- TypeScript strict mode enabled
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture
- Reusable UI components
- Clean code principles

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
