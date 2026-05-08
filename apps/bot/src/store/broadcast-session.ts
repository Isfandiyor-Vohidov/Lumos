const broadcastState = new Map<number, boolean>();

export function setWaitingForBroadcast(telegramId: number) {
  broadcastState.set(telegramId, true);
}

export function stopWaitingForBroadcast(telegramId: number) {
  broadcastState.delete(telegramId);
}

export function isWaitingForBroadcast(telegramId: number): boolean {
  return broadcastState.get(telegramId) ?? false;
}