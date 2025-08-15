import React from 'react';
import { StorageSettings } from '@/components/settings/StorageSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { DataSettings } from '@/components/settings/DataSettings';
import { Separator } from '@/components/ui/separator';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      {/* Storage Settings */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Storage</h2>
          <p className="text-muted-foreground">
            Manage your file storage location and usage
          </p>
        </div>
        <StorageSettings />
      </section>

      <Separator />

      {/* Appearance Settings */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Appearance</h2>
          <p className="text-muted-foreground">
            Customize the look and feel of the application
          </p>
        </div>
        <AppearanceSettings />
      </section>

      <Separator />

      {/* Data Settings */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Data Management</h2>
          <p className="text-muted-foreground">
            Manage your stored data and preferences
          </p>
        </div>
        <DataSettings />
      </section>
    </div>
  );
};