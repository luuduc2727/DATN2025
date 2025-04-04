// middleware/checkRole.js

const checkRole = (requiredRole) => {
    return (req, res, next) => {
      if (!req.user || req.user.role !== requiredRole) {
        return res.status(403).json({
          message: `Access denied. ${requiredRole} role required.`,
          success: false
        });
      }
      next();
    };
  };
  
  export default checkRole;
  