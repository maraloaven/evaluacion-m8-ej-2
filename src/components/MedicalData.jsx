import { useState } from 'react';
import { 
  Card, Form, Button, InputGroup, Alert, Spinner, 
  ListGroup, Badge, Accordion 
} from 'react-bootstrap';
import { searchDrugs, getOfflineData } from '../services/apiService';

const MedicalData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Por favor ingresa un medicamento para buscar');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      let results;

      if (!isOnline) {
        results = getOfflineData();
        setSearchResults(results);
      } else {
        results = await searchDrugs(searchTerm, 10);
        setSearchResults(results);
      }
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      setError(`Error: ${err.message || 'Ha ocurrido un problema al realizar la búsqueda'}`);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="mt-4">
      <Card.Header>
        <h4>Base de Datos de Medicamentos</h4>
      </Card.Header>
      <Card.Body>
        {!isOnline && (
          <Alert variant="warning">
            <Alert.Heading>Modo sin conexión</Alert.Heading>
            <p>
              Estás navegando sin conexión a internet. Se mostrarán datos de ejemplo.
            </p>
          </Alert>
        )}

        <Form onSubmit={handleSearch}>
          <Form.Group className="mb-3">
            <Form.Label>Buscar medicamentos</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Ej: paracetamol, ibuprofeno..."
                value={searchTerm}
                onChange={handleInputChange}
                disabled={isSearching}
              />
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSearching || !searchTerm.trim()}
              >
                {isSearching ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Buscando...
                  </>
                ) : 'Buscar'}
              </Button>
            </InputGroup>
          </Form.Group>
        </Form>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        {!error && searchResults && (
          <div className="search-results mt-4">
            <h5>Resultados de la búsqueda</h5>
            
            {searchResults.results && searchResults.results.length > 0 ? (
              <ListGroup className="mb-3">
                {searchResults.results.slice(0, 5).map((item, index) => (
                  <ListGroup.Item key={index}>
                    <DrugResult drug={item} />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <Alert variant="info">
                No se encontraron resultados para esta búsqueda. Intenta con otros términos.
              </Alert>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

const DrugResult = ({ drug }) => {
  const getBrandName = () => {
    if (drug.openfda && drug.openfda.brand_name) {
      return drug.openfda.brand_name[0];
    }
    return "Nombre no disponible";
  };

  const getGenericName = () => {
    if (drug.openfda && drug.openfda.generic_name) {
      return drug.openfda.generic_name[0];
    }
    return "Nombre genérico no disponible";
  };

  return (
    <div>
      <h5>{getBrandName()}</h5>
      <Badge bg="info" className="mb-2">{getGenericName()}</Badge>

      <Accordion className="mt-2">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Indicaciones</Accordion.Header>
          <Accordion.Body>
            {drug.indications_and_usage ? (
              <p>{drug.indications_and_usage[0]}</p>
            ) : (
              <p>No hay información de indicaciones disponible</p>
            )}
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="1">
          <Accordion.Header>Dosis y Administración</Accordion.Header>
          <Accordion.Body>
            {drug.dosage_and_administration ? (
              <p>{drug.dosage_and_administration[0]}</p>
            ) : (
              <p>No hay información de dosis disponible</p>
            )}
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="2">
          <Accordion.Header>Advertencias</Accordion.Header>
          <Accordion.Body>
            {drug.warnings ? (
              <p>{drug.warnings[0]}</p>
            ) : (
              <p>No hay advertencias disponibles</p>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default MedicalData;