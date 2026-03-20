import React, { StrictMode } from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeModeProvider } from './contexts/ThemeModeContext'
import { NotificationProvider } from './contexts/NotificationContext'
import App from './App.tsx'

// GLOBAL ERROR HANDLER FOR DEBUGGING
window.addEventListener('error', (e) => {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'color:red; background:white; padding:20px; z-index:99999; position:absolute; top:0; left:0; width:100%;';
  errorDiv.innerHTML = `<pre>${e.error ? e.error.stack : e.message}</pre>`;
  document.body.appendChild(errorDiv);
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <NotificationProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </NotificationProvider>
        </BrowserRouter>
      </ThemeModeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
