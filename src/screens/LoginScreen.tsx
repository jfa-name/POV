import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { login } from '../services/authService';
import { checkInternetConnection } from '../utils/network';
import { saveCookies, loadCookies } from '../services/cookieService';

const LoginScreen = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const cookiesLoaded = await loadCookies('https://dev.jfa.name');
        console.log('Cookies cargadas:', cookiesLoaded);

        // Comprobar si las cookies indican una sesión activa.
        if (cookiesLoaded?.session?.value) {
          setLoggedIn(true);
          navigation.navigate('Home'); // Navega directamente al Home si la sesión ya está activa.
        }
      } catch (error) {
        console.error('Error al inicializar sesión:', error);
      }
    };

    initializeSession();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const hasInternet = await checkInternetConnection();
    if (!hasInternet) {
      Alert.alert('Error', 'No tienes conexión a Internet.');
      return;
    }

    setLoading(true); // Muestra el indicador de carga mientras procesas
    try {
      console.log('Enviando datos de inicio de sesión:', { usr: username, pwd: password });
      const isLoggedIn = await login(username, password);

      if (isLoggedIn) {
        await saveCookies('https://dev.jfa.name');
        setLoggedIn(true);
        navigation.navigate('Home'); // Navega al Home después del login exitoso
      } else {
        Alert.alert('Inicio de sesión fallido', 'Credenciales inválidas.');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      Alert.alert('Error', 'Ocurrió un error durante el inicio de sesión. Inténtalo más tarde.');
    } finally {
      setLoading(false); // Oculta el indicador de carga
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default LoginScreen;
