import type { ProductForm } from '../types';

export function generateProductDescription(product: ProductForm): string {
  const { name, brand, price, doublePrice, badge, variantLabel, variants, colors } = product;
  const parts: string[] = [];

  parts.push(brand ? `${brand} - ${name}.` : `${name} - `);

  if (badge) parts.push(`Отмечен как "${badge}".`);

  if (variants?.length) {
    const list = variants.map((v) => v.name).join(', ');
    parts.push(`${variantLabel || 'Варианты'}: ${list}.`);
  }

  if (colors?.length) {
    parts.push(`Цвета: ${colors.map((c) => c.name).join(', ')}.`);
  }

  parts.push(doublePrice ? `Цена ${price} BYN (1 + 1 = ${doublePrice} BYN).` : `Цена ${price} BYN.`);

  return parts.join('\n');
}
