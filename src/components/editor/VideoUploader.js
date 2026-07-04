'use client';

import { useState, useRef, useCallback } from 'react';
import { Box, Typography, IconButton, CircularProgress, LinearProgress, Tooltip } from '@mui/material';
import { colors } from '../../theme/theme';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import VideocamIcon from '@mui/icons-material/Videocam';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

export default function VideoUploader({ value, onChange, label = 'ویدیو', hint = '' }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const getAuthToken = () => {
    try {
      const raw = sessionStorage.getItem('aban_admin_session');
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (!session?.token || Date.now() > session.expires) return null;
      return session.token;
    } catch {
      return null;
    }
  };

  const uploadFile = useCallback(async (file) => {
    if (!file) return;
    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use XMLHttpRequest for progress tracking
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');
        const token = getAuthToken();
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            onChange(data.url);
            resolve(data);
          } else {
            let msg = 'خطا در آپلود';
            try { msg = JSON.parse(xhr.responseText).error || msg; } catch {}
            reject(new Error(msg));
          }
        };
        xhr.onerror = () => reject(new Error('خطا در ارتباط با سرور'));
        xhr.send(formData);
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      setProgress(0);
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
          height: 160,
          borderRadius: '16px',
          border: `2px dashed ${error ? '#ff6b6b' : dragging ? colors.gold : value ? 'transparent' : 'rgba(197,165,108,0.35)'}`,
          bgcolor: dragging ? 'rgba(197,165,108,0.08)' : value ? 'rgba(0,0,0,0.02)' : 'rgba(197,165,108,0.03)',
          cursor: value || uploading ? 'default' : 'pointer',
          overflow: 'hidden',
          transition: 'all 0.2s',
          '&:hover': !value && !uploading ? { borderColor: colors.gold, bgcolor: 'rgba(197,165,108,0.07)' } : {},
        }}
      >
        {/* Video preview */}
        {value && !uploading && (
          <>
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <PlayCircleOutlineIcon sx={{ fontSize: 40, color: colors.gold }} />
              <Typography sx={{ fontSize: '0.72rem', color: colors.primary, maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
                {value.split('/').pop()}
              </Typography>
            </Box>
            <Box sx={{
              position: 'absolute', inset: 0, borderRadius: '14px',
              bgcolor: 'rgba(0,0,0,0)', transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.35)' },
              '&:hover .vid-actions': { opacity: 1 },
            }}>
              <Box className="vid-actions" sx={{ opacity: 0, transition: 'opacity 0.2s', display: 'flex', gap: 1 }}>
                <Tooltip title="تغییر ویدیو">
                  <IconButton onClick={() => inputRef.current?.click()}
                    sx={{ bgcolor: 'white', color: colors.primary, '&:hover': { bgcolor: colors.gold, color: 'white' } }}>
                    <CloudUploadIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="حذف ویدیو">
                  <IconButton onClick={handleRemove}
                    sx={{ bgcolor: 'white', color: '#ff6b6b', '&:hover': { bgcolor: '#ff6b6b', color: 'white' } }}>
                    <DeleteIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(76,175,80,0.9)', borderRadius: '20px', px: 1, py: 0.3, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 12, color: 'white' }} />
              <Typography sx={{ fontSize: '0.65rem', color: 'white', fontWeight: 'bold' }}>آپلود شد</Typography>
            </Box>
          </>
        )}

        {/* Upload in progress */}
        {uploading && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, px: 3 }}>
            <CircularProgress size={36} sx={{ color: colors.gold }} />
            <Typography sx={{ fontSize: '0.82rem', color: colors.primary, fontWeight: 'bold' }}>
              در حال آپلود... {progress}%
            </Typography>
            <LinearProgress variant="determinate" value={progress}
              sx={{ width: '100%', borderRadius: 4, bgcolor: 'rgba(197,165,108,0.15)', '& .MuiLinearProgress-bar': { bgcolor: colors.gold } }} />
          </Box>
        )}

        {/* Empty state */}
        {!value && !uploading && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: 'rgba(197,165,108,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {dragging ? (
                <CloudUploadIcon sx={{ fontSize: 26, color: colors.gold }} />
              ) : (
                <VideocamIcon sx={{ fontSize: 26, color: 'rgba(197,165,108,0.6)' }} />
              )}
            </Box>
            <Typography sx={{ fontSize: '0.82rem', color: colors.primary, fontWeight: 'bold' }}>
              {dragging ? 'رها کنید...' : 'کلیک کنید یا فایل را بکشید'}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: colors.dark, opacity: 0.5 }}>
              {hint || 'MP4, WEBM — حداکثر ۲۰۰ مگابایت'}
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
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
}