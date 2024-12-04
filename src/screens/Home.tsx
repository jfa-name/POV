import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { WebView } from 'react-native-webview';
import { CookieManager } from '@react-native-cookies/cookies';
import FileViewer from "react-native-file-viewer";
import RNPrint from 'react-native-print';

const Stack = createStackNavigator();

const Home = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [cookiesLoaded, setCookiesLoaded] = useState(false);
  const [cookies, setCookies] = useState<string | null>(null);
  const webViewRef = useRef(null);

  // Comprobar conexión a Internet
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

  // Cargar cookies
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
        setCookies(storedCookies);
      }
    } catch (error) {
      console.error('Error al cargar cookies:', error);
      await AsyncStorage.removeItem('session_cookies'); // Limpia cookies corruptas
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkInternetConnection();
    loadCookies();
  }, []);

  // Navegación en el WebView
  const handleNavigationRequest = (event) => {
    const { url } = event;
    if (url.includes("printview")) {
      Alert.alert(
        "Impresión Detectada",
        "Se detectó un intento de impresión. Procesando..."
      );
      webViewRef.current.injectedJavaScript(`
        window.print();
      `);
      return false;
    } else if (url.endsWith(".pdf")) {
      FileViewer.open(url)
        .then(() => console.log('Archivo PDF abierto'))
        .catch(err => console.error('Error abriendo PDF:', err));
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://dev.jfa.name/app/posapp', headers: { Cookie: cookies || '' } }}
          onLoadEnd={() => console.log("Página cargada")}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error:", nativeEvent);
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          injectedJavaScript={`
            const meta = document.createElement('meta'); 
            meta.setAttribute('name', 'viewport'); 
            meta.setAttribute('content', 'height=100%, initial-scale=0, maximum-scale=0, user-scalable=no'); 
            document.getElementsByTagName('head')[0].appendChild(meta);
          `}
          onShouldStartLoadWithRequest={handleNavigationRequest}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;