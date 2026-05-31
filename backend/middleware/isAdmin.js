const ADMIN_UID =
  "QCxXXNqFdMVfn4WmHK8CcWKx6K72";

const isAdmin = (
  req,
  res,
  next
) => {

  if (
    req.user.uid !== ADMIN_UID
  ) {

    return res.status(403).json({
      message:
        "Access denied. Admin only."
    });

  }

  next();

};

module.exports = isAdmin;