import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  HStack,
  VStack,
  IconButton,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { 
  FiMaximize2, 
  FiMinimize2, 
  FiInfo, 
  FiBarChart2, 
  FiDownload,
  FiBarChart, 
  FiBookOpen,
  FiAward,
  FiZap,
  FiAlertCircle,
} from 'react-icons/fi';
import { 
  AreaChart,
  Area,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from 'recharts';
import { formatCurrency, convertToINR } from '../utils/calculations';
import AnalyticsInfo from './AnalyticsInfo';
import FunFacts from './FunFacts';
import RealityCheck from './RealityCheck';
import QuoteDisplay from './QuoteDisplay';
import ShareResults from './ShareResults';

const ResultsVisualization = ({ 
  results, 
  calculationMode, 
  selectedBillionaire, 
  currency,
  monthlyInvestment,
  years,
  returnRate
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChart, setSelectedChart] = useState('area');
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const userColor = useColorModeValue('#3182CE', '#63B3ED');
  const billionaireColor = useColorModeValue('#D53F8C', '#ED64A6');
  const intersectionColor = useColorModeValue('#38A169', '#68D391');
  const gridColor = useColorModeValue('#EDF2F7', '#2D3748');
  const lightTextColor = useColorModeValue('gray.600', 'gray.400');
  const accentGradient = `linear(to-r, brand.500, accent.500)`;
  const tooltipBorderColor = useColorModeValue('gray.200', 'gray.700');
  const fullscreenLegendBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('gray.50', 'gray.900');
  const accentColor = useColorModeValue('brand.500', 'brand.300');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const yellowBg = useColorModeValue('yellow.50', 'yellow.900');
  const yellowBorderColor = useColorModeValue('yellow.200', 'yellow.700');
  const yellowIconColor = useColorModeValue('yellow.500', 'yellow.300');

  const formatYAxis = (value) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    const numValue = currency === 'INR' ? convertToINR(value) : value;

    if (currency === 'INR') {
      if (numValue >= 1e12) {
        return `${symbol}${(numValue / 1e12).toFixed(1)}L Cr`;
      } else if (numValue >= 1e11) {
        return `${symbol}${(numValue / 1e9).toFixed(1)}K Cr`;
      } else if (numValue >= 1e9) {
        return `${symbol}${(numValue / 1e9).toFixed(1)}H Cr`;
      } else if (numValue >= 1e7) {
        return `${symbol}${(numValue / 1e7).toFixed(1)}Cr`;
      } else if (numValue >= 1e5) {
        return `${symbol}${(numValue / 1e5).toFixed(1)}L`;
      } else if (numValue >= 1e3) {
        return `${symbol}${(numValue / 1e3).toFixed(1)}K`;
      } else {
        return `${symbol}${numValue.toFixed(0)}`;
      }
    } else {
      if (numValue >= 1e12) {
        return `${symbol}${(numValue / 1e12).toFixed(1)}T`;
      } else if (numValue >= 1e9) {
        return `${symbol}${(numValue / 1e9).toFixed(1)}B`;
      } else if (numValue >= 1e6) {
        return `${symbol}${(numValue / 1e6).toFixed(1)}M`;
      } else if (numValue >= 1e3) {
        return `${symbol}${(numValue / 1e3).toFixed(1)}K`;
      } else {
        return `${symbol}${numValue.toFixed(0)}`;
      }
    }
  };

  const formatYearValue = (yearValue) => {
    if (Math.abs(yearValue - Math.round(yearValue)) < 0.01) {
      return Math.round(yearValue);
    }
    return yearValue.toFixed(1);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          bg={bgColor}
          p={4}
          borderRadius="md"
          boxShadow="lg"
          border="1px solid"
          borderColor={tooltipBorderColor}
          maxW="280px"
        >
          <Text fontWeight="bold" mb={3}>Year {label}</Text>
          {payload.map((entry, index) => (
            <Flex key={index} justifyContent="space-between" mb={2}>
              <HStack spacing={2}>
                <Box w="10px" h="10px" borderRadius="full" bg={entry.color} />
                <Text fontWeight="medium">{entry.name}:</Text>
              </HStack>
              <Text fontWeight="semibold">{formatCurrency(entry.value, currency)}</Text>
            </Flex>
          ))}
          {payload.length === 2 && (
            <>
              <Divider my={2} />
              <Flex justifyContent="space-between" mt={2}>
                <Text fontWeight="medium">Difference:</Text>
                <Text fontWeight="bold" color={payload[0].value > payload[1].value ? userColor : billionaireColor}>
                  {formatCurrency(Math.abs(payload[0].value - payload[1].value), currency)}
                </Text>
              </Flex>
            </>
          )}
        </Box>
      );
    }
    return null;
  };

  const getYDomain = () => {
    const allValues = [
      ...results.userInvestmentData.map(d => d.value),
      ...results.billionaireData.map(d => d.value)
    ];
    const maxValue = Math.max(...allValues) * 1.1;
    return [0, maxValue];
  };

  const formatTargetDate = (yearsFromNow) => {
    const currentDate = new Date();
    const targetDate = new Date(currentDate);
    const fullYears = Math.floor(yearsFromNow);
    const months = Math.round((yearsFromNow - fullYears) * 12);
    targetDate.setFullYear(currentDate.getFullYear() + fullYears);
    targetDate.setMonth(currentDate.getMonth() + months);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
  };

  const getResultHeading = () => {
    switch (calculationMode) {
      case 'monthlyInvestment':
        const formattedValue = results.calculatedValue < 1 
          ? `${currency === 'INR' ? '₹' : '$'}${(currency === 'INR' ? convertToINR(results.calculatedValue) : results.calculatedValue).toFixed(6)}`
          : `${currency === 'INR' ? '₹' : '$'}${(currency === 'INR' ? convertToINR(results.calculatedValue) : results.calculatedValue).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`;
        return {
          label: 'Required Monthly Investment',
          value: formattedValue,
          subtext: `${formatCurrency(results.calculatedValue * 12, currency)} annually`
        };
      case 'yearsNeeded':
        return {
          label: 'Years Needed',
          value: results.isPossible ? `${results.calculatedValue.toFixed(1)} years` : 'Not Possible',
          subtext: results.isPossible ? 
            `Until ${formatTargetDate(results.calculatedValue)}` : 
            'With current parameters'
        };
      case 'returnRate':
        return {
          label: 'Required Return Rate',
          value: `${results.calculatedValue.toFixed(2)}%`,
          subtext: results.calculatedValue > 100 
            ? 'Extremely high return needed' 
            : 'Annual return needed'
        };
      default:
        return { label: '', value: '', subtext: '' };
    }
  };

  const prepareChartData = () => {
    return [...Array(Math.max(results.userInvestmentData.length, results.billionaireData.length)).keys()].map(i => ({
      year: i,
      user: i < results.userInvestmentData.length ? results.userInvestmentData[i].value : null,
      billionaire: i < results.billionaireData.length ? results.billionaireData[i].value : null
    }));
  };

  const resultHeading = getResultHeading();
  const chartData = prepareChartData();

  const renderChart = (fullscreen = false) => {
    const margin = fullscreen 
      ? { top: 30, right: 40, left: 0, bottom: 40 } 
      : { top: 20, right: 20, left: 0, bottom: 20 };
    const Chart = selectedChart === 'area' ? AreaChart : LineChart;
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <Chart
          data={chartData}
          margin={margin}
        >
          <defs>
            <linearGradient id={`userGradient${fullscreen ? 'FS' : ''}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={userColor} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={userColor} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id={`billionaireGradient${fullscreen ? 'FS' : ''}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={billionaireColor} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={billionaireColor} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={gridColor} 
            strokeOpacity={fullscreen ? 0.3 : 0.5}
          />
          <XAxis 
            dataKey="year" 
            tickLine={false}
            axisLine={{ stroke: gridColor, strokeOpacity: 0.8 }}
            tick={{ fontSize: fullscreen ? 14 : 12, fill: lightTextColor }}
            label={fullscreen ? { 
              value: 'Years from Now', 
              position: 'insideBottom', 
              offset: -25,
              fontSize: 16,
              fill: lightTextColor,
              fontWeight: 500
            } : null}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis 
            tickFormatter={formatYAxis} 
            domain={getYDomain()}
            tickLine={false}
            axisLine={{ stroke: gridColor, strokeOpacity: 0.8 }}
            tick={{ fontSize: fullscreen ? 14 : 12, fill: lightTextColor }}
            width={fullscreen ? 80 : 45}
            label={fullscreen ? { 
              value: 'Net Worth', 
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              fontSize: 16,
              fill: lightTextColor,
              fontWeight: 500
            } : null}
          />
          <RechartsTooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: gridColor, strokeDasharray: '3 3', strokeWidth: 2 }}
            wrapperStyle={{ zIndex: 100 }}
          />
          {selectedChart === 'area' ? (
            <>
              <Area 
                type="monotone" 
                dataKey="user" 
                name="Your Investment" 
                stroke={userColor}
                strokeWidth={fullscreen ? 3 : 2}
                fillOpacity={fullscreen ? 0.4 : 0.5}
                fill={`url(#userGradient${fullscreen ? 'FS' : ''})`}
                activeDot={{ 
                  r: fullscreen ? 10 : 8, 
                  stroke: userColor, 
                  strokeWidth: 2, 
                  fill: 'white',
                  strokeOpacity: 1
                }}
              />
              <Area 
                type="monotone" 
                dataKey="billionaire" 
                name={selectedBillionaire.name} 
                stroke={billionaireColor}
                strokeWidth={fullscreen ? 3 : 2}
                fillOpacity={fullscreen ? 0.4 : 0.5}
                fill={`url(#billionaireGradient${fullscreen ? 'FS' : ''})`}
                activeDot={{ 
                  r: fullscreen ? 10 : 8, 
                  stroke: billionaireColor, 
                  strokeWidth: 2, 
                  fill: 'white',
                  strokeOpacity: 1
                }}
              />
            </>
          ) : (
            <>
              <Line 
                type="monotone" 
                dataKey="user" 
                name="Your Investment" 
                stroke={userColor}
                strokeWidth={fullscreen ? 4 : 3}
                dot={false}
                activeDot={{ 
                  r: fullscreen ? 10 : 8, 
                  stroke: userColor, 
                  strokeWidth: 2, 
                  fill: 'white',
                  strokeOpacity: 1
                }}
              />
              <Line 
                type="monotone" 
                dataKey="billionaire" 
                name={selectedBillionaire.name} 
                stroke={billionaireColor}
                strokeWidth={fullscreen ? 4 : 3}
                dot={false}
                activeDot={{ 
                  r: fullscreen ? 10 : 8, 
                  stroke: billionaireColor, 
                  strokeWidth: 2, 
                  fill: 'white',
                  strokeOpacity: 1
                }}
              />
            </>
          )}
          {results.intersection && (
            <ReferenceLine 
              x={results.intersection.year} 
              stroke={intersectionColor}
              strokeWidth={fullscreen ? 3 : 2} 
              strokeDasharray="5 5"
              label={{
                position: fullscreen ? 'top' : 'insideTop',
                value: fullscreen ? `Match Point: Year ${formatYearValue(results.intersection.year)}` : '',
                fill: intersectionColor,
                fontSize: 14,
                fontWeight: 'bold',
                offset: 15
              }}
            />
          )}
        </Chart>
      </ResponsiveContainer>
    );
  };

  return (
    <Box>
      <Box mb={4}>
        <Flex 
          justifyContent="space-between" 
          alignItems="center" 
          mb={6}
          flexDirection={{ base: "column", sm: "row" }}
          gap={3}
        >
          <Heading as="h2" size="md" fontWeight="semibold" w={{ base: "100%", sm: "auto" }}>
            {calculationMode === 'monthlyInvestment' 
              ? 'Investment Requirements' 
              : calculationMode === 'yearsNeeded' 
                ? 'Time to Match Wealth' 
                : 'Required Return Rate'}
          </Heading>
          <HStack spacing={2} w={{ base: "100%", sm: "auto" }} justifyContent={{ base: "space-between", sm: "flex-end" }}>
            <ShareResults
              calculationMode={calculationMode}
              selectedBillionaire={selectedBillionaire}
              results={results}
              monthlyInvestment={monthlyInvestment}
              years={years}
              returnRate={returnRate}
              currency={currency}
              size={{ base: "sm", md: "md" }}
              mr={0}
            />
            <Button 
              size="sm"
              variant="ghost"
              onClick={() => setSelectedChart(selectedChart === 'area' ? 'line' : 'area')}
              leftIcon={<FiBarChart2 />}
              iconSpacing={{ base: 1, md: 2 }}
              px={{ base: 2, md: 3 }}
            >
              {selectedChart === 'area' ? <Box as="span" display={{ base: "none", md: "inline" }}>Line</Box> : <Box as="span" display={{ base: "none", md: "inline" }}>Area</Box>}
            </Button>
            <IconButton
              icon={<FiMaximize2 />}
              variant="ghost"
              size="sm"
              onClick={onOpen}
              aria-label="Expand chart"
            />
          </HStack>
        </Flex>
        <Box 
          mb={4} 
          borderRadius="lg" 
          overflow="hidden"
          bg={useColorModeValue('gray.50', 'gray.900')}
        >
          <Flex 
            direction={{ base: "column", md: "row" }} 
            align="stretch"
          >
            <Box 
              p={{ base: 4, md: 6 }} 
              flex={{ base: "1", md: "0 0 250px" }}
              minH={{ base: "auto", md: "300px" }}
              bgGradient={accentGradient}
              color="white"
              position="relative"
            >
              <Stat mb={4}>
                <StatLabel fontSize="sm" opacity={0.9}>
                  {resultHeading.label}
                </StatLabel>
                <Box h={{ base: "auto", md: "64px" }} display="flex" alignItems="center" py={2}>
                  <StatNumber 
                    fontSize={resultHeading.value.length > 15 ? { base: "xl", md: "2xl" } : { base: "2xl", md: "3xl" }} 
                    fontWeight="bold" 
                    letterSpacing="tight" 
                    lineHeight="1.2"
                  >
                    {resultHeading.value}
                  </StatNumber>
                </Box>
                <StatHelpText fontSize="sm" mt={1}>
                  {resultHeading.subtext}
                </StatHelpText>
              </Stat>
              {results.intersection && (
                <Box mt={4} pt={4} borderTopWidth="1px" borderTopColor="whiteAlpha.300">
                  <Text fontSize="sm" opacity={0.9}>Wealth Match Point</Text>
                  <Box h={{ base: "auto", md: "34px" }} display="flex" alignItems="center" py={2}>
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" lineHeight="1.2">
                      Year {formatYearValue(results.intersection.year)}
                    </Text>
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" noOfLines={1} maxW="100%" whiteSpace="normal">
                      {formatTargetDate(results.intersection.year)}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" mt={1}>
                      {formatCurrency(results.intersection.value, currency)}
                    </Text>
                  </VStack>
                </Box>
              )}
            </Box>
            <Box p={{ base: 4, md: 6 }} flex="1">
              <Flex 
                justifyContent="space-between" 
                alignItems="center" 
                mb={4}
                flexWrap="wrap"
                gap={2}
              >
                <Box></Box>
                <HStack 
                  spacing={{ base: 2, md: 4 }} 
                  mt={{ base: 2, md: 0 }}
                  w={{ base: "100%", md: "auto" }}
                  justify={{ base: "space-around", md: "flex-end" }}
                  flexWrap="wrap"
                >
                  <HStack>
                    <Box w="10px" h="10px" borderRadius="full" bg={userColor} />
                    <Text fontSize="xs">Your Investment</Text>
                  </HStack>
                  <HStack>
                    <Box w="10px" h="10px" borderRadius="full" bg={billionaireColor} />
                    <Text fontSize="xs" noOfLines={1}>{selectedBillionaire.name}</Text>
                  </HStack>
                  {results.intersection && (
                    <HStack>
                      <Box w="10px" h="10px" borderRadius="full" bg={intersectionColor} />
                      <Text fontSize="xs">Wealth Match</Text>
                    </HStack>
                  )}
                </HStack>
              </Flex>
              <Box height={{ base: "250px", md: "300px" }}>
                {renderChart(false)}
              </Box>
            </Box>
          </Flex>
        </Box>
        <Tabs 
          colorScheme="brand" 
          variant="enclosed" 
          index={tabIndex} 
          onChange={handleTabsChange}
          mt={6}
          borderRadius="lg"
          overflow="hidden"
          bg={cardBg}
          isLazy
        >
          <TabList overflowX="auto" flexWrap="nowrap" sx={{
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': { display: 'none' },
            '-webkit-overflow-scrolling': 'touch'
          }}>
            <Tab 
              fontWeight="medium" 
              _selected={{ color: accentColor, borderColor: 'currentColor', borderBottomColor: cardBg }}
              px={{ base: 4, md: 6 }}
              py={3}
              fontSize={{ base: "xs", md: "sm" }}
              minW="auto"
              flex={{ base: 1, md: "auto" }}
            >
              <FiBarChart mr={2} />
              <Text noOfLines={1}>Results Analysis</Text>
            </Tab>
            <Tab 
              fontWeight="medium" 
              _selected={{ color: accentColor, borderColor: 'currentColor', borderBottomColor: cardBg }}
              px={{ base: 4, md: 6 }}
              py={3}
              fontSize={{ base: "xs", md: "sm" }}
              minW="auto"
              flex={{ base: 1, md: "auto" }}
            >
              <FiBookOpen mr={2} />
              <Text noOfLines={1}>Insights & Education</Text>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={5}>
              {results.intersection && (
                <Box
                  mb={4}
                  p={4}
                  borderRadius="lg"
                  bg={yellowBg}
                  borderWidth="1px"
                  borderColor={yellowBorderColor}
                >
                  <Flex align="center">
                    <FiAward
                      color={yellowIconColor}
                      boxSize="24px"
                      mr={3}
                    />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">Investment Master Achievement</Text>
                      <Text fontSize="xs" color={lightTextColor}>
                        You've unlocked a strategy to match {selectedBillionaire.name}'s wealth growth!
                      </Text>
                    </Box>
                    <FiZap
                      color={yellowIconColor}
                      boxSize="20px"
                      ml="auto"
                    />
                  </Flex>
                </Box>
              )}
              <AnalyticsInfo 
                results={results}
                calculationMode={calculationMode}
                selectedBillionaire={selectedBillionaire}
                monthlyInvestment={monthlyInvestment}
                years={years}
                currency={currency}
                condensed={true}
              />
            </TabPanel>
            <TabPanel p={5}>
              <QuoteDisplay />
              {results.intersection && (
                <FunFacts 
                  netWorth={results.intersection.value} 
                  currency={currency}
                  calculationMode={calculationMode} 
                  monthlyInvestment={calculationMode === 'monthlyInvestment' ? results.calculatedValue : monthlyInvestment}
                  years={calculationMode === 'yearsNeeded' ? results.calculatedValue : years}
                  returnRate={calculationMode === 'returnRate' ? results.calculatedValue : returnRate}
                />
              )}
              <RealityCheck />
              <Box bg={cardBg} borderRadius="lg" overflow="hidden" mt={4}>
                <Box p={6}>
                  <HStack spacing={3} mb={4}>
                    <FiInfo color={accentColor} boxSize="20px" />
                    <Heading as="h3" size="sm" fontWeight="semibold">
                      Context & Perspective
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color={textMuted} mb={4} lineHeight="tall">
                    {selectedBillionaire.name}'s current net worth of {formatCurrency(selectedBillionaire.netWorth, currency)} is
                    equivalent to the annual income of approximately {Math.round(selectedBillionaire.netWorth / 50000)} average households.
                    {results.intersection 
                      ? ` At the intersection point in year ${results.intersection.year}, your investment will have grown to ${formatCurrency(results.intersection.value, currency)}, which would take an average saver over ${Math.round(results.intersection.value / (50000 * 0.2 * results.intersection.year))} lifetimes to accumulate at typical savings rates.` 
                      : ` To match ${selectedBillionaire.name}'s wealth growth, you would need exceptional returns sustained over a long period.`}
                  </Text>
                  <Box
                    bg={useColorModeValue('yellow.50', 'yellow.900')}
                    p={4}
                    borderRadius="md"
                    borderLeftWidth="4px"
                    borderColor="yellow.400"
                  >
                    <HStack align="flex-start" spacing={3}>
                      <FiAlertCircle color="yellow.400" mt={0.5} />
                      <Text fontSize="sm" color={textMuted}>
                        Remember that billionaire wealth often comes from founding successful companies, not just investment returns. This tool is for illustrative purposes to understand scale and growth patterns.
                      </Text>
                    </HStack>
                  </Box>
                </Box>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="full" motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(8px)" />
        <ModalContent bg={bgColor} height="100vh" maxWidth="100vw">
          <ModalHeader 
            borderBottomWidth="1px" 
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            px={{ base: 4, md: 8 }}
            py={4}
          >
            <Flex justifyContent="space-between" alignItems="center" width="100%">
              <Heading size="md" noOfLines={1}>
                Investment Growth: You vs {selectedBillionaire.name}
              </Heading>
              <IconButton
                icon={<FiMinimize2 />}
                variant="ghost"
                onClick={onClose}
                aria-label="Close fullscreen"
                borderRadius="full"
                size="md"
              />
            </Flex>
          </ModalHeader>
          <ModalBody p={{ base: 3, md: 8 }} overflow="auto">
            <Flex direction="column" height="100%" maxWidth={{ base: "100%", xl: "1600px" }} mx="auto">
              <Flex 
                justifyContent="space-between" 
                mb={6} 
                wrap="wrap" 
                gap={4}
                alignItems="center"
                bg={useColorModeValue('white', 'gray.800')}
                p={5}
                borderRadius="xl"
                boxShadow="sm"
              >
                <HStack spacing={{ base: 4, md: 8 }} flexWrap="wrap">
                  <Box>
                    <Text fontWeight="medium" fontSize="sm" color={lightTextColor} mb={1}>
                      {resultHeading.label}
                    </Text>
                    <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="brand.500">
                      {resultHeading.value}
                    </Text>
                  </Box>
                  {results.intersection && (
                    <Box>
                      <Text fontWeight="medium" fontSize="sm" color={lightTextColor} mb={1}>
                        Wealth Match Point
                      </Text>
                      <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="green.500">
                        Year {results.intersection.year}
                      </Text>
                    </Box>
                  )}
                </HStack>
                <HStack spacing={6} mt={{ base: 2, md: 0 }}>
                  <HStack>
                    <Text fontWeight="medium" fontSize="sm" color={lightTextColor}>Chart Type:</Text>
                    <Button 
                      size="sm" 
                      variant={selectedChart === 'area' ? 'solid' : 'outline'}
                      onClick={() => setSelectedChart('area')}
                      colorScheme="brand"
                    >
                      Area
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedChart === 'line' ? 'solid' : 'outline'}
                      onClick={() => setSelectedChart('line')}
                      colorScheme="brand"
                    >
                      Line
                    </Button>
                  </HStack>
                </HStack>
              </Flex>
              
              {/* Enhanced legend with better layout and information */}
              <Flex 
                justify="center" 
                mb={6}
                p={5}
                borderRadius="xl"
                bg={fullscreenLegendBg}
                boxShadow="sm"
                flexWrap="wrap"
                rowGap={4}
              >
                <HStack 
                  spacing={{ base: 4, md: 10 }}
                  flexWrap="wrap"
                  justifyContent={{ base: "space-around", md: "center" }}
                  width="100%"
                >
                  <HStack spacing={3}>
                    <Box 
                      w="16px" 
                      h="16px" 
                      borderRadius="full" 
                      bg={userColor}
                      boxShadow="0 0 0 2px rgba(255,255,255,0.3)"
                    />
                    <VStack spacing={0} align="start">
                      <Text fontWeight="medium">Your Investment</Text>
                      <Text fontSize="sm" color={lightTextColor}>
                        Final: {formatCurrency(results.userInvestmentData[results.userInvestmentData.length - 1]?.value || 0, currency)}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack spacing={3}>
                    <Box 
                      w="16px" 
                      h="16px" 
                      borderRadius="full" 
                      bg={billionaireColor}
                      boxShadow="0 0 0 2px rgba(255,255,255,0.3)"
                    />
                    <VStack spacing={0} align="start">
                      <Text fontWeight="medium">{selectedBillionaire.name}</Text>
                      <Text fontSize="sm" color={lightTextColor}>
                        Final: {formatCurrency(results.billionaireData[results.billionaireData.length - 1]?.value || 0, currency)}
                      </Text>
                    </VStack>
                  </HStack>
                  {results.intersection && (
                    <HStack spacing={3}>
                      <Box 
                        w="16px" 
                        h="16px" 
                        borderRadius="full" 
                        bg={intersectionColor}
                        boxShadow="0 0 0 2px rgba(255,255,255,0.3)"
                      />
                      <VStack spacing={0} align="start">
                        <Text fontWeight="medium">Wealth Match Point</Text>
                        <Text fontSize="sm" color={lightTextColor}>
                          Year {formatYearValue(results.intersection.year)}: {formatCurrency(results.intersection.value, currency)}
                        </Text>
                      </VStack>
                    </HStack>
                  )}
                </HStack>
              </Flex>
              
              {/* Enhanced chart container with better dimensions and responsiveness */}
              <Box 
                flex="1" 
                minH={{ base: "400px", md: "500px" }} 
                maxH={{ base: "60vh", md: "calc(100vh - 320px)" }}
                borderRadius="xl"
                overflow="hidden"
                bg={useColorModeValue('white', 'gray.900')}
                p={5}
                boxShadow="sm"
              >
                {renderChart(true)}
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter 
            borderTopWidth="1px" 
            borderTopColor={useColorModeValue('gray.200', 'gray.700')}
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'stretch', md: 'center' }}
            gap={3}
            px={{ base: 4, md: 8 }}
            py={4}
          >
            <Text fontSize="sm" color={lightTextColor} flex={{ base: 0, md: 1 }} mb={{ base: 2, md: 0 }}>
              Note: This chart shows wealth growth over time and assumes consistent returns without market volatility.
            </Text>
            <Flex gap={2} flexWrap="wrap" justifyContent={{ base: 'space-between', md: 'flex-end' }} w={{ base: '100%', md: 'auto' }}>
              <ShareResults
                calculationMode={calculationMode}
                selectedBillionaire={selectedBillionaire}
                results={results}
                monthlyInvestment={monthlyInvestment}
                years={years}
                returnRate={returnRate}
                currency={currency}
                size="sm"
              />
              <Button leftIcon={<FiDownload />} variant="outline" size="sm">
                Export Data
              </Button>
              <Button colorScheme="brand" onClick={onClose} size="sm">
                Close
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ResultsVisualization;
