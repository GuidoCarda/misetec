import { useEffect, useRef, useState } from "react";

function ClientOrders() {
  const [orders, setOrders] = useState<Record<string, string>[]>([]);
  const alreadyFetched = useRef(false);

  useEffect(() => {
    if (alreadyFetched.current) {
      return;
    }

    fetch("http://localhost:3000/api/v1/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));

    return () => {
      alreadyFetched.current = true;
    };
  }, []);

  console.log(orders);

  return <></>;
}

export default ClientOrders;
