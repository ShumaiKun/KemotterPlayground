module.exports = {
  Unauthorized : "Unauthorized",
  badParameter : (param, value) => `Bad parameter '${param}'(${value})`,
  dataNotFound : 'Data Not Found',
  isUndefined : (key) => `${key} is undefined`,
  isInvalid : (key) => `${key} is invalid.`
}