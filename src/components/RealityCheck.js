import React, { useState } from 'react';
import {
  Box,
  Text,
  Icon,
  HStack,
  VStack,
  useColorModeValue,
  Collapse,
  Button,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { FiAlertTriangle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { realityChecks, investmentEducation } from '../data/investorQuotes';

const RealityCheck = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const bgColor = useColorModeValue('yellow.50', 'yellow.900');
  const borderColor = useColorModeValue('yellow.200', 'yellow.700');
  const iconColor = useColorModeValue('yellow.500', 'yellow.300');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('gray.800', 'white');
  
  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      mb={4}
    >
      <Flex justify="space-between" align="center" onClick={() => setIsExpanded(!isExpanded)} cursor="pointer">
        <HStack spacing={3}>
          <Icon as={FiAlertTriangle} boxSize="20px" color={iconColor} />
          <Text fontWeight="bold" fontSize="sm" color={headingColor}>
            REALITY CHECK: THE PATH TO BILLIONS
          </Text>
        </HStack>
        
        <Button
          size="sm"
          variant="ghost"
          rightIcon={isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        >
          {isExpanded ? "Show less" : "Learn more"}
        </Button>
      </Flex>
      
      <Collapse in={isExpanded} animateOpacity>
        <VStack spacing={4} mt={4} align="stretch">
          <Text fontSize="sm" color={textColor}>
            While it's fun to compare investment growth with billionaires, it's important to understand how billionaire wealth typically accumulates. Here are some reality checks:
          </Text>
          
          {realityChecks.map((item, index) => (
            <Box key={index}>
              <Text fontWeight="semibold" fontSize="sm" color={headingColor}>
                {item.title}
              </Text>
              <Text fontSize="sm" color={textColor}>
                {item.description}
              </Text>
            </Box>
          ))}
          
          <Divider my={2} />
          
          <Text fontWeight="bold" fontSize="sm" color={headingColor}>
            PRACTICAL INVESTMENT WISDOM
          </Text>
          
          {investmentEducation.map((item, index) => (
            <Box key={index}>
              <Text fontWeight="semibold" fontSize="sm" color={headingColor}>
                {item.title}
              </Text>
              <Text fontSize="sm" color={textColor}>
                {item.description}
              </Text>
            </Box>
          ))}
        </VStack>
      </Collapse>
      
      {!isExpanded && (
        <Text fontSize="sm" color={textColor} mt={2}>
          Most billionaires didn't get rich through passive investing alone. They founded companies, took significant risks, and had timing, expertise, and often privilege on their side.
        </Text>
      )}
    </Box>
  );
};

export default RealityCheck;
