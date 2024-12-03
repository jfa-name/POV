import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { requestBluetoothPermissions } from './src/utils/Permissions';
import LoginScreen from './src/screens/LoginScreen';
import Home from './src/screens/Home';
import Configuration from './src/screens/Configuration';
import TestApp from './src/utils/testApp';

const Stack = createStackNavigator();

const App = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false); // Estado de sesión

  useEffect(() => {
    // Solicitar permisos al iniciar
    const initializeApp = async () => {
      const hasPermission = await requestBluetoothPermissions();
      setPermissionsGranted(hasPermission);
    };

    initializeApp();
  }, []);

  if (!permissionsGranted) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const loadCookiesAndCheckStatus = async () => {
    try {
      await loadCookies();
      await checkLoginStatus();
    } catch (error) {
      console.error("Error durante la carga de cookies o el estado de sesión:", error);
    } finally {
      setLoading(false); // Asegúrate de que siempre se desactiva el estado de carga
    }
  };
  
  useEffect(() => {
    loadCookiesAndCheckStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
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

export default App;