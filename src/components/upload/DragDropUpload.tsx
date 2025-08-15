import React, { useCallback, useState } from 'react';
import { Upload, FileIcon, Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { FileItem } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

export const DragDropUpload: React.FC = () => {
  const { dispatch } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  const processFiles = useCallback(async (files: FileList) => {
    setIsUploading(true);
    
    try {
      const fileItems: FileItem[] = Array.from(files).map(file => ({
        id: generateFileId(),
        name: file.name,
        size: file.size,
        type: file.type || 'unknown',
        uploadedAt: new Date(),
        path: URL.createObjectURL(file),
      }));

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch({ type: 'ADD_FILES', payload: fileItems });
      
      toast({
        title: 'Upload successful',
        description: `${fileItems.length} file${fileItems.length > 1 ? 's' : ''} uploaded successfully`,
      });

    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your files',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  }, [dispatch]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const openFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
    };
    input.click();
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          upload-area min-h-64 flex flex-col items-center justify-center p-8 text-center
          ${isDragOver ? 'drag-over' : ''}
          ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onClick={openFilePicker}
      >
        {isUploading ? (
          <>
            <div className="animate-spin w-12 h-12 border-2 border-primary border-t-transparent rounded-full mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Uploading files...</h3>
            <p className="text-muted-foreground">Please wait while we process your files</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              {isDragOver ? (
                <Plus className="w-8 h-8 text-primary" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>
            
            <h3 className="text-lg font-medium text-foreground mb-2">
              {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
            </h3>
            
            <p className="text-muted-foreground mb-4">
              or click to browse and select files
            </p>

            <Button 
              variant="outline" 
              className="mb-2"
              onClick={(e) => {
                e.stopPropagation();
                openFilePicker();
              }}
            >
              <FileIcon className="w-4 h-4 mr-2" />
              Browse Files
            </Button>

            <p className="text-xs text-muted-foreground">
              Supports all file types • Max 100MB per file
            </p>
          </>
        )}
      </div>
    </div>
  );
};