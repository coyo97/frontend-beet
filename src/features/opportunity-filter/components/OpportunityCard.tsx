import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  MatchCopyActions,
} from "@/features/match-context/components/MatchCopyActions";

import type {
  MatchOpportunity,
  TeamOpportunitySnapshot,
} from "../types/opportunity";

import {
  RecentFormBadges,
} from "./RecentFormBadges";

import {
  styles,
} from "./OpportunityCard.styles";

interface Props {
  opportunity:
    MatchOpportunity;

  onPress?:
    () =>
      void;
}

const PROFILE_LABELS = {
  "clear-favorite":
    "FAVORITO CLARO",

  "moderate-favorite":
    "VENTAJA MARCADA",

  "slight-edge":
    "VENTAJA LEVE",

  balanced:
    "PARTIDO PAREJO",

  "insufficient-data":
    "DATOS LIMITADOS",
} as const;

function TeamBlock({
  team,
  favored,
}: {
  team:
    TeamOpportunitySnapshot;

  favored:
    boolean;
}) {

  return (
    <View
      style={[
        styles.team,

        favored &&
          styles.favoredTeam,
      ]}
    >
      <View
        style={
          styles.teamHeader
        }
      >
        <Text
          numberOfLines={
            1
          }
          style={
            styles.teamName
          }
        >
          {favored
            ? "★ "
            : ""}
          {team.name}
        </Text>

        <Text
          style={
            styles.strength
          }
        >
          {Math.round(
            team.matchStrength
          )}
        </Text>
      </View>

      <View
        style={
          styles.stats
        }
      >
        <Text
          style={
            styles.stat
          }
        >
          Pos.{" "}
          <Text
            style={
              styles.statValue
            }
          >
            {team.position !==
            null
              ? `#${team.position}`
              : "—"}
          </Text>
        </Text>

        <Text
          style={
            styles.stat
          }
        >
          Pts{" "}
          <Text
            style={
              styles.statValue
            }
          >
            {team.points ??
              "—"}
          </Text>
        </Text>

        <Text
          style={
            styles.stat
          }
        >
          PJ{" "}
          <Text
            style={
              styles.statValue
            }
          >
            {team.played ??
              "—"}
          </Text>
        </Text>

        <Text
          style={
            styles.stat
          }
        >
          PPG{" "}
          <Text
            style={
              styles.statValue
            }
          >
            {team.pointsPerGame ??
              "—"}
          </Text>
        </Text>
      </View>

      <View
        style={
          styles.formLine
        }
      >
        <Text
          style={
            styles.formLabel
          }
        >
          Últimos 5
        </Text>

        <RecentFormBadges
          form={
            team.form
          }
        />
      </View>

      {team.dangerLevel !==
        "low" && (
        <View
          style={
            styles.dangerBox
          }
        >
          <Text
            style={
              styles.dangerText
            }
          >
            ⚠ Rival peligroso ·{" "}
            {team.dangerScore}/40
          </Text>
        </View>
      )}

      {team.notableWins
        .slice(
          0,
          3
        )
        .map(
          win => (
            <Text
              key={
                `${win.opponentName}-${win.opponentPosition}`
              }
              style={
                styles.notableWin
              }
            >
              ↑ Ganó a{" "}
              {win.opponentName}{" "}
              (#{win.opponentPosition})
            </Text>
          )
        )}
    </View>
  );
}

export function OpportunityCard({
  opportunity,
  onPress,
}: Props) {

  const match =
    opportunity.match;

  const homeFavored =
    opportunity
      .favoredSide ===
    "home";

  const awayFavored =
    opportunity
      .favoredSide ===
    "away";

  const minute =
    match.status.minute;

  return (
  <View
    style={
      styles.card
    }
  >
    <View
      style={
        styles.top
      }
    >
      <View
        style={
          styles.competitionArea
        }
      >
        <Text
          numberOfLines={
            1
          }
          style={
            styles.competition
          }
        >
          {match
            .competition
            .country
            ? `${match.competition.country} · `
            : ""}

          {match
            .competition
            .name}
        </Text>

        <Text
          style={
            styles.status
          }
        >
          {minute !==
          null
            ? `${minute}'`
            : match.status.long}
        </Text>
      </View>

      <View
        style={
          styles.profileBadge
        }
      >
        <Text
          style={
            styles.profileText
          }
        >
          {
            PROFILE_LABELS[
              opportunity.profile
            ]
          }
        </Text>
      </View>
    </View>

    <View
      style={
        styles.scoreHeader
      }
    >
      <Text
        style={
          styles.gap
        }
      >
        Diferencia contextual{" "}
        {opportunity
          .adjustedGap
          .toFixed(
            1
          )}
      </Text>

      <Text
        style={
          styles.quality
        }
      >
        Datos{" "}
        {opportunity.dataQuality}
        /100
      </Text>
    </View>

    <TeamBlock
      team={
        opportunity.home
      }
      favored={
        homeFavored
      }
    />

    <View
      style={
        styles.vs
      }
    >
      <Text
        style={
          styles.vsText
        }
      >
        VS
      </Text>
    </View>

    <TeamBlock
      team={
        opportunity.away
      }
      favored={
        awayFavored
      }
    />

    {/*
     * ========================================
     * COPIAR EQUIPOS / PARTIDO
     * ========================================
     *
     * Reutilizamos el mismo componente
     * que ya usamos en Todos y Rojas.
     *
     * ⧉ Local
     * ⧉ Visita
     * ⧉ Partido
     */}
    <MatchCopyActions
      home={
        match.home.name
      }
      away={
        match.away.name
      }
    />

    {opportunity
      .warnings
      .length >
      0 && (
      <View
        style={
          styles.warningArea
        }
      >
        {opportunity
          .warnings
          .slice(
            0,
            3
          )
          .map(
            (
              warning,
              index
            ) => (
              <Text
                key={
                  `${warning}-${index}`
                }
                style={
                  styles.warning
                }
              >
                ⚠ {warning}
              </Text>
            )
          )}
      </View>
    )}

    {opportunity
      .reasons
      .length >
      0 && (
      <View
        style={
          styles.reasonArea
        }
      >
        {opportunity
          .reasons
          .slice(
            0,
            4
          )
          .map(
            (
              reason,
              index
            ) => (
              <Text
                key={
                  `${reason}-${index}`
                }
                style={
                  styles.reason
                }
              >
                • {reason}
              </Text>
            )
          )}
      </View>
    )}

    {!opportunity.hasTable && (
      <Text
        style={
          styles.noTable
        }
      >
        Sin tabla comparable: análisis basado principalmente en forma reciente.
      </Text>
    )}

    {onPress && (
      <TouchableOpacity
        activeOpacity={
          0.8
        }
        onPress={
          onPress
        }
        style={
          styles.openButton
        }
      >
        <Text
          style={
            styles.openButtonText
          }
        >
          Abrir partido
        </Text>
      </TouchableOpacity>
    )}
  </View>
);
}
