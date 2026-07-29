const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const hours = d.getHours();
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours < 12 ? 'AM' : 'PM';
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${d.getDate()} ${MESES[d.getMonth()]}, ${h12}:${minutes} ${ampm}`;
}

export function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  return `${meses[d.getMonth()]} ${d.getFullYear()}`;
}

export function daysUntil(iso: string): number {
  const now = new Date();
  const target = new Date(iso);
  const diffMs = target.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  return Math.round(diffMs / (24 * 3600 * 1000));
}

export const CATEGORY_LABELS: Record<string, string> = {
  formula: 'Fórmulas',
  analisis: 'Análisis',
  imagen: 'Imágenes',
  otro: 'Otros',
};
