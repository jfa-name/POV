import AsyncStorage from '@react-native-async-storage/async-storage';
import { CookieManager } from '@react-native-cookies/cookies';

const COOKIE_STORAGE_KEY = 'session_cookies';

export const saveCookies = async (domain: string) => {
    const allCookies = await CookieManager.get(domain);
    await AsyncStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(allCookies));
  };
  
  export const loadCookies = async (domain: string) => {
    try {
        const storedCookies = await AsyncStorage.getItem(COOKIE_STORAGE_KEY);
        if (storedCookies) {
            console.log('Cookies almacenadas:', storedCookies);
            const parsedCookies = JSON.parse(storedCookies);
            for (const cookieName in parsedCookies) {
                console.log(`Estableciendo cookie: ${cookieName}`);
                await CookieManager.set(domain, {
                    name: cookieName,
                    value: parsedCookies[cookieName].value,
                    domain: parsedCookies[cookieName].domain || domain,
                    path: parsedCookies[cookieName].path || '/',
                    version: '1',
                    expires: parsedCookies[cookieName].expires,
                });
            }
        } else {
            console.log("No se encontraron cookies almacenadas.");
        }
    } catch (error) {
        console.error('Error al cargar cookies:', error);
        await AsyncStorage.removeItem(COOKIE_STORAGE_KEY); // Limpia cookies corruptas
    }
  };
  
  export const clearCookies = async () => {
    await AsyncStorage.removeItem(COOKIE_STORAGE_KEY);
    await CookieManager.clearAll(); // Limpia cookies del navegador
  };