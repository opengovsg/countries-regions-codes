# Convert country/region codes

![Coverage Status](https://coveralls.io/repos/github/opengovsg/countries-regions-codes/badge.svg?branch=develop&kill_cache=1)

A utility for converting between country/region codes. We currently support 6 schemes:
- `'name'` Plaintext English
- `'icao'` International Civil Aviation Organization
- `'iso2'` ISO 3166-1 alpha-2 ([link](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2))
- `'iso3'` ISO 3166-1 alpha-3 ([link](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3))
- `'flag'` Emojis 🇦🇪 🇪🇸 🇸🇬 🇲🇵 🇳🇱 
- `'phone'` Prefixes for international dialing ([link](https://countrycode.org/))

## Installation
```
npm install @opengovsg/countries-regions-codes
```

## Usage

`countries-regions-codes` provides a chained API:


```ts
import { convert } from '@opengovsg/countries-regions-codes'

convert('SGP').from('icao').to('iso2') // 'SG'
```


Schemes don't always have 1-1 mappings. In such cases, we support many-to-one mappings as expected

```ts
// United States Minor Outlying Islands
convert('UM').from('iso2').to('icao') // 'USA'

// United States
convert('US').from('iso2').to('icao') // 'USA'
```

and choose a sensible default for one-to-many mappings. Where ambiguous, we choose the territory with a larger population. The full list of alternates can be seen [here](https://github.com/opengovsg/countries-regions-codes/blob/develop/src/countries.ts)

```ts
convert('USA').from('icao').to('name') // 'United States'
```


Where a scheme has no representation for an option provided by another scheme, we throw an error.

```ts
// Refugee (Status) exists in icao but not iso2
convert('XXB').from('icao').to('iso2') // throws
```


Additionally, if you require the full enums, e.g. to use in a validator / to iterate over with your own logic, you can access them as a de-duped, sorted list:

```ts
import { schemes } from '@opengovsg/countries-regions-codes'

console.log(schemes.icao) // ['AFG', 'ALB', 'AZM', ...]
console.log(schemes.iso2) // ['AF', 'AL', 'AS', ...]
```

## Typings
Array items in `schemes` and return type from `convert()` are strongly-typed thanks to type-narrowing. 

```ts
const possiblePhonePrefix: string = '+66'
const wellTypedIso3 = convert(possiblePhonePrefix).from('phone').to('iso3')

// TS complains - wellTypedIso3 is known to be 'AFG' | 'ALB' | 'AZM' ...
if (wellTypedIso3 === 'Thailand') 
