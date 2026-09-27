import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "gmail_session";
export const STATE_COOKIE = "gmail_oauth_state";
const scopes = ["openid", "email", "https://www.googleapis.com/auth/gmail.modify"];

type GmailSession = { accessToken: string; refreshToken?: string; expiresAt: number; email?: string };
type TokenResponse = { access_token: string; refresh_token?: string; expires_in: number; id_token?: string };

export function gmailConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GMAIL_SESSION_SECRET);
}

function config(origin?: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const secret = process.env.GMAIL_SESSION_SECRET;
  if (!clientId || !clientSecret || !secret) throw new Error("Gmail integration is not configured");
  return { clientId, clientSecret, secret, redirectUri: process.env.GOOGLE_REDIRECT_URI || `${origin}/api/gmail/callback` };
}

export function createState() { return randomBytes(24).toString("hex"); }

export function authorizationUrl(origin: string, state: string) {
  const { clientId, redirectUri } = config(origin);
  const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: "code", access_type: "offline", prompt: "consent", include_granted_scopes: "true", scope: scopes.join(" "), state });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeCode(code: string, origin: string) {
  const { clientId, clientSecret, redirectUri } = config(origin);
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }) });
  if (!response.ok) throw new Error("Google token exchange failed");
  const token = await response.json() as TokenResponse;
  const profileResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", { headers: { authorization: `Bearer ${token.access_token}` } });
  const profile = profileResponse.ok ? await profileResponse.json() as { emailAddress?: string } : {};
  return { accessToken: token.access_token, refreshToken: token.refresh_token, expiresAt: Date.now() + token.expires_in * 1000, email: profile.emailAddress } satisfies GmailSession;
}

function key() { return createHash("sha256").update(config().secret).digest(); }
function encrypt(value: GmailSession) { const iv=randomBytes(12); const cipher=createCipheriv("aes-256-gcm",key(),iv); const encrypted=Buffer.concat([cipher.update(JSON.stringify(value),"utf8"),cipher.final()]); return Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString("base64url"); }
function decrypt(value: string) { const data=Buffer.from(value,"base64url"); const decipher=createDecipheriv("aes-256-gcm",key(),data.subarray(0,12)); decipher.setAuthTag(data.subarray(12,28)); return JSON.parse(Buffer.concat([decipher.update(data.subarray(28)),decipher.final()]).toString("utf8")) as GmailSession; }

export async function saveSession(session: GmailSession) { (await cookies()).set(SESSION_COOKIE, encrypt(session), { httpOnly:true, sameSite:"lax", secure:process.env.NODE_ENV==="production", path:"/", maxAge:60*60*24*30, priority:"high" }); }
export async function clearSession() { (await cookies()).delete(SESSION_COOKIE); }
export async function getSession() { const value=(await cookies()).get(SESSION_COOKIE)?.value; if(!value) return null; try{return decrypt(value)}catch{return null} }

async function refresh(session: GmailSession) {
  if (session.expiresAt > Date.now() + 60000) return session;
  if (!session.refreshToken) throw new Error("Gmail authorization expired");
  const { clientId, clientSecret } = config();
  const response=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:clientId,client_secret:clientSecret,refresh_token:session.refreshToken,grant_type:"refresh_token"})});
  if(!response.ok) throw new Error("Unable to refresh Gmail authorization");
  const token=await response.json() as TokenResponse;
  const updated={...session,accessToken:token.access_token,expiresAt:Date.now()+token.expires_in*1000}; await saveSession(updated); return updated;
}

export async function gmailRequest<T>(path: string, init?: RequestInit) {
  const current=await getSession(); if(!current) throw new Error("Gmail is not connected"); const session=await refresh(current);
  const response=await fetch(`https://gmail.googleapis.com/gmail/v1/users/me${path}`,{...init,headers:{...init?.headers,authorization:`Bearer ${session.accessToken}`}});
  if(!response.ok) throw new Error(`Gmail request failed (${response.status})`);
  return response.json() as Promise<T>;
}