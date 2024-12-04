import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { requestBluetoothPermissions } from './src/utils/Permissions';
import LoginScreen from './src/screens/LoginScreen';
import Home from './src/screens/Home';
import Configuration from './src/screens/Configuration';
import TestApp from './src/utils/testApp';
import { loadCookies } from './src/services/cookieService';

const Stack = createStackNavigator();

const App = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [loading, setLoading] = useState(true); // Indicador de carga global
  const [loggedIn, setLoggedIn] = useState(false); // Estado de sesión

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Verificar permisos (Bluetooth, Internet, etc.)
        const hasPermission = await requestBluetoothPermissions();
        setPermissionsGranted(hasPermission);

        if (!hasPermission) {
          Alert.alert(
            'Permisos Requeridos',
            'Se necesitan permisos para continuar. Por favor, otórgalos en la configuración.',
            [{ text: 'OK', onPress: () => {} }]
          );
          setLoading(false);
          return;
        }

        // Cargar cookies y verificar autenticación
        const cookiesLoaded = await loadCookies('https://tu-dominio.com');
        if (cookiesLoaded) {
          setLoggedIn(true); // Si las cookies están cargadas, asume sesión iniciada
        }
      } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
      } finally {
        setLoading(false); // Asegurarse de detener el estado de carga
      }
    };

    initializeApp();
  }, []);

  // Mostrar indicador de carga mientras se verifica permisos/autenticación
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {!loggedIn ? (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {(props) => <LoginScreen {...props} setLoggedIn={setLoggedIn} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Configuration" component={Configuration} />
            <Stack.Screen name="TestApp" component={TestApp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default App;