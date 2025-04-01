import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Icon,
  HStack,
  useColorModeValue,
  Button,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { FiCoffee, FiArrowRight, FiTarget, FiDollarSign, FiCalendar, FiPercent } from 'react-icons/fi';
import { wealthFacts, calculationModeFacts } from '../data/investorQuotes';

const FunFacts = ({ netWorth, currency, calculationMode, monthlyInvestment, years, returnRate }) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [customFact, setCustomFact] = useState('');
  const [calculationFact, setCalculationFact] = useState('');
  const [factType, setFactType] = useState('calculation'); // 'calculation', 'custom', 'mode', or 'general'
  
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.200', 'blue.700');
  const iconColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const badgeBg = useColorModeValue('blue.100', 'blue.800');
  
  // Get facts for current calculation mode
  const getModeSpecificFacts = () => {
    return calculationModeFacts[calculationMode] || calculationModeFacts.monthlyInvestment;
  };

  // Generate facts based on calculation mode and parameters
  useEffect(() => {
    // Generate calculation-specific facts
    if (calculationMode === 'monthlyInvestment' && netWorth) {
      const facts = [
        `The ${formatCurrency(monthlyInvestment, currency)} monthly investment needed is ${compareToExpense(monthlyInvestment, currency)}.`,
        `If you saved this amount by reducing daily coffee purchases, you'd need to skip about ${Math.round(monthlyInvestment/5)} coffees per month.`,
        `This monthly amount would pay for Netflix subscriptions for ${Math.floor(monthlyInvestment/15)} people.`,
        `Annually, that's ${formatCurrency(monthlyInvestment * 12, currency)}, which is about ${compareToIncome(monthlyInvestment * 12, currency)} for the average person.`,
        `If you found this amount in loose change each month, you'd need to find ${Math.round(monthlyInvestment * 100)} pennies daily.`,
        `Saving this monthly amount is equivalent to reducing your restaurant meals by about ${Math.floor(monthlyInvestment/50)} times per month.`,
      ];
      setCalculationFact(facts[Math.floor(Math.random() * facts.length)]);
    } 
    else if (calculationMode === 'yearsNeeded') {
      const facts = [
        `${years} years ago was ${new Date().getFullYear() - Math.round(years)}, when ${getHistoricalEvent(years)}.`,
        `In ${years} years, someone born today would be ${formatAge(years)}.`,
        `Over ${years} years, you'll make approximately ${Math.round(years * 12)} monthly investments.`,
        `${years} years is about ${Math.round(years * 365)} days of consistent investing.`,
        `During this ${years}-year period, you'll likely experience about ${Math.floor(years/5)} market corrections and ${Math.floor(years/10)} major market downturns.`,
        `The technology we'll have in ${years} years is likely to be as different from today as today is from ${new Date().getFullYear() - Math.round(years)}.`,
      ];
      setCalculationFact(facts[Math.floor(Math.random() * facts.length)]);
    }
    else if (calculationMode === 'returnRate') {
      const facts = [
        `A ${returnRate.toFixed(1)}% annual return is ${compareToMarketReturns(returnRate)}.`,
        `With this ${returnRate.toFixed(1)}% return rate, your investment would approximately double every ${(72/returnRate).toFixed(1)} years (using the Rule of 72).`,
        `Historically, investments with ${returnRate.toFixed(1)}% returns typically have ${getRiskLevel(returnRate)} risk profiles.`,
        `A ${returnRate.toFixed(1)}% return after 3% inflation would give you a real return of ${(returnRate - 3).toFixed(1)}%.`,
        `To achieve ${returnRate.toFixed(1)}% returns consistently, you would typically need ${getInvestmentType(returnRate)}.`,
        `If everyone could get ${returnRate.toFixed(1)}% returns, the world economy would grow much faster than its historical average of 3-4% annually.`,
      ];
      setCalculationFact(facts[Math.floor(Math.random() * facts.length)]);
    }
  }, [calculationMode, monthlyInvestment, years, returnRate, currency, netWorth]);
  
  // Generate a custom fact based on the current net worth
  useEffect(() => {
    if (!netWorth) return;
    
    const customFacts = [
      `With ${formatCurrency(netWorth, currency)}, you could buy ${Math.floor(netWorth/50000)} luxury cars!`,
      `This wealth could fund ${Math.floor(netWorth/25000)} 4-year college scholarships.`,
      `If you had this amount in $100 bills, the stack would be ${((netWorth/100) * 0.0043 / 39.37).toFixed(1)} feet tall!`,
      `You could pay an annual salary of $50,000 to ${Math.floor(netWorth/50000)} people for a year.`,
      `If you spent $1,000 per day, it would take you ${Math.floor(netWorth/1000/365)} years to spend it all.`,
      `The annual 4% return on this amount would give you ${formatCurrency(netWorth * 0.04, currency)} per year without touching the principal.`,
      `This much wealth could purchase ${Math.floor(netWorth/400000)} average homes in the US.`,
      `Invested in dividend stocks at 3% yield, this would generate ${formatCurrency(netWorth * 0.03, currency)} in passive income annually.`,
    ];
    
    setCustomFact(customFacts[Math.floor(Math.random() * customFacts.length)]);
  }, [netWorth, currency]);
  
  const nextFact = () => {
    // Cycle through fact types: calculation -> custom -> mode-specific -> general -> calculation
    if (factType === 'calculation') {
      setFactType('custom');
    } else if (factType === 'custom') {
      setFactType('mode');
      setCurrentFactIndex(0);
    } else if (factType === 'mode') {
      if (currentFactIndex < getModeSpecificFacts().length - 1) {
        setCurrentFactIndex(prevIndex => prevIndex + 1);
      } else {
        setFactType('general');
        setCurrentFactIndex(0);
      }
    } else { // 'general'
      if (currentFactIndex < wealthFacts.length - 1) {
        setCurrentFactIndex(prevIndex => prevIndex + 1);
      } else {
        setFactType('calculation');
      }
    }
  };

  // Get the current fact to display based on type
  const getCurrentFact = () => {
    if (factType === 'calculation') return calculationFact;
    if (factType === 'custom') return customFact;
    if (factType === 'mode') return getModeSpecificFacts()[currentFactIndex];
    return wealthFacts[currentFactIndex];
  };
  
  // Get badge text based on fact type
  const getBadgeText = () => {
    if (factType === 'calculation') {
      if (calculationMode === 'monthlyInvestment') return 'YOUR INVESTMENT AMOUNT';
      if (calculationMode === 'yearsNeeded') return 'YOUR TIME HORIZON';
      return 'YOUR RETURN RATE';
    }
    if (factType === 'custom') return 'YOUR WEALTH GOAL';
    if (factType === 'mode') {
      if (calculationMode === 'monthlyInvestment') return 'INVESTMENT INSIGHT';
      if (calculationMode === 'yearsNeeded') return 'TIME HORIZON FACT';
      return 'RETURN RATE INSIGHT';
    }
    return 'WEALTH PERSPECTIVE';
  };
  
  // Get icon based on fact type
  const getIcon = () => {
    if (factType === 'calculation') {
      if (calculationMode === 'monthlyInvestment') return FiDollarSign;
      if (calculationMode === 'yearsNeeded') return FiCalendar;
      return FiPercent;
    }
    if (factType === 'custom') return FiTarget;
    if (factType === 'mode') return FiTarget;
    return FiCoffee;
  };

  // Helper function to format currency values nicely
  const formatCurrency = (value, currencyCode) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode === 'INR' ? 'INR' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  // Helper function to compare monthly investment to common expenses
  const compareToExpense = (amount, currencyCode) => {
    if (currencyCode === 'INR') {
      if (amount < 1000) return "less than a basic mobile phone bill";
      if (amount < 5000) return "about a week's grocery for a small family";
      if (amount < 15000) return "similar to a basic car loan payment";
      if (amount < 50000) return "about the cost of a premium smartphone every month";
      return "more than many people's monthly salary";
    } else {
      if (amount < 50) return "less than a typical streaming service bundle";
      if (amount < 200) return "about the cost of a moderate dinner for two";
      if (amount < 500) return "similar to a car payment";
      if (amount < 1000) return "about the same as rent for a room in many cities";
      return "more than many people's monthly rent";
    }
  };

  // Helper function to compare annual investment to income
  const compareToIncome = (annualAmount, currencyCode) => {
    const averageIncome = currencyCode === 'INR' ? 400000 : 50000;
    const percentage = (annualAmount / averageIncome * 100).toFixed(1);
    return `${percentage}% of annual income`;
  };

  // Helper function to get historical events
  const getHistoricalEvent = (yearsAgo) => {
    const year = new Date().getFullYear() - Math.round(yearsAgo);
    
    if (year >= 2020) return "the COVID-19 pandemic began";
    if (year >= 2017) return "Bitcoin reached its first major peak";
    if (year >= 2015) return "Uber and the gig economy went mainstream";
    if (year >= 2010) return "Instagram was launched";
    if (year >= 2007) return "the first iPhone was released";
    if (year >= 2004) return "Facebook was founded";
    if (year >= 2000) return "the dot-com bubble burst";
    if (year >= 1995) return "the internet started becoming widely used";
    if (year >= 1990) return "the World Wide Web was invented";
    if (year >= 1980) return "personal computers became popular";
    if (year >= 1970) return "the first email was sent";
    if (year >= 1960) return "the first human space flight occurred";
    return "technologies we take for granted today didn't exist";
  };

  // Helper function to format age in a friendly way
  const formatAge = (years) => {
    if (years < 18) return `${years} years old, still a minor`;
    if (years < 25) return `${years} years old, a young adult`;
    if (years < 35) return `${years}, likely in their career prime`;
    if (years < 50) return `${years}, in mid-life`;
    if (years < 65) return `${years}, approaching retirement age`;
    return `${years}, well into retirement years`;
  };

  // Helper function to compare return rate to market benchmarks
  const compareToMarketReturns = (rate) => {
    if (rate < 2) return "lower than typical savings account returns";
    if (rate < 5) return "similar to government bond returns";
    if (rate < 8) return "typical for conservative investment portfolios";
    if (rate < 12) return "close to long-term stock market average returns";
    if (rate < 20) return "higher than average stock market returns";
    if (rate < 30) return "similar to top venture capital fund targets";
    return "extraordinarily high and rarely sustainable long-term";
  };

  // Helper function to get risk level associated with return rate
  const getRiskLevel = (rate) => {
    if (rate < 3) return "very low";
    if (rate < 6) return "low";
    if (rate < 10) return "moderate";
    if (rate < 15) return "high";
    if (rate < 25) return "very high";
    return "extreme";
  };

  // Helper function to suggest investment types for different return rates
  const getInvestmentType = (rate) => {
    if (rate < 3) return "savings accounts or short-term CDs";
    if (rate < 5) return "government bonds or high-grade corporate bonds";
    if (rate < 8) return "a balanced portfolio of stocks and bonds";
    if (rate < 12) return "a diversified stock portfolio";
    if (rate < 18) return "growth stocks or specialized sector investments";
    if (rate < 30) return "high-risk investments like early-stage startups";
    return "extraordinary luck or exceptional business skills";
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      mb={4}
    >
      <Flex justify="space-between" align="flex-start">
        <HStack spacing={3} align="flex-start" mb={2}>
          <Icon as={getIcon()} boxSize="20px" color={iconColor} mt={1} />
          <Box>
            <Text fontWeight="bold" fontSize="sm">
              INTERESTING FACT
            </Text>
            <Badge 
              fontSize="xs" 
              colorScheme="blue" 
              variant="subtle" 
              mt={1}
              bg={badgeBg}
            >
              {getBadgeText()}
            </Badge>
          </Box>
        </HStack>
        
        <Button
          size="xs"
          variant="ghost"
          rightIcon={<FiArrowRight />}
          onClick={nextFact}
          color={iconColor}
        >
          Next fact
        </Button>
      </Flex>
      
      <Text fontSize="sm" color={textColor} mt={2}>
        {getCurrentFact()}
      </Text>
    </Box>
  );
};

export default FunFacts;
