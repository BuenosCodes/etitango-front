export const GENDER_CHOICES = [
  { value: 'M', label: 'Hombre' },
  { value: 'F', label: 'Mujer' },
  { value: 'O', label: 'Otres' }
];

export const STATUS_CHOICES = [
  { value: 'W', label: 'En lista de espera' },
  { value: 'E', label: 'Pendiente de aprobación' },
  { value: 'A', label: 'Inscripto' }
];
export const DNI_TYPE_CHOICES = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CI-', label: 'CI-' },
  { value: 'PAS', label: 'PASAPORTE' }
];

export const ROL_CHOICES = [
  { value: 'L', label: 'Lidera' },
  { value: 'F', label: 'Sigue' },
  { value: 'A', label: 'Indistinto' }
];

export const TRANSPORTATION_CHOICES = [
  { value: 'A', label: 'Auto' },
  { value: 'B', label: 'Colectivo' },
  { value: 'V', label: 'Avión' },
  { value: 'C', label: 'Combi' },
  { value: 'O', label: 'Otro' }
];

export const CELIAC_CHOICES = [
  { value: true, label: 'Sí' },
  { value: false, label: 'No' }
];

export const getLabelForValue = (constantsObject, value) =>
  constantsObject?.find((key) => key.value === value)?.label;
