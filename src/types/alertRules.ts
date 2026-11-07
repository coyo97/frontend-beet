
export type AlertRulePhase =
  | "prematch"
  | "live";

export type AlertRuleScope =
  | "all"
  | "watchlist";

export type AlertRuleMetric =
  | "totalRedCards"
  | "homeRedCards"
  | "awayRedCards"
  | "minute"
  | "pointGap"
  | "positionGap"
  | "favoritePosition"
  | "favoriteGoalsBehind"
  | "favoriteAtHome"
  | "favoritePressure"
  | "favoriteAverageGoals"
  | "teamMemoryWins"
  | "teamMemoryLosses";

export type AlertRuleOperator =
  | "eq"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

export type AlertRuleCondition =
  | {
      kind: "comparison";
      metric: AlertRuleMetric;
      operator: AlertRuleOperator;
      value: number | boolean;
    }
  | {
      kind: "all" | "any";
      conditions: AlertRuleCondition[];
    };

export interface AlertRuleFilters {
  countries?: string[];
  competitions?: string[];
  excludedCompetitions?: string[];
}

export interface AlertRuleDelivery {
  priority: "high" | "normal" | "low";
  cooldownMinutes: number;
  remindersBeforeKickoff?: number[];
}

export interface AlertRule {
  id: string;
  ownerId: string;
  name: string;
  enabled: boolean;
  phase: AlertRulePhase;
  scope: AlertRuleScope;
  filters: AlertRuleFilters;
  when: AlertRuleCondition;
  delivery: AlertRuleDelivery;
  createdAt: string;
  updatedAt: string;
}

/*
 * El propietario nunca se envía
 * desde la APK.
 *
 * El backend lo obtiene del JWT.
 */
export interface SaveAlertRuleInput {
  name: string;
  enabled?: boolean;
  phase: AlertRulePhase;
  scope: AlertRuleScope;
  filters?: AlertRuleFilters;
  when: AlertRuleCondition;
  delivery?: Partial<AlertRuleDelivery>;
}

export interface AlertRulesResponse {
  count: number;
  rules: AlertRule[];
}

export interface AlertRuleResponse {
  rule: AlertRule;
}

export interface DeleteAlertRuleResponse {
  deleted: boolean;
}

