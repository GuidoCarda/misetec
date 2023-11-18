import { Group, Code, ScrollArea, NavLink } from "@mantine/core";
import { IconNotes } from "@tabler/icons-react";
import classes from "./NavbarNested.module.css";

const mockdata = [
  {
    label: "Orders",
    icon: IconNotes,
    href: "/orders",
  },
  {
    label: "Clients",
    icon: IconNotes,
    href: "/clients",
  },
  {
    label: "dashboard",
    icon: IconNotes,
    href: "/dashboard",
  },
];

export function NavbarNested() {
  const links = mockdata.map((item) => (
    <NavLink {...item} key={item.label} />
    // <LinksGroup {...item} key={item.label} />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Code fw={700}>Misetec</Code>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}></div>
    </nav>
  );
}
