import React from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  useColorModeValue,
  Divider,
  HStack,
  Icon,
  Badge,
  VStack,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiXCircle, 
  FiTrendingUp, 
  FiInfo, 
  FiDollarSign, 
  FiCalendar 
} from 'react-icons/fi';
import { formatCurrency, formatNumber } from '../utils/calculations';
import FunFacts from './FunFacts';
import RealityCheck from './RealityCheck';
import QuoteDisplay from './QuoteDisplay';

const AnalyticsInfo = ({ 
  results, 
  calculationMode, 
  selectedBillionaire, 
  monthlyInvestment, 
  years,
  currency,
  condensed = false // Add this prop to enable condensed mode
}) => {
  const cardBg = useColorModeValue('white', 'dark.card');
  const accentColor = useColorModeValue('brand.500', 'brand.400');
  const warningColor = useColorModeValue('orange.500', 'orange.300');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const statCardBg = useColorModeValue('gray.50', 'gray.900');
  const yellowBg = useColorModeValue('yellow.50', 'yellow.900');
  const yellowBorderColor = useColorModeValue('yellow.400', 'yellow.400');
  
  // Helper function to format large values without capping
  const formatLargeValue = (value, currencyCode) => {
    // Handle potentially infinite or NaN values
    if (!isFinite(value) || isNaN(value)) {
      return currencyCode === 'INR' ? '₹∞' : '$∞';
    }
    
    // For extremely large values, don't use scientific notation, use lakh crore instead
    if (Math.abs(value) > 1e16 && currencyCode === 'INR') {
      const lakhCrores = Math.abs(value) / 1e12;
      const symbol = '₹';
      const prefix = value < 0 ? '-' : '';
      return `${prefix}${symbol}${lakhCrores.toFixed(2)} lakh crore`;
    }
    
    // Use standard formatting for all values
    const formatted = formatCurrency(value, currencyCode);
    return formatted;
  };

  // Helper function to format date with month name
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

  // Helper function to format the year value to be clean and readable
  const formatYearValue = (yearValue) => {
    // If it's a whole number or very close to one, show as integer
    if (Math.abs(yearValue - Math.round(yearValue)) < 0.01) {
      return Math.round(yearValue);
    }
    // Otherwise format with 1 decimal place
    return yearValue.toFixed(1);
  };

  // Analysis messages based on calculation mode
  const getAnalysisMessages = () => {
    const messages = [];
    
    if (results.intersection) {
      messages.push({
        type: 'success',
        title: 'Wealth Match Found',
        description: `Your investment will match ${selectedBillionaire.name}'s wealth in ${formatYearValue(results.intersection.year)} years (${formatTargetDate(results.intersection.year)}), reaching ${formatCurrency(results.intersection.value, currency)}.`,
        icon: FiCheckCircle,
      });
    } else {
      messages.push({
        type: 'warning',
        title: 'No Wealth Match',
        description: `Your investment doesn't reach ${selectedBillionaire.name}'s wealth within the calculated timeframe.`,
        icon: FiAlertCircle,
      });
    }
    
    // Mode-specific messages
    switch (calculationMode) {
      case 'monthlyInvestment':
        if (results.calculatedValue > 10000) {
          messages.push({
            type: 'warning',
            title: 'High Investment Required',
            description: `The required monthly investment of ${formatCurrency(results.calculatedValue, currency)} is significant. Consider increasing your time horizon or expected return rate.`,
            icon: FiAlertCircle,
          });
        }
        break;
        
      case 'yearsNeeded':
        if (!results.isPossible) {
          messages.push({
            type: 'error',
            title: 'Not Achievable',
            description: `With current parameters, it would take over 100 years to match ${selectedBillionaire.name}'s wealth.`,
            icon: FiXCircle,
          });
        } else if (results.calculatedValue > 30) {
          messages.push({
            type: 'warning',
            title: 'Long Time Horizon',
            description: `It will take ${results.calculatedValue.toFixed(1)} years (until ${formatTargetDate(results.calculatedValue)}) to match the wealth. Consider increasing your monthly investment or expected return rate.`,
            icon: FiCalendar,
          });
        }
        break;
        
      case 'returnRate':
        if (!results.isPossible) {
          messages.push({
            type: 'error',
            title: 'Unrealistic Return Rate',
            description: `The required return rate would be over 100%, which is not realistically achievable.`,
            icon: FiXCircle,
          });
        } else if (results.calculatedValue > 100) {
          messages.push({
            type: 'warning',
            title: 'Extremely High Return Rate',
            description: `The required return rate of ${results.calculatedValue.toFixed(2)}% is extraordinary and very difficult to achieve. Consider increasing your monthly investment or time horizon.`,
            icon: FiTrendingUp,
          });
        } else if (results.calculatedValue > 15) {
          messages.push({
            type: 'warning',
            title: 'High Return Rate Required',
            description: `The required return rate of ${results.calculatedValue.toFixed(2)}% is above average market returns. Consider increasing your monthly investment or time horizon.`,
            icon: FiTrendingUp,
          });
        }
        break;
        
      default:
        break;
    }
    
    return messages;
  };
  
  // Update the getGrowthMetrics function to show uncapped percentages
  const getGrowthMetrics = () => {
    // Make sure we have data before calculating
    if (!results.userInvestmentData || !results.billionaireData) {
      return {
        finalUserValue: 0,
        finalBillionaireValue: 0,
        totalInvestment: 0,
        totalReturns: 0,
        returnsPercentage: 0,
        growthMultiplier: 0
      };
    }
    
    const finalUserValue = results.userInvestmentData.length > 0 
      ? results.userInvestmentData[results.userInvestmentData.length - 1].value
      : 0;
      
    const finalBillionaireValue = results.billionaireData.length > 0
      ? results.billionaireData[results.billionaireData.length - 1].value
      : 0;
      
    // Calculate total investment based on calculation mode
    let totalInvestment = 0;
    const totalYears = calculationMode === 'yearsNeeded' ? 
      (results.isPossible ? results.calculatedValue : years) : years;
    
    if (calculationMode === 'monthlyInvestment') {
      totalInvestment = results.calculatedValue * 12 * years;
    } else {
      totalInvestment = monthlyInvestment * 12 * totalYears;
    }
    
    // Calculate returns without capping
    const totalReturns = finalUserValue - totalInvestment;
    
    // Safety check for division by zero, but don't cap the percentage
    let returnsPercentage = 0;
    if (totalInvestment > 0) {
      returnsPercentage = (totalReturns / totalInvestment) * 100;
    }
    
    let growthMultiplier = 0;
    if (finalBillionaireValue > 0) {
      growthMultiplier = finalUserValue / finalBillionaireValue;
    }
    
    return {
      finalUserValue,
      finalBillionaireValue,
      totalInvestment,
      totalReturns,
      returnsPercentage,
      growthMultiplier
    };
  };
  
  const analysisMessages = getAnalysisMessages();
  const metrics = getGrowthMetrics();

  return (
    <Box>
      {!condensed && (
        <Heading as="h2" size="md" fontWeight="semibold" mb={6}>
          Analysis & Insights
        </Heading>
      )}
      
      {/* Only show the quote in the full view, not in condensed mode */}
      {!condensed && <QuoteDisplay />}
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={8}>
        {analysisMessages.map((message, index) => (
          <Card 
            key={index}
            bg={cardBg}
            borderRadius="lg"
            overflow="hidden"
            variant="outline"
            minH="100px"
            h="100%"
            borderColor={
              message.type === 'success' ? 'green.500' : 
              message.type === 'warning' ? 'orange.500' : 
              message.type === 'error' ? 'red.500' : 
              'gray.200'
            }
            borderLeftWidth="4px"
          >
            <CardBody p={{ base: 3, md: 5 }}>
              <Flex h="100%" flexDir={{ base: "column", sm: "row" }}>
                <Icon 
                  as={message.icon} 
                  boxSize="24px" 
                  color={
                    message.type === 'success' ? 'green.500' : 
                    message.type === 'warning' ? 'orange.500' : 
                    message.type === 'error' ? 'red.500' : 
                    'blue.500'
                  }
                  mr={{ base: 0, sm: 4 }}
                  mb={{ base: 2, sm: 0 }}
                  mt={{ base: 0, sm: 1 }}
                  flexShrink={0}
                />
                <Box>
                  <Text fontWeight="semibold" mb={1}>{message.title}</Text>
                  <Text fontSize="sm" color={textMuted}>{message.description}</Text>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
      
      {/* Only show fun facts in the full view */}
      {!condensed && results.intersection && (
        <FunFacts 
          netWorth={results.intersection.value} 
          currency={currency} 
        />
      )}
      
      <VStack spacing={4} mb={8} align="stretch">
        <Card bg={statCardBg} borderRadius="lg" overflow="hidden" variant="outline">
          <CardBody p={{ base: 3, md: 5 }}>
            <HStack spacing={4} align="flex-start" flexDir={{ base: "column", sm: "row" }}>
              <Flex 
                w="40px" 
                h="40px" 
                borderRadius="lg" 
                bg="blue.100" 
                color="blue.500"
                align="center"
                justify="center"
                flexShrink={0}
                mb={{ base: 2, sm: 0 }}
              >
                <Icon as={FiDollarSign} boxSize="20px" />
              </Flex>
              <VStack align="start" spacing={0} w="100%">
                <Text fontSize="sm" color={textMuted}>Your Final Investment</Text>
                <Box h={{ base: "auto", md: "36px" }} display="flex" alignItems="center" w="100%" overflow="visible" py={2}>
                  <Heading 
                    size="md" 
                    fontWeight="bold" 
                    color="blue.500"
                    fontSize={{ base: metrics.finalUserValue > 1e12 ? "xs" : "sm", md: metrics.finalUserValue > 1e12 ? "sm" : "md" }}
                    maxW="100%"
                    overflowWrap="break-word"
                    wordBreak="break-word"
                    lineHeight="1.2"
                  >
                    {formatLargeValue(metrics.finalUserValue, currency)}
                  </Heading>
                </Box>
                <HStack>
                  <Icon as={FiTrendingUp} color={metrics.returnsPercentage >= 0 ? "green.500" : "red.500"} />
                  <Text 
                    fontSize="sm" 
                    fontWeight="medium" 
                    color={metrics.returnsPercentage >= 0 ? "green.500" : "red.500"}
                  >
                    {`${Math.round(metrics.returnsPercentage)}% growth`}
                  </Text>
                </HStack>
                <Text fontSize="xs" color={textMuted} mt={1}>
                  Total invested: {formatLargeValue(metrics.totalInvestment, currency)}
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
        
        <Card bg={statCardBg} borderRadius="lg" overflow="hidden" variant="outline">
          <CardBody p={{ base: 3, md: 5 }}>
            <HStack spacing={4} align="flex-start" flexDir={{ base: "column", sm: "row" }}>
              <Flex 
                w="40px" 
                h="40px" 
                borderRadius="lg" 
                bg="pink.100" 
                color="pink.500"
                align="center"
                justify="center"
                flexShrink={0}
                mb={{ base: 2, sm: 0 }}
              >
                <Icon as={FiTrendingUp} boxSize="20px" />
              </Flex>
              <VStack align="start" spacing={0} w="100%">
                <Text fontSize="sm" color={textMuted} noOfLines={1}>{selectedBillionaire.name}'s Wealth</Text>
                <Box h={{ base: "auto", md: "36px" }} display="flex" alignItems="center" w="100%" overflow="visible" py={2}>
                  <Heading 
                    size="md" 
                    fontWeight="bold" 
                    color="pink.500"
                    fontSize={{ base: metrics.finalBillionaireValue > 1e12 ? "xs" : "sm", md: metrics.finalBillionaireValue > 1e12 ? "sm" : "md" }}
                    maxW="100%"
                    overflowWrap="break-word"
                    wordBreak="break-word"
                    lineHeight="1.2"
                  >
                    {formatLargeValue(metrics.finalBillionaireValue, currency)}
                  </Heading>
                </Box>
                <HStack>
                  <Icon as={FiTrendingUp} color="green.500" />
                  <Text fontSize="sm" fontWeight="medium" color="green.500">
                    {selectedBillionaire.cagr}% annual growth
                  </Text>
                </HStack>
                <Text fontSize="xs" color={textMuted} mt={1}>
                  Currently worth: {formatLargeValue(selectedBillionaire.netWorth, currency)}
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
        
        <Card bg={statCardBg} borderRadius="lg" overflow="hidden" variant="outline">
          <CardBody p={{ base: 3, md: 5 }}>
            <HStack spacing={4} align="flex-start" flexDir={{ base: "column", sm: "row" }}>
              <Flex 
                w="40px" 
                h="40px" 
                borderRadius="lg" 
                bg="green.100" 
                color="green.500"
                align="center"
                justify="center"
                flexShrink={0}
                mb={{ base: 2, sm: 0 }}
              >
                <Icon as={FiCalendar} boxSize="20px" />
              </Flex>
              <VStack align="start" spacing={0} w="100%">
                <Text fontSize="sm" color={textMuted}>Investment Returns</Text>
                <Box h={{ base: "auto", md: "36px" }} display="flex" alignItems="center" w="100%" overflow="visible" py={2}>
                  <Heading 
                    size="md" 
                    fontWeight="bold" 
                    color={metrics.totalReturns >= 0 ? "green.500" : "red.500"}
                    fontSize={{ base: (Math.abs(metrics.totalReturns) > 1e12) ? "xs" : "sm", md: (Math.abs(metrics.totalReturns) > 1e12) ? "sm" : "md" }}
                    maxW="100%"
                    overflowWrap="break-word"
                    wordBreak="break-word"
                    lineHeight="1.2"
                  >
                    {formatLargeValue(metrics.totalReturns, currency)}
                  </Heading>
                </Box>
                <HStack>
                  <Badge colorScheme={results.intersection ? "green" : "yellow"}>
                    {results.intersection ? `Match in ${formatYearValue(results.intersection.year)} years` : "No match found"}
                  </Badge>
                </HStack>
                <Text fontSize="xs" color={textMuted} mt={1}>
                  {results.intersection 
                    ? `You'll reach ${formatLargeValue(results.intersection.value, currency)} by ${formatTargetDate(results.intersection.year)}`
                    : `Adjust parameters to find a potential match`}
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      </VStack>
      
      {/* Only show reality check in the full view */}
      {!condensed && <RealityCheck />}
      
      {/* Only show context card in the full view */}
      {!condensed && (
        <Card bg={cardBg} borderRadius="lg" overflow="hidden">
          <CardBody p={6}>
            <HStack spacing={3} mb={4}>
              <Icon as={FiInfo} color={accentColor} boxSize="20px" />
              <Heading as="h3" size="sm" fontWeight="semibold">
                Context & Perspective
              </Heading>
            </HStack>
            
            <Text fontSize="sm" color={textMuted} mb={4} lineHeight="tall">
              {selectedBillionaire.name}'s current net worth of {formatCurrency(selectedBillionaire.netWorth, currency)} is
              equivalent to the annual income of approximately {formatNumber(selectedBillionaire.netWorth / 50000)} average households.
              {results.intersection 
                ? ` At the intersection point in year ${results.intersection.year}, your investment will have grown to ${formatCurrency(results.intersection.value, currency)}, which would take an average saver over ${formatNumber(results.intersection.value / (50000 * 0.2 * results.intersection.year))} lifetimes to accumulate at typical savings rates.` 
                : ` To match ${selectedBillionaire.name}'s wealth growth, you would need exceptional returns sustained over a long period.`}
            </Text>
            
            <Box
              bg={yellowBg}
              p={4}
              borderRadius="md"
              borderLeftWidth="4px"
              borderColor={yellowBorderColor}
            >
              <HStack align="flex-start" spacing={3}>
                <Icon as={FiAlertCircle} color="yellow.400" mt={0.5} />
                <Text fontSize="sm" color={textMuted}>
                  Remember that billionaire wealth often comes from founding successful companies, not just investment returns. This tool is for illustrative purposes to understand scale and growth patterns.
                </Text>
              </HStack>
            </Box>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default AnalyticsInfo;
