import Dexie from 'dexie';

const db = new Dexie('HospitalHospitalDB');

db.version(1).stores({
  doctors: '++id, name, specialty, email, phone',
  appointments: '++id, patientName, doctorId, date, reason, status'
});

const indexedDBService = {
  
  getAllDoctors: async () => {
    return await db.doctors.toArray();
  },
  
  getDoctorById: async (id) => {
    return await db.doctors.get(id);
  },
  
  addDoctor: async (doctor) => {
    return await db.doctors.add(doctor);
  },
  
  updateDoctor: async (id, doctorData) => {
    return await db.doctors.update(id, doctorData);
  },
  
  deleteDoctor: async (id) => {
    return await db.doctors.delete(id);
  },
  
  getAllAppointments: async () => {
    return await db.appointments.toArray();
  },
  
  getAppointmentById: async (id) => {
    return await db.appointments.get(id);
  },
  
  addAppointment: async (appointment) => {
    return await db.appointments.add(appointment);
  },
  
  updateAppointment: async (id, appointmentData) => {
    return await db.appointments.update(id, appointmentData);
  },
  
  deleteAppointment: async (id) => {
    return await db.appointments.delete(id);
  },
  
  getAppointmentsByDoctor: async (doctorId) => {
    return await db.appointments
      .where('doctorId')
      .equals(doctorId)
      .toArray();
  },
  
  initSampleData: async () => {
    try {
      const doctorCount = await db.doctors.count();
      
      if (doctorCount > 0) {
        console.log("Ya existen datos en la base de datos. Omitiendo inicialización.");
        return;
      }
      
      const doctors = [
        { name: 'Dr. Mario', specialty: 'Medicina General', email: 'dr.mario@hospital.com', phone: '555-1234' },
        { name: 'Dr. Simi', specialty: 'Farmacología', email: 'dr.simi@hospital.com', phone: '555-5678' },
        { name: 'Dr. Nick Riviera', specialty: 'Cirugía', email: 'dr.nick@hospital.com', phone: '555-9012' },
        { name: 'Dra. Ana Polo', specialty: 'Psicología', email: 'dra.anapolo@hospital.com', phone: '555-3456' }
      ];
      
      await db.doctors.bulkAdd(doctors);

      const appointments = [
        { patientName: 'Guaripolo', doctorId: 1, date: new Date('2025-03-10T10:00:00'), reason: 'Chequeo anual', status: 'pendiente' },
        { patientName: 'Juanín', doctorId: 2, date: new Date('2025-03-11T11:30:00'), reason: 'Dolor de cabeza', status: 'confirmada' },
        { patientName: 'Bodoque', doctorId: 3, date: new Date('2025-03-12T09:15:00'), reason: 'Vacunación', status: 'pendiente' }
      ];
      
      await db.appointments.bulkAdd(appointments);
      
      console.log('Datos de ejemplo añadidos correctamente');
    } catch (error) {
      console.error('Error al inicializar datos:', error);
    }
  }
};

export default indexedDBService;