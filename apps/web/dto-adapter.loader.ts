module.exports = (source) => {
  const regex = /@Api\w*Property\w*\(([^()]*|\([^()]*\))*\)/gm;
  const subst = '';
  const result = source.replace(regex, subst);
  return result;
};
