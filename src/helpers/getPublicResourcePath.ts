export const getPublicResourcePath = (path: string) => {
  // Remove trailing slashes
  const basePath = process.env.NEXT_BASE_PATH?.replace(/\/$/, "") || "";
  // Remove leading and trailing slashes
  const resourcePath =
    process.env.NEXT_PUBLIC_RESOURCE_PATH?.replace(/^\/+|\/+$/g, "") || "";
  // Remove leading slashes
  const cleanPath = path.replace(/^\/+/, "");

  const pathSegments = [basePath, resourcePath, cleanPath].filter(
    (segment) => segment !== "",
  );

  return `/${pathSegments.join("/")}`;
};
