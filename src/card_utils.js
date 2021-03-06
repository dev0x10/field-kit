/**
 * @TODO Make this an enum
 */
export const AMEX        = 'amex';
export const DISCOVER    = 'discover';
export const JCB         = 'jcb';
export const MASTERCARD  = 'mastercard';
export const VISA        = 'visa';

/**
 * Pass in a credit card number and it'll return the
 * type of card it is.
 *
 * @param {string} pan
 * @returns {?string} returns the type of card based in the digits
 */
export function determineCardType(pan) {
  if (pan === null || pan === undefined) {
    return null;
  }

  pan = pan.toString();
  const firsttwo = parseInt(pan.slice(0, 2), 10);
  const iin = parseInt(pan.slice(0, 6), 10);
  const halfiin = parseInt(pan.slice(0, 3), 10);

  if (pan[0] === '4') {
    return VISA;
  } else if (pan.slice(0, 4) === '6011' || firsttwo === 65 || (halfiin >= 664 && halfiin <= 649) || (iin >= 622126 && iin <= 622925)) {
    return DISCOVER;
  } else if (pan.slice(0, 4) === '2131' || pan.slice(0, 4) === '1800' || firsttwo === 35) {
    return JCB;
  } else if (firsttwo >= 51 && firsttwo <= 55) {
    return MASTERCARD;
  } else if (firsttwo === 34 || firsttwo === 37) {
    return AMEX;
  }
}

/**
 * Pass in a credit card number and it'll return if it
 * passes the [luhn algorithm](http://en.wikipedia.org/wiki/Luhn_algorithm)
 *
 * @param {string} pan
 * @returns {boolean}
 */
export function luhnCheck(pan) {

  const checkCardNum = (function(arr) {
    return function(ccNum) {
      let len = ccNum.length;
      let bit = 1;
      let sum = 0;
      let val;

      while (len) {
        val = parseInt(ccNum.charAt(--len), 10);
        sum += (bit ^= 1) ? arr[val] : val;
      }

      return sum && sum % 10 === 0;
    };
  }([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));

  return checkCardNum(pan);

}

/**
 * Pass in a credit card number and it'll return if it
 * is a valid length for that type. If it doesn't know the
 * type it'll return false
 *
 * @param {string} pan
 * @returns {boolean}
 */
export function validCardLength(pan) {
  switch (determineCardType(pan)) {
    case VISA:
      return pan.length === 13 || pan.length === 16;
    case DISCOVER: case MASTERCARD:
      return pan.length === 16;
    case JCB:
      return pan.length === 15 || pan.length === 16;
    case AMEX:
      return pan.length === 15;
    default:
      return false;
  }
}
