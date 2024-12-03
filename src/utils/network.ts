import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export const checkInternetConnection = async () => {
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