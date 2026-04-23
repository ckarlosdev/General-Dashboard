import React, { useEffect, useRef } from 'react';

interface CanvasRendererProps {
  data: string | null;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // 1. Parsear el string (manejando el escape de comillas si es necesario)
      const shapes = JSON.parse(data);
      
      // Limpiar el canvas antes de dibujar
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach((shape: any) => {
        if (shape.type === 'line') {
          ctx.beginPath();
          ctx.strokeStyle = shape.color || '#000';
          ctx.lineWidth = shape.width || 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          // Asumiendo que shape tiene un array de puntos [{x, y}, ...]
          if (shape.points && shape.points.length > 0) {
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            shape.points.forEach((p: any) => {
              ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
          }
        }
        // Puedes agregar más tipos aquí: 'rect', 'circle', etc.
      });
    } catch (error) {
      console.error("Error rendering canvas data:", error);
    }
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={800} // Resolución interna alta
      height={600}
      style={{
        width: '100%',   // Responsivo al contenedor
        height: '100%',
        display: 'block',
        touchAction: 'none'
      }}
    />
  );
};

export default CanvasRenderer;