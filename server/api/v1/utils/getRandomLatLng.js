
/**
 * @description Enter a latitude and longitude for a center where you want a random space from
 * @param {number} lat  
 * @param {number} lng 
 * @return {Object} lat, lng
 */

const getRandomLatLng = (lat, lng) => {
    // let brusselCenter = { lat: 50.85045, lat: 4.34878 } 
    let center = { lat: lat, lng: lng }
    let radius = 1000;
    let x0 = center.lng;
    let y0 = center.lat;
    let rd = radius / 111300;

    let u = Math.random();
    let v = Math.random();

    let w = rd * Math.sqrt(u);
    let t = 2 * Math.PI * v;
    let x = w * Math.cos(t);
    let y = w * Math.sin(t);

    let xp = x / Math.cos(y0);
    return { 'lat': y + y0, 'lng': xp + x0 };
}

module.exports = getRandomLatLng;