import { convert, countriesAndRegions } from '..'

const primaryCountries = countriesAndRegions.filter(
  (countryOrRegion) => !('alternate' in countryOrRegion)
)
const countriesWithIcaoAndIso = primaryCountries.filter(
  (countryOrRegion) =>
    !!countryOrRegion.icao && !!countryOrRegion.iso2 && !!countryOrRegion.iso3
)
const countriesWithIso = primaryCountries.filter(
  (countryOrRegion) => !!countryOrRegion.iso2 && !!countryOrRegion.iso3
)

const countriesWithFlagsAndIcao = primaryCountries.filter(
  (countryOrRegion) => !!countryOrRegion.icao && !!countryOrRegion.flag
)

const countriesWithPhonesAndIso = primaryCountries.filter(
  (countryOrRegion) =>
    !!countryOrRegion.phone && !!countryOrRegion.iso2 && !!countryOrRegion.iso3
)

/** Happy path */
describe(convert.name, () => {
  it.each(
    countriesWithIcaoAndIso.map((countryOrRegion) => [
      countryOrRegion.name,
      countryOrRegion.icao,
      countryOrRegion.iso2,
    ])
  )('convert %s from icao to iso2', (name, icao, iso2) =>
    expect(
      convert(icao as string)
        .from('icao')
        .to('iso2')
    ).toEqual(iso2)
  )

  it.each(
    countriesWithIcaoAndIso.map((countryOrRegion) => [
      countryOrRegion.name,
      countryOrRegion.icao,
      countryOrRegion.iso2,
    ])
  )('convert %s from iso2 to icao', (name, icao, iso2) =>
    expect(
      convert(iso2 as string)
        .from('iso2')
        .to('icao')
    ).toEqual(icao)
  )

  it.each(
    countriesWithIcaoAndIso.map((countryOrRegion) => [
      countryOrRegion.name,
      countryOrRegion.icao,
      countryOrRegion.iso3,
    ])
  )('convert %s from icao to iso3', (name, icao, iso3) =>
    expect(
      convert(icao as string)
        .from('icao')
        .to('iso3')
    ).toEqual(iso3)
  )

  it.each(
    countriesWithIcaoAndIso.map((countryOrRegion) => [
      countryOrRegion.name,
      countryOrRegion.icao,
      countryOrRegion.iso3,
    ])
  )('convert %s from iso3 to icao', (name, icao, iso3) =>
    expect(
      convert(iso3 as string)
        .from('iso3')
        .to('icao')
    ).toEqual(icao)
  )

  it.each(
    countriesWithIso.map((countryOrRegion) => [
      countryOrRegion.name,
      countryOrRegion.iso2,
      countryOrRegion.iso3,
    ])
  )('convert %s from iso2 to iso3', (name, iso2, iso3) =>
    expect(
      convert(iso2 as string)
        .from('iso2')
        .to('iso3')
    ).toEqual(iso3)
  )

  it.each(
    countriesWithIso.map((countryOrRegion) => [
      countryOrRegion.name,
      countryOrRegion.iso2,
      countryOrRegion.iso3,
    ])
  )('convert %s from iso3 to iso2', (name, iso2, iso3) =>
    expect(
      convert(iso3 as string)
        .from('iso3')
        .to('iso2')
    ).toEqual(iso2)
  )

  it.each(
    countriesWithFlagsAndIcao.map((countryOrRegion) => [
      countryOrRegion.name,
      countryOrRegion.icao,
      countryOrRegion.flag,
    ])
  )('convert %s from icao to flag', (name, icao, flag) =>
    expect(
      convert(icao as string)
        .from('icao')
        .to('flag')
    ).toEqual(flag)
  )

  it.each(
    countriesWithFlagsAndIcao.map((countryOrRegion) => [
      countryOrRegion.name,
      countryOrRegion.icao,
      countryOrRegion.flag,
    ])
  )('convert %s from flag to icao', (name, icao, flag) =>
    expect(
      convert(flag as string)
        .from('flag')
        .to('icao')
    ).toEqual(icao)
  )

  it.each(
    countriesWithPhonesAndIso.map((countryOrRegion) => [
      countryOrRegion.name,
      countryOrRegion.iso3,
      countryOrRegion.phone,
    ])
  )('convert %s from iso3 to phone', (name, iso3, phone) =>
    expect(
      convert(iso3 as string)
        .from('iso3')
        .to('phone')
    ).toEqual(phone)
  )

  it.each(
    countriesWithPhonesAndIso.map((countryOrRegion) => [
      countryOrRegion.name,
      countryOrRegion.iso3,
      countryOrRegion.phone,
    ])
  )('convert %s from phone to iso3', (name, iso3, phone) =>
    expect(
      convert(phone as string)
        .from('phone')
        .to('iso3')
    ).toEqual(iso3)
  )
})

/** Error-handling */
describe(convert.name, () => {
  it('should throw Error when .from() is called out of order', () => {
    expect(() => convert('USA').from('icao').from('icao')).toThrowError()
  })

  it('should throw Error when .to() is called out of order', () => {
    expect(() => convert('USA').to('icao')).toThrowError()
  })

  it('should throw Error when val is not known in scheme specified in .from()', () => {
    const VALID_ICAO_CODE = 'SGP' // not a valid iso2 code
    expect(() => convert(VALID_ICAO_CODE).from('iso2')).toThrowError()
  })

  it('should throw Error when countryOrRegion cannot be projected to scheme specifeid in .to()', () => {
    const VALID_ICAO_CODE = 'XXX' // does not have an iso2 equivalent
    expect(() =>
      convert(VALID_ICAO_CODE).from('icao').to('iso2')
    ).toThrowError()
  })

  it('should throw Error when countryOrRegion cannot be projected to scheme specifeid in .to()', () => {
    const VALID_ICAO_CODE = 'ILO' // does not have a flag
    expect(() =>
      convert(VALID_ICAO_CODE).from('icao').to('flag')
    ).toThrowError()
  })
})

/** Tie-breaking */
describe(convert.name, () => {
  it('should break ties for one-to-many icao mappings', () => {
    expect(convert('CHN').from('icao').to('iso2')).toEqual('CN')
    expect(convert('FRA').from('icao').to('iso3')).toEqual('FRA')
    expect(convert('USA').from('icao').to('iso3')).toEqual('USA')
    expect(convert('DE').from('iso2').to('icao')).toEqual('D')
    expect(convert('🇬🇧').from('flag').to('iso2')).toEqual('GB')
  })

  it('should map alternates in the allowed direction', () => {
    // Non-exhaustive
    expect(convert('DEU').from('icao').to('iso2')).toEqual('DE')
    expect(convert('UMI').from('iso3').to('icao')).toEqual('USA')
    expect(convert('UMI').from('iso3').to('iso2')).toEqual('UM')
    expect(convert('Dominican Republic').from('name').to('phone')).toEqual(
      '+1-809'
    )
  })
})

/** Quality-of-life */
describe(convert.name, () => {
  it('should accept case-insensitive, output fix-cased', () => {
    expect(convert('pri').from('iso3').to('name')).toEqual('Puerto Rico')
    expect(convert('pRi').from('iso3').to('iso3')).toEqual('PRI')
    expect(convert('puerto Rico').from('name').to('iso3')).toEqual('PRI')
  })

  it('should trim leading / trailing whitespace', () => {
    expect(convert(' Paraguay').from('name').to('iso2')).toEqual('PY')
    expect(convert('+595 ').from('phone').to('iso2')).toEqual('PY')
  })
})
