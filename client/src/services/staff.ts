export async function createStaffAccount(values: Record<string, unknown>) {
  console.log(values);
  const res = await fetch("http://localhost:3000/api/v1/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const data = await res.json();
  console.log(values);

  if (res.status === 400) {
    throw new Error(data.message);
  }

  return data;
}

export async function getStaffMembers() {
  const res = await fetch("http://localhost:3000/api/v1/auth/staff", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status === 400) {
    throw new Error(data.message);
  }

  return data;
}
