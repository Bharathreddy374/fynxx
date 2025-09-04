// lib/jwt.ts
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize, SerializeOptions } from 'cookie';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

interface TokenPayload {
  sub: string; // User ID
  role: string;
  status: string;
}

export function signAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: Number(process.env.ACCESS_TOKEN_TTL_SECONDS),
  });
}

export function signRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: Number(process.env.REFRESH_TOKEN_TTL_SECONDS),
  });
}

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  const isProduction = process.env.NODE_ENV === 'production';

  // Base cookie options
  const baseCookieOptions: SerializeOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  };

  // Conditionally add the domain ONLY in production
  if (isProduction && process.env.COOKIE_DOMAIN) {
    baseCookieOptions.domain = process.env.COOKIE_DOMAIN;
  }

  const accessCookie = serialize('access_token', accessToken, {
    ...baseCookieOptions,
    maxAge: parseInt(process.env.ACCESS_TOKEN_TTL_SECONDS!),
  });

  const refreshCookie = serialize('refresh_token', refreshToken, {
    ...baseCookieOptions,
    maxAge: parseInt(process.env.REFRESH_TOKEN_TTL_SECONDS!),
  });

  res.headers.append('Set-Cookie', accessCookie);
  res.headers.append('Set-Cookie', refreshCookie);

  return res;
}