import {
  countriesAndRegions,
  CountryOrRegion,
  Identifier,
  IdentifierScheme,
  IdentifierSchemes,
} from './countries-regions'

// Use maps for O(1) lookup. Internal optimization.
const lookupMaps: Record<IdentifierScheme, Map<string, CountryOrRegion>> = {
  icao: new Map<string, CountryOrRegion>(),
  iso2: new Map<string, CountryOrRegion>(),
  iso3: new Map<string, CountryOrRegion>(),
  name: new Map<string, CountryOrRegion>(),
  flag: new Map<string, CountryOrRegion>(),
  phone: new Map<string, CountryOrRegion>(),
}

for (const countryOrRegion of countriesAndRegions) {
  for (const identifier of IdentifierSchemes) {
    const typesafeCountry = countryOrRegion as CountryOrRegion
    const code = typesafeCountry[identifier]?.toUpperCase()

    // No valid entry in thsi scheme
    if (code === undefined) continue

    // Alternate is superseded by an existing mapping
    if (typesafeCountry.alternate && lookupMaps[identifier].has(code)) continue

    lookupMaps[identifier].set(code, typesafeCountry)
  }
}

class Converter {
  private val: string
  private origin?: IdentifierScheme

  constructor(val: string) {
    this.val = val.toUpperCase().trim()
  }

  /**
   * Indicate which variety of Identifier the starting symbol is
   * @throws {Error} if operations called in wrong order, or when this.val does not match the requested scheme.
   */
  from(from: IdentifierScheme): this {
    if (this.origin !== undefined)
      throw new Error('.from should be called exactly once')
    if (!lookupMaps[from].has(this.val))
      throw new Error(`${this.val} does not exist in identifier scheme ${from}`)
    this.origin = from
    return this
  }

  /**
   * Convert the country/region to the desired identifier scheme
   * @throws {Error} if operations called in wrong order, or when this.val cannot be mapped to the requested scheme.
   */
  to<T extends IdentifierScheme>(to: T): Identifier<T> {
    if (this.origin === undefined)
      throw new Error('.from must be called before .to')

    const code = lookupMaps[this.origin].get(this.val)![to]

    if (!code)
      throw new Error(
        `${this.val} from ${this.origin} does not have an equivalent in ${to}`
      )
    return code as Identifier<T>
  }
}

/**
 * Entry-point for conversion between country/region codes.
 * @param val Case-insensitive.
 * Where schemes have one-to-many mappings, this makes an opinionated choice to return the code deemed as 'primary'
 * See countries-regions.ts for the exact enumeration.
 */
export function convert(val: string): Converter {
  return new Converter(val)
}
