export const CODE_LOOKUP = new Map<string, string>([
  ['A', 'Residential 7 or more units'],
  ['AH', 'Agricultural/Horticultural'],
  ['C', 'Commercial'],
  ['CC', 'Commercial Condominium'],
  ['CD', 'Residential Condominium Unit'],
  ['CL', 'Commercial Land'],
  ['CM', 'Condominium Main Building'],
  ['CP', 'Condominium Parking'],
  ['E', 'Tax Exempt'],
  ['EA', 'Tax Exempt (121A)'],
  ['I', 'Industrial'],
  ['R1', 'Residential 1-Family Unit'],
  ['R2', 'Residential 2-Family Unit'],
  ['R3', 'Residential 3-Family Unit'],
  ['R4', 'Residential 4 or more Family Unit'],
  ['RC', 'Mixed Use Residential/Commercial'],
  ['RL', 'Residential Land'],
]);

const UNIT_TYPES = new Set(['CD', 'R1', 'R2', 'R3', 'R4']);

export const isUnit = (lu: string): boolean => UNIT_TYPES.has(lu);
