import React, { useState } from 'react';
import {
  Box,
  Heading,
  Button,
  Text,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Icon,
  InputGroup,
  InputRightElement,
  VStack,
  SimpleGrid,
  Avatar,
  AvatarBadge,
  Center,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiDollarSign, 
  FiPercent, 
  FiEdit3, 
  FiUser, 
  FiCheck, 
  FiChevronDown, 
  FiSearch 
} from 'react-icons/fi';
import { formatCurrency } from '../utils/calculations';

const BillionaireSelection = ({
  billionaires,
  selectedBillionaire,
  customBillionaire,
  isCustom,
  setSelectedBillionaire,
  setCustomBillionaire,
  setIsCustom,
  currency
}) => {
  const { isOpen: isSelectOpen, onOpen: onSelectOpen, onClose: onSelectClose } = useDisclosure();
  const { isOpen: isCustomOpen, onOpen: onCustomOpen, onClose: onCustomClose } = useDisclosure();
  const [tempCustom, setTempCustom] = useState(customBillionaire);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'dark.card');
  const hoverBg = useColorModeValue('gray.50', 'dark.hover');
  const selectedBg = useColorModeValue('brand.50', 'rgba(0, 102, 255, 0.15)');
  const selectedBorder = useColorModeValue('brand.500', 'brand.400');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const popoverBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeBg = useColorModeValue('brand.50', 'rgba(0, 102, 255, 0.2)');
  
  const handleCustomSave = () => {
    setCustomBillionaire(tempCustom);
    setIsCustom(true);
    onCustomClose();
  };
  
  const handleBillionaireSelect = (billionaire) => {
    setSelectedBillionaire(billionaire);
    setIsCustom(false);
    onSelectClose();
    
    // Scroll to calculation mode section after selecting a billionaire
    setTimeout(() => {
      const calculationModeElement = document.getElementById('calculation-mode-section');
      if (calculationModeElement) {
        calculationModeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  const handleCustomClick = (e) => {
    e.stopPropagation();
    onCustomOpen();
  };

  // Filter billionaires based on search query
  const filteredBillionaires = billionaires.filter(
    b => b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      boxShadow={useColorModeValue('sm', 'none')}
      borderWidth={useColorModeValue(0, 1)}
      borderColor="gray.700"
    >
      <Box p={6}>
        <Heading as="h2" size="md" mb={4} fontWeight="semibold">
          Select a Billionaire
        </Heading>
        
        {/* Main selection button */}
        <Button
          onClick={onSelectOpen}
          variant="outline"
          width="100%"
          justifyContent="space-between"
          mb={4}
          p={4}
          height="auto"
          borderRadius="lg"
          borderColor={borderColor}
          _hover={{ bg: hoverBg }}
        >
          <HStack spacing={3} justify="flex-start" width="100%">
            <Avatar 
              size="md" 
              name={isCustom ? customBillionaire.name : selectedBillionaire.name}
              src={isCustom ? null : selectedBillionaire.image}
              bg={isCustom ? "brand.500" : undefined}
            >
              {isCustom && <AvatarBadge boxSize="1.25em" bg="gray.500" borderColor="gray.200" icon={<FiUser />} />}
            </Avatar>
            <VStack align="start" spacing={0}>
              <Text fontWeight="semibold">{isCustom ? customBillionaire.name : selectedBillionaire.name}</Text>
              <Text fontSize="sm" color={textMuted}>
                {formatCurrency(isCustom ? customBillionaire.netWorth : selectedBillionaire.netWorth, currency)} · {isCustom ? customBillionaire.cagr : selectedBillionaire.cagr}% growth
              </Text>
            </VStack>
          </HStack>
          <Icon as={FiChevronDown} ml={2} />
        </Button>
        
        {/* Current selection display */}
        <Box
          bg={useColorModeValue('gray.50', 'gray.900')}
          p={4}
          borderRadius="md"
        >
          <Flex justify="space-between" alignItems="center" mb={2}>
            <Heading as="h3" size="sm" fontWeight="semibold" noOfLines={1} maxW="70%">
              {isCustom ? customBillionaire.name : selectedBillionaire.name}
            </Heading>
            {isCustom && (
              <Button
                size="xs"
                leftIcon={<FiEdit3 />}
                variant="ghost"
                onClick={handleCustomClick}
              >
                Edit
              </Button>
            )}
          </Flex>
          <Text 
            fontSize="sm" 
            mb={3} 
            color={textMuted} 
            noOfLines={2} 
            h="40px" 
            overflow="hidden"
          >
            {isCustom ? 'Custom billionaire with configurable parameters' : selectedBillionaire.description}
          </Text>
          <Grid2Columns spacing={4}>
            <HStack>
              <Icon as={FiDollarSign} color={textMuted} flexShrink={0} />
              <VStack spacing={0} align="start">
                <Text fontSize="xs" color={textMuted}>Net Worth</Text>
                <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                  {formatCurrency(isCustom ? customBillionaire.netWorth : selectedBillionaire.netWorth, currency)}
                </Text>
              </VStack>
            </HStack>
            <HStack>
              <Icon as={FiPercent} color={textMuted} flexShrink={0} />
              <VStack spacing={0} align="start">
                <Text fontSize="xs" color={textMuted}>Growth Rate</Text>
                <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                  {isCustom ? customBillionaire.cagr : selectedBillionaire.cagr}% per year
                </Text>
              </VStack>
            </HStack>
          </Grid2Columns>
        </Box>
      </Box>
      
      {/* Billionaire Selection Modal */}
      <Modal isOpen={isSelectOpen} onClose={onSelectClose} size="xl" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader>Choose a Billionaire</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Search Input */}
            <InputGroup mb={4}>
              <Input
                placeholder="Search billionaires..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="filled"
                borderRadius="md"
              />
              <InputRightElement>
                <Icon as={FiSearch} color="gray.500" />
              </InputRightElement>
            </InputGroup>
            
            {/* Billionaire Grid */}
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} mb={4}>
              {filteredBillionaires.map((billionaire) => (
                <BillionaireCard
                  key={billionaire.id}
                  billionaire={billionaire}
                  isSelected={!isCustom && selectedBillionaire.id === billionaire.id}
                  onClick={() => handleBillionaireSelect(billionaire)}
                  currency={currency}
                />
              ))}
            </SimpleGrid>
            
            <Divider my={4} />
            
            {/* Custom billionaire option */}
            <BillionaireCard
              isCustom
              billionaire={customBillionaire}
              isSelected={isCustom}
              onClick={() => {
                setIsCustom(true);
                onSelectClose();
              }}
              onEdit={handleCustomClick}
              currency={currency}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onSelectClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Custom Billionaire Modal */}
      <Modal isOpen={isCustomOpen} onClose={onCustomClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader>Custom Billionaire</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={5}>
              <FormLabel fontWeight="medium">Name</FormLabel>
              <Input 
                value={tempCustom.name}
                onChange={(e) => setTempCustom({...tempCustom, name: e.target.value})}
                placeholder="e.g. Future Me"
                borderRadius="md"
              />
            </FormControl>
            
            <FormControl mb={5}>
              <FormLabel fontWeight="medium">Net Worth</FormLabel>
              <InputGroup>
                <NumberInput 
                  value={tempCustom.netWorth}
                  min={1000000}
                  step={1000000}
                  onChange={(valueString) => setTempCustom({...tempCustom, netWorth: Number(valueString)})}
                  w="100%"
                >
                  <NumberInputField borderRadius="md" pl={7} />
                  <InputLeftAdornment>{currency === 'INR' ? '₹' : '$'}</InputLeftAdornment>
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
              <Text fontSize="sm" color={textMuted} mt={1}>
                Current value: {formatCurrency(tempCustom.netWorth, currency)}
              </Text>
            </FormControl>
            
            <FormControl>
              <FormLabel fontWeight="medium">Annual Growth Rate</FormLabel>
              <InputGroup>
                <NumberInput 
                  value={tempCustom.cagr}
                  min={1}
                  max={100}
                  step={0.1}
                  onChange={(valueString) => setTempCustom({...tempCustom, cagr: Number(valueString)})}
                  w="100%"
                >
                  <NumberInputField borderRadius="md" />
                  <InputRightAdornment>%</InputRightAdornment>
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
              <Text fontSize="sm" color={textMuted} mt={1}>
                How much their wealth grows annually
              </Text>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onCustomClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleCustomSave}>
              Save & Select
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// BillionaireCard component
const BillionaireCard = ({ billionaire, isSelected, isCustom, onClick, onEdit, currency }) => {
  const hoverBg = useColorModeValue('gray.50', 'dark.hover');
  const selectedBg = useColorModeValue('brand.50', 'rgba(0, 102, 255, 0.15)');
  const selectedBorder = useColorModeValue('brand.500', 'brand.400');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  
  return (
    <Box
      cursor="pointer"
      p={{ base: 2, md: 3 }}
      borderRadius="md"
      borderWidth="1px"
      borderColor={isSelected ? selectedBorder : 'transparent'}
      bg={isSelected ? selectedBg : 'transparent'}
      _hover={{ bg: hoverBg, transform: 'translateY(-1px)' }}
      transition="all 0.2s"
      position="relative"
      onClick={onClick}
    >
      <Flex align="center" flexWrap={{ base: "wrap", sm: "nowrap" }}>
        <Avatar 
          size={{ base: "sm", md: "md" }} 
          name={billionaire.name}
          src={isCustom ? null : billionaire.image}
          bg={isCustom ? "brand.500" : undefined}
          mr={3}
        >
          {isCustom && <AvatarBadge boxSize="1.25em" bg="gray.500" icon={<FiUser />} />}
        </Avatar>
        <VStack align="start" spacing={0} flex="1">
          <HStack justify="space-between" width="100%" flexWrap="wrap">
            <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }} noOfLines={1} maxW={{ base: "80%", sm: "100%" }}>
              {billionaire.name}
            </Text>
            {isSelected && (
              <Center
                bg={selectedBorder}
                borderRadius="full"
                color="white"
                boxSize={{ base: "16px", md: "20px" }}
                fontSize={{ base: "10px", md: "12px" }}
              >
                <Icon as={FiCheck} />
              </Center>
            )}
          </HStack>
          <Flex fontSize="xs" color={textMuted} mt={1} width="100%" flexWrap="wrap" gap={1}>
            <Text>{formatCurrency(billionaire.netWorth, currency)}</Text>
            <Text display={{ base: "none", sm: "inline" }}>•</Text>
            <Text>{billionaire.cagr}% growth/year</Text>
          </Flex>
        </VStack>
      </Flex>
      
      {isCustom && onEdit && (
        <Tooltip label="Edit custom billionaire" placement="top">
          <Button
            size="xs"
            position="absolute"
            top={2}
            right={2}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            variant="ghost"
            p={1}
            minW="auto"
            h="auto"
          >
            <Icon as={FiEdit3} />
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};

// Custom components for input adornments
const InputLeftAdornment = ({ children }) => (
  <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" pointerEvents="none" zIndex={2} color="gray.500">
    {children}
  </Box>
);

const InputRightAdornment = ({ children }) => (
  <Box position="absolute" right={10} top="50%" transform="translateY(-50%)" pointerEvents="none" zIndex={2} color="gray.500">
    {children}
  </Box>
);

// A simplified Grid2Columns component
const Grid2Columns = ({ spacing, children }) => (
  <Flex gap={spacing}>
    {React.Children.map(children, (child, i) => (
      <Box key={i} flex="1">
        {child}
      </Box>
    ))}
  </Flex>
);

export default BillionaireSelection;
