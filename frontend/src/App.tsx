import React from 'react';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { CartProvider } from './contexts/CartContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AIStudioPage from './pages/AIStudioPage';
import WardrobeOptimizerPage from './pages/WardrobeOptimizerPage';
import VirtualTryOnPage from './pages/VirtualTryOnPage';
import SmartOccasionPage from './pages/SmartOccasionPage';
import CheckoutPage from './pages/CheckoutPage';

function Layout() {
  return (
    <CartProvider>
      <Navigation />
      <Outlet />
      <footer
        className="py-8 px-6 text-center text-xs"
        style={{
          borderTop: '1px solid rgba(245,166,35,0.08)',
          background: '#0a0a0a',
          color: '#444',
        }}
      >
        <p>
          © {new Date().getFullYear()} AURAWEAR. All rights reserved. &nbsp;|&nbsp; Built with{' '}
          <span style={{ color: '#f5a623' }}>♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'aurawear')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#f5a623', textDecoration: 'none' }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </CartProvider>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const shopRoute = createRoute({ getParentRoute: () => rootRoute, path: '/shop', component: ShopPage });
const studioRoute = createRoute({ getParentRoute: () => rootRoute, path: '/studio', component: AIStudioPage });
const wardrobeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/wardrobe', component: WardrobeOptimizerPage });
const tryOnRoute = createRoute({ getParentRoute: () => rootRoute, path: '/try-on', component: VirtualTryOnPage });
const occasionRoute = createRoute({ getParentRoute: () => rootRoute, path: '/occasion', component: SmartOccasionPage });
const checkoutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/checkout', component: CheckoutPage });

const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  studioRoute,
  wardrobeRoute,
  tryOnRoute,
  occasionRoute,
  checkoutRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
