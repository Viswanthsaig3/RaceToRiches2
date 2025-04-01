import React from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FiDollarSign, FiCalendar, FiTrendingUp } from 'react-icons/fi';

const CalculationMode = ({ mode, setMode }) => {
  const cardBg = useColorModeValue('white', 'dark.card');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const selectedBg = useColorModeValue('brand.50', 'rgba(0, 102, 255, 0.15)');
  const selectedBorder = useColorModeValue('brand.500', 'brand.400');
  const hoverBg = useColorModeValue('gray.50', 'dark.hover');
  
  const modes = [
    {
      id: 'monthlyInvestment',
      label: 'Monthly Investment',
      description: 'Calculate how much you need to invest monthly',
      icon: FiDollarSign,
    },
    {
      id: 'yearsNeeded',
      label: 'Years Needed',
      description: 'Calculate how many years you need to invest',
      icon: FiCalendar,
    },
    {
      id: 'returnRate',
      label: 'Return Rate',
      description: 'Calculate the return rate you need',
      icon: FiTrendingUp,
    },
  ];

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    
    // Only scroll to parameters section for modes other than 'yearsNeeded'
    if (selectedMode !== 'yearsNeeded') {
      setTimeout(() => {
        const parametersElement = document.getElementById('parameters-section');
        if (parametersElement) {
          parametersElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  return (
    <Box
      id="calculation-mode-section"
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      boxShadow={useColorModeValue('sm', 'none')}
      borderWidth={useColorModeValue(0, 1)}
      borderColor="gray.700"
      p={6}
    >
      <Heading as="h2" size="md" mb={5} fontWeight="semibold">
        Calculation Mode
      </Heading>
      
      <SimpleGrid columns={1} spacing={3}>
        {modes.map((item) => (
          <Flex
            key={item.id}
            direction="row"
            align="center"
            p={4}
            borderRadius="lg"
            cursor="pointer"
            transition="all 0.2s"
            bg={mode === item.id ? selectedBg : 'transparent'}
            borderWidth="1px"
            borderColor={mode === item.id ? selectedBorder : 'gray.200'}
            _hover={{
              bg: mode === item.id ? selectedBg : hoverBg,
              transform: 'translateY(-1px)'
            }}
            onClick={() => handleModeSelect(item.id)}
          >
            <Flex
              align="center"
              justify="center"
              w="40px"
              h="40px"
              borderRadius="full"
              bg={mode === item.id ? selectedBorder : 'gray.100'}
              color={mode === item.id ? 'white' : 'gray.500'}
              mr={4}
            >
              <Icon as={item.icon} boxSize="20px" />
            </Flex>
            <VStack align="start" spacing={0}>
              <Text fontWeight={mode === item.id ? "semibold" : "medium"}>
                {item.label}
              </Text>
              <Text fontSize="xs" color={textMuted}>
                {item.description}
              </Text>
            </VStack>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CalculationMode;
