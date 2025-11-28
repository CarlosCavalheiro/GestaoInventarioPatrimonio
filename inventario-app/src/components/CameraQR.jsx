import { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import './CameraQR.css';

function CameraQR({ form, setForm, isManualEntry, zoomLevel = 1 }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Aplicar zoom e foco contínuo
  useEffect(() => {
    const video = webcamRef.current?.video;
    if (!video || !video.srcObject) return;

    const [track] = video.srcObject.getVideoTracks();
    if (!track || !track.getCapabilities) return;

    const capabilities = track.getCapabilities();
    const constraints = { advanced: [] };

    // Zoom
    if (capabilities.zoom) {
      const min = capabilities.zoom.min || 1;
      const max = capabilities.zoom.max || 3;
      constraints.advanced.push({ zoom: Math.min(Math.max(zoomLevel, min), max) });
    }

    // Foco automático ou contínuo
    if (capabilities.focusMode) {
      if (capabilities.focusMode.includes('continuous')) {
        constraints.advanced.push({ focusMode: 'continuous' });
      } else if (capabilities.focusMode.includes('auto')) {
        constraints.advanced.push({ focusMode: 'auto' });
      }
    }

    // Distância de foco (fallback)
    if (capabilities.focusDistance) {
      constraints.advanced.push({ focusDistance: capabilities.focusDistance.min });
    }

    track.applyConstraints(constraints).catch(err => {
      console.warn('Não foi possível aplicar constraints:', err);
    });
  }, [zoomLevel]);

  // Loop de leitura de QR Code
  useEffect(() => {
    if (isManualEntry) return;
    let animationFrameId;

    const scan = () => {
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });

        if (code?.data && code.data !== form.numeroPatrimonio) {
          const numeroPatrimonio = code.data.split('-')[0].trim();
          setForm(f => ({ ...f, numeroPatrimonio, placaIdentificacaoOk: true }));
        }
      }

      animationFrameId = requestAnimationFrame(scan);
    };

    animationFrameId = requestAnimationFrame(scan);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isManualEntry, form.numeroPatrimonio, setForm]);

  return (
    <div className="camera-container relative mt-4 border rounded-lg overflow-hidden">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'environment', width: 1280, height: 720 }}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        className="overlay absolute inset-0 flex justify-center items-center pointer-events-none"
      >
        <div
          className="scanner-frame border-4 border-blue-500 rounded-lg w-64 h-64 relative animate-pulse"
          style={{ boxShadow: '0 0 15px rgba(245, 132, 141, 0.5)' }}
        >
          <div
            className="scanner-line absolute top-0 left-0 w-full h-1 bg-blue-500 animate-slideDown"
          ></div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>

  );
}

export default CameraQR;
