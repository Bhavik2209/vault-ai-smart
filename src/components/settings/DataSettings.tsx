import React, { useState } from 'react';
import { Trash2, AlertTriangle, Database, Download } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

export const DataSettings: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAllData = async () => {
    setIsClearing(true);
    
    // Simulate clearing data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear all files from state
    state.files.forEach(file => {
      dispatch({ type: 'REMOVE_FILE', payload: file.id });
    });
    
    // Reset storage usage
    dispatch({ type: 'UPDATE_STORAGE', payload: { used: 0, limit: state.storageLimit } });
    
    setIsClearing(false);
    
    toast({
      title: 'Data cleared successfully',
      description: 'All files and data have been removed from your vault',
    });
  };

  const handleExportData = () => {
    // In a real app, this would export user data
    toast({
      title: 'Export started',
      description: 'Your data export will be ready shortly',
    });
  };

  const formatDataSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Overview
          </CardTitle>
          <CardDescription>
            Summary of your stored data and usage statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-surface rounded-lg">
              <div className="text-2xl font-semibold text-foreground">{state.files.length}</div>
              <div className="text-sm text-muted-foreground">Total Files</div>
            </div>
            <div className="text-center p-4 bg-surface rounded-lg">
              <div className="text-2xl font-semibold text-foreground">
                {formatDataSize(state.storageUsed)}
              </div>
              <div className="text-sm text-muted-foreground">Storage Used</div>
            </div>
            <div className="text-center p-4 bg-surface rounded-lg">
              <div className="text-2xl font-semibold text-foreground">
                {state.files.filter(f => f.type.startsWith('image/')).length}
              </div>
              <div className="text-sm text-muted-foreground">Images</div>
            </div>
            <div className="text-center p-4 bg-surface rounded-lg">
              <div className="text-2xl font-semibold text-foreground">
                {state.files.filter(f => f.type === 'application/pdf').length}
              </div>
              <div className="text-sm text-muted-foreground">PDFs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Data
          </CardTitle>
          <CardDescription>
            Download a copy of your data for backup or migration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export includes file metadata, search history, and settings. 
              The actual files remain in your storage location.
            </p>
            <Button onClick={handleExportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanent actions that cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Clear All Data</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This will permanently delete all files, search history, and reset all settings. 
                This action cannot be undone.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    disabled={state.files.length === 0}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all 
                      {state.files.length} files, your search history, and reset all 
                      settings to defaults.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearAllData}
                      disabled={isClearing}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isClearing ? 'Clearing...' : 'Clear All Data'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};