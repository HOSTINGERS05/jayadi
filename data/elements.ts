import { ElementData } from "../types";

// Helper to generate a subset of elements. 
export const ELEMENTS: Record<number, Omit<ElementData, 'configuration'>> = {
  1: { number: 1, symbol: 'H', name: 'Hydrogen', group: 'nonmetal', mass: '1.008' },
  2: { number: 2, symbol: 'He', name: 'Helium', group: 'noble', mass: '4.002' },
  3: { number: 3, symbol: 'Li', name: 'Lithium', group: 'alkali', mass: '6.94' },
  4: { number: 4, symbol: 'Be', name: 'Beryllium', group: 'alkaline', mass: '9.012' },
  5: { number: 5, symbol: 'B', name: 'Boron', group: 'metalloid', mass: '10.81' },
  6: { number: 6, symbol: 'C', name: 'Carbon', group: 'nonmetal', mass: '12.01' },
  7: { number: 7, symbol: 'N', name: 'Nitrogen', group: 'nonmetal', mass: '14.00' },
  8: { number: 8, symbol: 'O', name: 'Oxygen', group: 'nonmetal', mass: '15.99' },
  9: { number: 9, symbol: 'F', name: 'Fluorine', group: 'halogen', mass: '18.99' },
  10: { number: 10, symbol: 'Ne', name: 'Neon', group: 'noble', mass: '20.18' },
  // ... Adding key elements mentioned in the prompt
  11: { number: 11, symbol: 'Na', name: 'Sodium', group: 'alkali', mass: '22.99' },
  12: { number: 12, symbol: 'Mg', name: 'Magnesium', group: 'alkaline', mass: '24.30' },
  13: { number: 13, symbol: 'Al', name: 'Aluminium', group: 'post-transition', mass: '26.98' },
  14: { number: 14, symbol: 'Si', name: 'Silicon', group: 'metalloid', mass: '28.08' },
  15: { number: 15, symbol: 'P', name: 'Phosphorus', group: 'nonmetal', mass: '30.97' },
  16: { number: 16, symbol: 'S', name: 'Sulfur', group: 'nonmetal', mass: '32.06' },
  17: { number: 17, symbol: 'Cl', name: 'Chlorine', group: 'halogen', mass: '35.45' },
  18: { number: 18, symbol: 'Ar', name: 'Argon', group: 'noble', mass: '39.95' },
  19: { number: 19, symbol: 'K', name: 'Potassium', group: 'alkali', mass: '39.09' },
  20: { number: 20, symbol: 'Ca', name: 'Calcium', group: 'alkaline', mass: '40.08' },
  // Transition
  21: { number: 21, symbol: 'Sc', name: 'Scandium', group: 'transition', mass: '44.96' },
  22: { number: 22, symbol: 'Ti', name: 'Titanium', group: 'transition', mass: '47.87' },
  26: { number: 26, symbol: 'Fe', name: 'Iron', group: 'transition', mass: '55.85' },
  29: { number: 29, symbol: 'Cu', name: 'Copper', group: 'transition', mass: '63.55' },
  30: { number: 30, symbol: 'Zn', name: 'Zinc', group: 'transition', mass: '65.38' },
  47: { number: 47, symbol: 'Ag', name: 'Silver', group: 'transition', mass: '107.87' },
  79: { number: 79, symbol: 'Au', name: 'Gold', group: 'transition', mass: '196.97' },
  80: { number: 80, symbol: 'Hg', name: 'Mercury', group: 'transition', mass: '200.59' },
  // Heavy
  82: { number: 82, symbol: 'Pb', name: 'Lead', group: 'post-transition', mass: '207.2' },
  86: { number: 86, symbol: 'Rn', name: 'Radon', group: 'noble', mass: '222' },
  92: { number: 92, symbol: 'U', name: 'Uranium', group: 'actinide', mass: '238.03' },
  118: { number: 118, symbol: 'Og', name: 'Oganesson', group: 'noble', mass: '294' },
};

const GROUPS = ['alkali', 'alkaline', 'transition', 'post-transition', 'metalloid', 'nonmetal', 'halogen', 'noble', 'lanthanide', 'actinide'];
const NAMES = [
  "", "Hydrogen", "Helium", "Lithium", "Beryllium", "Boron", "Carbon", "Nitrogen", "Oxygen", "Fluorine", "Neon",
  "Sodium", "Magnesium", "Aluminium", "Silicon", "Phosphorus", "Sulfur", "Chlorine", "Argon", "Potassium", "Calcium",
  "Scandium", "Titanium", "Vanadium", "Chromium", "Manganese", "Iron", "Cobalt", "Nickel", "Copper", "Zinc",
  "Gallium", "Germanium", "Arsenic", "Selenium", "Bromine", "Krypton", "Rubidium", "Strontium", "Yttrium", "Zirconium",
  "Niobium", "Molybdenum", "Technetium", "Ruthenium", "Rhodium", "Palladium", "Silver", "Cadmium", "Indium", "Tin",
  "Antimony", "Tellurium", "Iodine", "Xenon", "Cesium", "Barium", "Lanthanum", "Cerium", "Praseodymium", "Neodymium",
  "Promethium", "Samarium", "Europium", "Gadolinium", "Terbium", "Dysprosium", "Holmium", "Erbium", "Thulium", "Ytterbium",
  "Lutetium", "Hafnium", "Tantalum", "Tungsten", "Rhenium", "Osmium", "Iridium", "Platinum", "Gold", "Mercury",
  "Thallium", "Lead", "Bismuth", "Polonium", "Astatine", "Radon", "Francium", "Radium", "Actinium", "Thorium",
  "Protactinium", "Uranium", "Neptunium", "Plutonium", "Americium", "Curium", "Berkelium", "Californium", "Einsteinium", "Fermium",
  "Mendelevium", "Nobelium", "Lawrencium", "Rutherfordium", "Dubnium", "Seaborgium", "Bohrium", "Hassium", "Meitnerium", "Darmstadtium",
  "Roentgenium", "Copernicium", "Nihonium", "Flerovium", "Moscovium", "Livermorium", "Tennessine", "Oganesson"
];
const SYMBOLS = [
  "", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne",
  "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca",
  "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
  "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr",
  "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn",
  "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd",
  "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb",
  "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg",
  "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th",
  "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm",
  "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds",
  "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"
];

// --- Electron Configuration Logic ---
const ORBITALS = [
  { name: '1s', cap: 2 },
  { name: '2s', cap: 2 },
  { name: '2p', cap: 6 },
  { name: '3s', cap: 2 },
  { name: '3p', cap: 6 },
  { name: '4s', cap: 2 },
  { name: '3d', cap: 10 },
  { name: '4p', cap: 6 },
  { name: '5s', cap: 2 },
  { name: '4d', cap: 10 },
  { name: '5p', cap: 6 },
  { name: '6s', cap: 2 },
  { name: '4f', cap: 14 },
  { name: '5d', cap: 10 },
  { name: '6p', cap: 6 },
  { name: '7s', cap: 2 },
  { name: '5f', cap: 14 },
  { name: '6d', cap: 10 },
  { name: '7p', cap: 6 },
];

const NOBLES = [
  { num: 86, sym: '[Rn]' },
  { num: 54, sym: '[Xe]' },
  { num: 36, sym: '[Kr]' },
  { num: 18, sym: '[Ar]' },
  { num: 10, sym: '[Ne]' },
  { num: 2, sym: '[He]' },
];

const EXCEPTIONS: Record<number, string> = {
  24: "[Ar] 3d⁵ 4s¹",
  29: "[Ar] 3d¹⁰ 4s¹",
  41: "[Kr] 4d⁴ 5s¹",
  42: "[Kr] 4d⁵ 5s¹",
  44: "[Kr] 4d⁷ 5s¹",
  45: "[Kr] 4d⁸ 5s¹",
  46: "[Kr] 4d¹⁰",
  47: "[Kr] 4d¹⁰ 5s¹",
  57: "[Xe] 5d¹ 6s²",
  78: "[Xe] 4f¹⁴ 5d⁹ 6s¹",
  79: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹",
  118: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶" 
};

// Map numbers to superscript characters
const toSuper = (num: number) => {
  const map: Record<string, string> = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
  return num.toString().split('').map(d => map[d] || d).join('');
};

const getElectronConfiguration = (z: number): string => {
  if (EXCEPTIONS[z]) return EXCEPTIONS[z];
  if (z === 1) return '1s¹';

  let remaining = z;
  let config = '';
  
  // Find nearest noble gas below z
  let noble = null;
  for (const n of NOBLES) {
    if (z > n.num) {
      noble = n;
      break;
    }
  }

  let startIdx = 0;
  if (noble) {
    config += noble.sym + ' ';
    remaining -= noble.num;
    if (noble.sym === '[He]') startIdx = 1; // skip 1s
    if (noble.sym === '[Ne]') startIdx = 3; // skip 1s 2s 2p
    if (noble.sym === '[Ar]') startIdx = 5;
    if (noble.sym === '[Kr]') startIdx = 8;
    if (noble.sym === '[Xe]') startIdx = 11;
    if (noble.sym === '[Rn]') startIdx = 15;
  }

  for (let i = startIdx; i < ORBITALS.length; i++) {
    if (remaining <= 0) break;
    const orbital = ORBITALS[i];
    const fill = Math.min(remaining, orbital.cap);
    config += `${orbital.name}${toSuper(fill)} `;
    remaining -= fill;
  }

  return config.trim();
};

export const getElement = (n: number): ElementData => {
  const base = ELEMENTS[n] || {
    number: n,
    symbol: SYMBOLS[n] || '?',
    name: NAMES[n] || 'Unknown',
    group: GROUPS[n % GROUPS.length],
    mass: (n * 2).toString()
  };
  
  return {
    ...base,
    configuration: getElectronConfiguration(n)
  };
};

export const GROUP_COLORS: Record<string, string> = {
  'alkali': 'bg-red-500 border-red-700 text-white',
  'alkaline': 'bg-orange-400 border-orange-600 text-white',
  'transition': 'bg-yellow-500 border-yellow-700 text-white',
  'post-transition': 'bg-green-400 border-green-600 text-white',
  'metalloid': 'bg-teal-500 border-teal-700 text-white',
  'nonmetal': 'bg-blue-400 border-blue-600 text-white',
  'halogen': 'bg-indigo-500 border-indigo-700 text-white',
  'noble': 'bg-purple-500 border-purple-700 text-white',
  'lanthanide': 'bg-pink-400 border-pink-600 text-white',
  'actinide': 'bg-rose-500 border-rose-700 text-white',
  'unknown': 'bg-gray-500 border-gray-700 text-white'
};