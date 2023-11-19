// mantine ui
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

// Router
import Router from "./Router";

function App() {
  return (
    <MantineProvider theme={{ fontFamily: "Outfit, sans-serif" }}>
      <Router />
    </MantineProvider>
  );
}

export default App;
