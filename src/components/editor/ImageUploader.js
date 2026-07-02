'use client';

import { useState, useRef, useCallback } from 'react';
import { Box, Typography, IconButton, CircularProgress, Tooltip } from '@mui/material';
import { colors } from '../../theme/theme';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function ImageUploader({ value, onChange, label = 'تصویر', height = 160, hint = '' }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در آپلود');
      onChange(data.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    setError('');
  };

  return (
    <Box>
      {label && (
        <Typography sx={{ fontSize: '0.78rem', color: colors.primary, fontWeight: 'bold', mb: 0.8 }}>
          {label}
        </Typography>
      )}

      <Box
        onClick={() => !uploading && !value && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        sx={{
          position: 'relative',
          height,
          borderRadius: '16px',
          border: `2px dashed ${error ? '#ff6b6b' : dragging ? colors.gold : value ? 'transparent' : 'rgba(197,165,108,0.35)'}`,
          bgcolor: dragging ? 'rgba(197,165,108,0.08)' : value ? 'transparent' : 'rgba(197,165,108,0.03)',
          cursor: value || uploading ? 'default' : 'pointer',
          overflow: 'hidden',
          transition: 'all 0.2s',
          '&:hover': !value && !uploading ? { borderColor: colors.gold, bgcolor: 'rgba(197,165,108,0.07)' } : {},
        }}
      >
        {/* Preview image */}
        {value && !uploading && (
          <>
            <Box
              component="img"
              src={value}
              alt="preview"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px', display: 'block' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            {/* Overlay on hover */}
            <Box sx={{
              position: 'absolute', inset: 0, borderRadius: '14px',
              bgcolor: 'rgba(0,0,0,0)', transition: 'bgcolor 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.45)' },
              '&:hover .img-actions': { opacity: 1 },
            }}>
              <Box className="img-actions" sx={{ opacity: 0, transition: 'opacity 0.2s', display: 'flex', gap: 1 }}>
                <Tooltip title="تغییر تصویر">
                  <IconButton onClick={() => inputRef.current?.click()}
                    sx={{ bgcolor: 'white', color: colors.primary, '&:hover': { bgcolor: colors.gold, color: 'white' } }}>
                    <CloudUploadIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="حذف تصویر">
                  <IconButton onClick={handleRemove}
                    sx={{ bgcolor: 'white', color: '#ff6b6b', '&:hover': { bgcolor: '#ff6b6b', color: 'white' } }}>
                    <DeleteIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            {/* Success badge */}
            <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(76,175,80,0.9)', borderRadius: '20px', px: 1, py: 0.3, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 12, color: 'white' }} />
              <Typography sx={{ fontSize: '0.65rem', color: 'white', fontWeight: 'bold' }}>آپلود شد</Typography>
            </Box>
          </>
        )}

        {/* Upload in progress */}
        {uploading && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
            <CircularProgress size={36} sx={{ color: colors.gold }} />
            <Typography sx={{ fontSize: '0.82rem', color: colors.primary, fontWeight: 'bold' }}>در حال آپلود...</Typography>
          </Box>
        )}

        {/* Empty state */}
        {!value && !uploading && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: 'rgba(197,165,108,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {dragging ? (
                <CloudUploadIcon sx={{ fontSize: 26, color: colors.gold }} />
              ) : (
                <ImageIcon sx={{ fontSize: 26, color: 'rgba(197,165,108,0.6)' }} />
              )}
            </Box>
            <Typography sx={{ fontSize: '0.82rem', color: colors.primary, fontWeight: 'bold' }}>
              {dragging ? 'رها کنید...' : 'کلیک کنید یا فایل را بکشید'}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: colors.dark, opacity: 0.5 }}>
              {hint || 'JPG, PNG, WEBP — حداکثر ۵ مگابایت'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Error message */}
      {error && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.8 }}>
          <ErrorIcon sx={{ fontSize: 14, color: '#ff6b6b' }} />
          <Typography sx={{ fontSize: '0.72rem', color: '#ff6b6b' }}>{error}</Typography>
        </Box>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
}