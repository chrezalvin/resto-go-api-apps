"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcCrow = calcCrow;
exports.toRad = toRad;
exports.isWithinRadius = isWithinRadius;
/**
 * This function takes in latitude and longitude of two locations
 * and returns the distance between them as the crow flies (in meters)
 * @param coords1 first location
 * @param coords2 second location
 * @returns distance between two locations in meters
 */
function calcCrow(coords1, coords2) {
    // var R = 6.371; // km
    var R = 6371000;
    var dLat = toRad(coords2.lat - coords1.lat);
    var dLon = toRad(coords2.long - coords1.long);
    var lat1 = toRad(coords1.lat);
    var lat2 = toRad(coords2.lat);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}
// Converts numeric degrees to radians
function toRad(value) {
    return value * Math.PI / 180;
}
/**
 * Check if the distance between two coordinates is within a certain radius (in meter)
 * @param coords1 first coordinate
 * @param coords2 second coordinate
 * @param radius radius in meters
 * @returns true if the distance between the two coordinates is within the radius, false otherwise
 */
function isWithinRadius(coords1, coords2, radius) {
    return calcCrow(coords1, coords2) <= radius;
}