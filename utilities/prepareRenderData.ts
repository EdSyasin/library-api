export default (data = {}, success = {}, errors = {}) => {
    return { ...data, errors, success };
}
