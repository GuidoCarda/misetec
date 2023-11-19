import {
  Box,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
import { Link } from "react-router-dom";

function NewClient() {
  return (
    <>
      <Group mb={"xl"} justify="space-between" pos={"relative"}>
        <Button
          variant="transparent"
          to=".."
          c="grey"
          size="sm"
          component={Link}
          leftSection={<IconArrowBack />}
          pos={"absolute"}
          top={-30}
          left={-10}
        >
          volver
        </Button>
        <Stack gap={2}>
          <Title order={2}>Nuevo Cliente</Title>
          <Text w="45ch" c={"gray"}>
            Complete los datos del cliente para hacer un seguimiento de sus
            ordenes
          </Text>
        </Stack>
      </Group>
      <form>
        <Stack gap={"md"}>
          <SimpleGrid cols={2}>
            <TextInput label="Nombre" placeholder="Nombre" />
            <TextInput label="Apellido" placeholder="Apellido" />
            <TextInput label="DNI" placeholder="DNI" />
          </SimpleGrid>
          <Box>
            <Title order={4}>Datos de contacto</Title>
            <Text c={"gray"}>
              Los siguientes datos seran de utilizad para poder contactar a el
              cliente
            </Text>
          </Box>
          <TextInput label="Direccion" placeholder="Direccion" />
          <TextInput label="Email" placeholder="Email" />
          <TextInput label="Telefono" placeholder="Telefono" />
        </Stack>
        <Group justify="flex-end" mt={"xl"}>
          <Button>Cargar</Button>
        </Group>
      </form>
    </>
  );
}

export default NewClient;
