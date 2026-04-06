/**
 * RBAC Middleware
 * Enforces permission-based access control at the route level.
 *
 * Usage:
 *   router.post('/members', authenticate, checkPermission('ADD_MEMBER'), controller.create);
 */

/**
 * Returns an Express middleware that checks if the authenticated user
 * has the specified permission. Permissions come from the JWT payload
 * (set at login time from DB).
 *
 * @param {string} permissionKey - e.g. 'ADD_MEMBER', 'VIEW_USER_BASIC'
 */
function checkPermission(permissionKey) {
  return function rbacGuard(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required.'
      });
    }

    const userPermissions = req.user.permissions || [];

    if (!userPermissions.includes(permissionKey)) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: `Access denied. Required permission: ${permissionKey}`,
        required: permissionKey,
        userPermissions
      });
    }

    next();
  };
}

/**
 * Requires ANY of the supplied permissions (OR logic).
 * @param {string[]} permissionKeys
 */
function checkAnyPermission(...permissionKeys) {
  return function rbacGuardAny(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    const userPermissions = req.user.permissions || [];
    const hasAny = permissionKeys.some(k => userPermissions.includes(k));

    if (!hasAny) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: `Access denied. Requires one of: ${permissionKeys.join(', ')}`,
        required: permissionKeys,
        userPermissions
      });
    }

    next();
  };
}

module.exports = { checkPermission, checkAnyPermission };
