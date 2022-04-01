import {
  countriesAndRegions,
  Identifier,
  IdentifierScheme,
} from './countries-regions'

function filterDeduplicateAndSort<T extends IdentifierScheme>(
  identifierScheme: T
): Identifier<T>[] {
  const uniques = new Set<string>()
  for (const x of countriesAndRegions.map(
    (country) => country[identifierScheme]
  ))
    if (x !== undefined) uniques.add(x)
  return [...uniques].sort() as Identifier<T>[]
}

/** Enumerations of country codes, grouped by identifier scheme. */
export const schemes = {
  name: filterDeduplicateAndSort('name'),
  icao: filterDeduplicateAndSort('icao'),
  iso2: filterDeduplicateAndSort('iso2'),
  iso3: filterDeduplicateAndSort('iso3'),
  flag: filterDeduplicateAndSort('flag'),
  phone: filterDeduplicateAndSort('phone'),
}
