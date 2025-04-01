import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Icon,
  HStack,
  Text,
  useClipboard,
  useToast,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  useColorModeValue,
  Flex,
  Textarea,
  Divider,
} from '@chakra-ui/react';
import { FiShare2, FiCopy, FiTwitter, FiMessageCircle } from 'react-icons/fi';
import { formatCurrency } from '../utils/calculations';

const ShareResults = ({ 
  calculationMode, 
  selectedBillionaire, 
  results,
  monthlyInvestment,
  years,
  returnRate,
  currency,
  size = "md",
  ...props
}) => {
  const toast = useToast();
  const [shareMessage, setShareMessage] = useState('');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const twitterBgColor = useColorModeValue('blue.50', 'blue.900');
  const redditBgColor = useColorModeValue('orange.50', 'orange.900');
  
  // Generate share message once when component mounts or when essential props change
  // using useCallback to memoize the function
  const generateShareMessage = useCallback(() => {
    const baseUrl = "https://racetoriches.com";
    const billionaireName = selectedBillionaire.name;
    const emojis = ["💰", "📈", "🚀", "💎", "⏱️", "💸", "🔥", "✨"];
    
    // Pick random emojis for variety
    const startEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const endEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    let message = "";
    
    switch (calculationMode) {
      case 'monthlyInvestment':
        // More creative monthly investment messages
        const investmentPhrases = [
          `${startEmoji} Turns out I'd need ${formatCurrency(results.calculatedValue, currency)}/month to match ${billionaireName}'s fortune in ${years} years! `,
          `${startEmoji} Just calculated my billionaire blueprint: ${formatCurrency(results.calculatedValue, currency)}/month could match ${billionaireName} in ${years} years! `,
          `${startEmoji} My path to ${billionaireName}-level wealth? Stashing away ${formatCurrency(results.calculatedValue, currency)} monthly for ${years} years! `
        ];
        
        message = investmentPhrases[Math.floor(Math.random() * investmentPhrases.length)];
        
        if (results.intersection) {
          const intersectionPhrases = [
            `I'd hit ${formatCurrency(results.intersection.value, currency)} by year ${Math.round(results.intersection.year)}! `,
            `By year ${Math.round(results.intersection.year)}, I'd be swimming in ${formatCurrency(results.intersection.value, currency)}! `,
            `Year ${Math.round(results.intersection.year)} is my wealth match milestone: ${formatCurrency(results.intersection.value, currency)}! `
          ];
          message += intersectionPhrases[Math.floor(Math.random() * intersectionPhrases.length)];
        }
        
        if (results.calculatedValue < 1000) {
          message += `Surprisingly within reach! ${endEmoji} `;
        } else if (results.calculatedValue > 10000) {
          message += `Ambitious dreams start somewhere! ${endEmoji} `;
        } else {
          message += `The power of consistency! ${endEmoji} `;
        }
        break;
        
      case 'yearsNeeded':
        if (results.isPossible) {
          // More creative time horizon messages
          const yearPhrases = [
            `${startEmoji} My ${formatCurrency(monthlyInvestment, currency)}/month investment journey would match ${billionaireName}'s wealth in ${results.calculatedValue.toFixed(1)} years! `,
            `${startEmoji} The countdown is on! ${results.calculatedValue.toFixed(1)} years of investing ${formatCurrency(monthlyInvestment, currency)}/month to reach ${billionaireName} status! `,
            `${startEmoji} Plot twist: I could reach ${billionaireName}'s wealth level in just ${results.calculatedValue.toFixed(1)} years at ${formatCurrency(monthlyInvestment, currency)}/month! `
          ];
          
          message = yearPhrases[Math.floor(Math.random() * yearPhrases.length)];
          
          if (results.calculatedValue < 30) {
            const quickPhrases = [
              `Faster than I thought possible! `,
              `That's sooner than retiring! `,
              `Time to start planning my yacht purchase! `
            ];
            message += quickPhrases[Math.floor(Math.random() * quickPhrases.length)] + endEmoji;
          } else {
            const longPhrases = [
              `Patience is a virtue (and a wealth-builder)! `,
              `Long game, big rewards! `,
              `Marathon, not a sprint! `
            ];
            message += longPhrases[Math.floor(Math.random() * longPhrases.length)] + endEmoji;
          }
        } else {
          const impossiblePhrases = [
            `${startEmoji} Plot twist: Even with ${formatCurrency(monthlyInvestment, currency)}/month, I'd need 100+ years to match ${billionaireName}'s wealth! Talk about perspective! ${endEmoji}`,
            `${startEmoji} Reality check: ${formatCurrency(monthlyInvestment, currency)}/month would take more than a century to reach ${billionaireName}-level wealth! Mind = blown! ${endEmoji}`,
            `${startEmoji} Fun fact: My ${formatCurrency(monthlyInvestment, currency)}/month would need 100+ years to reach ${billionaireName} status! Time to adjust my strategy! ${endEmoji}`
          ];
          
          message = impossiblePhrases[Math.floor(Math.random() * impossiblePhrases.length)];
        }
        break;
        
      case 'returnRate':
        // More creative return rate messages
        const returnPhrases = [
          `${startEmoji} The magic number? ${results.calculatedValue.toFixed(2)}% annual returns would transform my ${formatCurrency(monthlyInvestment, currency)}/month into ${billionaireName}-level wealth in ${years} years! `,
          `${startEmoji} Cracked the code! Need ${results.calculatedValue.toFixed(2)}% returns to turn ${formatCurrency(monthlyInvestment, currency)}/month into ${billionaireName} territory in ${years} years! `,
          `${startEmoji} My wealth calculator shows I'd need ${results.calculatedValue.toFixed(2)}% yearly returns to match ${billionaireName} in ${years} years (investing ${formatCurrency(monthlyInvestment, currency)}/month)! `
        ];
        
        message = returnPhrases[Math.floor(Math.random() * returnPhrases.length)];
        
        if (results.calculatedValue < 10) {
          const achievablePhrases = [
            `Totally doable with the right strategy! `,
            `Well within historical market returns! `,
            `Challenge accepted! `
          ];
          message += achievablePhrases[Math.floor(Math.random() * achievablePhrases.length)] + endEmoji;
        } else if (results.calculatedValue < 20) {
          const challengingPhrases = [
            `Challenging but not impossible! `,
            `Time to channel my inner Warren Buffett! `,
            `I better start studying investment strategies! `
          ];
          message += challengingPhrases[Math.floor(Math.random() * challengingPhrases.length)] + endEmoji;
        } else {
          const extremePhrases = [
            `Maybe I should invent the next big thing instead! `,
            `I might need a startup and some venture capital! `,
            `Time to get REALLY creative with my investing! `
          ];
          message += extremePhrases[Math.floor(Math.random() * extremePhrases.length)] + endEmoji;
        }
        break;
        
      default:
        message = `${startEmoji} I'm mapping my path to ${billionaireName}-level wealth with Race To Riches! The numbers are eye-opening! ${endEmoji}`;
    }
    
    // Creative call-to-actions
    const ctas = [
      `Map your own wealth journey at ${baseUrl} #RaceToRiches`,
      `See how you compare at ${baseUrl} #RaceToRiches`,
      `What's your number? Find out at ${baseUrl} #RaceToRiches`,
      `Challenge yourself at ${baseUrl} #RaceToRiches #InvestingGoals`,
      `Run your own numbers at ${baseUrl} #RaceToRiches #WealthBuilding`
    ];
    
    message += ` ${ctas[Math.floor(Math.random() * ctas.length)]}`;
    
    return message;
  }, [calculationMode, currency, monthlyInvestment, results, selectedBillionaire, years]);
  
  // Generate the message once when component mounts or dependencies change
  useEffect(() => {
    if (results && selectedBillionaire) {
      setShareMessage(generateShareMessage());
    }
  }, [results, selectedBillionaire, generateShareMessage]);
  
  const { hasCopied, onCopy } = useClipboard(shareMessage);
  
  // Share on Twitter (X) - defined outside render function to prevent re-creation
  const shareOnTwitter = () => {
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`https://twitter.com/intent/tweet?text=${encodedMessage}`, '_blank');
    
    toast({
      title: "Shared on X (Twitter)!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Share on Reddit - defined outside render function to prevent re-creation
  const shareOnReddit = () => {
    const encodedTitle = encodeURIComponent(`My plan to match ${selectedBillionaire.name}'s wealth!`);
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`https://www.reddit.com/submit?title=${encodedTitle}&text=${encodedMessage}`, '_blank');
    
    toast({
      title: "Shared on Reddit!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  return (
    <Popover placement="top-end">
      <PopoverTrigger>
        <Button
          leftIcon={<FiShare2 />}
          size={size}
          colorScheme="brand"
          variant="outline"
          {...props}
          px={{ base: 2, md: 3 }}
          aria-label="Share Results"
        >
          <Box as="span" display={{ base: "none", sm: "inline" }}>Share</Box>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        width={{ base: "250px", sm: "320px" }} 
        p={1} 
        boxShadow="lg" 
        border="1px solid" 
        borderColor={borderColor}
      >
        <PopoverArrow />
        <PopoverBody p={4}>
          <VStack spacing={4} align="stretch">
            <Text fontWeight="bold" fontSize="sm">Share your investment strategy</Text>
            
            <Textarea 
              value={shareMessage} 
              size="sm" 
              rows={4}
              fontSize="xs"
              resize="none"
              bg={useColorModeValue('gray.50', 'gray.900')}
              isReadOnly
            />
            
            <Button
              size="sm"
              leftIcon={<FiCopy />}
              onClick={onCopy}
              width="full"
              variant="outline"
            >
              {hasCopied ? "Copied!" : "Copy to clipboard"}
            </Button>
            
            <Divider />
            
            <HStack spacing={2}>
              <Button
                leftIcon={<FiTwitter />}
                onClick={shareOnTwitter}
                bg={twitterBgColor}
                flex={1}
                size="sm"
                color={useColorModeValue('blue.600', 'blue.200')}
                _hover={{ bg: useColorModeValue('blue.100', 'blue.800') }}
                px={2}
              >
                <Box as="span" display={{ base: "none", sm: "inline" }}>Share on X</Box>
                <Box as="span" display={{ base: "inline", sm: "none" }}>X</Box>
              </Button>
              
              <Button
                leftIcon={<FiMessageCircle />}
                onClick={shareOnReddit}
                bg={redditBgColor}
                flex={1}
                size="sm"
                color={useColorModeValue('orange.600', 'orange.200')}
                _hover={{ bg: useColorModeValue('orange.100', 'orange.800') }}
                px={2}
              >
                <Box as="span" display={{ base: "none", sm: "inline" }}>Post to Reddit</Box>
                <Box as="span" display={{ base: "inline", sm: "none" }}>Reddit</Box>
              </Button>
            </HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ShareResults;
