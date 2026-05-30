import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#E6F7F7' },
          100: { value: '#B3E8EA' },
          500: { value: '#008A8F' },
          600: { value: '#007579' },
          700: { value: '#005F63' },
        },
      },
      fonts: {
        body: { value: 'Vazirmatn, sans-serif' },
        heading: { value: 'Vazirmatn, sans-serif' },
      },
    },
  },
});

export const appSystem = createSystem(defaultConfig, customConfig);
