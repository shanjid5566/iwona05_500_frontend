# React 18 Production-Ready Starter

A comprehensive, production-ready React 18 application built with modern tools and best practices. Designed by senior developers for real-world, team-based projects.

## Features

- **Vite** - Lightning-fast HMR and build tooling
- **React 18** - Latest React with concurrent features
- **Tailwind CSS v4** - Utility-first CSS with custom theme
- **React Router DOM** - Declarative routing
- **Context API** - Global state management
- **Axios** - Centralized API service with interceptors
- **Framer Motion** - Production-ready animations
- **Lucide React** - Beautiful icon library
- **Clean Architecture** - Scalable folder structure
- **PropTypes** - Runtime type checking

## Theme Configuration

The project uses a custom Tailwind theme with:
- **Primary Color**: Green (`#22c55e`)
- **Secondary Color**: Black (`#000000`)

Theme colors are configured in [src/index.css](src/index.css) and can be used throughout the application:

```jsx
className="bg-primary-600 text-white"
className="bg-secondary-900 text-white"

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Button, Card, Spinner)
│   └── layout/         # Layout components (Header, Footer, MainLayout)
├── pages/              # Page components
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Dashboard.jsx
│   └── NotFound.jsx
├── routes/             # Routing configuration
│   └── index.jsx
├── context/            # Context API providers
│   ├── AppContext.jsx
│   ├── UserContext.jsx
│   └── index.js
├── services/           # API services
│   ├── api.js         # Axios configuration
│   └── index.js       # Service implementations
├── hooks/              # Custom React hooks
│   └── index.js
├── utils/              # Utility functions
│   └── helpers.js
├── constants/          # App constants
│   └── index.js
└── assets/             # Static assets
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd iwona05_$500_Web_Safari
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Architecture Patterns

### Context API Usage

```jsx
import { useApp, useUser } from './context';

function MyComponent() {
  const { theme, toggleTheme } = useApp();
  const { user, isAuthenticated } = useUser();
  
  // Your component logic
}
```

### API Service Pattern

```jsx
import { userService } from './services';

// Use in components
const users = await userService.getUsers();
const user = await userService.getUserById(1);
```

### Custom Hooks

```jsx
import { useApi, useLocalStorage, useDebounce } from './hooks';

function MyComponent() {
  const { data, loading, error } = useApi(apiFunction);
  const [value, setValue] = useLocalStorage('key', 'default');
  const debouncedSearch = useDebounce(search, 500);
}
```

## Component Examples

### Button Component

```jsx
import { Button } from './components/common';

<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>

// Variants: primary | secondary | outline | ghost
// Sizes: sm | md | lg
```

### Card Component

```jsx
import { Card } from './components/common';

<Card title="Title" subtitle="Subtitle" hoverable padding="lg">
  <p>Your content here</p>
</Card>
```

### Animated Elements

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## API Configuration

The application uses Axios with a centralized configuration in [src/services/api.js](src/services/api.js).

**Features:**
- Automatic token injection
- Global error handling
- Request/Response interceptors
- Development logging
- Timeout configuration

**Base URL:** Configure in `.env.local`:
```
VITE_API_BASE_URL=https://your-api.com
```

## Styling Guidelines

This project uses **Tailwind CSS** exclusively. Follow these guidelines:

1. **Use utility classes** - No inline styles
2. **Component composition** - Build complex UIs from simple components
3. **Responsive design** - Mobile-first approach
4. **Custom colors** - Use theme colors (`primary-*`, `secondary-*`)
5. **Consistent spacing** - Use Tailwind's spacing scale

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy** - Upload the `dist` folder to your hosting provider

### Recommended Hosting

- **Vercel** - Zero-config deployment
- **Netlify** - Automatic builds from Git
- **Cloudflare Pages** - Global CDN
- **AWS S3 + CloudFront** - Scalable solution

## Dependencies

### Core Dependencies
- `react` ^18.3.1 - UI library
- `react-dom` ^18.3.1 - React DOM renderer
- `react-router-dom` ^7.6.0 - Routing
- `axios` ^1.7.9 - HTTP client
- `framer-motion` ^12.0.1 - Animations
- `lucide-react` ^0.477.0 - Icons
- `prop-types` ^15.8.1 - Type checking

### Development Dependencies
- `vite` ^7.3.1 - Build tool
- `tailwindcss` ^4.1.18 - CSS framework
- `@vitejs/plugin-react` ^4.3.4 - React plugin for Vite
- `eslint` ^9.15.0 - Linting

## Best Practices Implemented

✅ Clean, scalable folder structure
✅ Centralized API configuration
✅ Global state management with Context API
✅ Custom hooks for reusability
✅ PropTypes for runtime validation
✅ Responsive design patterns
✅ Animation best practices
✅ Error handling
✅ Loading states
✅ Environment variable management
✅ Code splitting ready
✅ SEO-friendly routing

## Contributing

This is a template project. Feel free to:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

##  Author

Built by a senior React developer with 10+ years of experience, following industry best practices and modern patterns.

---

**Happy Coding!**
