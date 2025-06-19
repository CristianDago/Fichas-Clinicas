import { GoogleAuth } from "google-auth-library";
import { drive_v3, google } from "googleapis";
import { GoogleServiceAccountCredentials } from "../interfaces/google.service.account.credentials";

const REQUIRED_ENV_KEYS: Array<keyof GoogleServiceAccountCredentials> = [
  "type",
  "project_id",
  "private_key_id",
  "private_key",
  "client_email",
  "client_id",
  "auth_uri",
  "token_uri",
  "auth_provider_x509_cert_url",
  "client_x509_cert_url",
  "universe_domain",
];

const getCredentialsFromEnv = (): GoogleServiceAccountCredentials => {
  const rawCredentials = {
    type: process.env.GOOGLE_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
  };

  for (const key of REQUIRED_ENV_KEYS) {
    if (!rawCredentials[key]) {
      throw new Error(`Falta la variable de entorno: ${key.toUpperCase()}`);
    }
  }

  return rawCredentials as GoogleServiceAccountCredentials;
};
export const getGoogleDriveAuthClient = async (): Promise<GoogleAuth> => {
  try {
    const credentials = getCredentialsFromEnv();
    return new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error al crear cliente de autenticación:", message);
    throw new Error(`Google Drive Auth Error: ${message}`);
  }
};

export const getGoogleDriveService = async (): Promise<drive_v3.Drive> => {
  const auth = await getGoogleDriveAuthClient();
  return google.drive({ version: "v3", auth });
};
