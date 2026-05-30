export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  const params = new URLSearchParams({
    street: address,
    city: 'Витебск',
    countrycodes: 'by',
    viewbox: '30.0000,55.3000,30.5500,55.0000',
    bounded: '1',
    format: 'jsonv2',
    limit: '1',
    addressdetails: '1',
  });

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'natvape-front/1.0',
      },
    });
    const data = await res.json();
    if (data.length > 0) {
      return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
    }
  } catch {
    // fallback
  }

  return { lat: 0, lng: 0 };
}
