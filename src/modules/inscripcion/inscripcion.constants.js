export const CELIAC_CHOICES = [
  { value: true, label: 'Sí' },
  { value: false, label: 'No' }
];

export const getLabelForValue = (constantsObject, value) =>
  constantsObject?.find((key) => key.value === value)?.label;
