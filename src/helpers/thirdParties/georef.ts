import {toTitleCase} from "../formatting";

// https://datosgobar.github.io/georef-ar-api/
interface ArgentinaLocalidades {
    cantidad: number,
    localidades: {
        id: string,
        nombre: string
    }[]
}

interface ArgentinaProvincias {
    cantidad: number,
    provincias: {
        nombre: string,
        id: string
    }[]
}

export const getProvinces = async () => {
    const response = await fetch('https://apis.datos.gob.ar/georef/api/provincias?campos=nombre')
    const {provincias} = await response.json() as ArgentinaProvincias
    return provincias.map(province => province.nombre).sort()
}
export const getCities = async (province: string) => {
    const encodedProvince = encodeURIComponent(province)
    const response = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${encodedProvince}&max=2000&campos=nombre`)
    const data = await response.json() as ArgentinaLocalidades
    return (data.localidades.map(localidad => toTitleCase(localidad.nombre))).sort()
}