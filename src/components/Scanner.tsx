// src/components/Scanner.tsx
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, AlertCircle } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { useAuth } from '../context/AuthContext';
import { FirebaseService } from '../services/firebaseService';
import { getExpenseCategories } from '../utils/helpers';
import { Expense } from '../types/expense';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserDetails } from '../types/UserDetails';
import { uid } from 'chart.js/helpers';

interface ScannerProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onAddExpense }) => {
  const { user } = useAuth();
  console.log('Logged-in user:', user);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch {
      setError('Camera access denied. Please allow permissions or upload an image.');
    }
  };

  const stopCamera = () => {
    const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks() ?? [];
    tracks.forEach(track => track.stop());
    setIsScanning(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      setPreviewImage(imageDataUrl);
      processImage(imageDataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      processImage(result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageDataUrl: string) => {
    setLoading(true);
    setError(null);
    try {
      const worker = await Tesseract.createWorker('eng', 1);
      const { data: { text } } = await worker.recognize(imageDataUrl);
      await worker.terminate();

      const extractedData = extractReceiptData(text);

      let receiptUrl = '';
      if (user) {
        const blob = await (await fetch(imageDataUrl)).blob();
        const file = new File([blob], `receipt_${Date.now()}.jpg`, { type: 'image/jpeg' });
        receiptUrl = await FirebaseService.uploadReceipt(file, user.uid);
      }

      setScannedData({
        ...extractedData,
        receipt: receiptUrl,
        date: extractedData.date || new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('OCR Error:', err);
      setError('Image processing failed. Try another photo.');
    } finally {
      setLoading(false);
    }
  };

  const extractReceiptData = (text: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const itemPattern = /^(.+?)\s+(\d+\.\d{2})$/;
    const items: { name: string; price: number }[] = [];
    let subtotal = 0, tax = 0, total = 0;

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (itemPattern.test(line)) {
        const match = line.match(itemPattern);
        if (match) items.push({ name: match[1], price: parseFloat(match[2]) });
      }
      if (lower.includes('subtotal')) {
        const match = line.match(/(\d+\.\d{2})/);
        if (match) subtotal = parseFloat(match[1]);
      }
      if (lower.includes('tax')) {
        const match = line.match(/(\d+\.\d{2})/);
        if (match) tax = parseFloat(match[1]);
      }
      if (lower.includes('total') || lower.includes('amount due') || lower.includes('balance')) {
        const match = line.match(/(\d+\.\d{2})/);
        if (match) total = parseFloat(match[1]);
      }
    }

    const storeName = lines[0] || 'Unknown Store';
    const dateMatch = text.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/);
    const timeMatch = text.match(/(\d{1,2}[:\.]\d{2}(?:\s*[APMapm]{2})?)/);
    console.log("Scanned data:", scannedData);
    return {
      storeName,
      items,
      subtotal,
      tax,
      total,
      date: dateMatch?.[1] || '',
      time: timeMatch?.[1] || '',
      description: items.map(i => `${i.name} - $${i.price.toFixed(2)}`).join(', '),
      category: 'Other',
      amount: total || subtotal || 0,
    };
  };

  const handleSaveExpense = async () => {
  if (!scannedData || !user) {
    setError('User not authenticated or scanned data missing.');
    return;
  }

  const expenseData = {

    description: scannedData.description || 'Receipt',
  category: scannedData.category || 'Other',
  date: scannedData.date,
  receipt: scannedData.receipt || '',
  storeName: scannedData.storeName || 'Unknown Store',
  subtotal: scannedData.subtotal || 0,
  tax: scannedData.tax || 0,
  total: scannedData.total || scannedData.amount || 0,
  amount: scannedData.amount || scannedData.total || 0,  // ✅ Add this line
  time: scannedData.time || '',
  createdAt: new Date().toISOString(),
  };

  try {
    const expenseRef = doc(collection(db, 'users', user.uid, 'expenses'));
    await setDoc(expenseRef, expenseData);
    console.log('Expense saved:', expenseData);
    onAddExpense(expenseData);
    resetScanner();
    console.log('Scanned data:', scannedData);
  } catch (err) {
    console.error('Failed to save expense to Firestore:', err);
    setError('Failed to save receipt to database.');
  }
};


  const resetScanner = () => {
    stopCamera();
    setScannedData(null);
    setPreviewImage(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto font-sans bg-white rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900">📸 Receipt Scanner</h2>
      <p className="text-gray-600">Capture or upload receipts to extract data with AI and save to your expense tracker.</p>

      {error && (
        <div className="bg-red-100 p-4 border-l-4 border-red-500 rounded-r-lg flex items-center">
          <AlertCircle className="text-red-500 mr-3" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!isScanning && !previewImage && !scannedData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={startCamera} className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center text-gray-700 hover:border-blue-500 hover:text-blue-600 transition">
            <Camera className="w-8 h-8 mx-auto text-blue-600" />
            <p className="mt-2 text-sm font-medium">Use Camera</p>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center text-gray-700 hover:border-green-500 hover:text-green-600 transition">
            <Upload className="w-8 h-8 mx-auto text-green-600" />
            <p className="mt-2 text-sm font-medium">Upload Image</p>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </div>
      )}

      {isScanning && (
        <div>
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg shadow-md" />
          <div className="mt-4 flex justify-center space-x-4">
            <button onClick={capturePhoto} className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
              <Camera className="inline w-5 h-5 mr-2" /> Capture
            </button>
            <button onClick={stopCamera} className="bg-gray-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-gray-700 transition">
              <X className="inline w-5 h-5 mr-2" /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center p-8">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 font-medium">Processing receipt with OCR...</p>
        </div>
      )}

      {previewImage && scannedData && (
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Receipt Preview</h3>
            <img src={previewImage} alt="Receipt preview" className="w-full rounded-lg border border-gray-300 shadow-md" />
          </div>
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold text-gray-800">Extracted Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">Store Name</label>
              <input
                type="text"
                value={scannedData.storeName || ''}
                onChange={(e) => setScannedData({ ...scannedData, storeName: e.target.value })}
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={scannedData.amount || ''}
                onChange={(e) => setScannedData({ ...scannedData, amount: parseFloat(e.target.value) })}
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={scannedData.category || ''}
                onChange={(e) => setScannedData({ ...scannedData, category: e.target.value })}
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm"
              >
                {getExpenseCategories().map(cat => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={4}
                value={scannedData.description || ''}
                onChange={(e) => setScannedData({ ...scannedData, description: e.target.value })}
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>Subtotal:</strong> ${scannedData.subtotal?.toFixed(2)}</p>
              <p><strong>Tax:</strong> ${scannedData.tax?.toFixed(2)}</p>
              <p><strong>Total:</strong> ${scannedData.total?.toFixed(2)}</p>
              <p><strong>Date:</strong> {scannedData.date}</p>
              <p><strong>Time:</strong> {scannedData.time}</p>
            </div>

            <div className="flex space-x-3 pt-4">
                     <button
                        onClick={handleSaveExpense}
                        
                        className={`flex-1 px-4 py-2 rounded-lg   bg-green-600 text-white hover:bg-green-700`}
                      >
                        <Check className="inline w-5 h-5 mr-2" /> Save
                      </button>
              <button onClick={resetScanner} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                <X className="inline w-5 h-5 mr-2" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
