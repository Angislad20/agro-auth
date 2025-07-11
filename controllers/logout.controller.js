const logout = async (req, res) => {
  try {
   
    return res.status(200).json({
      message: 'Déconnexion réussie. Merci de supprimer le token côté client.'
    });
  } catch (error) {
    console.error('Erreur logout :', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { logout };
