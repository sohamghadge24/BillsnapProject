// File: src/components/UploadScanner.tsx
import React, { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { UploadCloud } from 'lucide-react';

interface UploadScannerProps {
  onExtract: (imageDataUrl: string, text: string) => void;
  onError: (error: string) => void;
}

const UploadScanner: React.FC<UploadScannerProps> = ({ onExtract, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLLabelElement>(null);

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      try {
        const worker = await Tesseract.createWorker('eng', 1);
        const { data: { text } } = await worker.recognize(imageDataUrl);
        await worker.terminate();
        onExtract(imageDataUrl, text);
      } catch (err) {
        console.error('OCR Error:', err);
        onError('Image processing failed. Try another photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id="upload-input"
      />

      <label
        htmlFor="upload-input"
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full max-w-md p-6 text-center border-2 border-dashed rounded-lg cursor-pointer transition 
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
      >
        <div className="flex flex-col items-center gap-2 text-gray-700">
          <UploadCloud size={32} />
          <p className="font-medium">Click to upload or drag & drop image here</p>
          <p className="text-xs text-gray-500">Only PNG, JPG, JPEG accepted</p>
        </div>
      </label>
    </div>
  );
};

export default UploadScanner;
