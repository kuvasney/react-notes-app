# 📝 Take Note - Frontend

> **Your Notes, Simple and Secure**

Take Note is a modern, secure, and intuitive note-taking application that combines simplicity with powerful features. Built with React and TypeScript, it offers end-to-end encryption, real-time collaboration, and a beautiful user interface.

## ✨ Features

### 🔒 **Security First**

- End-to-end encryption for all notes
- Secure user authentication with JWT
- Password reset functionality
- Protected routes and data isolation

### 📝 **Powerful Note Management**

- Create, edit, and delete notes with ease
- Rich text editing with textarea support
- Color-coded notes for visual organization
- Customizable tags for categorization
- Pin important notes to the top
- Archive notes to keep workspace clean

### 🤝 **Smart Sharing**

- **Public Notes**: Share notes with anyone via public links
- **Private Collaboration**: Invite specific users to collaborate
- **Shareable Links**: Generate unique tokens for public access
- Full control over note visibility

### 🎨 **Visual Organization**

- 6 color themes for notes (Yellow, Blue, Green, Red, Purple, Gray)
- Custom tags with click-to-filter functionality
- Drag-and-drop reordering (in development)
- Pinned notes always visible
- Archive system for completed notes

### 🔍 **Advanced Search**

- Instant search by title, content, or tags
- Filter by specific tags
- Real-time search results
- Clear and intuitive search interface

### 🌍 **Multi-language Support**

- 🇧🇷 Portuguese (pt-BR)
- 🇺🇸 English (en-US)
- 🇪🇸 Spanish (es-ES)
- Easy language switching

### 🎯 **User Experience**

- Modern and responsive design
- Light and dark mode support
- Keyboard shortcuts (ESC to cancel editing)
- Inline editing for quick updates
- SEO-optimized pages with dynamic meta tags
- Mobile-friendly interface

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Routing**: React Router v6
- **Styling**: SCSS with CSS Modules
- **Icons**: React Icons (Feather Icons)
- **HTTP Client**: Native Fetch API with custom interceptors
- **Internationalization**: Custom i18n implementation
- **Testing**: MSW (Mock Service Worker) for API mocking

## 📦 Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Reusable components
│   ├── AddCollaborator.tsx
│   ├── ErrorBoundary/
│   ├── Layout/
│   ├── Modal/
│   ├── PublicLabel.tsx
│   ├── Share.tsx
│   └── ...
├── config/          # Configuration files
│   └── api.ts       # API configuration and interceptors
├── contexts/        # React contexts
│   └── LanguageContext.tsx
├── hooks/           # Custom React hooks
│   ├── useAuth.ts
│   ├── useEscapeKey.ts
│   ├── useNotesApi.ts
│   ├── usePageMeta.ts
│   └── useUserApi.ts
├── i18n/            # Internationalization
│   ├── en-US.json
│   ├── es-ES.json
│   └── pt-BR.json
├── mocks/           # MSW mock handlers
├── pages/           # Page components
│   ├── Home/
│   ├── Notes/
│   ├── Register/
│   └── User/
├── stores/          # Zustand stores
│   ├── notesStore.ts
│   └── userStore.ts
├── styles/          # Global styles
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/take-note-frontend.git
cd take-note-frontend
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000
VITE_NODE_ENV=development
VITE_DEBUG_MODE=true
```

4. **Start development server**

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

```bash
# Development
pnpm dev              # Start development server

# Build
pnpm build            # Build for production
pnpm preview          # Preview production build

# Linting
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
```

## 🔧 Configuration

### API Configuration

The API configuration is located in `src/config/api.ts`:

```typescript
export const API_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "10000"),
  headers: {
    "Content-Type": "application/json",
  },
};
```

### Custom Fetch Interceptors

The app uses custom fetch wrappers:

- `apiFetch`: For authenticated routes (auto-redirects on 401)
- `publicFetch`: For public routes (login, register, password reset)

## 🎨 Theming

The application supports light and dark modes with CSS custom properties defined in `src/styles/_variables.scss`.

## 🔐 Authentication Flow

1. User registers or logs in
2. JWT token stored in sessionStorage
3. Token included in all API requests via `getAuthHeaders()`
4. Automatic logout on 401 responses (token expiration)
5. Protected routes redirect to login when unauthenticated

## 📱 Responsive Design

The application is fully responsive with breakpoints defined in SCSS:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🧪 Testing

The project uses MSW (Mock Service Worker) for API mocking during development:

```bash
# MSW is automatically initialized in development mode
# Mock data is located in src/mocks/
```

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
pnpm build
# Upload dist/ folder to your hosting service
```

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-api-url.com
VITE_NODE_ENV=production
VITE_DEBUG_MODE=false
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Rafael** - _Initial work_ - [kuvasney](https://github.com/kuvasney)

## 📞 Support

For support, email [contato@rafael.abc.br] or open an issue in the repository.

---

**Take Note** - Simplicity and Security in Every Note 📝🔒
