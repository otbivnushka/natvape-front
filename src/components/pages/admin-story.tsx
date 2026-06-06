import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '@/api';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { Input, ImageUpload } from '@/components/ui';
import { useAdminGuard } from '@/hooks/useAdminGuard';

interface SlideForm {
  imageId: number | null;
  duration: number;
  heading: string;
  subtitle: string;
}

const emptySlide = (): SlideForm => ({
  imageId: null,
  duration: 3000,
  heading: '',
  subtitle: '',
});

const AdminStory = () => {
  const navigate = useNavigate();
  useAdminGuard();

  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [imageId, setImageId] = useState<number | null>(null);
  const [slides, setSlides] = useState<SlideForm[]>([emptySlide()]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Api.admin.createStorySet({
        title,
        imageId: imageId!,
        stories: slides.map((s) => ({
          imageId: s.imageId!,
          duration: s.duration,
          ...(s.heading || s.subtitle
            ? { title: s.heading || undefined, subtitle: s.subtitle || undefined }
            : {}),
        })),
      });
      navigate('/admin/stories');
    } catch {
      /* silent */
    } finally {
      setSaving(false);
    }
  };

  const addSlide = () => setSlides((prev) => [...prev, emptySlide()]);
  const removeSlide = (i: number) => setSlides((prev) => prev.filter((_, idx) => idx !== i));
  const updateSlide = (i: number, patch: Partial<SlideForm>) =>
    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-2xl mx-auto px-4 pb-20 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">Создать историю</h1>
          <button
            onClick={() => navigate('/admin/stories')}
            className="flex items-center gap-1.5 py-1.5 px-3 border border-line rounded-lg bg-surface text-sm text-muted cursor-pointer hover:bg-page transition-colors"
          >
            <ArrowLeft size={14} />
            Назад
          </button>
        </div>

        <div className="bg-surface rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-muted mb-4">Основная информация</h2>
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <ImageUpload value={imageId} previewUrl="" onChange={setImageId} />
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted">Слайды ({slides.length})</h2>
            <button
              onClick={addSlide}
              className="flex items-center gap-1 py-1.5 px-3 border-none rounded-lg bg-primary text-on-primary text-xs font-semibold cursor-pointer hover:opacity-85 transition-all"
            >
              <Plus size={12} />
              Добавить слайд
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {slides.map((slide, i) => (
              <div key={i} className="bg-page rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted">Слайд #{i + 1}</span>
                  <button
                    onClick={() => removeSlide(i)}
                    className="p-1 rounded text-muted cursor-pointer hover:text-red-500 transition-colors"
                    disabled={slides.length <= 1}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <ImageUpload
                    value={slide.imageId}
                    previewUrl=""
                    onChange={(imageId) => updateSlide(i, { imageId })}
                  />

                  <Input
                    type="number"
                    placeholder="Длительность (мс)"
                    value={slide.duration || ''}
                    onChange={(e) => updateSlide(i, { duration: Number(e.target.value) })}
                  />

                  <div className="border-t border-line pt-3 mt-1">
                    <p className="text-[11px] font-semibold text-dim mb-2">
                      Заголовок (опционально)
                    </p>
                    <div className="flex flex-col gap-2">
                      <Input
                        placeholder="Заголовок"
                        value={slide.heading}
                        onChange={(e) => updateSlide(i, { heading: e.target.value })}
                      />
                      <Input
                        placeholder="Подзаголовок"
                        value={slide.subtitle}
                        onChange={(e) => updateSlide(i, { subtitle: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !title || imageId == null || slides.some((s) => s.imageId == null)}
          className="w-full py-3 border-none rounded-xl bg-primary text-on-primary text-sm font-semibold cursor-pointer hover:opacity-85 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : null}
          {saving ? 'Сохранение...' : 'Создать историю'}
        </button>
      </div>
    </div>
  );
};

export { AdminStory };
