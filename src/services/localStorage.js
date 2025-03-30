const USER_PREFERENCES_KEY = 'hospital_user_preferences';
const SESSION_DATA_KEY = 'hospital_session_data';

const localStorageService = {
  getUserPreferences: () => {
    try {
      const preferencesJson = localStorage.getItem(USER_PREFERENCES_KEY);
      
      if (preferencesJson) {
        return JSON.parse(preferencesJson);
      } else {
        return {
          theme: 'light',
          fontSize: 'medium',
          notifications: true,
          language: 'es'
        };
      }
    } catch (error) {
      console.error('Error al leer preferencias:', error);
      return {
        theme: 'light',
        fontSize: 'medium',
        notifications: true,
        language: 'es'
      };
    }
  },
  
  saveUserPreferences: (preferences) => {
    try {
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      return false;
    }
  },
  
  getSessionData: () => {
    try {
      const sessionDataJson = sessionStorage.getItem(SESSION_DATA_KEY);
      
      if (sessionDataJson) {
        return JSON.parse(sessionDataJson);
      } else {
        return {
          lastVisitedPage: '/',
          searchHistory: []
        };
      }
    } catch (error) {
      console.error('Error al leer datos de sesión:', error);
      return {
        lastVisitedPage: '/',
        searchHistory: []
      };
    }
  },
  
  saveSessionData: (data) => {
    try {
      sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error al guardar datos de sesión:', error);
      return false;
    }
  },
  
  updateLastVisitedPage: (page) => {
    try {
      const sessionData = localStorageService.getSessionData();
      sessionData.lastVisitedPage = page;
      sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Error al actualizar última página:', error);
      return false;
    }
  }
};

export default localStorageService;