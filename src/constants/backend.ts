export const BACKEND_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://laboratory-backend.stellar.org"
    : "https://laboratory-backend-dev.stellar.org";
