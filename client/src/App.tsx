// mantine ui
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

// Router
import Router from "./Router";

function App() {
  return (
    <MantineProvider>
      <Router />
    </MantineProvider>
  );
}

export default App;
