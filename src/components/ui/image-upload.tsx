import React, { useRef, useState, useEffect } from 'react';
import { Api } from '../../api';
import { Upload, Trash2, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: number | null;
  previewUrl?: string;
  onChange: (id: number | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, previewUrl, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'uploaded'>('idle');
  const [uploadedId, setUploadedId] = useState<number | null>(null);
  const [preview, setPreview] = useState(previewUrl ?? '');

  useEffect(() => {
    if (previewUrl) {
      setPreview(previewUrl);
      setStatus(value != null ? 'idle' : 'idle');
    } else if (value == null && !uploadedId) {
      setPreview('');
      setStatus('idle');
    }
  }, [previewUrl]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    try {
      const res = await Api.images.upload(file);
      setUploadedId(res.id);
      setPreview(res.url);
      setStatus('uploaded');
      onChange(res.id);
    } catch {
      setStatus('idle');
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    const idToRemove = uploadedId ?? value;
    if (idToRemove != null) {
      await Api.images.remove(idToRemove);
    }
    setUploadedId(null);
    setPreview('');
    setStatus('idle');
    onChange(null);
  };

  const hasImage = !!preview;

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === 'uploading'}
        className="flex items-center gap-1.5 py-2 px-3 border border-line rounded-lg bg-surface text-sm text-muted cursor-pointer hover:bg-page transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'uploading' ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Upload size={14} />
        )}
        {status === 'uploading' ? 'Загрузка...' : 'Выбрать изображение'}
      </button>

      {hasImage && (
        <img
          src={preview}
          alt="preview"
          className="w-14 h-14 rounded-lg object-cover bg-surface border border-line shrink-0"
        />
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={!hasImage}
        className="flex items-center gap-1.5 py-2 px-3 border border-line rounded-lg text-sm text-muted cursor-pointer hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Trash2 size={14} />
        Удалить
      </button>
    </div>
  );
};

export { ImageUpload };
