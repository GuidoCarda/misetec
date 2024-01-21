// Router
import AuthProvider from "@/context/AuthProvider";
import Router from "./Router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosInterceptor } from "@/services/config";

const queryClient = new QueryClient();
AxiosInterceptor();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
