import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { HomePage } from '@/pages/HomePage';
import { SearchPage } from '@/pages/SearchPage';
import { SettingsPage } from '@/pages/SettingsPage';

export const AppLayout: React.FC = () => {
  const { state } = useApp();

  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
    </div>
  );
};