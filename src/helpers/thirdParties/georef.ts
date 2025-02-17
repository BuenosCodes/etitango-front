import { toTitleCase } from '../formatting';

// https://datosgobar.github.io/georef-ar-api/
interface ArgentinaLocalidadesDatosGobAr {
  cantidad: number;
  localidades: {
    id: string;
    nombre: string;
  }[];
}

interface ArgentinaProvinciasDatosGobAr {
  cantidad: number;
  provincias: {
    nombre: string;
    id: string;
  }[];
}

// https://github.com/juanifioren/argentina-states-cities/tree/master
export interface ArgentinaProvinciaLocal {
  code: string;
  name: string;
}

const ProvinciasMap : { [id: string] : string;  } = {
  "Capital Federal": "CAB",
  "Buenos Aires": "BSA",
  "Catamarca": "CAT",
  "Córdoba": "COR",
  "Corrientes": "CRR",
  "Chaco": "CHA",
  "Chubut": "CHU",
  "Entre Ríos": "ENT",
  "Formosa": "FOR",
  "Jujuy": "JUJ",
  "La Pampa": "PAM",
  "La Rioja": "RIO",
  "Mendoza": "MEN",
  "Misiones": "MIS",
  "Neuquén": "NEU",
  "Río Negro": "RNE",
  "Salta": "SAL",
  "San Juan": "SJU",
  "San Luis": "SLU",
  "Santa Cruz": "SCR",
  "Santa Fe": "SFE",
  "Santiago del Estero": "SDE",
  "Tierra del Fuego": "TDF",
  "Tucumán": "TUC"
};

export const getProvincesDatosGobAr = async () => {
  const response = await fetch('https://apis.datos.gob.ar/georef/api/provincias?campos=nombre');
  const { provincias } = (await response.json()) as ArgentinaProvinciasDatosGobAr;
  return (provincias || []).map((province) => province.nombre).sort();
};
export const getCitiesDatosGobAr = async (province: string) => {
  const encodedProvince = encodeURIComponent(province);
  const response = await fetch(
    `https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodedProvince}&max=2000&campos=nombre`
  );
  const data = (await response.json()) as ArgentinaLocalidadesDatosGobAr;
  return (data?.localidades || []).map((localidad) => toTitleCase(localidad.nombre)).sort();
};

export const getProvinces = async () => {
  const response = await fetch('/data/argentina_states.json');
  const provincias  = (await response.json()) as ArgentinaProvinciaLocal[];
  return (provincias || []).map((province) => province.name).sort();
}

export const getCities = async (province: string) => {
  const code = ProvinciasMap[province];
  const response = await fetch(
    `/data/argentina_localities_${code}.json`
  );
  const localidades = (await response.json()) as string[];
  return localidades
}
