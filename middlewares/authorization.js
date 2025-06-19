const isAdminOrSelf = (req, res, next) => {
  const user = req.user;
  const userId = parseInt(req.params.id);

  if (user.profil_id === 1 || user.id === userId) {
    return next();
  }

  return res.status(403).json({ message: 'Accès refusé.' });
};

module.exports = isAdminOrSelf;
