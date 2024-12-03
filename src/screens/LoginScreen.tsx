import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { login } from '../services/authService';
import { checkInternetConnection } from '../utils/network';
import { saveCookies, loadCookies } from '../services/cookieService';

const LoginScreen = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    loadCookies('https://dev.jfa.name');
  }, []);

  const handleLogin = async () => {
    console.log('Enviando datos de inicio de sesión:', { usr: username, pwd: password });
    const hasInternet = await checkInternetConnection();
    if (!hasInternet) return;

    const isLoggedIn = await login(username, password);
    if (isLoggedIn) {
        await saveCookies('https://dev.jfa.name');
        navigation.navigate('Home');
        setLoggedIn(true);
    } else {
        Alert.alert('Inicio de sesión fallido', 'Credenciales inválidas.');
      }
    };

//     try {
//       const success = await login(username, password);
//       if (success) {
//         setLoggedIn(true); // Cambiar al estado de "logueado"
//       } else {
//         Alert.alert('Error', 'Credenciales incorrectas.');
//       }
//     } catch (error) {
//       console.error('Error al iniciar sesión:', error);
//       Alert.alert('Error', 'Ocurrió un problema al iniciar sesión.');
//     }
//   };

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
