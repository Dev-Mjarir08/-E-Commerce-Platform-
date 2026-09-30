import React, { useState } from "react";
import { UploadCloud, X, Star, Image as ImageIcon, FileText, ArrowLeft } from "lucide-react";

export default function MediaUpload({ maxFiles = 6, onFilesChange, onBack }) {
  const [files, setFiles] = useState([
    {
      id: "m1",
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80",
      name: "bamboo-watch-main.jpg",
      isCover: true,
      size: "1.2 MB",
    },
    {
      id: "m2",
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80",
      name: "organizer-side.jpg",
      isCover: false,
      size: "890 KB",
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      console.log("Navigate back");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const uploadedFiles = Array.from(e.dataTransfer.files);
    processFiles(uploadedFiles);
  };

  const handleFileInput = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    processFiles(uploadedFiles);
  };

  const processFiles = (uploadedFiles) => {
    const newFileEntries = uploadedFiles.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      name: file.name,
      isCover: files.length === 0 && index === 0,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
    }));

    const updatedFiles = [...files, ...newFileEntries];
    setFiles(updatedFiles);
    if (onFilesChange) onFilesChange(updatedFiles);
  };

  const setCoverImage = (id) => {
    const updatedFiles = files.map((file) => ({
      ...file,
      isCover: file.id === id,
    }));
    setFiles(updatedFiles);
    if (onFilesChange) onFilesChange(updatedFiles);
  };

  const removeFile = (id) => {
    const updatedFiles = files.filter((f) => f.id !== id);
    setFiles(updatedFiles);
    if (onFilesChange) onFilesChange(updatedFiles);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* BACK BUTTON */}
      <div>
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group mb-2"
        >
          <ArrowLeft size={16} className="text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="text-emerald-600" size={18} /> Product Media & Images
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload up to {maxFiles} high-resolution product photos. First image is featured.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {files.length} / {maxFiles} Files
        </span>
      </div>

      {/* DROPZONE AREA */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-emerald-500 bg-emerald-50/50"
            : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="media-file-input"
        />
        <label htmlFor="media-file-input" className="cursor-pointer space-y-2 block">
          <div className="p-3 bg-emerald-100 text-emerald-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
            <UploadCloud size={24} />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              Click to upload or drag & drop files here
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              PNG, JPG, WEBP or GIF up to 10MB each
            </p>
          </div>
        </label>
      </div>

      {/* MEDIA PREVIEW GRID */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {files.map((file) => (
            <div
              key={file.id}
              className={`relative group rounded-xl overflow-hidden border-2 bg-slate-50 ${
                file.isCover ? "border-emerald-500" : "border-slate-200"
              }`}
            >
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-28 object-cover"
              />

              {/* Cover Tag */}
              {file.isCover && (
                <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <Star size={10} fill="currentColor" /> Main
                </span>
              )}

              {/* Hover Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!file.isCover && (
                  <button
                    type="button"
                    onClick={() => setCoverImage(file.id)}
                    title="Set as Featured Cover"
                    className="p-1.5 bg-white text-slate-800 hover:text-emerald-600 rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  title="Remove Image"
                  className="p-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* File details footer */}
              <div className="p-2 bg-white text-[10px] truncate border-t border-slate-100">
                <p className="font-semibold text-slate-700 truncate">{file.name}</p>
                <p className="text-slate-400">{file.size}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}