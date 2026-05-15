
export async function updateContainerStatus (
    containerId,
    status,
    token) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/containers/${containerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status}),
      }
    );
    if (!response.ok)
      throw new Error("Could not update container status, try later");
  return response.json();
};
