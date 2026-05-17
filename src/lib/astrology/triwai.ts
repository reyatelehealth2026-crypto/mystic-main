/**
 * §10 — ตรีวัย (Three Life Stages).
 *
 * Equal 0-25 / 25-50 / 50-75 split. The เจ้าวัย of each stage is the
 * planet that rules the strongest house (by dignity) in the stage's
 * house-set.
 */

import { dignitiesOf, sortDignities, type DignityLabel } from "./dignities";
import { TRIWAI_STAGES, type TriwaiStage } from "./reference";
import { signRuler } from "./divisional";
import type { NatalChart, PlanetId } from "./types";

export interface TriwaiAssignment {
  stage: TriwaiStage;
  lord: PlanetId;
  lordHouse: number;
  lordSign: number;
  dignities: DignityLabel[];
}

export function computeTriwai(chart: NatalChart): TriwaiAssignment[] {
  const lagna = chart.planets[0];
  const lagnaSign = lagna.zodiac.sign;
  return TRIWAI_STAGES.map((stage) => {
    let best: TriwaiAssignment | null = null;
    for (const houseNum of stage.houses) {
      const sign = (lagnaSign + houseNum - 1) % 12;
      const lord = signRuler(sign);
      const lordPlanet = chart.planets.find((p) => p.id === lord);
      if (!lordPlanet) continue;
      const labels = sortDignities(
        dignitiesOf(lord, lordPlanet.zodiac.sign, lordPlanet.zodiac.degree)
      );
      const score = scoreDignities(labels);
      if (!best || score > scoreDignities(best.dignities)) {
        best = {
          stage,
          lord,
          lordHouse: ((lordPlanet.zodiac.sign - lagnaSign + 12) % 12) + 1,
          lordSign: lordPlanet.zodiac.sign,
          dignities: labels,
        };
      }
    }
    if (!best) {
      const fallbackSign = (lagnaSign + stage.houses[0] - 1) % 12;
      best = {
        stage,
        lord: signRuler(fallbackSign),
        lordHouse: stage.houses[0],
        lordSign: fallbackSign,
        dignities: [],
      };
    }
    return best;
  });
}

function scoreDignities(labels: DignityLabel[]): number {
  if (labels.length === 0) return 0;
  const weights: Partial<Record<DignityLabel, number>> = {
    อุจจ์: 10,
    เกษตร: 8,
    มูลตรีโกณ: 7,
    มหาจักร: 5,
    ราชาโชค: 4,
    เทวีโชค: 3,
    อุจจาวิลาส: 2,
    อุจจาภิมุข: -3,
    ปรเกษตร: -5,
    นิจ: -10,
  };
  return labels.reduce((acc, l) => acc + (weights[l] ?? 0), 0);
}

export function currentStage(ageYears: number): TriwaiStage | null {
  return TRIWAI_STAGES.find((s) => ageYears >= s.startAge && ageYears < s.endAge) ?? null;
}
