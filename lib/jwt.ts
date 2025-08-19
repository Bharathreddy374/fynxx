// lib/jwt.ts
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

interface TokenPayload {
  sub: string; // User ID
  role: string;
  status: string;
}

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: `${process.env.ACCESS_TOKEN_TTL_SECONDS}s`,
  });
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: `${process.env.REFRESH_TOKEN_TTL_SECONDS}s`,
  });
}

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  const isProduction = process.env.NODE_ENV === 'production';
  const domain = process.env.COOKIE_DOMAIN!;

  const accessCookie = serialize('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: parseInt(process.env.ACCESS_TOKEN_TTL_SECONDS!),
    domain: domain,
  });

  const refreshCookie = serialize('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: parseInt(process.env.REFRESH_TOKEN_TTL_SECONDS!),
    domain: domain,
  });

  res.headers.append('Set-Cookie', accessCookie);
  res.headers.append('Set-Cookie', refreshCookie);

  return res;
}