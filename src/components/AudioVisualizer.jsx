import React, { useEffect, useRef } from 'react';

const AudioVisualizer = ({ audioRef }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!audioRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 64;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      const barWidth = (canvasRef.current.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        ctx.fillStyle = '#0ed2f7';
        ctx.fillRect(x, canvasRef.current.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    draw();
  }, [audioRef]);

  return <canvas ref={canvasRef} width={600} height={100} />;
};

export default AudioVisualizer;
