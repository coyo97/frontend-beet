export type ServerConnectionSource =
  | "default"
  | "override";

export interface ServerConnection {
  origin:
    string;

  apiBaseUrl:
    string;

  socketUrl:
    string;

  source:
    ServerConnectionSource;
}
