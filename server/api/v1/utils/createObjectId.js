/**
 * @param {Math} m  
 * @param {Date} d 
 * @param {Number} h 
 * @param {Number} s 
 * @return {string} Object id
 */
const createObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) => {
    return s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
}

module.exports = createObjectId;