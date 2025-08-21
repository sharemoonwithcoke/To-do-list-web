// src/models/shareModel.js

// Store sharing relationships: for each owner userId, a Set of target userIds with whom tasks are shared
const shareMap = {}; // { ownerUserId: Set<targetUserId> }

export function addShare(ownerUserId, targetUserId) {
  if (!shareMap[ownerUserId]) {
    shareMap[ownerUserId] = new Set();
  }
  shareMap[ownerUserId].add(targetUserId);
  return true;
}

export function removeShare(ownerUserId, targetUserId) {
  if (!shareMap[ownerUserId]) return false;
  return shareMap[ownerUserId].delete(targetUserId);
}

export function listShares(ownerUserId) {
  const set = shareMap[ownerUserId] || new Set();
  return Array.from(set);
}

export function isSharedWith(ownerUserId, targetUserId) {
  const set = shareMap[ownerUserId];
  return set ? set.has(targetUserId) : false;
}

export function listOwnersThatSharedWith(targetUserId) {
  const owners = [];
  for (const [owner, set] of Object.entries(shareMap)) {
    if (set.has(targetUserId)) owners.push(owner);
  }
  return owners;
}

