import english from './english';
import marathi from "./marathi";
import gujrati from "./gujrati";

const defaults = {
  separator: ',',
  majorPrefix: '',
  majorSuffix: '',
  minorPrefix: '',
  minorSuffix: '',
  prefix: '',
  suffix: '',
};

function getString(p67, p45, p3, p12, decimal, l, obj) {
  const lakh = !!p67 ? `${l[p67]} ${l[1e5]}${obj.separator} ` : '';
  const thousand = !!p45 ? `${l[p45]} ${l[1e3]}${obj.separator} ` : '';
  const hundred = !!p3 ? `${l[p3]}${l[1e2]} ` : '';
  const dec = !!p12 ? `${l[p12]} ` : '';
  const majorSuffix = obj.majorSuffix ? `${obj.majorSuffix} `: '';
  const point = decimal ? `${majorSuffix}${obj.minorPrefix || '.'} ${l[decimal]} ${obj.minorSuffix}`: '';
  return `${lakh}${thousand}${hundred}${dec}${point}`;
}

export default function inWords(num, language = 'ENG', options) {
  const obj = { ...defaults, ...options};

  let lang;
  let number = Number(num);
  let negative = false;
  if (!number) return '';
  number = Math.round((number + 0.00001) * 100);
  if (number < 0) {
    negative = true;
    number *= -1;
  }
  const arr = String(number).split('').reverse();
  const decimal = Number(`${arr[1] || 0 }${arr[0] || 0 }`);
  const p12     = Number(`${arr[3] || 0 }${arr[2] || 0 }`); // dec
  const p3      = Number(`${arr[4] || 0 }`); // hundred
  const p45     = Number(`${arr[6] || 0 }${arr[5] || 0 }`); // thousand
  const p67     = Number(`${arr[8] || 0 }${arr[7] || 0 }`); // lakh
  const remaining = arr.filter((x,i) => i >8).reverse().join('');

  if (language === 'ENG') lang = english;
  else if (language === 'MAR') lang = marathi;
  else if (language === 'GUJ') lang = gujrati;

  let remString = inWords(remaining, language, {separator: obj.separator});
  remString = remString ? `${remString}${lang[1e7]}${obj.separator} `: '';
  const sign = negative ? `${lang.negative} ` : '';
  const majorPrefix = obj.majorPrefix ? `${obj.majorPrefix} `: '';
  const prefix = obj.prefix ? `${obj.prefix} `: '';
  const suffix = obj.suffix ? ` ${obj.suffix}`: '';
  return `${prefix}${majorPrefix}${sign}${remString}${getString(p67, p45, p3, p12, decimal, lang, obj)}${suffix}`.replace(/\s\s+/g, ' ');
};
