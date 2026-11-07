
import { create } from "zustand";

import {
  getAlertRules,
  createAlertRule,
  replaceAlertRule,
  setAlertRuleEnabled,
  deleteAlertRule,
} from "../async/services/alertRulesService";

import type {
  AlertRule,
  SaveAlertRuleInput,
} from "../types/alertRules";

interface AlertRulesState {
  rules: AlertRule[];
  loading: boolean;
  mutatingId: string | null;
  error: string | null;

  load: () => Promise<void>;
  add: (input: SaveAlertRuleInput) => Promise<AlertRule>;
  replace: (
    id: string,
    input: SaveAlertRuleInput
  ) => Promise<AlertRule>;
  setEnabled: (
    id: string,
    enabled: boolean
  ) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reset: () => void;
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operación";
}

let loadVersion = 0;

export const useAlertRulesStore =
  create<AlertRulesState>((set) => ({
    rules: [],
    loading: false,
    mutatingId: null,
    error: null,

    load: async () => {
      const version = ++loadVersion;

      set({
        loading: true,
        error: null,
        rules: [],
      });

      try {
        const response = await getAlertRules();

        if (version === loadVersion) {
          set({ rules: response.rules });
        }
      } catch (error) {
        if (version === loadVersion) {
          set({
            error: errorMessage(error),
            rules: [],
          });
        }
      } finally {
        if (version === loadVersion) {
          set({ loading: false });
        }
      }
    },

    add: async (input) => {
      set({
        mutatingId: "create",
        error: null,
      });

      try {
        const { rule } =
          await createAlertRule(input);

        set((state) => ({
          rules: [rule, ...state.rules],
        }));

        return rule;
      } catch (error) {
        set({ error: errorMessage(error) });
        throw error;
      } finally {
        set({ mutatingId: null });
      }
    },

    replace: async (id, input) => {
      set({
        mutatingId: id,
        error: null,
      });

      try {
        const { rule } =
          await replaceAlertRule(id, input);

        set((state) => ({
          rules: state.rules.map((item) =>
            item.id === id ? rule : item
          ),
        }));

        return rule;
      } catch (error) {
        set({ error: errorMessage(error) });
        throw error;
      } finally {
        set({ mutatingId: null });
      }
    },

    setEnabled: async (id, enabled) => {
      set({
        mutatingId: id,
        error: null,
      });

      try {
        const { rule } =
          await setAlertRuleEnabled(id, enabled);

        set((state) => ({
          rules: state.rules.map((item) =>
            item.id === id ? rule : item
          ),
        }));
      } catch (error) {
        set({ error: errorMessage(error) });
        throw error;
      } finally {
        set({ mutatingId: null });
      }
    },

    remove: async (id) => {
      set({
        mutatingId: id,
        error: null,
      });

      try {
        await deleteAlertRule(id);

        set((state) => ({
          rules: state.rules.filter(
            (item) => item.id !== id
          ),
        }));
      } catch (error) {
        set({ error: errorMessage(error) });
        throw error;
      } finally {
        set({ mutatingId: null });
      }
    },

    reset: () => {
      loadVersion++;

      set({
        rules: [],
        loading: false,
        mutatingId: null,
        error: null,
      });
    },
  }));

