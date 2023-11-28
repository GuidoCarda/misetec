import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

function Clients() {
  const [clients, setClients] = useState<Record<string, string>[]>([]);
  const [search, setSearch] = useState("");

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

  console.log(filteredClients, setSearch);

  return (
    <>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10">
        Clientes
      </h2>
    </>
  );
}

export default Clients;
