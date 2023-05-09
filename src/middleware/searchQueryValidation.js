const validateRateQuery = (req, res, next) => {
  const { rate } = req.query;
  const rateNumber = Number(rate);
  // const hasValid = !Number.isInteger(rate) || Number(rate) <= 0 || Number(rate) > 5;
  console.log('a', rate);
  if (rate && (rateNumber <= 0 || rateNumber > 5 || !Number.isInteger(rateNumber))) {
    return res.status(400)
    .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};

const validateDateQuery = (req, res, next) => {
  const { date } = req.query;
  const dateFormat = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
  const hasValidDate = dateFormat.test(date);
  if (date && !hasValidDate) {
    return res.status(400).json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validateRate = (req, res, next) => {
  const { rate } = req.body;
  if (rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (!Number.isInteger(rate) || rate <= 0 || rate > 5) {
    return res.status(400)
    .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};

module.exports = { validateRateQuery, validateDateQuery, validateRate };