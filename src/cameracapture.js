import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';

function CameraCapture() {
  const [imageData, setImageData] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  //const img = useRef(null);
  //const ocrResult = document.getElementById('ocr-result');
  const ocrResultRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true   
 });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);   
    // Convert the canvas content to a data URL (base64-encoded image)
    const dataURL = canvas.toDataURL('image/jpeg');   
    setImageData(dataURL);

    const processedImageData = preprocessingImage(canvas);
    
    //img.src = dataURL;
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'captured_image.png';
    link.click();

    Tesseract.recognize(
        processedImageData,
        'eng',
        {
            logger: m => console.log(m) // Log progress data
        }
    ).then(({ data: { text } }) => {
        // Display the recognized text in the OCR result div
        ocrResultRef.textContent = text;
        console.log('Recognized text:', text);
    }).catch(err => {
        console.error('Error performing OCR:', err);
        ocrResultRef.textContent = 'Error performing OCR.';
    });

  };

    const preprocessingImage = (canvas) => {
      //const processedImageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.length);
      const context = canvas.getContext('2d');
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      thresholdFilter(imageData.data);
      context.putImageData(imageData, 0, 0);
      console.log("preprocessing..")
      return canvas;
    }
  const thresholdFilter = (pixels, level = 0.5) => {
    if (!pixels || !pixels.length) {
      console.error('invalid pixels')
      return;
    }
    const thresh = Math.floor(level * 255);
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const grey = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const val = grey >= thresh ? 255 : 0;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = val;
    }
  };


  return (
    <div>
      <video ref={videoRef} autoPlay />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureImage}>Capture</button>

      {imageData && <img src={imageData} alt="Captured" />}
      <canvas ref={canvasRef} style={{ display: 'none' }} /> 
      <div ref={ocrResultRef}>OCR results here </div>
    </div>
  );
}

export default CameraCapture;
