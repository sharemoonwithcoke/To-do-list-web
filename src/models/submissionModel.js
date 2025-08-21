// src/models/submissionModel.js
import crypto from 'crypto';

// Store submissions per task per owner user: { ownerUserId: { taskId: [submission] } }
// submission: { id, taskId, ownerUserId, submitterUserId, dateISO, type: 'screenshot'|'link'|'log', details: string, filePath?: string, createdAt }
const submissionsStore = {};

export function addSubmission({ ownerUserId, taskId, submitterUserId, type, details, filePath }) {
  if (!submissionsStore[ownerUserId]) {
    submissionsStore[ownerUserId] = {};
  }
  if (!submissionsStore[ownerUserId][taskId]) {
    submissionsStore[ownerUserId][taskId] = [];
  }
  const submission = {
    id: crypto.randomUUID(),
    taskId,
    ownerUserId,
    submitterUserId,
    dateISO: new Date().toISOString(),
    type,
    details,
    filePath,
    createdAt: new Date().toISOString(),
  };
  submissionsStore[ownerUserId][taskId].push(submission);
  return { ...submission };
}

export function listSubmissions(ownerUserId, taskId) {
  return [...(submissionsStore[ownerUserId]?.[taskId] || [])];
}

