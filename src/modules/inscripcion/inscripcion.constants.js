export const VALIDATION_RULES = {
  email: {
    required: {
      msg: 'Este campo no puede estar vacío'
    },
    regex: {
      // eslint-disable-next-line
      expression: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      msg: 'Formato de mail inválido'
    }
  },
  name: {
    required: {
      msg: 'Este campo no puede estar vacío'
    },
    maxLength: {
      length: 32,
      msg: 'El nombre debe tener menos de 32 caracteres'
    }
  },
  last_name: {
    required: {
      msg: 'Este campo no puede estar vacío'
    },
    maxLength: {
      length: 32,
      msg: 'El apellido debe tener menos de 32 caracteres'
    }
  },
  dni_number: {
    required: {
      msg: 'Este campo no puede estar vacío'
    },
    maxLength: {
      length: 11,
      msg: 'El dni debe tener menos de 32 caracteres'
    }
  }
}

export const GENDER_CHOICES = [
  { value: 'M', label: 'Hombre' },
  { value: 'F', label: 'Mujer' },
  { value: 'O', label: 'Otres' },
];


export const STATUS_CHOICES = [
  { value: 'W', label: 'En lista de espera' },
  { value: 'E', label: 'Pendiente de aprobación' },
  { value: 'A', label: 'Inscripto' },
];
export const DNI_TYPE_CHOICES = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CI-', label: 'CI-' },
  { value: 'PAS', label: 'PASAPORTE' }
];

export const ROL_CHOICES = [
  { value: 'L', label: 'Lidera' },
  { value: 'F', label: 'Sigue' },
  { value: 'A', label: 'Indistinto' },
];


export const FOOD_CHOICES = [
  { value: 'O', label: 'Omnívora/Carnívora' },
  { value: 'V', label: 'Vegetariana' },
  { value: 'G', label: 'Vegana' }
]

export const TRANSPORTATION_CHOICES = [
  { value: 'A', label: 'Auto' },
  { value: 'B', label: 'Colectivo' },
  { value: 'V', label: 'Avión' },
  { value: 'C', label: 'Combi' },
  { value: 'O', label: 'Otro' }
];


export const HELP_WITH_CHOICES = [
  { value: 'A', label: 'Limpieza del Salon' },
  { value: 'C', label: 'Cocina' },
];