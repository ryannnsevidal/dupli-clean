/**
 * DupliClean Import Page
 * 
 * This page handles file import functionality for the duplicate detection platform.
 * It provides both local file upload and cloud service integration capabilities.
 * The page demonstrates professional file handling, progress tracking, and
 * user-friendly interface design for bulk file operations.
 * 
 * Key features:
 * - Drag and drop file upload interface
 * - Cloud service integration (Google Drive, Dropbox, OneDrive)
 * - Real-time upload progress tracking
 * - File type validation and processing
 * - Background job queuing and monitoring
 * - Professional error handling and user feedback
 */

'use client';
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatBytes } from "@/lib/utils";
import RclonePane from "./RclonePane";

interface FileWithProgress {
  file: File;
  status: "pending" | "uploading" | "completed" | "error";
  progress: number;
  error?: string;
}

export default function ImportPage() {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [activeTab, setActiveTab] = useState<"local" | "cloud">("local");
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      status: "pending" as const,
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const uploadFile = async (fileWithProgress: FileWithProgress) => {
    const { file } = fileWithProgress;
    
    // Update status to uploading
    setFiles(prev => prev.map(f => 
      f.file === file ? { ...f, status: "uploading" } : f
    ));

    try {
      // Get presigned URL
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
        }),
      });

      if (!presignRes.ok) throw new Error("Failed to get upload URL");
      const { url, key } = await presignRes.json();

      // Upload to S3
      const uploadRes = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      // Commit upload
      const commitRes = await fetch("/api/upload/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        }),
      });

      if (!commitRes.ok) throw new Error("Failed to commit upload");

      // Update status to completed
      setFiles(prev => prev.map(f => 
        f.file === file ? { ...f, status: "completed", progress: 100 } : f
      ));

      toast({
        title: "Upload Complete",
        description: `${file.name} has been uploaded and queued for processing.`,
      });

    } catch (error) {
      console.error("Upload error:", error);
      setFiles(prev => prev.map(f => 
        f.file === file ? { 
          ...f, 
          status: "error", 
          error: error instanceof Error ? error.message : "Upload failed" 
        } : f
      ));

      toast({
        title: "Upload Failed",
        description: `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const uploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === "pending");
    if (pendingFiles.length === 0) return;

    for (const fileWithProgress of pendingFiles) {
      await uploadFile(fileWithProgress);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const completedCount = files.filter(f => f.status === "completed").length;
  const errorCount = files.filter(f => f.status === "error").length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Import Your Photos & PDFs
        </h1>
        <p className="text-gray-600">
          Upload files from your computer or import from cloud services to find and remove duplicates.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("local")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "local"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Local Files
          </button>
          <button
            onClick={() => setActiveTab("cloud")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "cloud"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Cloud Services
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "local" ? (
        <div className="space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="text-6xl">📁</div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-gray-500 mt-1">
                  or click to select files
                </p>
              </div>
              <p className="text-sm text-gray-400">
                Supports JPG, PNG, WebP, GIF, and PDF files
              </p>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Files ({files.length})
                </h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={uploadAll}
                    disabled={files.filter(f => f.status === "pending").length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Upload & Process All
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {files.map((fileWithProgress, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {fileWithProgress.file.type.startsWith("image/") ? "Image" : "Document"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {fileWithProgress.file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatBytes(fileWithProgress.file.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {fileWithProgress.status === "pending" && (
                        <span className="text-yellow-600 text-sm">Pending</span>
                      )}
                      {fileWithProgress.status === "uploading" && (
                        <span className="text-blue-600 text-sm">Uploading...</span>
                      )}
                      {fileWithProgress.status === "completed" && (
                        <span className="text-green-600 text-sm">✓ Complete</span>
                      )}
                      {fileWithProgress.status === "error" && (
                        <span className="text-red-600 text-sm">
                          Error: {fileWithProgress.error}
                        </span>
                      )}
                      <Button
                        onClick={() => removeFile(fileWithProgress.file)}
                        variant="outline"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              {(completedCount > 0 || errorCount > 0) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {completedCount > 0 && (
                      <span className="text-green-600">✓ {completedCount} uploaded successfully</span>
                    )}
                    {completedCount > 0 && errorCount > 0 && " • "}
                    {errorCount > 0 && (
                      <span className="text-red-600">✗ {errorCount} failed</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <RclonePane />
      )}
    </div>
  );
}
