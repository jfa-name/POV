import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      'https://dev.jfa.name/api/method/login', {
        usr: username,
        pwd: password,
      });
    console.log("Respuesta del servidor:", response.data);

    // Supongamos que el servidor devuelve cookies en la respuesta
    const cookies = response.headers['set-cookie'];

    if (cookies) {
      console.log('Cookies obtenidas:', cookies);
      const userSession = { username, cookies };
      await AsyncStorage.setItem('session_cookies', JSON.stringify(userSession));
    } else {
      console.warn('No se obtuvieron cookies de la respuesta.');
    }
    return true;
    
  } catch (error) {
    console.error('Error en el inicio de sesión:', error.response ? error.response.data : error.message);
    return false;
  }
};