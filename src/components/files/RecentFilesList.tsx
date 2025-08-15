import React from 'react';
import { FileText, Image, Video, FileArchive, Music, Trash2, ExternalLink } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { FileItem } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Video;
  if (type.startsWith('audio/')) return Music;
  if (type.includes('archive') || type.includes('zip')) return FileArchive;
  return FileText;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  
  return date.toLocaleDateString();
};

interface FileItemProps {
  file: FileItem;
  onDelete: (id: string) => void;
  onOpen: (file: FileItem) => void;
}

const FileItemCard: React.FC<FileItemProps> = ({ file, onDelete, onOpen }) => {
  const Icon = getFileIcon(file.type);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(file.id);
  };

  const handleOpen = () => {
    onOpen(file);
  };

  return (
    <div 
      className="file-item group cursor-pointer"
      onClick={handleOpen}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{file.name}</h4>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span>{formatDate(file.uploadedAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpen}
          className="text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export const RecentFilesList: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleDeleteFile = (id: string) => {
    dispatch({ type: 'REMOVE_FILE', payload: id });
    toast({
      title: 'File deleted',
      description: 'File has been removed from your vault',
    });
  };

  const handleOpenFile = (file: FileItem) => {
    if (file.path) {
      // In a real app, this would open the file
      toast({
        title: 'Opening file',
        description: `Opening ${file.name}`,
      });
      console.log('Opening file:', file);
    }
  };

  // Sort files by upload date (most recent first)
  const sortedFiles = [...state.files].sort((a, b) => 
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  if (sortedFiles.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border border-border">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No files yet</h3>
        <p className="text-muted-foreground">
          Upload some files to get started with your AI-powered file vault
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedFiles.slice(0, 10).map((file) => (
        <FileItemCard
          key={file.id}
          file={file}
          onDelete={handleDeleteFile}
          onOpen={handleOpenFile}
        />
      ))}
      
      {sortedFiles.length > 10 && (
        <div className="text-center pt-4">
          <Button variant="outline" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'search' })}>
            View all {sortedFiles.length} files
          </Button>
        </div>
      )}
    </div>
  );
};