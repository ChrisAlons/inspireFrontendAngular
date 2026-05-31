export interface ProcedimientoCatalogo {
  codigo: string;
  nombre: string;
  descripcion: string;
  precioBase: number;
  requierePieza: boolean;
}

export const PROCEDIMIENTOS_CATALOGO: ProcedimientoCatalogo[] = [
  { codigo: 'CONSULTA', nombre: 'Consulta general', descripcion: 'Evaluación clínica inicial', precioBase: 50, requierePieza: false },
  { codigo: 'RADIOGRAFIA', nombre: 'Radiografía periapical', descripcion: 'Radiografía de pieza específica', precioBase: 30, requierePieza: true },
  { codigo: 'RX_PANORAMICA', nombre: 'Radiografía panorámica', descripcion: 'Radiografía panorámica completa', precioBase: 60, requierePieza: false },
  { codigo: 'LIMPIEZA', nombre: 'Limpieza dental', descripcion: 'Profilaxis dental con ultrasonido', precioBase: 80, requierePieza: false },
  { codigo: 'FLUORIZACION', nombre: 'Fluorización', descripcion: 'Aplicación tópica de flúor', precioBase: 40, requierePieza: false },
  { codigo: 'SELLANTE', nombre: 'Sellante de fosas', descripcion: 'Sellante preventivo en fosas y fisuras', precioBase: 50, requierePieza: true },
  { codigo: 'OBTURACION', nombre: 'Obturación con resina', descripcion: 'Restauración directa con resina compuesta', precioBase: 150, requierePieza: true },
  { codigo: 'OBTURACION_TEMP', nombre: 'Obturación temporal', descripcion: 'Restauración temporal con IRM o similar', precioBase: 60, requierePieza: true },
  { codigo: 'RECONTORNEO', nombre: 'Recontorneo dental', descripcion: 'Ajuste de forma dental', precioBase: 80, requierePieza: true },
  { codigo: 'ENDODONCIA', nombre: 'Endodoncia', descripcion: 'Tratamiento de conducto', precioBase: 400, requierePieza: true },
  { codigo: 'RETRATAMIENTO', nombre: 'Retratamiento endodóntico', descripcion: 'Repetición de tratamiento de conducto', precioBase: 500, requierePieza: true },
  { codigo: 'CURETAJE', nombre: 'Curetaje subgingival', descripcion: 'Raspado y alisado radicular por cuadrante', precioBase: 120, requierePieza: true },
  { codigo: 'GINGIVECTOMIA', nombre: 'Gingivectomía', descripcion: 'Cirugía de encía', precioBase: 200, requierePieza: false },
  { codigo: 'EXTRACCION', nombre: 'Extracción simple', descripcion: 'Extracción de pieza dental erupcionada', precioBase: 150, requierePieza: true },
  { codigo: 'EXTRACCION_QX', nombre: 'Extracción quirúrgica', descripcion: 'Extracción de pieza retenida o impactada', precioBase: 300, requierePieza: true },
  { codigo: 'CIRUGIA_3M', nombre: 'Cirugía tercer molar', descripcion: 'Extracción quirúrgica de tercer molar', precioBase: 450, requierePieza: true },
  { codigo: 'CORONA', nombre: 'Corona dental', descripcion: 'Corona de porcelana sobre diente natural', precioBase: 600, requierePieza: true },
  { codigo: 'CORONA_TEMP', nombre: 'Corona temporal', descripcion: 'Corona provisional de acrílico', precioBase: 100, requierePieza: true },
  { codigo: 'PUENTE', nombre: 'Puente fijo', descripcion: 'Prótesis fija sobre dientes pilares', precioBase: 800, requierePieza: false },
  { codigo: 'PROTESIS_REM', nombre: 'Prótesis removible', descripcion: 'Prótesis parcial o total removible', precioBase: 500, requierePieza: false },
  { codigo: 'IMPLANTE', nombre: 'Implante dental', descripcion: 'Colocación de implante de titanio', precioBase: 1200, requierePieza: true },
  { codigo: 'PILAR_IMPLANTE', nombre: 'Pilar de implante', descripcion: 'Colocación de pilar sobre implante', precioBase: 200, requierePieza: true },
  { codigo: 'ORTODONCIA_EVAL', nombre: 'Evaluación ortodóncica', descripcion: 'Diagnóstico y plan de tratamiento ortodóncico', precioBase: 100, requierePieza: false },
  { codigo: 'BRACKETS', nombre: 'Colocación de brackets', descripcion: 'Aparatología fija completa', precioBase: 1500, requierePieza: false },
  { codigo: 'CONTROL_ORTO', nombre: 'Control de ortodoncia', descripcion: 'Ajuste mensual de aparatología', precioBase: 80, requierePieza: false },
  { codigo: 'BLANQUEAMIENTO', nombre: 'Blanqueamiento dental', descripcion: 'Blanqueamiento en consultorio con luz LED', precioBase: 300, requierePieza: false }
];

export interface PiezaDentalCatalogo {
  id: number;
  nombre: string;
  cuadrante: number;
  posicion: number;
  esDeciduo: boolean;
}

export const PIEZAS_DENTALES_CATALOGO: PiezaDentalCatalogo[] = [
  { id: 0, nombre: 'No aplica', cuadrante: 0, posicion: 0, esDeciduo: false },
  { id: 11, nombre: 'Incisivo central (Q1)', cuadrante: 1, posicion: 1, esDeciduo: false },
  { id: 12, nombre: 'Incisivo lateral (Q1)', cuadrante: 1, posicion: 2, esDeciduo: false },
  { id: 13, nombre: 'Canino (Q1)', cuadrante: 1, posicion: 3, esDeciduo: false },
  { id: 14, nombre: 'Primer premolar (Q1)', cuadrante: 1, posicion: 4, esDeciduo: false },
  { id: 15, nombre: 'Segundo premolar (Q1)', cuadrante: 1, posicion: 5, esDeciduo: false },
  { id: 16, nombre: 'Primer molar (Q1)', cuadrante: 1, posicion: 6, esDeciduo: false },
  { id: 17, nombre: 'Segundo molar (Q1)', cuadrante: 1, posicion: 7, esDeciduo: false },
  { id: 18, nombre: 'Tercer molar (Q1)', cuadrante: 1, posicion: 8, esDeciduo: false },
  { id: 21, nombre: 'Incisivo central (Q2)', cuadrante: 2, posicion: 1, esDeciduo: false },
  { id: 22, nombre: 'Incisivo lateral (Q2)', cuadrante: 2, posicion: 2, esDeciduo: false },
  { id: 23, nombre: 'Canino (Q2)', cuadrante: 2, posicion: 3, esDeciduo: false },
  { id: 24, nombre: 'Primer premolar (Q2)', cuadrante: 2, posicion: 4, esDeciduo: false },
  { id: 25, nombre: 'Segundo premolar (Q2)', cuadrante: 2, posicion: 5, esDeciduo: false },
  { id: 26, nombre: 'Primer molar (Q2)', cuadrante: 2, posicion: 6, esDeciduo: false },
  { id: 27, nombre: 'Segundo molar (Q2)', cuadrante: 2, posicion: 7, esDeciduo: false },
  { id: 28, nombre: 'Tercer molar (Q2)', cuadrante: 2, posicion: 8, esDeciduo: false },
  { id: 31, nombre: 'Incisivo central (Q3)', cuadrante: 3, posicion: 1, esDeciduo: false },
  { id: 32, nombre: 'Incisivo lateral (Q3)', cuadrante: 3, posicion: 2, esDeciduo: false },
  { id: 33, nombre: 'Canino (Q3)', cuadrante: 3, posicion: 3, esDeciduo: false },
  { id: 34, nombre: 'Primer premolar (Q3)', cuadrante: 3, posicion: 4, esDeciduo: false },
  { id: 35, nombre: 'Segundo premolar (Q3)', cuadrante: 3, posicion: 5, esDeciduo: false },
  { id: 36, nombre: 'Primer molar (Q3)', cuadrante: 3, posicion: 6, esDeciduo: false },
  { id: 37, nombre: 'Segundo molar (Q3)', cuadrante: 3, posicion: 7, esDeciduo: false },
  { id: 38, nombre: 'Tercer molar (Q3)', cuadrante: 3, posicion: 8, esDeciduo: false },
  { id: 41, nombre: 'Incisivo central (Q4)', cuadrante: 4, posicion: 1, esDeciduo: false },
  { id: 42, nombre: 'Incisivo lateral (Q4)', cuadrante: 4, posicion: 2, esDeciduo: false },
  { id: 43, nombre: 'Canino (Q4)', cuadrante: 4, posicion: 3, esDeciduo: false },
  { id: 44, nombre: 'Primer premolar (Q4)', cuadrante: 4, posicion: 4, esDeciduo: false },
  { id: 45, nombre: 'Segundo premolar (Q4)', cuadrante: 4, posicion: 5, esDeciduo: false },
  { id: 46, nombre: 'Primer molar (Q4)', cuadrante: 4, posicion: 6, esDeciduo: false },
  { id: 47, nombre: 'Segundo molar (Q4)', cuadrante: 4, posicion: 7, esDeciduo: false },
  { id: 48, nombre: 'Tercer molar (Q4)', cuadrante: 4, posicion: 8, esDeciduo: false }
];

export const CARAS_DENTALES_CATALOGO = [
  { codigo: 'VESTIBULAR', nombre: 'Vestibular', abreviatura: 'V' },
  { codigo: 'PALATINO', nombre: 'Palatino', abreviatura: 'P' },
  { codigo: 'LINGUAL', nombre: 'Lingual', abreviatura: 'L' },
  { codigo: 'MESIAL', nombre: 'Mesial', abreviatura: 'M' },
  { codigo: 'DISTAL', nombre: 'Distal', abreviatura: 'D' },
  { codigo: 'OCLUSAL', nombre: 'Oclusal', abreviatura: 'O' },
  { codigo: 'INCISAL', nombre: 'Incisal', abreviatura: 'I' },
  { codigo: 'NO_APLICA', nombre: 'No aplica', abreviatura: 'NA' }
];
