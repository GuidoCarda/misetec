import { Button, Group, Stack, Text, Title } from "@mantine/core";

function Orders() {
  return (
    <>
      <Group justify="space-between">
        <Stack gap={2}>
          <Title order={2}>Ordenes</Title>
          <Text c={"gray"}>
            Esta pagina contiene un listado con todas las ordenes
          </Text>
        </Stack>
        <Button bg={"gray"}>Nuevo Orden</Button>
      </Group>
    </>
  );
}

export default Orders;
