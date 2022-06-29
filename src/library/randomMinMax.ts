/**
 * Generates a number between the min an max (min max included)
 * 
 * @param {number} min Mininum possible number to be generated. 
 * @param {number} max Maxium possible number to be generated. 
 * @returns {number} The random number.
 */
export default function randomMinMaxFloor(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randomMinMaxFloat(min: number, max: number) {
    return Math.random() * (max - min + 1) + min
}

