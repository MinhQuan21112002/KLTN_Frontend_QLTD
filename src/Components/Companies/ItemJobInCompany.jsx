import { ArrowUpDownIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { FiDollarSign } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const ItemJobInCompany = ({
    id,
    image,
    name,
    position,
    location,
    salary,
    workingForm,
}) => {

    const navigate = useNavigate();
    return (
        <>
            <Box
                key={id}
                maxW="100%"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                m={4}
                p={2}
                w={"95%"}
                fontFamily={"sans-serif"}
            >
                <HStack w={"100%"}>
                    <Box
                        borderRadius="lg"
                        borderWidth="1px"
                        overflow="hidden"
                        w={"23%"}
                        height={"100%"}
                    >
                        <Image
                            w={"100%"}
                            h={"100%"}
                            src={image}
                            alt={name}
                          
                        />
                    </Box>
                    <VStack w={"77%"}>
                        <HStack p={0} w={"100%"}>
                            <VStack w={"60%"}  align={"flex-start"}>
                                <Text fontWeight="bold">{name}</Text>
                                <Text>Position: {position}</Text>
                            </VStack>
                            <HStack w={"40%"}>
                                <FiDollarSign />
                                <Text>Salary: {salary}</Text>
                            </HStack>
                        </HStack>

                        <HStack w={"100%"} p={0}>
                            <HStack w="60%">
                                <Button colorScheme='teal' size='xs' m={1} p={1} fontSize={10}> {location}</Button>
                                <Button colorScheme='teal' size='xs'> {workingForm}</Button>
                            </HStack>
                            <Button size='xs' colorScheme='whatsapp' m={2} onClick={() => navigate(`/jobpage/${id}`)}>
                                Ứng tuyển
                            </Button>

                        </HStack>
                    </VStack>
                </HStack>
            </Box>
        </>
    );
};