import React from 'react';
import { Home, Search, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navigationItems = [
  { id: 'home' as const, icon: Home, label: 'Home', description: 'Upload and manage files' },
  { id: 'search' as const, icon: Search, label: 'Search', description: 'Search your files with AI' },
  { id: 'settings' as const, icon: Settings, label: 'Settings', description: 'App preferences' },
];

export const AppSidebar: React.FC = () => {
  const { state, dispatch } = useApp();

  const handlePageChange = (page: 'home' | 'search' | 'settings') => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <aside className={`
      ${state.sidebarCollapsed ? 'w-16' : 'w-64'} 
      bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-smooth
    `}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!state.sidebarCollapsed && (
          <h2 className="text-lg font-semibold text-sidebar-foreground">AI File Vault</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {state.sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.currentPage === item.id;
            
            const navButton = (
              <Button
                variant="ghost"
                onClick={() => handlePageChange(item.id)}
                className={`
                  w-full justify-start gap-3 h-12 px-3
                  ${isActive 
                    ? 'bg-sidebar-accent text-sidebar-primary font-medium' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  }
                  transition-all duration-200
                `}
              >
                <Icon size={20} className="shrink-0" />
                {!state.sidebarCollapsed && <span>{item.label}</span>}
              </Button>
            );

            // Wrap with tooltip when collapsed
            if (state.sidebarCollapsed) {
              return (
                <li key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {navButton}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            }

            return <li key={item.id}>{navButton}</li>;
          })}
        </ul>
      </nav>

      {/* Storage indicator */}
      {!state.sidebarCollapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/70 mb-2">Storage Used</div>
          <div className="w-full bg-sidebar-accent rounded-full h-2 mb-1">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((state.storageUsed / state.storageLimit) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-sidebar-foreground/70">
            {(state.storageUsed / (1024 * 1024 * 1024)).toFixed(1)} GB / {(state.storageLimit / (1024 * 1024 * 1024)).toFixed(0)} GB
          </div>
        </div>
      )}
    </aside>
  );
};