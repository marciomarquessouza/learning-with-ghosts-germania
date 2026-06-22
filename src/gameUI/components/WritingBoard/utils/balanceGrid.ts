import { DEFAULT_SLOT_QNT_H, DEFAULT_SLOT_QNT_W } from "..";
import { PreparedTarget } from "./prepareTarget";

export const MAX_SLOT_QNT_W = 7;
export const MAX_SLOT_QNT_H = 7;

export function balanceGrind(preparedTarget: PreparedTarget): {
  slotQntH: number;
  slotQntW: number;
} {
  const { sanitizedTarget } = preparedTarget;
  const targetSize = sanitizedTarget.length;
  const slotsQnt = DEFAULT_SLOT_QNT_W * DEFAULT_SLOT_QNT_H;

  if (targetSize <= slotsQnt) {
    return { slotQntH: DEFAULT_SLOT_QNT_H, slotQntW: DEFAULT_SLOT_QNT_W };
  }

  let w = DEFAULT_SLOT_QNT_W;
  let h = DEFAULT_SLOT_QNT_H;

  while (w < MAX_SLOT_QNT_W && w * h < targetSize) {
    w++;
  }

  if (w * h >= targetSize) {
    return { slotQntW: w, slotQntH: h };
  }

  while (w < MAX_SLOT_QNT_W && w * h < targetSize) {
    w++;
  }

  while (h < MAX_SLOT_QNT_H && w * h < targetSize) {
    h++;
  }

  if (w * h < targetSize) {
    return { slotQntW: MAX_SLOT_QNT_W, slotQntH: MAX_SLOT_QNT_H };
  }

  return { slotQntW: w, slotQntH: h };
}
