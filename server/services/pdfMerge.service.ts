import fs from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { uploadsPath } from './storage.service.ts';

interface MergeableDocument {
  storage_path: string;
  mime_type: string;
  title: string;
}

/**
 * Combina documentos (PDFs y/o imágenes) en un único PDF, en el orden dado.
 * Las imágenes (incluido HEIC de cámara de iPhone) se normalizan a JPEG con sharp
 * antes de embeberlas, porque pdf-lib no soporta HEIC directamente.
 */
export async function mergeDocumentsToPdf(docs: MergeableDocument[]): Promise<Buffer> {
  const merged = await PDFDocument.create();

  for (const doc of docs) {
    try {
      const bytes = await fs.readFile(uploadsPath(doc.storage_path));

      if (doc.mime_type === 'application/pdf') {
        const src = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(src, src.getPageIndices());
        for (const page of pages) merged.addPage(page);
        continue;
      }

      const jpegBytes = await sharp(bytes).rotate().jpeg({ quality: 90 }).toBuffer();
      const image = await merged.embedJpg(jpegBytes);
      const page = merged.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    } catch (cause) {
      // Un archivo corrupto o ilegible no debe tumbar el proceso ni el merge completo —
      // se convierte en un error claro que errorHandler responde como 400.
      const reason = cause instanceof Error ? cause.message : String(cause);
      throw new Error(`No se pudo procesar "${doc.title}" para el paquete de impresión: ${reason}`);
    }
  }

  return Buffer.from(await merged.save());
}
