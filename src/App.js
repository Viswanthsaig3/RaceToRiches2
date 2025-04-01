import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
  IconButton,
  Stack,
  Image,
  HStack,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion'; // Add this import
import { FiSun, FiMoon } from 'react-icons/fi';
import BillionaireSelection from './components/BillionaireSelection';
import CalculationMode from './components/CalculationMode';
import ParameterConfig from './components/ParameterConfig';
import ResultsVisualization from './components/ResultsVisualization';
import AnalyticsInfo from './components/AnalyticsInfo';
import { billionaireData } from './data/billionaireData';
import { calculateInvestmentGrowth, calculateBillionaireGrowth } from './utils/calculations';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('light.bg', 'dark.bg');
  const cardBg = useColorModeValue('light.card', 'dark.card');
  const headingColor = useColorModeValue('brand.600', 'brand.400');
  const accentGradient = `linear(to-r, brand.500, accent.500)`;

  // State management for all parameters
  const [selectedBillionaire, setSelectedBillionaire] = useState(billionaireData[0]);
  const [customBillionaire, setCustomBillionaire] = useState({
    name: 'Custom Billionaire',
    netWorth: 1000000000,
    cagr: 20,
  });
  const [calculationMode, setCalculationMode] = useState('monthlyInvestment');
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
  const [years, setYears] = useState(20);
  const [returnRate, setReturnRate] = useState(10);
  const [results, setResults] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [currency, setCurrency] = useState('USD'); // Add currency state - USD or INR

  // Calculate results whenever parameters change
  useEffect(() => {
    const activeBillionaire = isCustom ? customBillionaire : selectedBillionaire;
    
    let calculatedResults = {
      userInvestmentData: [],
      billionaireData: [],
      intersection: null,
      calculatedValue: 0,
      isPossible: true,
    };
    
    // Flag to skip intersection search for return rate mode
    let skipIntersectionSearch = false;
    
    // Different calculations based on selected mode
    switch (calculationMode) {
      case 'monthlyInvestment':
        // Calculate needed monthly investment
        const requiredInvestment = calculateRequiredInvestment(
          activeBillionaire.netWorth,
          activeBillionaire.cagr,
          years,
          returnRate
        );
        calculatedResults.calculatedValue = requiredInvestment;
        
        // Always generate billionaire growth data first
        calculatedResults.billionaireData = calculateBillionaireGrowth(
          activeBillionaire.netWorth,
          activeBillionaire.cagr,
          years
        );
        
        calculatedResults.userInvestmentData = calculateInvestmentGrowth(
          requiredInvestment,
          returnRate,
          years
        );
        break;
        
      case 'yearsNeeded':
        // Calculate years needed
        const yearsRequired = calculateYearsNeeded(
          activeBillionaire.netWorth,
          activeBillionaire.cagr,
          monthlyInvestment,
          returnRate
        );
        calculatedResults.calculatedValue = yearsRequired;
        calculatedResults.isPossible = yearsRequired < 100; // Arbitrary limit
        
        // Generate billionaire growth data for the full period
        calculatedResults.billionaireData = calculateBillionaireGrowth(
          activeBillionaire.netWorth,
          activeBillionaire.cagr,
          Math.min(yearsRequired, 100) // Cap at 100 years for visualization
        );
        
        // Generate user investment data for the same period
        calculatedResults.userInvestmentData = calculateInvestmentGrowth(
          monthlyInvestment,
          returnRate,
          Math.min(yearsRequired, 100) // Cap at 100 years for visualization
        );
        
        // For yearsNeeded mode, if it's possible, always create an intersection point at the calculated year
        if (calculatedResults.isPossible) {
          const targetYear = yearsRequired;
          // Get the value from the billionaire data at the intersection year
          const finalBillionaireValue = activeBillionaire.netWorth * Math.pow(1 + activeBillionaire.cagr / 100, targetYear);
          
          calculatedResults.intersection = {
            year: targetYear,
            value: finalBillionaireValue
          };
          
          // Skip the normal intersection finding logic since we've explicitly set it
          skipIntersectionSearch = true;
        }
        break;
        
      case 'returnRate':
        // Calculate required return rate to reach the billionaire's wealth at EXACTLY the specified year
        const requiredReturn = calculateRequiredReturnForExactYear(
          activeBillionaire.netWorth,
          activeBillionaire.cagr,
          monthlyInvestment,
          years
        );
        calculatedResults.calculatedValue = requiredReturn;
        calculatedResults.isPossible = true; // Always show the result

        // Generate billionaire growth data for the comparison period
        calculatedResults.billionaireData = calculateBillionaireGrowth(
          activeBillionaire.netWorth,
          activeBillionaire.cagr,
          years
        );
        
        // Then generate user investment data with the calculated return rate
        calculatedResults.userInvestmentData = calculateInvestmentGrowth(
          monthlyInvestment,
          requiredReturn,
          years
        );

        // In return rate mode, create the intersection point EXACTLY at the final year
        // This ensures the graph shows a match at exactly the user-selected year
        if (calculatedResults.userInvestmentData.length > 0 && calculatedResults.billionaireData.length > 0) {
          // Force the intersection to be at the end year
          const targetYear = years;
          const billionaireValue = calculatedResults.billionaireData[calculatedResults.billionaireData.length - 1].value;
          
          calculatedResults.intersection = {
            year: targetYear,
            value: billionaireValue
          };
        }
        
        // Skip finding intersection through normal means for this mode
        skipIntersectionSearch = true;
        break;
        
      default:
        break;
    }
    
    // Find intersection point - but skip for return rate mode where we set it explicitly
    if (!skipIntersectionSearch && calculatedResults.userInvestmentData.length > 0 && 
        calculatedResults.billionaireData.length > 0) {
      calculatedResults.intersection = findIntersection(
        calculatedResults.userInvestmentData,
        calculatedResults.billionaireData
      );
    }
    
    setResults(calculatedResults);
  }, [selectedBillionaire, customBillionaire, calculationMode, monthlyInvestment, years, returnRate, isCustom]);

  // Utility functions for calculations
  function calculateRequiredInvestment(targetNetWorth, billionaireCagr, years, userReturnRate) {
    // Simple estimation for demo purposes
    const targetFutureValue = targetNetWorth * Math.pow(1 + billionaireCagr / 100, years);
    const monthlyRate = userReturnRate / 100 / 12;
    const months = years * 12;
    
    // Handle potential division by zero or very small numbers
    if (monthlyRate === 0 || Math.abs(monthlyRate) < 1e-10) {
      return targetFutureValue / months;
    }
    
    // Calculate the monthly payment required
    const PMT = targetFutureValue / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    // Ensure we don't return exactly zero - use a very small value if needed
    return Math.max(PMT, 0.000001);
  }
  
  function calculateYearsNeeded(targetNetWorth, billionaireCagr, monthlyInvestment, userReturnRate) {
    // More precise calculation
    let userNetWorth = 0;
    let billionaireNetWorth = targetNetWorth;
    let yearsCount = 0;
    const monthlyRate = userReturnRate / 100 / 12;
    
    // Continue until user wealth exceeds billionaire wealth or 100 years is reached
    while (userNetWorth < billionaireNetWorth && yearsCount < 100) {
      // Increment by one month at a time for more precision
      for (let month = 0; month < 12; month++) {
        // Add monthly investment
        userNetWorth += monthlyInvestment;
        // Apply monthly growth
        userNetWorth *= (1 + monthlyRate);
      }
      
      // Apply annual growth to billionaire's wealth
      billionaireNetWorth *= (1 + billionaireCagr / 100);
      
      yearsCount++;
      
      // Early exit if we match or exceed billionaire wealth
      if (userNetWorth >= billionaireNetWorth) {
        break;
      }
    }
    
    // Add fractional year for more precision if we have an intersection
    if (yearsCount < 100 && userNetWorth >= billionaireNetWorth) {
      // Calculate what fraction of the year we needed to reach billionaire wealth
      const prevYearBillionaireWealth = billionaireNetWorth / (1 + billionaireCagr / 100);
      const userWealthForPrevYear = userNetWorth / Math.pow(1 + userReturnRate / 100, 1);
      
      // Simple linear interpolation for fractional year
      if (userWealthForPrevYear < prevYearBillionaireWealth) {
        const growth = userNetWorth - userWealthForPrevYear;
        const needed = billionaireNetWorth - userWealthForPrevYear;
        const fraction = needed / growth;
        yearsCount = yearsCount - (1 - fraction);
      }
    }
    
    return yearsCount;
  }
  
  function calculateRequiredReturnForExactYear(targetNetWorth, billionaireCagr, monthlyInvestment, years) {
    // Calculate future billionaire wealth at EXACTLY the specified year
    const targetFutureValue = targetNetWorth * Math.pow(1 + billionaireCagr / 100, years);
    const annualInvestment = monthlyInvestment * 12;
    
    // Handle edge cases
    if (annualInvestment <= 0) {
      return 100000; // Return an extremely high value if no investment
    }
    
    if (targetFutureValue <= 0) {
      return 0;
    }
    
    // Binary search to find the exact return rate needed to match at the specified year
    let low = 0;
    let high = 100000; // Allow for very high returns
    let mid = 0;
    
    // Higher precision search
    const precision = 0.0001;
    const maxIterations = 1000;
    
    for (let i = 0; i < maxIterations; i++) {
      mid = (high + low) / 2;
      const r = mid / 100; // Convert percentage to decimal
      
      // Calculate future value of monthly investments at the specified rate
      let fv;
      if (Math.abs(r) < 1e-10) {
        // For extremely small rates, use linear calculation
        fv = annualInvestment * years;
      } else {
        // Calculate the monthly factor
        const monthlyRate = r / 12;
        const totalMonths = years * 12;
        
        // Use the formula for future value of periodic payments
        // FV = P * [(1 + r)^n - 1] / r
        fv = monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
      }
      
      // Adjust search range based on comparison with target value
      if (Math.abs(fv - targetFutureValue) < precision * targetFutureValue) {
        // Close enough to the target
        break;
      } else if (fv < targetFutureValue) {
        low = mid;
      } else {
        high = mid;
      }
    }
    
    return mid;
  }
  
  function findIntersection(userData, billionaireData) {
    if (!userData.length || !billionaireData.length) return null;
    
    // Check for exact matches first
    for (let i = 0; i < Math.min(userData.length, billionaireData.length); i++) {
      if (Math.abs(userData[i].value - billionaireData[i].value) / billionaireData[i].value < 0.01 || // Within 1% of each other
          userData[i].value >= billionaireData[i].value) {
        return {
          year: userData[i].year,
          value: userData[i].value
        };
      }
    }
    
    // Find intersection between data points
    for (let i = 1; i < Math.min(userData.length, billionaireData.length); i++) {
      // Check if lines cross between points (i-1) and i
      const userPrev = userData[i-1].value;
      const userCurrent = userData[i].value;
      const billPrev = billionaireData[i-1].value;
      const billCurrent = billionaireData[i].value;
      
      // Check if the lines cross between these points
      // (userPrev < billPrev && userCurrent >= billCurrent) means the user line crosses above the billionaire line
      if (userPrev < billPrev && userCurrent >= billCurrent) {
        // Interpolate to find the exact crossing point
        const t = (billPrev - userPrev) / ((userCurrent - userPrev) - (billCurrent - billPrev));
        const year = userData[i-1].year + t * (userData[i].year - userData[i-1].year);
        const value = userPrev + t * (userCurrent - userPrev);
        
        return {
          year: parseFloat(year.toFixed(2)),
          value: value
        };
      }
    }
    
    return null;
  }

  return (
    <Box bg={bgColor} minHeight="100vh">
      <Container maxW="container.xl" py={6} px={{ base: 2, md: 6 }}>
        {/* Header section with gradient border bottom */}
        <Flex 
          justifyContent="space-between" 
          alignItems="center" 
          mb={6} 
          pb={4}
          borderBottomWidth="1px"
          borderBottomColor={useColorModeValue('gray.200', 'gray.800')}
        >
          <Flex alignItems="center">
            {/* Replace the text-based logo with the favicon image */}
            <Box 
              w={{ base: "28px", md: "40px" }} 
              h={{ base: "28px", md: "40px" }} 
              mr={3}
              position="relative"
              overflow="hidden"
              borderRadius="lg"
            >
              <Image 
                src="/favicon/favicon-32x32.png" 
                alt="Race To Riches logo"
                width="100%"
                height="100%"
                objectFit="cover"
              />
            </Box>
            <Heading 
              as="h1" 
              size={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
              letterSpacing="tight" 
              fontWeight="extrabold"
              display={{ base: "none", sm: "block" }}
            >
              Race To <Text as="span" color={headingColor}>Riches</Text>
            </Heading>
            <Heading
              as="h1"
              size="xs"
              letterSpacing="tight"
              fontWeight="extrabold"
              display={{ base: "block", sm: "none" }}
            >
              RTR
            </Heading>
          </Flex>
          
          <HStack spacing={{ base: 1, sm: 3 }}>
            {/* Currency Toggle - more compact for mobile */}
            <HStack spacing={1}>
              <Button 
                size="sm" 
                variant={currency === 'USD' ? 'solid' : 'outline'} 
                colorScheme="brand"
                onClick={() => setCurrency('USD')}
                fontWeight="medium"
                px={{ base: 2, sm: 3 }}
                minW={{ base: "30px", sm: "auto" }}
                h={{ base: "30px", sm: "auto" }}
              >
                $
              </Button>
              <Button 
                size="sm" 
                variant={currency === 'INR' ? 'solid' : 'outline'} 
                colorScheme="brand"
                onClick={() => setCurrency('INR')}
                fontWeight="medium"
                px={{ base: 2, sm: 3 }}
                minW={{ base: "30px", sm: "auto" }}
                h={{ base: "30px", sm: "auto" }}
              >
                ₹
              </Button>
            </HStack>
            
            {/* Color Mode Toggle - smaller on mobile */}
            <IconButton
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
              size={{ base: "sm", md: "md" }}
              borderRadius="full"
            />
          </HStack>
        </Flex>
        
        <Stack 
          spacing={{ base: 4, lg: 8 }} 
          direction={{ base: "column", lg: "row" }} 
          align="flex-start"
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          position="relative"
        >
          <Box 
            w={{ base: "100%", lg: "30%" }}
            position={{ base: "static", lg: "sticky" }} 
            top="20px" 
            maxH={{ base: "auto", lg: "calc(100vh - 40px)" }}
            overflowY={{ base: "visible", lg: "auto" }}
            pr={{ base: 0, lg: 3 }}
            zIndex={{ base: 1, lg: 2 }}
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: useColorModeValue('gray.300', 'gray.600'),
                borderRadius: '24px',
              },
            }}
          >
            <Stack spacing={5}>
              <BillionaireSelection 
                billionaires={billionaireData}
                selectedBillionaire={selectedBillionaire}
                customBillionaire={customBillionaire}
                isCustom={isCustom}
                setSelectedBillionaire={setSelectedBillionaire}
                setCustomBillionaire={setCustomBillionaire}
                setIsCustom={setIsCustom}
                currency={currency}
              />
              
              <CalculationMode 
                mode={calculationMode}
                setMode={setCalculationMode}
              />
              
              <ParameterConfig 
                calculationMode={calculationMode}
                monthlyInvestment={monthlyInvestment}
                years={years}
                returnRate={returnRate}
                setMonthlyInvestment={setMonthlyInvestment}
                setYears={setYears}
                setReturnRate={setReturnRate}
                currency={currency}
              />
            </Stack>
          </Box>
          
          <Box 
            id="right-panel"
            w={{ base: "100%", lg: "70%" }}
            bg={cardBg}
            borderRadius="xl"
            p={{ base: 3, sm: 4, md: 6 }}
            boxShadow={useColorModeValue('sm', 'none')}
            borderWidth={useColorModeValue(0, 1)}
            borderColor="gray.800"
            maxH={{ lg: "calc(100vh - 40px)" }}
            overflowY={{ lg: "auto" }}
            zIndex={{ base: 0, lg: 1 }}
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: useColorModeValue('gray.300', 'gray.600'),
                borderRadius: '24px',
              },
            }}
          >
            {results ? (
              <Stack id="results-container" spacing={8}>
                <ResultsVisualization 
                  results={results}
                  calculationMode={calculationMode}
                  selectedBillionaire={isCustom ? customBillionaire : selectedBillionaire}
                  currency={currency}
                  monthlyInvestment={monthlyInvestment}
                  years={years}
                  returnRate={returnRate}
                />
              </Stack>
            ) : (
              <Flex direction="column" align="center" justify="center" h="500px">
                <Box 
                  w="80px" 
                  h="80px" 
                  borderRadius="full" 
                  bgGradient={accentGradient} 
                  mb={4}
                  opacity={0.7}
                />
                <Heading size="md" mb={2} textAlign="center">
                  Adjust parameters to see results
                </Heading>
                <Text textAlign="center" color="gray.500">
                  Select a billionaire and calculation mode, then adjust the parameters to compare investment growth.
                </Text>
              </Flex>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
