// src/services/sessionService.js
import { createSession, getSession, deleteSession } from '../models/sessionModel.js';
import crypto from 'crypto';

export function startSession(userId) {
  const sid = crypto.randomUUID();
  createSession(sid, userId);
  return sid;
}

export function getSessionUser(sid) {
  return getSession(sid);
}

export function endSession(sid) {
  deleteSession(sid);
}