export type FootballProviderKey =
  | "sofascore"
  | "flashscore"
  | "fotmob"
  | "api-football"
  | "1xbet";

export type FootballProviderSettingSource =
  | "default"
  | "stored";

export interface FootballProviderSetting {
  key:
    FootballProviderKey;

  enabled:
    boolean;

  source:
    FootballProviderSettingSource;

  updatedAt:
    string |
    null;
}
