import { AppShell, Container } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { NavbarNested } from "./PrivateSidebar/NavbarNested";

function PrivateLayout() {
  return (
    <AppShell navbar={{ width: 300, breakpoint: "sm" }}>
      <AppShell.Navbar>
        <NavbarNested />
      </AppShell.Navbar>
      <AppShell.Main>
        <Container size={"xl"} py="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default PrivateLayout;
