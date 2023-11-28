import {
  ActionIcon,
  Button,
  Card,
  Drawer,
  Group,
  Modal,
  Select,
  Space,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustments, IconRowRemove } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

// const clientsMock = [
//   {
//     id: 1,
//     name: "Juan Perez",
//     address: "Calle 123",
//     email: "juan@gmail.com",
//     phone_number: "900990563",
//   },
//   {
//     id: 2,
//     name: "Pedro Perez",
//     address: "Calle 123",
//     email: "pedro@gmail.com",
//     phone_number: "1235474",
//   },
//   {
//     id: 3,
//     name: "Maria Perez",
//     address: "Calle 123",
//     email: "maria@gmail.com",
//     phone_number: "56467",
//   },
//   {
//     id: 4,
//     name: "Jose Perez",
//     address: "Calle 123",
//     email: "jose@gmail.com",
//     phone_number: "31231231",
//   },
//   {
//     id: 5,
//     name: "Luis Perez",
//     address: "Calle 123",
//     email: "luis@gmail.com",
//     phone_number: "23423423",
//   },
// ];

function Clients() {
  const [clients, setClients] = useState<Record<string, string>[]>([]);
  const [search, setSearch] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const alreadyFetched = useRef(false);

  const location = useLocation();

  useEffect(() => {
    if (alreadyFetched.current) return;

    fetch("http://localhost:3000/api/v1/clients", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => setClients(data));

    return () => {
      alreadyFetched.current = true;
    };
  }, []);

  const lastPathnameSlug = location.pathname.split("/").slice(-1)[0];

  if (lastPathnameSlug === "new") {
    return <Outlet />;
  }

  console.log(lastPathnameSlug);

  const filteredClients = clients.filter((client) => {
    return (
      client.firstname.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.phone_number.toLowerCase().includes(search.toLowerCase())
    );
  });

  const rows = filteredClients.map((client) => (
    <Table.Tr key={client.id}>
      <Table.Td>{client.id}</Table.Td>
      <Table.Td>
        {client.firstname} {client.lastname}
      </Table.Td>
      <Table.Td>{client.address}</Table.Td>
      <Table.Td>{client.email}</Table.Td>
      <Table.Td>{client.phone_number}</Table.Td>
      <Table.Td align="right">
        <Group gap={"sm"} w={"max-content"}>
          <ActionIcon
            variant="light"
            color="gray"
            size="lg"
            aria-label="Settings"
            onClick={open}
          >
            <IconAdjustments
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            size="lg"
            aria-label="Settings"
            onClick={openDeleteModal}
          >
            <IconRowRemove
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Group justify="space-between">
        <Stack gap={2}>
          <Title order={2}>Clientes</Title>
          <Text c={"gray"}>
            Esta pagina contiene un listado con todos los clientes
          </Text>
        </Stack>
        <Button bg={"gray"} component="a" href="clients/new">
          Nuevo cliente
        </Button>
      </Group>
      <Space h="xl" />
      <Group align="flex-end" gap={"xl"} justify="space-between">
        <TextInput
          mt={"xl"}
          w="75%"
          label="Buscar cliente"
          description="Busca por nombre, email o telefono"
          placeholder="Buscar cliente"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
        <Select
          label="Your favorite library"
          placeholder="Pick value"
          data={["React", "Angular", "Vue", "Svelte"]}
        />
      </Group>
      <Card mt={"md"} bg={"rgb(255,255,255)"} withBorder>
        <Table verticalSpacing={"sm"}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Numero</Table.Th>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Direccion</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Telefono</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text c={"grey"} ta="center" py={"md"}>
                    No hay resultados coincidentes
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              rows
            )}
          </Table.Tbody>
        </Table>
      </Card>
      <EditClientDrawer opened={opened} open={open} close={close} />
      <ConfirmDeleteModal
        opened={deleteModalOpened}
        open={openDeleteModal}
        close={closeDeleteModal}
      />
    </>
  );
}

interface EditClientDrawerProps {
  opened: boolean;
  open: () => void;
  close: () => void;
}

function EditClientDrawer({ opened, close }: EditClientDrawerProps) {
  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        title="Editar cliente"
      >
        <Stack gap={"md"}>
          <TextInput label="Nombre" />
          <TextInput label="Direccion" />
          <TextInput label="Email" />
          <TextInput label="Telefono" />
          <Button mt={"xl"}>Guardar</Button>
        </Stack>
      </Drawer>
    </>
  );
}

interface ConfirmDeleteModalProps {
  opened: boolean;
  open: () => void;
  close: () => void;
}

function ConfirmDeleteModal({ opened, close }: ConfirmDeleteModalProps) {
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size={"md"}
        title="Dar de baja cliente"
      >
        <Text c={"grey"}>
          Estas seguro que quieres eliminar el cliente? Esta accion no se podra
          revertir
        </Text>
        <Group justify="flex-end" mt={"xl"}>
          <Button onClick={close} variant="subtle" color="lightgray" c={"grey"}>
            Cancelar
          </Button>
          <Button onClick={close} color="red">
            Eliminar
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default Clients;
