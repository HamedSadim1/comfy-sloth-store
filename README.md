# Comfy Sloth Store

A modern, fully-refactored e-commerce application built with React, TypeScript, and best practices.

## 🚀 Features

- **Modern React**: Functional components with hooks
- **TypeScript**: Full type safety throughout the application
- **Performance Optimized**: useMemo, useCallback, lazy loading
- **State Management**: Zustand stores and React Context
- **API Integration**: Axios-based API client with full CRUD operations
- **Authentication**: Auth0 integration
- **Payment Processing**: Stripe integration
- **Responsive Design**: Styled-components for consistent UI
- **Code Quality**: ESLint, comprehensive testing setup

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Styled-components
- **State Management**: Zustand, React Context
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: Auth0
- **Payments**: Stripe
- **API Client**: Axios with interceptors
- **Routing**: React Router v7
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── Context/            # React contexts for global state
├── hooks/              # Custom React hooks
├── services/           # API services and utilities
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
├── data/               # Static data and constants
└── assets/             # Images and static assets
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/HamedSadim1/comfy-sloth-store.git
cd comfy-sloth-store
```

1. Install dependencies:

```bash
npm install
```

1. Create environment variables:

```bash
cp .env.example .env
```

Fill in your environment variables:

- Auth0 credentials
- Stripe API keys
- Other required secrets

1. Start the development server:

```bash
npm run dev
```

1. Build for production:

```bash
npm run build
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_REACT_APP_AUTH0_DOMAIN=your_auth0_domain
VITE_REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_REACT_APP_STRIP_PUBLIC_KEY=your_stripe_public_key
VITE_REACT_APP_STRIP_SECRET_KEY=your_stripe_secret_key
```

## 📝 Key Improvements Made

### Code Quality

- ✅ Converted all components to functional components with hooks
- ✅ Added explicit TypeScript typing (no `any` types)
- ✅ Implemented comprehensive JSDoc documentation
- ✅ Added proper error handling and logging

### Performance

- ✅ Memoized expensive operations with `useMemo`
- ✅ Optimized re-renders with `useCallback`
- ✅ Implemented code splitting with lazy loading
- ✅ Efficient state management patterns

### Architecture

- ✅ Centralized state management with Zustand and Context
- ✅ Generic API client with full CRUD operations
- ✅ Modular component structure
- ✅ Consistent naming conventions

### Developer Experience

- ✅ Full TypeScript IntelliSense support
- ✅ Comprehensive ESLint configuration
- ✅ Clear project structure and documentation
- ✅ Modern development tooling (Vite, React 19)

## 🤝 Contributing

1. Fork the repository
1. Create a feature branch: `git checkout -b feature/your-feature`
1. Commit your changes: `git commit -m 'Add some feature'`
1. Push to the branch: `git push origin feature/your-feature`
1. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original project inspiration from John Smilga's React course
- Refactored with modern React and TypeScript best practices
- Icons from React Icons
- UI components styled with Styled-components

---

Built with ❤️ using React, TypeScript, and modern web technologies.
