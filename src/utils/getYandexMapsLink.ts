export function getYandexMapLink(lat: number, lon: number): string {
  return `https://yandex.ru/maps/?pt=${lon},${lat}&z=16&l=map`;
}
