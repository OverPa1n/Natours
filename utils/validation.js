const {userValidate} = require('../schemaValidators/userValidate')

module.exports = (data, nameOfSchema) => {
  switch (nameOfSchema) {
    case 'user':
      return userValidate(data)
  }
}
