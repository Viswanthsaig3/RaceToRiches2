import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const colors = {
  brand: {
    50: '#e6f0ff',
    100: '#b3d1ff',
    200: '#80b3ff',
    300: '#4d94ff',
    400: '#1a75ff',
    500: '#0066ff',
    600: '#0052cc',
    700: '#003d99',
    800: '#002966',
    900: '#001433',
  },
  accent: {
    50: '#fff0fa',
    100: '#ffd6f0',
    200: '#ffaddf',
    300: '#ff85cf',
    400: '#ff5cbf',
    500: '#ff33af',
    600: '#cc298c',
    700: '#991f69',
    800: '#661446',
    900: '#330a23',
  },
  dark: {
    bg: '#111827',
    card: '#1f2937',
    hover: '#374151'
  },
  light: {
    bg: '#f9fafb',
    card: '#ffffff',
    hover: '#f3f4f6'
  }
};

const fonts = {
  heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif',
  body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif',
};

const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === 'dark' 
        ? 'dark.bg' 
        : 'light.bg',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      borderRadius: 'lg',
      fontWeight: 'medium',
      _focus: {
        boxShadow: 'none',
      },
    },
    variants: {
      solid: (props) => ({
        bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.400' : 'brand.600',
          transform: 'translateY(-1px)',
          boxShadow: 'md',
        },
        transition: 'all 0.2s',
      }),
      outline: (props) => ({
        border: '1px solid',
        borderColor: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
        color: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
        _hover: {
          bg: props.colorMode === 'dark' ? 'rgba(26, 117, 255, 0.12)' : 'rgba(0, 102, 255, 0.08)',
        },
      }),
      ghost: (props) => ({
        color: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
        _hover: {
          bg: props.colorMode === 'dark' ? 'rgba(26, 117, 255, 0.12)' : 'rgba(0, 102, 255, 0.08)',
        },
      }),
    },
  },
  Card: {
    baseStyle: (props) => ({
      bg: props.colorMode === 'dark' ? 'dark.card' : 'light.card',
      borderRadius: 'xl',
      boxShadow: props.colorMode === 'dark' ? 'none' : 'sm',
      overflow: 'hidden',
      border: props.colorMode === 'dark' ? '1px solid' : 'none',
      borderColor: 'gray.800',
      transition: 'all 0.2s ease-in-out',
    }),
  },
  Heading: {
    baseStyle: {
      fontWeight: '600',
    },
  },
  Tooltip: {
    baseStyle: (props) => ({
      bg: props.colorMode === 'dark' ? 'dark.hover' : 'gray.800',
      color: 'white',
      borderRadius: 'md',
      px: 3,
      py: 2,
    }),
  },
};

const theme = extendTheme({ config, colors, fonts, styles, components });

export default theme;
