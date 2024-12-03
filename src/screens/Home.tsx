import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ActivityIndicator, Alert, PermissionsAndroid, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { WebView } from 'react-native-webview';
import { Cookies, CookieManager } from '@react-native-cookies/cookies';
//import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import FileViewer from "react-native-file-viewer";
import RNPrint from 'react-native-print';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cookiesLoaded, setCookiesLoaded] = useState(false);
  const [cookies, setCookies] = useState<string[] | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const webViewRef = useRef(null);

  // Comprobar conexión
  const checkInternetConnection = async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert(
        'Sin conexión a Internet',
        'Revisa tu conexión de red y vuelve a intentarlo.',
        [{ text: 'Reintentar', onPress: checkInternetConnection }]
      );
      return false;
    }
    return true;
  };
  // Estado de sesión
  const checkLoginStatus = async () => {
    try {
      const storedCookies = await AsyncStorage.getItem('session_cookies');
      console.log('Cookies almacenadas:', storedCookies);
  
      if (storedCookies) {
        const parsedCookies = JSON.parse(storedCookies);
        console.log("parsedCookies:", parsedCookies);
  
        const cookieArray = Object.keys(parsedCookies).map(cookieName => {
          const cookieValue = parsedCookies[cookieName].value;
          return `${cookieName}=${cookieValue}`;
        });
  
        const cookieString = cookieArray.join('; ');
        console.log('Cookies unidas para WebView (limpias):', cookieString);
        setCookies(cookieString);
        setLoggedIn(true); // Aquí marca al usuario como logueado
      } else {
        console.log("No hay cookies guardadas, el usuario no está logueado.");
      }
    } catch (error) {
      console.error("Error comprobando estado de login:", error);
    } finally {
      setLoading(false); // Asegúrate de desactivar el estado de carga
    }
  };
  
  // Añadir encabezados de cookies a la WebView si se tiene una sesión

  const customHeaders = {
    Cookie: cookies || '',
  };

  const loadCookies = async () => {
    try {
      const storedCookies = await AsyncStorage.getItem('session_cookies');
      if (storedCookies) {
        const parsedCookies = JSON.parse(storedCookies);
        for (const cookieName in parsedCookies) {
          await CookieManager.set('https://dev.jfa.name', {
            name: cookieName,
            value: parsedCookies[cookieName].value,
            domain: parsedCookies[cookieName].domain || 'dev.jfa.name',
            path: parsedCookies[cookieName].path || '/',
            version: '1',
            expires: parsedCookies[cookieName].expires,
          });
        }
        setCookiesLoaded(true);
        console.log('Cookies cargadas correctamente.');
      }
    } catch (error) {
      console.error('Error al cargar cookies:', error);
      await AsyncStorage.removeItem('session_cookies'); // Limpia cookies corruptas
    }
  };
  
  useEffect(() => {
    loadCookies();
    checkLoginStatus();
  }, []);
  
  return (
    <NavigationContainer>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : loggedIn ? (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Configuration" component={Configuration} options={{ title: 'Configuración' }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
  },
  loader: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

