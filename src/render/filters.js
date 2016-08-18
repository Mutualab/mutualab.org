module.exports = {
  nl2br : (str) => {
    return str.replace(/\r|\n|\r\n/g, '<br>')
  }
}
