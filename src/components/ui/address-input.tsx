import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectAddress: (address: string, lat: number, lng: number) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({ value, onChange, onSelectAddress }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<number>(undefined);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleInput = (val: string) => {
    onChange(val);
    clearTimeout(timerRef.current);
    if (!val.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    timerRef.current = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q: `${val}, Витебск`,
          viewbox: '30.0000,55.3000,30.5500,55.0000',
          bounded: '1',
          format: 'jsonv2',
          limit: '5',
        });
        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
          headers: { Accept: 'application/json', 'User-Agent': 'natvape-front/1.0' },
        });
        const data: Suggestion[] = await res.json();
        console.log(data);
        setSuggestions([]); // setSuggestions(data);
        setIsOpen(false); // setIsOpen(data.length > 0);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);
  };

  const handleSelect = (s: Suggestion) => {
    const addr = s.display_name.split(',')[1] + ', ' + s.display_name.split(',')[0];
    console.log(s.display_name);
    onSelectAddress(addr, Number(s.lat), Number(s.lon));
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Введите точный адрес"
        className="w-full bg-surface border-2 border-line rounded-xl p-3 text-sm text-body outline-none transition-all duration-200 focus:border-primary placeholder:text-dim"
      />
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-surface border-2 border-line rounded-xl overflow-auto max-h-50">
          {suggestions.map((s, i) => (
            <button
              key={s.lat + s.lon + i}
              onClick={() => handleSelect(s)}
              className={clsx(
                'w-full px-3 py-2 text-left text-[13px] transition-colors duration-100 cursor-pointer border-none',
                i === 0 && 'rounded-t-xl',
                i === suggestions.length - 1 && 'rounded-b-xl',
                'text-muted hover:bg-page hover:text-body',
              )}
            >
              {s.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { AddressInput };
