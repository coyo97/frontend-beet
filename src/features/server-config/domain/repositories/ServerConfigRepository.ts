export interface ServerConfigRepository {

  getOverride():
    Promise<
      string |
      null
    >;

  saveOverride(
    origin:
      string
  ):
    Promise<void>;

  clearOverride():
    Promise<void>;
}
