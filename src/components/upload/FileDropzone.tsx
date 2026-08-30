import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileUp, CheckCircle, AlertCircle, X } from 'lucide-react';

export interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  acceptedFormats?: string[];
  error?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  acceptedFormats = ['.csv', '.json', '.xlsx'],
  error,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const acceptRecord = acceptedFormats.reduce((acc, format) => {
    if (format === '.csv') acc['text/csv'] = ['.csv'];
    else if (format === '.json') acc['application/json'] = ['.json'];
    else if (format === '.xlsx') acc['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = ['.xlsx'];
    return acc;
  }, {} as Record<string, string[]>);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptRecord,
    maxFiles: 1,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  const getBorderColor = () => {
    if (error || isDragReject) return 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
    if (isDragActive) return 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] bg-cyan-900/10';
    if (selectedFile) return 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)] bg-green-900/5';
    return 'border-slate-700 hover:border-cyan-500/30 hover:bg-slate-800/50';
  };

  return (
    <div className="w-full">
      <div {...getRootProps()}>
        <motion.div
          animate={{ scale: isDragActive ? 1.02 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`relative w-full p-10 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 min-h-[240px] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${getBorderColor()}`}
          role="button"
          aria-label="File upload dropzone"
          tabIndex={0}
        >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="p-4 rounded-full bg-green-500/20 text-green-400">
                <CheckCircle size={40} className="drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </div>
              <div>
                <p className="text-lg font-bold text-white mb-1">{selectedFile.name}</p>
                <p className="text-sm text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={removeFile}
                className="mt-4 flex items-center space-x-2 text-sm text-slate-400 hover:text-white bg-slate-800 px-4 py-2 rounded-lg transition-colors border border-slate-700 hover:border-slate-500"
              >
                <X size={16} />
                <span>Remove File</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className={`p-4 rounded-full ${isDragActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                {isDragActive ? <FileUp size={48} className="drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" /> : <UploadCloud size={48} />}
              </div>
              
              <div>
                <p className="text-xl font-bold text-slate-200 mb-2">
                  {isDragActive ? 'DROP DATASET NOW' : 'DROP SCREENING DATA HERE'}
                </p>
                <p className="text-sm text-slate-400 mb-4">
                  Drag and drop your file, or <span className="text-cyan-400 font-semibold underline decoration-cyan-400/30 underline-offset-4">Browse Files</span>
                </p>
              </div>

              <div className="flex gap-2">
                {acceptedFormats.map(format => (
                  <span key={format} className="px-2 py-1 text-xs font-mono font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {format}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 flex items-center space-x-2 text-red-400 text-sm bg-red-950/30 p-3 rounded-lg border border-red-900/50"
        >
          <AlertCircle size={16} className="shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}
    </div>
  );
};
