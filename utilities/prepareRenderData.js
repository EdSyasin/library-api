module.exports = (data = {}, success = {}, errors = {}) => {
    return { ...data, errors, success };
}
