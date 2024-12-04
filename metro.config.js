const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Configuración personalizada
const customConfig = {
  resolver: {
    // Aseguramos que los activos como PNGs se manejen correctamente
    assetExts: [...defaultConfig.resolver.assetExts, 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'],
    // Si usas SVGs, los configuramos aquí
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

// Combinamos la configuración por defecto con la personalizada
const mergedConfig = mergeConfig(defaultConfig, customConfig);

// Aplicamos la configuración de `react-native-reanimated`
const reanimatedConfig = wrapWithReanimatedMetroConfig(mergedConfig);

module.exports = reanimatedConfig;