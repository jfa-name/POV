import React from 'react';
import {View, Text, Alert, TextInput, Button, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
// const localHtmlFile = require('./test.html');

const TestApp = () => {
  const handlePrint = (data) => {
    try {
      // Verificar si hay una impresora conectada
      if (!connectedDevice) {
        throw new Error('No hay ninguna impresora conectada');
      }
      // Lógica de impresión aquí usando "data"
      console.log('Printing:', data);
      Alert.alert('Impresión exitosa', 'El texto ha sido enviado a la ipresora');
    } catch (error) {
      Alert.alert('Error de impresión', error.message);
    }    
  };
  return (
    <View style={styles.container}>
      <WebView
        source={localHtmlFile}
        onMessage={(event) => handlePrint(event.nativeEvent.data)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function printOut(divId) {
  var printOutContent = document.getElementById(divId).innerHTML;
  var textInputValue = document.getElementById('textInput').value;
  var originalContent = document.body.innerHTML;
  document.body.innerHTML = printOutContent + "<p>" + textInputValue + "</p>";
  window.ReactNativeWebView.postMessage(textInputValue);
  document.body.innerHTML = originalContent;
}

export default TestApp;
