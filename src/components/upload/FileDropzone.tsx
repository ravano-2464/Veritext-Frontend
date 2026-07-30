import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, AlertCircle, FileType2 } from 'lucide-react';
import { clsx } from 'clsx';
import * as Progress from '@radix-ui/react-progress';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export interface FileWithPreview extends File {
  preview?: string;
  id: string;
  status: 'idle' | 'parsing' | 'analyzing' | 'done' | 'error';
  progress: number;
  errorMessage?: string;
}

interface FileDropzoneProps {
  onFilesAccepted: (files: FileWithPreview[]) => void;
  onFileRemove: (id: string) => void;
  files: FileWithPreview[];
  maxFiles?: number;
  maxSizeMb?: number;
}

export function FileDropzone({
  onFilesAccepted,
  onFileRemove,
  files,
  maxFiles = 5,
  maxSizeMb = 4,
}: FileDropzoneProps) {
  const [dragError, setDragError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: import('react-dropzone').FileRejection[]) => {
      setDragError(null);

      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors[0].code === 'file-too-large') {
          setDragError(`File is too large. Maximum size is ${maxSizeMb}MB.`);
        } else if (rejection.errors[0].code === 'too-many-files') {
          setDragError(`You can only upload up to ${maxFiles} files at once.`);
        } else {
          setDragError(rejection.errors[0].message);
        }
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          id: Math.random().toString(36).substring(7),
          status: 'idle' as const,
          progress: 0,
        }),
      );

      onFilesAccepted(newFiles);
    },
    [onFilesAccepted, maxSizeMb, maxFiles],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxSize: maxSizeMb * 1024 * 1024,
    maxFiles,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
    },
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={clsx(
          'relative flex flex-col items-center justify-center w-full h-64 p-6 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden group bg-card',
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border/60 hover:border-primary/50 hover:bg-muted/50',
          isDragReject && 'border-destructive bg-destructive/5',
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4 text-center z-10">
          <div
            className={clsx(
              'p-4 rounded-full transition-colors duration-300',
              isDragActive
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
              isDragReject && 'bg-destructive/20 text-destructive',
            )}
          >
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {isDragActive ? 'Drop your files here' : 'Click or drag files to upload'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports PDF, DOCX, TXT, and Markdown up to {maxSizeMb}MB
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {dragError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <AlertCircle className="w-4 h-4" />
            <p>{dragError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 space-y-3">
        <AnimatePresence>
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-4 p-4 bg-card border border-border/50 rounded-xl shadow-sm relative overflow-hidden"
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-muted rounded-lg relative overflow-hidden">
                {file.preview ? (
                  <Image src={file.preview} alt="preview" fill className="object-cover" />
                ) : (
                  <FileType2 className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground truncate pr-4">{file.name}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileRemove(file.id);
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <Progress.Root
                    className="relative overflow-hidden bg-secondary rounded-full w-full h-1.5"
                    value={file.progress}
                  >
                    <Progress.Indicator
                      className={clsx(
                        'w-full h-full transition-transform duration-500 ease-out',
                        file.status === 'error' ? 'bg-destructive' : 'bg-primary',
                      )}
                      style={{ transform: `translateX(-${100 - file.progress}%)` }}
                    />
                  </Progress.Root>
                  <span className="text-xs font-mono text-muted-foreground w-8 text-right">
                    {file.progress}%
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1.5">
                  <span
                    className={clsx(
                      'text-xs font-medium capitalize',
                      file.status === 'error'
                        ? 'text-destructive'
                        : file.status === 'done'
                          ? 'text-green-500'
                          : 'text-muted-foreground',
                    )}
                  >
                    {file.status === 'error' ? file.errorMessage || 'Failed' : file.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
