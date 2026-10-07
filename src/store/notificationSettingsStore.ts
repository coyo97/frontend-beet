import {
  create,
} from "zustand";

import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../async/services/notificationPreferencesService";




import type {
  PushPreferences,
  UpdatePushPreferencesInput
} from "../types/notifications";

interface State {
  preferences:
    PushPreferences |
    null;

  loading:
    boolean;

  saving:
    boolean;

  error:
    string |
    null;

  load:
    () =>
      Promise<void>;

  update:
  (
    patch:
      UpdatePushPreferencesInput
  ) =>
    Promise<void>;
}

export const useNotificationSettingsStore =
  create<State>(
    (
      set
    ) => ({
      preferences:
        null,

      loading:
        false,

      saving:
        false,

      error:
        null,

      load:
        async () => {
          set({
            loading:
              true,

            error:
              null,
          });

          try {
            const preferences =
              await getNotificationPreferences();

            set({
              preferences,
            });
          } catch (error) {
            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "Could not load settings",
            });
          } finally {
            set({
              loading:
                false,
            });
          }
        },

update:
  async (
    patch
  ) => {

    set({
      saving:
        true,

      error:
        null,
    });

    try {
      const preferences =
        await updateNotificationPreferences(
          patch
        );

      set({
        preferences,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Could not update settings",
      });

      throw error;
    } finally {
      set({
        saving:
          false,
      });
    }
  },
    })
  );
