# OnChain Test Kit - Example Frontend

This is an example frontend application that demonstrates the integration of the OnChain Test Kit with Vercel Web Analytics.

## Features

- **Vite-based React application** for fast development and optimized builds
- **Vercel Web Analytics integration** for tracking user interactions and page performance
- **TypeScript support** for type-safe development
- **Modern styling** with responsive design

## Getting Started

### Prerequisites

- Node.js 16+ or later
- npm, pnpm, yarn, or bun package manager

### Installation

1. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

### Development

Start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
# or
bun dev
```

The application will open at `http://localhost:3000`.

### Build

Build for production:

```bash
npm run build
# or
pnpm build
# or
yarn build
# or
bun build
```

The optimized build will be in the `dist` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
# or
pnpm preview
# or
yarn preview
# or
bun preview
```

## Vercel Web Analytics Integration

This application integrates Vercel Web Analytics using the `@vercel/analytics` package. The Analytics component is added to the main React entry point in `src/main.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
```

### Deployment to Vercel

To deploy this application to Vercel with Web Analytics enabled:

1. **Enable Web Analytics in Vercel Dashboard**
   - Go to your [Vercel dashboard](/dashboard)
   - Select your project
   - Click the **Analytics** tab
   - Click **Enable** to enable Web Analytics

2. **Deploy your app**
   - Using Vercel CLI:
     ```bash
     vercel deploy
     ```
   - Or connect your Git repository to Vercel for automatic deployments

3. **View your analytics**
   - Once deployed, analytics data will be collected automatically
   - View your data in the Vercel dashboard under the **Analytics** tab

## Project Structure

```
src/
├── main.tsx          # Application entry point with Analytics component
├── App.tsx           # Main application component
├── App.css           # Application styling
├── index.css         # Global styles
└── components/       # Additional components directory
```

## Building the Package

From the root of the monorepo:

```bash
npm run build

# Or if using the root workspace:
cd ..
npm run build
```

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Vercel Web Analytics Documentation](https://vercel.com/docs/analytics)
- [OnChain Test Kit Documentation](../README.md)
