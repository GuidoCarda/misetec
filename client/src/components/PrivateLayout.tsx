import { AppShell, Container } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { NavbarNested } from "./PrivateSidebar/NavbarNested";

function PrivateLayout() {
  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 280, breakpoint: "lg" }}>
      <AppShell.Navbar>
        <NavbarNested />
      </AppShell.Navbar>
      <AppShell.Header>Test </AppShell.Header>
      <AppShell.Main bg={"#f9fbfc"}>
        <Container size={"lg"} p="xl" mt="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default PrivateLayout;
