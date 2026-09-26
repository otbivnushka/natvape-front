import { ApiRoutes } from '../constants';
import type { ApiBonus, ApiBonusHistoryItem } from '../dto/bonus.dto';
import type { Bonus, BonusHistoryEntry } from '../../types';
import { axiosInstance } from '../instance';

function mapBonusHistoryItem(i: ApiBonusHistoryItem): BonusHistoryEntry {
  return i;
}

function mapBonus(b: ApiBonus): Bonus {
  return {
    ...b,
    history: (b.history ?? []).map(mapBonusHistoryItem),
  };
}

export const get = async (): Promise<Bonus> => {
  const { data } = await axiosInstance.get<ApiBonus>(ApiRoutes.BONUS);
  return mapBonus(data);
};
