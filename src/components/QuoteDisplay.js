import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Icon,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';
import { investorQuotes } from '../data/investorQuotes';
import { motion, AnimatePresence } from 'framer-motion';

const QuoteDisplay = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  // Change quote every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prevIndex => (prevIndex + 1) % investorQuotes.length);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const authorColor = useColorModeValue('brand.600', 'brand.300');
  
  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      mb={4}
    >
      <Flex align="center" mb={3}>
        <Icon as={FiMessageCircle} color="brand.500" mr={2} />
        <Text fontSize="sm" fontWeight="medium" color="brand.500">
          INVESTOR WISDOM
        </Text>
      </Flex>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <Text 
            fontSize="md" 
            fontStyle="italic" 
            color={textColor}
            mb={2}
          >
            "{investorQuotes[quoteIndex].quote}"
          </Text>
          
          <Text 
            fontSize="sm" 
            fontWeight="medium" 
            color={authorColor}
            textAlign="right"
          >
            — {investorQuotes[quoteIndex].author}
          </Text>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default QuoteDisplay;
