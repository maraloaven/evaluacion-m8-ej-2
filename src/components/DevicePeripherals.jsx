import { useState, useRef } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';

const DevicePeripherals = () => {
  // Estados para la cámara
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Activar la cámara
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true
      });
      
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      setError('No se pudo acceder a la cámara. Por favor, permite el acceso y vuelve a intentarlo.');
      setIsCameraActive(false);
    }
  };

  // Desactivar la cámara
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  // Capturar imagen
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
    }
  };

  // Tomar otra foto
  const resetCamera = () => {
    setCapturedImage(null);
  };

  return (
    <Card className="mt-4">
      <Card.Header>
        <h4>Escáner de Documentos Médicos</h4>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          Usa la cámara para escanear recetas médicas y resultados de laboratorio.
        </Card.Text>
        
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}
        
        <div className="text-center mb-3">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Imagen capturada" 
              className="img-fluid border rounded"
              style={{ maxHeight: '300px' }}
            />
          ) : (
            <div>
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                className="border rounded"
                style={{ 
                  maxHeight: '300px', 
                  maxWidth: '100%', 
                  display: isCameraActive ? 'block' : 'none',
                  margin: '0 auto'
                }}
              />
              {!isCameraActive && (
                <div className="bg-light border rounded p-5">
                  <p className="mb-0">La cámara está desactivada</p>
                </div>
              )}
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        
        <div className="d-flex justify-content-center gap-2 mb-3">
          {!isCameraActive && !capturedImage ? (
            <Button variant="primary" onClick={startCamera}>
              Activar Cámara
            </Button>
          ) : isCameraActive && !capturedImage ? (
            <>
              <Button variant="success" onClick={captureImage}>
                Capturar Imagen
              </Button>
              <Button variant="secondary" onClick={stopCamera}>
                Desactivar Cámara
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={resetCamera}>
                Tomar Otra Foto
              </Button>
              <Button variant="success">
                Guardar Documento
              </Button>
            </>
          )}
        </div>
        
        {capturedImage && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Documento</Form.Label>
              <Form.Select>
                <option>Selecciona el tipo de documento</option>
                <option value="prescription">Receta Médica</option>
                <option value="labResults">Resultados de Laboratorio</option>
                <option value="medicalReport">Informe Médico</option>
                <option value="other">Otro</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                placeholder="Añade una descripción para el documento..."
              />
            </Form.Group>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default DevicePeripherals;