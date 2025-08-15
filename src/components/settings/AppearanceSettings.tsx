import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

export const AppearanceSettings: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleDarkModeToggle = (enabled: boolean) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { darkMode: enabled },
    });
    
    // In a real app, this would apply the theme
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: enabled ? 'Dark mode enabled' : 'Light mode enabled',
      description: 'Theme preference has been updated',
    });
  };

  const themeOptions = [
    {
      id: 'light',
      name: 'Light',
      icon: Sun,
      description: 'Clean and bright interface',
      active: !state.settings.darkMode,
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes in low light',
      active: state.settings.darkMode,
    },
    {
      id: 'system',
      name: 'System',
      icon: Monitor,
      description: 'Follow your system preference',
      active: false, // Not implemented yet
    },
  ];

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose how AI File Vault looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((theme) => {
              const Icon = theme.icon;
              return (
                <div
                  key={theme.id}
                  className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${theme.active 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-border-hover hover:bg-surface'
                    }
                    ${theme.id === 'system' ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => {
                    if (theme.id === 'light') handleDarkModeToggle(false);
                    if (theme.id === 'dark') handleDarkModeToggle(true);
                  }}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${theme.active ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                      {theme.id === 'system' && (
                        <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
                      )}
                    </div>
                  </div>
                  {theme.active && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>
            Customize your viewing experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base font-medium">
                Dark Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Use dark theme for better visibility in low light
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={state.settings.darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};