import { useState, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UploadCloud,
  File as FileIcon,
  CheckCircle,
  AlertTriangle,
  X,
  Download,
  RotateCcw,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/Toast';
import { uploadCsv } from '@/api/requests';
import type { UploadResult } from '@/types';

export function UploadPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);
      const res = await uploadCsv(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      return res;
    },
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      showToast(`Upload complete: ${data.validRows} valid rows processed.`, 'success');
    },
    onError: (err: unknown) => {
      const message = (err as { message?: string })?.message || 'Upload failed. Please try again.';
      showToast(message, 'error');
    },
  });

  const handleFileSelect = useCallback((selectedFile: File | undefined) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith('.csv')) {
      showToast('Please select a CSV file.', 'error');
      return;
    }
    setFile(selectedFile);
    setResult(null);
  }, [showToast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleUpload = () => {
    if (!file) return;
    uploadMutation.mutate(file);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Upload Service Requests</h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload a CSV file containing service requests. The backend will validate and process the data.
          </p>
        </div>

        {/* Upload Area */}
        {!result && (
          <>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
                isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                isDragging ? 'bg-brand-100' : 'bg-slate-100'
              }`}>
                <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-brand-600' : 'text-slate-400'}`} />
              </div>
              <p className="text-base font-medium text-slate-900">
                {isDragging ? 'Drop your file here' : 'Drag & drop your CSV file here'}
              </p>
              <p className="text-sm text-slate-500 mt-1">or</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => fileInputRef.current?.click()}
                icon={<FileIcon className="w-4 h-4" />}
              >
                Browse Files
              </Button>
              <p className="text-xs text-slate-400 mt-4">Supports .csv files up to 10MB</p>
            </div>

            {/* Selected File */}
            {file && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                      <FileIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                      <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {uploadMutation.isPending && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleUpload}
                    loading={uploadMutation.isPending}
                    icon={!uploadMutation.isPending ? <UploadCloud className="w-4 h-4" /> : undefined}
                  >
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
                  </Button>
                  <Button variant="outline" onClick={handleReset} disabled={uploadMutation.isPending}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* CSV Format Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Expected CSV Format</h3>
              <p className="text-sm text-blue-700 mb-2">Your CSV should include the following columns:</p>
              <code className="block text-xs text-blue-800 bg-blue-100 rounded-lg p-3 font-mono">
                request_id, department, service_type, current_stage, priority, status, request_date, deadline
              </code>
            </div>
          </>
        )}

        {/* Upload Result */}
        {result && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Upload Complete</h3>
                  <p className="text-sm text-slate-500">{file?.name} has been processed.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-slate-900 tabular-nums">{result.totalRows}</p>
                  <p className="text-sm text-slate-500 mt-1">Total Rows</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-600 tabular-nums">{result.validRows}</p>
                  <p className="text-sm text-emerald-600 mt-1">Valid Rows</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-red-600 tabular-nums">{result.invalidRows}</p>
                  <p className="text-sm text-red-600 mt-1">Invalid Rows</p>
                </div>
              </div>
            </div>

            {/* Validation Errors */}
            {result.errors.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-semibold text-slate-900">Validation Errors</h3>
                  <span className="text-xs text-slate-500">({result.errors.length} rows with issues)</span>
                </div>
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-5 font-semibold">Row</th>
                        <th className="py-3 px-5 font-semibold">Field</th>
                        <th className="py-3 px-5 font-semibold">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.errors.map((err, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-3 px-5 font-semibold text-slate-900 tabular-nums">{err.row}</td>
                          <td className="py-3 px-5 text-slate-600">{err.field}</td>
                          <td className="py-3 px-5 text-red-600">{err.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleReset} icon={<RotateCcw className="w-4 h-4" />}>
                Upload Another File
              </Button>
              <Button variant="outline" icon={<Download className="w-4 h-4" />}>
                Download Error Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
