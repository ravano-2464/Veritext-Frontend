const COUNTRY_CODES = (
  'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ ' +
  'CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO ' +
  'FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM ' +
  'JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ ' +
  'MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE ' +
  'RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT ' +
  'TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'
).split(' ');

const COUNTRY_ALIASES: Record<string, string> = {
  america: 'US',
  amerika: 'US',
  britain: 'GB',
  'cape verde': 'CV',
  cina: 'CN',
  'czech republic': 'CZ',
  'great britain': 'GB',
  'ivory coast': 'CI',
  'korea selatan': 'KR',
  'korea utara': 'KP',
  'mainland china': 'CN',
  'north korea': 'KP',
  'south korea': 'KR',
  timorleste: 'TL',
  'timor leste': 'TL',
  'united states of america': 'US',
  uae: 'AE',
  uk: 'GB',
  usa: 'US',
};

const LEGACY_LOCALE_VALUES = new Set([
  'ar',
  'de',
  'en',
  'es',
  'fr',
  'it',
  'ja',
  'ko',
  'pt',
  'ru',
  'zh',
]);

const normalizeCountryKey = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const englishCountryNames =
  typeof Intl !== 'undefined' ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;
const indonesianCountryNames =
  typeof Intl !== 'undefined' ? new Intl.DisplayNames(['id'], { type: 'region' }) : null;

const countryLookup = new Map<string, string>();
const countryNameByCode = new Map<string, string>();

for (const code of COUNTRY_CODES) {
  const englishName = englishCountryNames?.of(code);
  const indonesianName = indonesianCountryNames?.of(code);

  if (englishName && englishName !== code) {
    countryLookup.set(normalizeCountryKey(englishName), code);
    countryNameByCode.set(code, englishName);
  }

  if (indonesianName && indonesianName !== code) {
    countryLookup.set(normalizeCountryKey(indonesianName), code);
  }
}

for (const [alias, code] of Object.entries(COUNTRY_ALIASES)) {
  countryLookup.set(normalizeCountryKey(alias), code);
}

const isLegacyLocaleValue = (value: string) => {
  const normalizedValue = normalizeCountryKey(value);
  return (
    LEGACY_LOCALE_VALUES.has(normalizedValue) ||
    /^[a-z]{2,3}(?: [a-z]{2,3})?$/.test(normalizedValue)
  );
};

export interface CountryMetadata {
  code: string | null;
  displayValue: string;
  isRecognized: boolean;
}

export const getCountryFlagUrl = (countryCode: string) =>
  `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

export const getCountryMetadata = (value: string | null | undefined): CountryMetadata => {
  const rawValue = String(value ?? '').trim();

  if (!rawValue) {
    return {
      code: null,
      displayValue: '',
      isRecognized: false,
    };
  }

  const normalizedValue = normalizeCountryKey(rawValue);
  const resolvedCode = countryLookup.get(normalizedValue) ?? null;

  if (!resolvedCode) {
    return {
      code: null,
      displayValue: isLegacyLocaleValue(rawValue) ? '' : rawValue,
      isRecognized: false,
    };
  }

  return {
    code: resolvedCode,
    displayValue: countryNameByCode.get(resolvedCode) ?? rawValue,
    isRecognized: true,
  };
};

export const getEditableCountryValue = (value: string | null | undefined) =>
  getCountryMetadata(value).displayValue;
