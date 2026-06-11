// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Input Sanitization Pipe
// Strips XSS vectors, SQL injection markers from all string inputs
// Register globally in main.ts
// ══════════════════════════════════════════════════════════════

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' || metadata.type === 'query' || metadata.type === 'param') {
      return this.sanitize(value);
    }
    return value;
  }

  private sanitize(value: any): any {
    if (value === null || value === undefined) return value;
    if (typeof value === 'string') return this.sanitizeString(value);
    if (Array.isArray(value)) return value.map(v => this.sanitize(v));
    if (typeof value === 'object') {
      const clean: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        clean[this.sanitizeString(k)] = this.sanitize(v);
      }
      return clean;
    }
    return value;
  }

  private sanitizeString(str: string): string {
    return str
      // Strip HTML tags
      .replace(/<[^>]*>/g, '')
      // Encode HTML entities
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      // Strip null bytes
      .replace(/\0/g, '')
      // Limit length (10KB max per string field)
      .slice(0, 10240)
      .trim();
  }
}
