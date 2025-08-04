import React, { useEffect, useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { getStorage, ref, uploadString } from 'firebase/storage';

const CameraScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraOn(true);
        setError('');
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Check permissions or HTTPS.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOn(false);
  };

  useEffect(() => {
    return () => {
      stopCamera(); // Clean up when unmounted
    };
  }, []);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    const dataUrl = canvasRef.current.toDataURL('image/jpeg');
    setImageData(dataUrl);
    runOCR(dataUrl);
  };

  const runOCR = async (image: string) => {
    setLoading(true);
    setOcrText('');
    try {
      const result = await Tesseract.recognize(image, 'eng');
      setOcrText(result.data.text);
    } catch (err) {
      console.error('OCR failed:', err);
      setError('Failed to extract text.');
    } finally {
      setLoading(false);
    }
  };

  const uploadToFirebase = async () => {
    if (!imageData) return;
    try {
      const storage = getStorage();
      const filename = `receipts/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadString(storageRef, imageData, 'data_url');
      alert('✅ Uploaded to Firebase');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('❌ Upload failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-center">📷 Camera Scanner</h2>

      {error && <p className="text-red-600 text-center">{error}</p>}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full border rounded"
      />

      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {!isCameraOn ? (
          <button
            onClick={startCamera}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ▶️ Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            ⛔ Stop Camera
          </button>
        )}

        <button
          onClick={captureImage}
          disabled={!isCameraOn}
          className={`px-4 py-2 rounded ${
            isCameraOn
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
        >
          📸 Capture
        </button>

        <button
          onClick={uploadToFirebase}
          disabled={!imageData}
          className={`px-4 py-2 rounded ${
            imageData
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
        >
          ☁️ Upload
        </button>
      </div>

      {loading && <p className="text-blue-500 text-center">⏳ Scanning text...</p>}
      {ocrText && (
        <div className="bg-gray-100 p-3 rounded text-sm">
          <strong>🧠 Extracted Text:</strong>
          <pre className="whitespace-pre-wrap">{ocrText}</pre>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScanner;
