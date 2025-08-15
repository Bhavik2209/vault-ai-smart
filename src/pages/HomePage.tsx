import React from 'react';
import { DragDropUpload } from '@/components/upload/DragDropUpload';
import { RecentFilesList } from '@/components/files/RecentFilesList';
import { useApp } from '@/contexts/AppContext';

export const HomePage: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upload Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Upload Files</h2>
          <p className="text-muted-foreground">
            Drag and drop files or browse to add them to your vault
          </p>
        </div>
        <DragDropUpload />
      </section>

      {/* Recent Files Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Recent Files</h2>
          <p className="text-muted-foreground">
            {state.files.length > 0 
              ? `${state.files.length} files in your vault`
              : 'No files uploaded yet'
            }
          </p>
        </div>
        <RecentFilesList />
      </section>
    </div>
  );
};