module.exports = (source) => {
  const regex = /@ApiProperty(?:Optional)?\((?:.|\s)*?\)/gm;
  const subst = '';
  const result = source.replace(regex, subst);
  return result;
};
