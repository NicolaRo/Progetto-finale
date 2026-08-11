export type ContainerStatus =
  | "Container ready to use"
  | "Container busy"
  | "Container ready for collection";

export async function updateContainerStatus(
  containerId: string,
  status: ContainerStatus,
  token: string
) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/containers/${containerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );
  if (!response.ok)
    throw new Error("Could not update container status, try later");
  return response.json();
}