import { Api } from '@/api';
import type { Address } from '@/types';
import React, { useEffect, useState } from 'react';
import { AddressInput } from '../ui';
import { geocodeAddress } from '@/utils/geocode';
import { useToastError } from '@/hooks/useToastError';
import { AddressBlock } from '../shared';

interface AddressSelectorProps {
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number | null) => void;
  className?: string;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({selectedAddressId, setSelectedAddressId, className }) => {
  const toastError = useToastError();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [pendingAddressInput, setPendingAddressInput] = useState('');
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    Api.addresses
      .getAll()
      .then((list) => {
        setAddresses(list);
        if (list.length > 0) setSelectedAddressId(list[0].id);
      })
      .catch(() => {});
      // eslint-disable-next-line
  }, []);

  const handleSelectAddress = (address: string, lat: number, lng: number) => {
    setPendingAddressInput(address);
    setPendingCoords({ lat, lng });
  };
  const handleCancelAdd = () => {
    setIsAddingAddress(false);
  };
  const handleSaveAddress = async () => {
    const trimmed = pendingAddressInput.trim();
    if (!trimmed) return;
    let { lat, lng } = pendingCoords ?? { lat: 0, lng: 0 };
    if (!pendingCoords) {
      try {
        const coords = await geocodeAddress(trimmed);
        lat = coords.lat;
        lng = coords.lng;
      } catch {
        lat = 0;
        lng = 0;
      }
    }
    try {
      const newAddr = await Api.addresses.create({
        label: trimmed,
        lat,
        lng,
      });
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
      setIsAddingAddress(false);
    } catch {
      toastError('сохранении адреса');
    }
  };

  const handleAddNew = () => {
    setIsAddingAddress(true);
    setPendingAddressInput('');
    setPendingCoords(null);
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await Api.addresses.remove(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (selectedAddressId === id) {
        const remaining = addresses.filter((a) => a.id !== id);
        const first = remaining[0];
        if (first) {
          setSelectedAddressId(first.id);
        } else {
          handleAddNew();
        }
      }
    } catch {
      toastError('удалении адреса');
    }
  };
  return (
    <div className={className}>
      <h2 className="text-sm font-semibold text-muted mb-2.5">Адрес доставки</h2>

      {isAddingAddress ? (
        <div className="flex flex-col gap-3">
          <AddressInput
            value={pendingAddressInput}
            onChange={(v) => {
              setPendingAddressInput(v);
              setPendingCoords(null);
            }}
            onSelectAddress={handleSelectAddress}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancelAdd}
              className="flex-1 py-3 rounded-xl border-2 border-line text-sm font-medium text-muted bg-surface hover:border-muted transition-all duration-200 cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSaveAddress}
              disabled={!pendingAddressInput.trim()}
              className="flex-1 py-3 rounded-xl border-2 border-primary bg-primary text-sm font-medium text-on-primary hover:bg-primary-hover transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Сохранить
            </button>
          </div>
        </div>
      ) : (
        <AddressBlock
          addresses={addresses}
          selectedId={selectedAddressId ?? -1}
          onSelect={setSelectedAddressId}
          onAddNew={handleAddNew}
          onDelete={handleDeleteAddress}
        />
      )}
    </div>
  );
};

export { AddressSelector };
