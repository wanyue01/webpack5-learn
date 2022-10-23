const schema = require('./schema.json');

module.exports = function(content) {
  // schema是options的验证规则
  // schema符合JSON Schema的规则
  const options = this.getOptions(schema);
  const prefix = `
  /*
  * Author: ${options.author}
  */
  `;
  console.log(prefix + content);
  return prefix + content;
}