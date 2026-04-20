import { Request, Response, NextFunction } from 'express';
import { tenantStorage } from '../lib/db.js';

export const tenantContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // During this "vibe/dev" stage, we'll use a header. 
  // Later, this will come from a secure JWT/Auth token.
  const tenantId = req.headers['x-tenant-id'] as string;

  if (!tenantId) {
    return res.status(401).json({ 
      error: { 
        code: 'MISSING_CONTEXT', 
        message: '6 Degrees requires a valid Tenant ID header.' 
      } 
    });
  }

  // We wrap the rest of the request in our storage 'run' block
  tenantStorage.run(tenantId, () => {
    next();
  });
};
