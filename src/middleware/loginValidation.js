const loginValidation = (req, res, next) => {
  const { email, password } = req.body;
  const emailRegex = /\S+@\S+\.\S+/;
  const hasEmailValid = emailRegex.test(email);
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!hasEmailValid) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  } 
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  const hasPasswordValid = password.length > 5;
  if (!hasPasswordValid) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};
module.exports = loginValidation;