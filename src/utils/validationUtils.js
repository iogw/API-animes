const isANumber = (value) => !isNaN(parseInt(value));

const id = (id) => isANumber(id);

const animeInputs = (title, year, chapters) => {
  if (!title || !year || !chapters) return false;
  if (typeof title !== 'string') return false;
  if (isANumber(year) || isANumber(chapters)) return false;
  const maxYear = new Date().getFullYear() + 2;
  return 1900 < parseInt(year) && parseInt(year) < maxYear;
};

const validateUserSignup = (username, email, password) => {
  if (!username || !email || !password) return false;
  if (!(email.includes('@') && email.includes('.'))) return false;
  return password.length >= 8;
};

const validateUserLogin = (email, password) => {
  return email && password && email.includes('@') && email.includes('.');
};

module.exports = { animeInputs, id, validateUserSignup, validateUserLogin };
