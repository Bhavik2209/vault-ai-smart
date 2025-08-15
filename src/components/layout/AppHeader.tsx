import React from 'react';
import { User, Bell } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const AppHeader: React.FC = () => {
  const { state } = useApp();

  const getPageTitle = () => {
    switch (state.currentPage) {
      case 'home':
        return 'File Upload';
      case 'search':
        return 'Search Files';
      case 'settings':
        return 'Settings';
      default:
        return 'Home';
    }
  };

  const getPageDescription = () => {
    switch (state.currentPage) {
      case 'home':
        return 'Upload and organize your files';
      case 'search':
        return 'Search through your files using natural language';
      case 'settings':
        return 'Manage your preferences and storage';
      default:
        return '';
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-muted-foreground">
            {getPageDescription()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Bell size={18} />
          </Button>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">User</div>
              <div className="text-xs text-muted-foreground">AI File Vault</div>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                <User size={16} />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};