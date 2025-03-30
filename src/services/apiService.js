const API_URL = 'https://api.fda.gov/drug/label.json';

/**
 * @param {string} query - Término de búsqueda
 * @param {number} limit - Número máximo de resultados
 */
export const searchDrugs = async (query, limit = 10) => {
  try {
    const url = `${API_URL}?search=${query}&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error en la búsqueda: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error buscando medicamentos:', error);
    throw error;
  }
};

export const getOfflineData = () => {
  return {
    meta: { disclaimer: "Datos de ejemplo para modo offline" },
    results: [
      {
        openfda: { 
          brand_name: ["Paracetamol"], 
          generic_name: ["Acetaminophen"] 
        },
        indications_and_usage: ["Para el alivio temporal de dolores y fiebre"],
        dosage_and_administration: ["Adultos: 500mg cada 4-6 horas según sea necesario"],
        warnings: ["No usar más de 4000mg en 24 horas"]
      },
      {
        openfda: { 
          brand_name: ["Ibuprofeno"], 
          generic_name: ["Ibuprofen"] 
        },
        indications_and_usage: ["Antiinflamatorio para dolor y fiebre"],
        dosage_and_administration: ["Adultos: 200-400mg cada 4-6 horas según sea necesario"],
        warnings: ["Puede aumentar el riesgo de problemas cardiovasculares"]
      }
    ]
  };
};

export default {
  searchDrugs,
  getOfflineData
};