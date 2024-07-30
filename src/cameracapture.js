import React, { useState, useRef } from 'react';

function CameraCapture() {
  const [imageData, setImageData] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const img = useRef(null)
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
    const   
 video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);   
    // Convert the canvas content to a data URL (base64-encoded image)
    const dataURL = canvas.toDataURL('image/jpeg');   
 
    setImageData(dataURL);
    img.src = dataURL;
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'captured_image.png';
    link.click();

  };

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureImage}>Capture</button>

      {imageData && <img src={imageData} alt="Captured" />}
      <canvas ref={canvasRef} style={{ display: 'none' }} /> 
    </div>
  );
}

export default CameraCapture;
