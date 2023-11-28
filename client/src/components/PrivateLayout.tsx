import { AppShell, Container } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { NavbarNested } from "./PrivateSidebar/NavbarNested";

function PrivateLayout() {
  return (
    <AppShell navbar={{ width: 280, breakpoint: "lg" }}>
      <AppShell.Navbar>
        <NavbarNested />
      </AppShell.Navbar>
      <AppShell.Main bg={"#f9fbfc"}>
        <Container size={"xl"} p="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default PrivateLayout;
