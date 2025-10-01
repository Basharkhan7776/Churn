import type { ProjectOptions } from '../types';

export function generateJWTAuth(options: ProjectOptions): string {
  const { language } = options;

  return `import jwt from 'jsonwebtoken';${language === 'ts' ? `
import type { Request, Response, NextFunction } from 'express';

interface JWTPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}` : ''}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function generateToken(payload${language === 'ts' ? ': JWTPayload' : ''})${language === 'ts' ? ': string' : ''} {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token${language === 'ts' ? ': string' : ''})${language === 'ts' ? ': JWTPayload | null' : ''} {
  try {
    return jwt.verify(token, JWT_SECRET)${language === 'ts' ? ' as JWTPayload' : ''};
  } catch (error) {
    return null;
  }
}

export function authMiddleware(req${language === 'ts' ? ': Request' : ''}, res${language === 'ts' ? ': Response' : ''}, next${language === 'ts' ? ': NextFunction' : ''}) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = payload;
  next();
}
`;
}

export function generateSessionAuth(options: ProjectOptions): string {
  const { language } = options;

  return `import session from 'express-session';${language === 'ts' ? `
import type { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    email?: string;
  }
}` : ''}

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
};

export function sessionMiddleware(req${language === 'ts' ? ': Request' : ''}, res${language === 'ts' ? ': Response' : ''}, next${language === 'ts' ? ': NextFunction' : ''}) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}
`;
}

export function generateOAuthConfig(options: ProjectOptions): string {
  const { language } = options;

  return `// OAuth 2.0 Configuration${language === 'ts' ? `
import type { Request, Response } from 'express';` : ''}

export const oauthConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.OAUTH_CALLBACK_URL + '/google',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri: process.env.OAUTH_CALLBACK_URL + '/github',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
  },
};

// Add OAuth routes to your Express app:
// app.get('/auth/google', googleAuthHandler);
// app.get('/auth/google/callback', googleCallbackHandler);
// app.get('/auth/github', githubAuthHandler);
// app.get('/auth/github/callback', githubCallbackHandler);
`;
}
