/**
 * Экспорт данных в CSV-файл и скачивание в браузере.
 */
export function exportToCsv(filename: string, headers: string[], rows: string[][]): void {
  const csvContent = [
    headers.join(';'),
    ...rows.map((row) => row.join(';')),
  ].join('\n');

  // BOM для корректного отображения кириллицы в Excel
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
