export type PdfPage = { page: number; text: string };

export async function extractPdfPages(buffer: ArrayBuffer): Promise<PdfPage[]> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer), disableWorker: true });
  const pdf = await loadingTask.promise;
  const pages: PdfPage[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    pages.push({ page: pageNumber, text });
  }

  return pages;
}
