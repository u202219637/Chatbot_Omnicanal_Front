import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Renderiza Markdown ligero (negrita, bullets, headers cortos) dentro de
 * burbujas de chat. El backend genera Markdown real para el canal WEB,
 * pero Angular no lo interpreta por defecto — sin este pipe, el texto se
 * ve plano con asteriscos y guiones crudos en vez de negrita/listas reales.
 */
@Pipe({ name: 'linebreak', standalone: true })
export class LinebreakPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    let texto = value
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const lineas = texto.split('\n');
    const html: string[] = [];
    let dentroDeLista = false;

    const cerrarListaSiAbierta = () => {
      if (dentroDeLista) { html.push('</ul>'); dentroDeLista = false; }
    };

    for (let linea of lineas) {
      const lineaTrim = linea.trim();

      const headerMatch = lineaTrim.match(/^#{1,3}\s+(.*)$/);
      if (headerMatch) {
        cerrarListaSiAbierta();
        html.push(`<strong class="chat-md-header">${headerMatch[1]}</strong><br>`);
        continue;
      }

      const bulletMatch = lineaTrim.match(/^[-•]\s+(.*)$/);
      if (bulletMatch) {
        if (!dentroDeLista) { html.push('<ul class="chat-md-list">'); dentroDeLista = true; }
        html.push(`<li>${bulletMatch[1]}</li>`);
        continue;
      }

      cerrarListaSiAbierta();

      if (lineaTrim === '') {
        html.push('<br>');
      } else {
        html.push(linea + '<br>');
      }
    }
    cerrarListaSiAbierta();

    let resultado = html.join('');
    resultado = resultado.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    resultado = resultado
      .replace(/(<br>)+(<ul)/g, '$2')
      .replace(/(<\/ul>)(<br>)+/g, '$1')
      .replace(/(<br>)+$/g, '');

    return this.sanitizer.bypassSecurityTrustHtml(resultado);
  }
}