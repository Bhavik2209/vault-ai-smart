import React, { useState } from 'react';
import { Folder, HardDrive, Info } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export const StorageSettings: React.FC = () => {
  const { state, dispatch } = useApp();
  const [newStorageLocation, setNewStorageLocation] = useState(state.settings.storageLocation);

  const storageUsedGB = state.storageUsed / (1024 * 1024 * 1024);
  const storageLimitGB = state.storageLimit / (1024 * 1024 * 1024);
  const usagePercentage = (state.storageUsed / state.storageLimit) * 100;

  const handleUpdateStorageLocation = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { storageLocation: newStorageLocation },
    });
    
    toast({
      title: 'Storage location updated',
      description: 'Files will be stored in the new location',
    });
  };

  const handleBrowseFolder = () => {
    // In a real Electron app, this would open a native folder dialog
    toast({
      title: 'Browse folder',
      description: 'This would open a folder selection dialog in the Electron app',
    });
  };

  return (
    <div className="space-y-6">
      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Storage Usage
          </CardTitle>
          <CardDescription>
            Monitor your storage usage and manage available space
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">Used Space</span>
              <span className="text-muted-foreground">
                {storageUsedGB.toFixed(2)} GB of {storageLimitGB.toFixed(0)} GB
              </span>
            </div>
            <Progress value={Math.min(usagePercentage, 100)} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center pt-2">
            <div>
              <div className="text-2xl font-semibold text-foreground">{state.files.length}</div>
              <div className="text-sm text-muted-foreground">Files</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">
                {storageUsedGB.toFixed(1)} GB
              </div>
              <div className="text-sm text-muted-foreground">Used</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">
                {(storageLimitGB - storageUsedGB).toFixed(1)} GB
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Storage Location
          </CardTitle>
          <CardDescription>
            Choose where your files are stored on your computer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storage-location">File Storage Path</Label>
            <div className="flex gap-2">
              <Input
                id="storage-location"
                value={newStorageLocation}
                onChange={(e) => setNewStorageLocation(e.target.value)}
                placeholder="Enter storage path..."
                className="flex-1"
              />
              <Button variant="outline" onClick={handleBrowseFolder}>
                <Folder className="w-4 h-4 mr-2" />
                Browse
              </Button>
            </div>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Changing the storage location will move all existing files to the new location.
              This process may take some time depending on the number of files.
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleUpdateStorageLocation}
              disabled={newStorageLocation === state.settings.storageLocation}
            >
              Update Location
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};