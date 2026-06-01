import bcryptjs from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "placement-gpt-super-secret-key-2026";

// 1. Password Hashing (Runs in Node.js environment)
export function hashPassword(password: string): string {
  const salt = bcryptjs.genSaltSync(10);
  return bcryptjs.hashSync(password, salt);
}

export function comparePassword(password: string, hashed: string): boolean {
  try {
    return bcryptjs.compareSync(password, hashed);
  } catch (e) {
    return false;
  }
}

// 2. Edge-Safe JWT implementation using standard Web Crypto API
// This operates flawlessly in Next.js App Router API routes AND Edge middleware!

// Helper: base64UrlEncode
function base64UrlEncode(str: string): string {
  const base64 = btoa(str);
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// Helper: base64UrlDecode
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

// Helper: Get Crypto Key
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Sign JWT Token
export async function signToken(payload: any, expiresInDays = 7): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const fullPayload = { ...payload, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const enc = new TextEncoder();
  const key = await getCryptoKey(JWT_SECRET);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(dataToSign));
  
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureStr = String.fromCharCode(...signatureArray);
  const encodedSignature = base64UrlEncode(signatureStr);

  return `${dataToSign}.${encodedSignature}`;
}

// Verify JWT Token
export async function verifyToken(token: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const dataToVerify = `${header}.${payload}`;

    const key = await getCryptoKey(JWT_SECRET);
    const enc = new TextEncoder();
    
    const decodedSignatureStr = base64UrlDecode(signature);
    const signatureBuffer = new Uint8Array(
      decodedSignatureStr.split("").map((c) => c.charCodeAt(0))
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      enc.encode(dataToVerify)
    );

    if (!isValid) return null;

    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    
    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return decodedPayload;
  } catch (e) {
    return null;
  }
}
