
import {
  del,
  get,
  patch,
  post,
  put,
} from "../api";

import {
  alertRulesRoutes,
} from "../routes/alertRulesRoutes";

import {
  getAuthToken,
} from "../../features/auth/storage/authToken";

import type {
  AlertRuleResponse,
  AlertRulesResponse,
  DeleteAlertRuleResponse,
  SaveAlertRuleInput,
} from "../../types/alertRules";

async function authenticatedOptions() {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("NO_SESSION");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

/*
 * Consultar las reglas del
 * usuario autenticado.
 */
export async function getAlertRules():
  Promise<AlertRulesResponse> {

  return get<AlertRulesResponse>(
    alertRulesRoutes.list,
    {},
    await authenticatedOptions()
  );
}

/*
 * Crear una regla personal.
 */
export async function createAlertRule(
  input: SaveAlertRuleInput
): Promise<AlertRuleResponse> {

  return post<AlertRuleResponse>(
    alertRulesRoutes.create,
    input,
    await authenticatedOptions()
  );
}

/*
 * Reemplazar las condiciones
 * de una regla existente.
 */
export async function replaceAlertRule(
  id: string,
  input: SaveAlertRuleInput
): Promise<AlertRuleResponse> {

  return put<AlertRuleResponse>(
    alertRulesRoutes.replace(id),
    input,
    await authenticatedOptions()
  );
}

/*
 * Habilitar o deshabilitar.
 */
export async function setAlertRuleEnabled(
  id: string,
  enabled: boolean
): Promise<AlertRuleResponse> {

  return patch<AlertRuleResponse>(
    alertRulesRoutes.enabled(id),
    { enabled },
    await authenticatedOptions()
  );
}

/*
 * Eliminar una regla propia.
 */
export async function deleteAlertRule(
  id: string
): Promise<DeleteAlertRuleResponse> {

  return del<DeleteAlertRuleResponse>(
    alertRulesRoutes.remove(id),
    await authenticatedOptions()
  );
}

