import React from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Stack,
  useColorModeValue,
  HStack,
  InputGroup,
  InputRightAddon,
  Flex,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FiDollarSign, FiCalendar, FiPercent, FiInfo } from 'react-icons/fi';

const ParameterConfig = ({
  calculationMode,
  monthlyInvestment,
  years,
  returnRate,
  setMonthlyInvestment,
  setYears,
  setReturnRate,
  currency
}) => {
  const cardBg = useColorModeValue('white', 'dark.card');
  const sliderThumbColor = useColorModeValue('brand.500', 'brand.400');
  const sliderTrackColor = useColorModeValue('brand.100', 'gray.700');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  
  // Get logarithmic scale for investment slider - updated for higher max value
  const logScale = (value) => {
    // Scale goes from 10 to 1B (1,000,000,000)
    return Math.round(Math.exp(Math.log(10) + (Math.log(1000000000) - Math.log(10)) * value / 100));
  };
  
  const invLogScale = (value) => {
    return Math.round(((Math.log(value) - Math.log(10)) / (Math.log(1000000000) - Math.log(10))) * 100);
  };

  // Function to scroll the results panel into view
  const scrollToResults = () => {
    // Get the results container element
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
      // Use scrollIntoView with behavior: 'smooth' for a smooth scrolling experience
      // But only scroll the right panel, not the entire page
      const rightPanel = document.getElementById('right-panel');
      if (rightPanel) {
        rightPanel.scrollTop = 0; // Scroll the right panel to the top
      }
    }
  };

  // Add change handlers that trigger scrolling to results after parameter changes
  const handleMonthlyInvestmentChange = (valueString) => {
    setMonthlyInvestment(Number(valueString));
    setTimeout(scrollToResults, 300); // Delay to allow state to update
  };

  const handleYearsChange = (valueString) => {
    setYears(Number(valueString));
    setTimeout(scrollToResults, 300); // Delay to allow state to update
  };

  const handleReturnRateChange = (valueString) => {
    setReturnRate(Number(valueString));
    setTimeout(scrollToResults, 300); // Delay to allow state to update
  };

  // Handle slider changes with the same scroll effect
  const handleMonthlyInvestmentSliderChange = (val) => {
    setMonthlyInvestment(logScale(val));
    setTimeout(scrollToResults, 300);
  };

  const handleYearsSliderChange = (val) => {
    setYears(val);
    setTimeout(scrollToResults, 300);
  };

  const handleReturnRateSliderChange = (val) => {
    setReturnRate(val);
    setTimeout(scrollToResults, 300);
  };

  // Format date to show month and year
  const formatTargetDate = (yearsFromNow) => {
    const currentDate = new Date();
    const targetDate = new Date(currentDate);
    
    // Get the full years
    const fullYears = Math.floor(yearsFromNow);
    
    // Calculate months from the decimal part
    const months = Math.round((yearsFromNow - fullYears) * 12);
    
    // Add years and months to the current date
    targetDate.setFullYear(currentDate.getFullYear() + fullYears);
    targetDate.setMonth(currentDate.getMonth() + months);
    
    // Format into "Month Year" (e.g., "December 2045")
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
  };

  return (
    <Box
      id="parameters-section"
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      boxShadow={useColorModeValue('sm', 'none')}
      borderWidth={useColorModeValue(0, 1)}
      borderColor="gray.700"
      p={6}
    >
      <Heading as="h2" size="md" mb={5} fontWeight="semibold">
        Parameters
      </Heading>
      
      <Stack spacing={6}>
        {calculationMode !== 'monthlyInvestment' && (
          <FormControl>
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
              <HStack>
                <Icon as={FiDollarSign} color={textMuted} />
                <FormLabel fontSize="sm" fontWeight="medium" m={0}>Monthly Investment</FormLabel>
              </HStack>
              <Tooltip label="How much you'll invest each month" placement="top">
                <Box as="span">
                  <Icon as={FiInfo} color={textMuted} />
                </Box>
              </Tooltip>
            </Flex>
            
            <InputGroup size="md" mb={3}>
              <NumberInput
                value={monthlyInvestment}
                min={10}
                max={1000000000} // Increased to 1B
                step={1000}
                onChange={handleMonthlyInvestmentChange}
                w="100%"
              >
                <NumberInputField borderRadius="md" pl={8} />
                <DollarAdornment>{currency === 'INR' ? '₹' : '$'}</DollarAdornment>
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
            
            <Slider
              value={invLogScale(monthlyInvestment)}
              min={0}
              max={100}
              onChange={handleMonthlyInvestmentSliderChange}
              colorScheme="brand"
              mb={2}
            >
              <SliderTrack bg={sliderTrackColor}>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6} bg={sliderThumbColor} boxShadow="md" />
            </Slider>
            
            <Text fontSize="xs" color={textMuted}>
              {currency === 'INR' 
                ? `₹${monthlyInvestment.toLocaleString()} per month (₹${(monthlyInvestment * 12).toLocaleString()} annually)`
                : `$${monthlyInvestment.toLocaleString()} per month ($${(monthlyInvestment * 12).toLocaleString()} annually)`
              }
            </Text>
          </FormControl>
        )}
        
        {calculationMode !== 'yearsNeeded' && (
          <FormControl>
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
              <HStack>
                <Icon as={FiCalendar} color={textMuted} />
                <FormLabel fontSize="sm" fontWeight="medium" m={0}>Investment Period</FormLabel>
              </HStack>
              <Tooltip label="How long you'll be investing" placement="top">
                <Box as="span">
                  <Icon as={FiInfo} color={textMuted} />
                </Box>
              </Tooltip>
            </Flex>
            
            <InputGroup size="md" mb={3}>
              <NumberInput
                value={years}
                min={1}
                max={100} // Increased to 100
                step={1}
                onChange={handleYearsChange}
                w="100%"
              >
                <NumberInputField borderRadius="md" />
                <InputRightAddon children="years" borderRadius="0 md md 0" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
            
            <Slider
              value={years}
              min={1}
              max={100} // Increased to 100
              onChange={handleYearsSliderChange}
              colorScheme="brand"
              mb={2}
            >
              <SliderTrack bg={sliderTrackColor}>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6} bg={sliderThumbColor} boxShadow="md" />
            </Slider>
            
            <Text fontSize="xs" color={textMuted}>
              Investing until {formatTargetDate(years)}
            </Text>
          </FormControl>
        )}
        
        {calculationMode !== 'returnRate' && (
          <FormControl>
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
              <HStack>
                <Icon as={FiPercent} color={textMuted} />
                <FormLabel fontSize="sm" fontWeight="medium" m={0}>Annual Return Rate</FormLabel>
              </HStack>
              <Tooltip label="Expected investment return percentage" placement="top">
                <Box as="span">
                  <Icon as={FiInfo} color={textMuted} />
                </Box>
              </Tooltip>
            </Flex>
            
            <InputGroup size="md" mb={3}>
              <NumberInput
                value={returnRate}
                min={1}
                // Remove max constraint
                step={1}
                onChange={handleReturnRateChange}
                w="100%"
              >
                <NumberInputField borderRadius="md" />
                <InputRightAddon children="%" borderRadius="0 md md 0" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
            
            <Slider
              value={Math.min(returnRate, 100)} // Limit slider display but not actual value
              min={1}
              max={100}
              onChange={handleReturnRateSliderChange}
              colorScheme="brand"
              mb={2}
            >
              <SliderTrack bg={sliderTrackColor}>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6} bg={sliderThumbColor} boxShadow="md" />
            </Slider>
            
            <Flex justify="space-between">
              <Text fontSize="xs" color={textMuted}>
                {returnRate}% annual return{returnRate > 100 ? " (extreme)" : ""}
              </Text>
              <Text fontSize="xs" color={textMuted}>
                (S&P 500 avg: ~10%)
              </Text>
            </Flex>
          </FormControl>
        )}
      </Stack>
    </Box>
  );
};

// Custom component to add currency symbol at the beginning of the input
const DollarAdornment = ({ children }) => (
  <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" pointerEvents="none" zIndex={2} color="gray.500">
    {children}
  </Box>
);

export default ParameterConfig;
