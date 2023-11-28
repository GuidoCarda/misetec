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
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./NewClient.module.css";

function NewClient() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);

    fetch("http://localhost:3000/api/v1/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate(-1);
      });
  };

  return (
    <>
      <Group mb={"xl"} justify="space-between" pos={"relative"}>
        <Button
          variant="transparent"
          to=".."
          size="sm"
          component={Link}
          leftSection={<IconArrowNarrowLeft />}
          pos={"absolute"}
          top={-30}
          className={classes.returnLink}
          left={-15}
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
      <form onSubmit={handleSubmit}>
        <Stack>
          <SimpleGrid cols={2}>
            <TextInput label="Nombre" placeholder="Nombre" name="firstname" />
            <TextInput
              label="Apellido"
              placeholder="Apellido"
              name="lastname"
            />
            <TextInput label="DNI" placeholder="DNI" name="dni" />
          </SimpleGrid>
          <Box mt="xl">
            <Title order={4}>Datos de contacto</Title>
            <Text c={"gray"}>
              Los siguientes datos seran de utilizad para poder contactar a el
              cliente
            </Text>
          </Box>
          <TextInput label="Direccion" placeholder="Direccion" name="address" />
          <TextInput label="Email" placeholder="Email" name="email" />
          <TextInput
            label="Telefono"
            placeholder="Telefono"
            name="phone_number"
          />
          <TextInput
            label="Codigo Postal"
            placeholder="2000"
            name="postal_code"
          />
        </Stack>
        <Group justify="flex-end" mt={"xl"}>
          <Button type="submit">Cargar</Button>
        </Group>
      </form>
    </>
  );
}

export default NewClient;
