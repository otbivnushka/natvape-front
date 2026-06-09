import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '@/api';
import { MapBlock } from '@/components/shared';
import { Input, Spinner } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

const AdminPickup: React.FC = () => {
  const navigate = useNavigate();
  const [label, setLabel] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleMapClick = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  const handleSubmit = async () => {
    if (!label.trim() || lat === null || lng === null) return;
    setSaving(true);
    try {
      await Api.admin.createPickup({ label: label.trim(), lat, lng });
      navigate('/admin/pickups');
    } catch {
      /* silent */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/admin/pickups')}
            className="p-2 border border-line rounded-lg text-muted cursor-pointer hover:text-body hover:border-muted transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-primary">Новая точка самовывоза</h1>
        </div>

        <div className="bg-surface rounded-xl p-5 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-muted mb-1.5">Название</label>
            <Input
              placeholder="Например: ТЦ Сentral, 1 этаж"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted mb-1.5">
              Точка на карте {lat !== null && `(${lat.toFixed(4)}, ${lng?.toFixed(4)})`}
            </label>
            <MapBlock
              lat={lat ?? undefined}
              lng={lng ?? undefined}
              onMapClick={handleMapClick}
              markerTitle={label || 'Новая точка'}
              className="h-60"
            />
            <p className="text-xs text-dim mt-1">Кликните по карте, чтобы установить метку</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!label.trim() || lat === null || lng === null || saving}
            className="w-full py-2.5 px-4 border-none rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {saving ? <Spinner /> : 'Создать точку'}
          </button>
        </div>
      </div>
    </div>
  );
};

export { AdminPickup };
