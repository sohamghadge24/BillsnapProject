// src/components/Scanner.tsx
import React, { useState } from 'react';
import { Upload, Camera, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FirebaseService } from '../services/firebaseService';
import { getExpenseCategories } from '../utils/helpers';
import { Expense } from '../types/expense';
import UploadScanner from './UploadScanner';
import CameraScanner from './CameraScanner';


interface ScannerProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onAddExpense }) => {
  const { currentUser } = useAuth();
  const [mode, setMode] = useState<'camera' | 'upload' | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [scannedText, setScannedText] = useState<string>('');
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    amount: 0,
    description: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    receipt: ''
  });

  const extractData = (text: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const amountRegex = /(\d+\.\d{2})/g;
    const amounts = lines.flatMap(line => [...line.matchAll(amountRegex)].map(m => parseFloat(m[1])));
    const amount = amounts.length ? Math.max(...amounts) : 0;

    const storeName = lines[0] || 'Unknown Store';
    const description = lines.join('\n');

    const dateMatch = text.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/);
    const date = dateMatch?.[1] || new Date().toISOString().split('T')[0];

    setFormData({
      ...formData,
      amount,
      description,
      category: 'Other',
      date
    });
  };

  const handleScanned = ({ image, text }: { image: string; text: string }) => {
    setScannedImage(image);
    setScannedText(text);
    extractData(text);
  };

  const handleSave = async () => {
    if (!currentUser) return;
    try {
      const expenseId = await FirebaseService.addExpense(currentUser.uid, {
        ...formData,
        receipt: ''
      });

      if (scannedImage) {
        const blob = await (await fetch(scannedImage)).blob();
        const file = new File([blob], `receipt_${Date.now()}.jpg`, { type: 'image/jpeg' });

        const receiptUrl = await FirebaseService.uploadReceipt(file, currentUser.uid, expenseId);
        await FirebaseService.updateExpense(expenseId, { receipt: receiptUrl });
      }

      onAddExpense({ ...formData, receipt: '' });
      reset();
    } catch (err) {
      console.error('Error saving:', err);
    }
  };

  const reset = () => {
    setMode(null);
    setScannedImage(null);
    setScannedText('');
    setFormData({
      amount: 0,
      description: '',
      category: 'Other',
      date: new Date().toISOString().split('T')[0],
      receipt: ''
    });
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">Scan a Receipt</h2>

      {!mode && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setMode('camera')}
            className="p-6 border-2 border-dashed rounded-lg hover:border-blue-500 text-center"
          >
            <Camera className="mx-auto text-blue-600 w-8 h-8" />
            <p className="mt-2">Use Camera</p>
          </button>
          <button
            onClick={() => setMode('upload')}
            className="p-6 border-2 border-dashed rounded-lg hover:border-green-500 text-center"
          >
            <Upload className="mx-auto text-green-600 w-8 h-8" />
            <p className="mt-2">Upload Image</p>
          </button>
        </div>
      )}

      {mode === 'camera' && <CameraScanner onScanned={(data) => console.log('OCR Result:', data.text)} />
}
      {mode === 'upload' && <UploadScanner onScanned={handleScanned} />}

      {scannedImage && (
        <div className="grid md:grid-cols-2 gap-6 pt-6">
          <div>
            <img src={scannedImage} alt="Scanned" className="w-full rounded-lg border" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Extracted Data</h3>
            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            />
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <select
              className="w-full border p-2 rounded"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {getExpenseCategories().map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />

            <div className="flex gap-4 pt-4">
              <button onClick={handleSave} className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700">
                <Check className="inline w-5 h-5 mr-2" /> Save
              </button>
              <button onClick={reset} className="flex-1 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300">
                <X className="inline w-5 h-5 mr-2" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

