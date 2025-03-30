import { useState, useEffect } from 'react';
import { Table, Form, Card, Badge, Button, InputGroup, Alert } from 'react-bootstrap';
import indexedDBService from '../services/indexedDB';
import localStorageService from '../services/localStorage';

const AppointmentList = ({ onEdit, refreshTrigger }) => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadAllData();
  }, [refreshTrigger]);

  async function loadAllData() {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      console.log("Cargando datos...");
      
      const doctorsList = await indexedDBService.getAllDoctors();
      console.log(`Se encontraron ${doctorsList.length} médicos`);
      
      const doctorsMap = {};
      doctorsList.forEach(doctor => {
        doctorsMap[doctor.id] = doctor;
      });
      
      const appointmentsList = await indexedDBService.getAllAppointments();
      console.log(`Se encontraron ${appointmentsList.length} citas en la base de datos`);
      
      const appointmentIds = appointmentsList.map(a => a.id);
      const uniqueIds = new Set(appointmentIds);
      
      if (appointmentIds.length !== uniqueIds.size) {
        console.warn(`¡Se detectaron duplicados! ${appointmentIds.length} IDs vs ${uniqueIds.size} únicos`);
      }
      
      const appointmentsMap = new Map();
      appointmentsList.forEach(appointment => {
        appointmentsMap.set(appointment.id, appointment);
      });
      
      const uniqueAppointments = Array.from(appointmentsMap.values());
      console.log(`Lista final de citas: ${uniqueAppointments.length}`);
      
      const sessionData = localStorageService.getSessionData();
      
      setDoctors(doctorsMap);
      setAppointments(uniqueAppointments);
      setSearchHistory(sessionData.searchHistory || []);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setErrorMessage('Error al cargar datos. Por favor, recarga la página.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      localStorageService.addToSearchHistory(e.target.value);
      const sessionData = localStorageService.getSessionData();
      setSearchHistory(sessionData.searchHistory || []);
    }
  };

  const getFilteredAppointments = () => {
    if (!searchTerm.trim()) return appointments;
    
    return appointments.filter(appointment => {
      const patientNameMatch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      const doctorMatch = doctors[appointment.doctorId]?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const reasonMatch = appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
      
      return patientNameMatch || doctorMatch || reasonMatch;
    });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta cita?')) {
      try {
        await indexedDBService.deleteAppointment(id);
        
        setAppointments(prevAppointments => 
          prevAppointments.filter(appointment => appointment.id !== id)
        );
      } catch (error) {
        console.error('Error al eliminar la cita:', error);
        alert('No se pudo eliminar la cita. Intente nuevamente.');
      }
    }
  };

  const useSearchTerm = (term) => {
    setSearchTerm(term);
  };

  const clearSearchHistory = () => {
    localStorageService.clearSearchHistory();
    setSearchHistory([]);
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando citas...</p>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();

  return (
    <Card>
      <Card.Body>
        {errorMessage && (
          <Alert variant="danger" className="mb-3">
            {errorMessage}
          </Alert>
        )}
        
        <div className="mb-4">
          <Form.Group>
            <Form.Label>Buscar citas</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar por paciente, doctor o motivo..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyUp={handleSearch}
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </Button>
              )}
            </InputGroup>
          </Form.Group>
          
          {searchHistory.length > 0 && (
            <div className="mt-2">
              <small className="text-muted">Búsquedas recientes:</small>
              <div className="d-flex flex-wrap gap-1 mt-1">
                {searchHistory.slice(0, 5).map((term, index) => (
                  <Badge 
                    key={index} 
                    bg="light" 
                    text="dark" 
                    className="px-2 py-1 cursor-pointer"
                    style={{cursor: 'pointer'}}
                    onClick={() => useSearchTerm(term)}
                  >
                    {term}
                  </Badge>
                ))}
                {searchHistory.length > 0 && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 ms-2"
                    onClick={clearSearchHistory}
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {filteredAppointments.length === 0 ? (
          <div className="text-center my-5">
            <p className="text-muted">No hay citas que coincidan con su búsqueda</p>
          </div>
        ) : (
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Paciente</th>
                <th>Doctor</th>
                <th>Fecha y Hora</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.patientName}</td>
                  <td>{doctors[appointment.doctorId]?.name || 'Doctor no disponible'}</td>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{appointment.reason}</td>
                  <td>
                    <Badge 
                      bg={
                        appointment.status === 'pendiente' ? 'secondary' :
                        appointment.status === 'confirmada' ? 'primary' :
                        appointment.status === 'completada' ? 'success' : 'danger'
                      }
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => onEdit(appointment)} 
                        title="Editar cita"
                      >
                        ✏️
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(appointment.id)} 
                        title="Eliminar cita"
                      >
                        🗑️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default AppointmentList;