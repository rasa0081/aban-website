'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Youtube } from '@tiptap/extension-youtube';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { Typography } from '@tiptap/extension-typography';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Extension } from '@tiptap/core';
import { Box, IconButton, Tooltip, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, Popover } from '@mui/material';
import ImageUploader from './ImageUploader';
import { useState, useCallback, useRef } from 'react';
import { colors } from '../../theme/theme';

// Icons
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import AnchorIcon from '@mui/icons-material/Anchor';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import AddLinkIcon from '@mui/icons-material/AddLink';

const lowlight = createLowlight(common);

// ── Custom Anchor extension ───────────────────────────────────────────────────
const AnchorExtension = Extension.create({
  name: 'anchor',
  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph'],
        attributes: {
          id: {
            default: null,
            parseHTML: el => el.getAttribute('id'),
            renderHTML: attrs => attrs.id ? { id: attrs.id } : {},
          },
        },
      },
    ];
  },
});

// ── Force RTL direction on every block so mixed Persian/English/number text
//    never gets reordered by the browser's bidi algorithm ──────────────────────
const RtlDirExtension = Extension.create({
  name: 'rtlDir',
  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph', 'listItem', 'blockquote', 'tableCell', 'tableHeader'],
        attributes: {
          dir: {
            default: 'rtl',
            // Always force rtl, even if old/pasted HTML had dir="ltr"/"auto" baked in.
            parseHTML: () => 'rtl',
            renderHTML: () => ({ dir: 'rtl' }),
          },
        },
      },
    ];
  },
});

// ── Font size extension ───────────────────────────────────────────────────────
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: el => el.style.fontSize?.replace('px', '') || null,
            renderHTML: attrs => {
              if (!attrs.fontSize) return {};
              return { style: `font-size: ${attrs.fontSize}px` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (size) => ({ chain }) =>
        chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize: () => ({ chain }) =>
        chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

// ── Toolbar Button ────────────────────────────────────────────────────────────
function ToolBtn({ title, onClick, active, disabled, children }) {
  return (
    <Tooltip title={title} arrow>
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          sx={{
            borderRadius: '6px',
            width: 30, height: 30,
            color: active ? colors.gold : 'rgba(255,255,255,0.75)',
            bgcolor: active ? 'rgba(197,165,108,0.2)' : 'transparent',
            '&:hover': { bgcolor: 'rgba(197,165,108,0.15)', color: colors.gold },
            '&:disabled': { opacity: 0.3 },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}

function ToolDivider() {
  return <Box sx={{ width: '1px', height: 22, bgcolor: 'rgba(255,255,255,0.1)', mx: 0.3 }} />;
}

// ── Main Editor ───────────────────────────────────────────────────────────────
export default function RichTextEditor({ value, onChange, placeholder = 'محتوای خود را اینجا بنویسید...' }) {
  const [linkDialog, setLinkDialog] = useState({ open: false, url: '', text: '' });
  const [anchorDialog, setAnchorDialog] = useState({ open: false, id: '' });
  const [imageDialog, setImageDialog] = useState({ open: false, url: '', alt: '' });
  const [youtubeDialog, setYoutubeDialog] = useState({ open: false, url: '' });
  const [tableDialog, setTableDialog] = useState({ open: false, rows: 3, cols: 3 });
  const [colorAnchor, setColorAnchor] = useState(null);
  const [highlightAnchor, setHighlightAnchor] = useState(null);
  const [fontSizeAnchor, setFontSizeAnchor] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        autolink: false,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'editor-link',
          target: null,  // don't add target="_blank" by default
          rel: null,     // don't add rel by default — we set it per link below
        },
        validate: href => true,
      }),
      Image.configure({ resizable: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ width: '100%', height: 360 }),
      CodeBlockLowlight.configure({ lowlight }),
      Typography,
      AnchorExtension,
      RtlDirExtension,
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        dir: 'rtl',
        style: 'outline: none; min-height: 300px; font-family: inherit;',
      },
    },
  });

  // ── Link handler ──
  const openLinkDialog = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href || '';
    const selected = editor.state.selection;
    const text = editor.state.doc.textBetween(selected.from, selected.to) || '';
    setLinkDialog({ open: true, url: prev, text });
  }, [editor]);

  const applyLink = () => {
    if (!editor) return;
    if (linkDialog.url) {
      const href = linkDialog.url;
      // Anchor links and internal links: no new tab
      // External links: open in new tab
      const isAnchor = href.startsWith('#');
      const isInternal = !href.startsWith('http') && !href.startsWith('//');
      const target = (isAnchor || isInternal) ? null : '_blank';
      const rel = target === '_blank' ? 'noopener noreferrer' : null;
      editor.chain().focus().extendMarkRange('link').setLink({ href, target, rel }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setLinkDialog({ open: false, url: '', text: '' });
  };

  // ── Anchor handler ──
  const openAnchorDialog = useCallback(() => {
    if (!editor) return;
    const current = editor.getAttributes('paragraph').id || editor.getAttributes('heading').id || '';
    setAnchorDialog({ open: true, id: current });
  }, [editor]);

  const applyAnchor = () => {
    if (!editor) return;
    const nodeType = editor.isActive('heading') ? 'heading' : 'paragraph';
    editor.chain().focus().updateAttributes(nodeType, { id: anchorDialog.id }).run();
    setAnchorDialog({ open: false, id: '' });
  };

  // ── Image handler ──
  const applyImage = () => {
    if (!editor || !imageDialog.url) return;
    editor.chain().focus().setImage({ src: imageDialog.url, alt: imageDialog.alt }).run();
    setImageDialog({ open: false, url: '', alt: '' });
  };

  const handleImageUpload = async (file) => {
    if (!file || !editor) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
        setImageDialog({ open: false, url: '', alt: '' });
      }
    } catch(e) { console.error(e); }
  };

  // ── YouTube handler ──
  const applyYoutube = () => {
    if (!editor || !youtubeDialog.url) return;
    editor.commands.setYoutubeVideo({ src: youtubeDialog.url });
    setYoutubeDialog({ open: false, url: '' });
  };

  // ── Table handler ──
  const applyTable = () => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: parseInt(tableDialog.rows), cols: parseInt(tableDialog.cols), withHeaderRow: true }).run();
    setTableDialog({ open: false, rows: 3, cols: 3 });
  };

  const TEXT_COLORS = ['#000000','#1a1e24','#c5a56c','#0c2b29','#ffffff','#e53935','#1e88e5','#43a047','#fb8c00','#8e24aa','#00acc1','#f06292'];
  const HIGHLIGHT_COLORS = ['#fff9c4','#c8e6c9','#bbdefb','#f8bbd0','#ffe0b2','#e1bee7','#b2ebf2','rgba(197,165,108,0.3)'];
  const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];
  const HEADINGS = [1, 2, 3, 4, 5, 6];

  if (!editor) return null;

  return (
    <Box sx={{ border: `1px solid rgba(197,165,108,0.3)`, borderRadius: '16px', direction: 'rtl' }}>
      {/* ── Toolbar ── */}
      <Box sx={{
        bgcolor: colors.primary, p: 1, display: 'flex', flexWrap: 'wrap', gap: 0.3, alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 50,
        borderTopLeftRadius: '16px', borderTopRightRadius: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      }}>

        {/* History */}
        <ToolBtn title="بازگشت" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><UndoIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="جلو" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><RedoIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolDivider />

        {/* Headings */}
        {HEADINGS.map(h => (
          <ToolBtn key={h} title={`عنوان ${h}`} active={editor.isActive('heading', { level: h })} onClick={() => editor.chain().focus().toggleHeading({ level: h }).run()}>
            <Box sx={{ fontSize: 11, fontWeight: 'bold', lineHeight: 1 }}>H{h}</Box>
          </ToolBtn>
        ))}
        <ToolDivider />

        {/* Font size */}
        <Tooltip title="اندازه فونت">
          <Box onClick={(e) => setFontSizeAnchor(e.currentTarget)}
            sx={{ cursor: 'pointer', px: 1, height: 30, display: 'flex', alignItems: 'center', borderRadius: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', '&:hover': { bgcolor: 'rgba(197,165,108,0.15)', color: colors.gold } }}>
            Aa
          </Box>
        </Tooltip>
        <Popover open={Boolean(fontSizeAnchor)} anchorEl={fontSizeAnchor} onClose={() => setFontSizeAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
            {FONT_SIZES.map(s => (
              <Box key={s} onClick={() => { editor.chain().focus().setFontSize(s).run(); setFontSizeAnchor(null); }}
                sx={{ px: 1.5, py: 0.5, borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', bgcolor: 'rgba(197,165,108,0.08)', '&:hover': { bgcolor: colors.gold, color: 'white' } }}>
                {s}
              </Box>
            ))}
          </Box>
        </Popover>
        <ToolDivider />

        {/* Basic formatting */}
        <ToolBtn title="پررنگ" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><FormatBoldIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="کج" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalicIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="زیرخط" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlinedIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="خط‌خورده" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><StrikethroughSIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolDivider />

        {/* Colors */}
        <Tooltip title="رنگ متن">
          <Box onClick={(e) => setColorAnchor(e.currentTarget)}
            sx={{ cursor: 'pointer', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', '&:hover': { bgcolor: 'rgba(197,165,108,0.15)' } }}>
            <FormatColorTextIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.75)' }} />
          </Box>
        </Tooltip>
        <Popover open={Boolean(colorAnchor)} anchorEl={colorAnchor} onClose={() => setColorAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <Box sx={{ p: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.8, maxWidth: 200 }}>
            {TEXT_COLORS.map(c => (
              <Box key={c} onClick={() => { editor.chain().focus().setColor(c).run(); setColorAnchor(null); }}
                sx={{ width: 24, height: 24, borderRadius: '6px', bgcolor: c, cursor: 'pointer', border: '2px solid rgba(0,0,0,0.1)', '&:hover': { transform: 'scale(1.2)' }, transition: 'transform 0.15s' }} />
            ))}
            <Box onClick={() => { editor.chain().focus().unsetColor().run(); setColorAnchor(null); }}
              sx={{ px: 1, py: 0.3, borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', border: '1px solid rgba(0,0,0,0.15)', '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}>
              پاک
            </Box>
          </Box>
        </Popover>

        {/* Highlight */}
        <Tooltip title="هایلایت">
          <Box onClick={(e) => setHighlightAnchor(e.currentTarget)}
            sx={{ cursor: 'pointer', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', '&:hover': { bgcolor: 'rgba(197,165,108,0.15)' } }}>
            <BorderColorIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.75)' }} />
          </Box>
        </Tooltip>
        <Popover open={Boolean(highlightAnchor)} anchorEl={highlightAnchor} onClose={() => setHighlightAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <Box sx={{ p: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.8, maxWidth: 200 }}>
            {HIGHLIGHT_COLORS.map(c => (
              <Box key={c} onClick={() => { editor.chain().focus().toggleHighlight({ color: c }).run(); setHighlightAnchor(null); }}
                sx={{ width: 24, height: 24, borderRadius: '6px', bgcolor: c, cursor: 'pointer', border: '2px solid rgba(0,0,0,0.1)', '&:hover': { transform: 'scale(1.2)' }, transition: 'transform 0.15s' }} />
            ))}
            <Box onClick={() => { editor.chain().focus().unsetHighlight().run(); setHighlightAnchor(null); }}
              sx={{ px: 1, py: 0.3, borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', border: '1px solid rgba(0,0,0,0.15)', '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}>
              پاک
            </Box>
          </Box>
        </Popover>
        <ToolDivider />

        {/* Alignment */}
        <ToolBtn title="راست‌چین" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><FormatAlignRightIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="وسط‌چین" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><FormatAlignCenterIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="چپ‌چین" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><FormatAlignLeftIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolDivider />

        {/* Lists */}
        <ToolBtn title="لیست نقطه‌ای" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulletedIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="لیست شماره‌دار" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumberedIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="نقل‌قول" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><FormatQuoteIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="کد" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><CodeIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="خط افقی" onClick={() => editor.chain().focus().setHorizontalRule().run()}><HorizontalRuleIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolDivider />

        {/* Links & Anchors */}
        <ToolBtn title="لینک" active={editor.isActive('link')} onClick={openLinkDialog}><LinkIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="حذف لینک" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')}><LinkOffIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="لنگر (Anchor)" onClick={openAnchorDialog}><AnchorIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolDivider />

        {/* Media */}
        <ToolBtn title="تصویر" onClick={() => setImageDialog({ open: true, url: '', alt: '' })}><ImageIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="ویدیو یوتیوب" onClick={() => setYoutubeDialog({ open: true, url: '' })}><YouTubeIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolBtn title="جدول" onClick={() => setTableDialog({ open: true, rows: 3, cols: 3 })}><TableChartIcon sx={{ fontSize: 16 }} /></ToolBtn>
        <ToolDivider />

        {/* Clear */}
        <ToolBtn title="پاک کردن فرمت" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}><FormatClearIcon sx={{ fontSize: 16 }} /></ToolBtn>
      </Box>

      {/* ── Editor Content ── */}
      <Box sx={{
        p: 2.5, minHeight: 350, bgcolor: 'white', direction: 'rtl',
        borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', overflow: 'hidden',
        '& .ProseMirror': { outline: 'none', minHeight: 300, direction: 'rtl', lineHeight: 1.8, fontFamily: 'inherit' },
        '& .ProseMirror h1': { fontSize: '2rem', fontWeight: 'bold', mb: 1, color: colors.primary },
        '& .ProseMirror h2': { fontSize: '1.6rem', fontWeight: 'bold', mb: 1, color: colors.primary },
        '& .ProseMirror h3': { fontSize: '1.3rem', fontWeight: 'bold', mb: 1, color: colors.primary },
        '& .ProseMirror h4,h5,h6': { fontWeight: 'bold', mb: 0.5, color: colors.primary },
        '& .ProseMirror p': { mb: 1 },
        '& .ProseMirror ul': { paddingRight: '1.5rem', mb: 1 },
        '& .ProseMirror ol': { paddingRight: '1.5rem', mb: 1 },
        '& .ProseMirror blockquote': { borderRight: `4px solid ${colors.gold}`, pr: 2, pl: 0, color: '#555', fontStyle: 'italic', my: 1 },
        '& .ProseMirror pre': { bgcolor: '#1e1e1e', color: '#d4d4d4', p: 2, borderRadius: '8px', overflow: 'auto', mb: 1 },
        '& .ProseMirror code': { bgcolor: 'rgba(0,0,0,0.06)', px: 0.5, borderRadius: '4px', fontSize: '0.9em' },
        '& .ProseMirror a': { color: colors.gold, textDecoration: 'underline', cursor: 'pointer' },
        '& .ProseMirror img': { maxWidth: '100%', borderRadius: '8px', my: 1 },
        '& .ProseMirror table': { borderCollapse: 'collapse', width: '100%', mb: 1 },
        '& .ProseMirror td, & .ProseMirror th': { border: `1px solid rgba(197,165,108,0.3)`, p: '8px 12px', textAlign: 'right' },
        '& .ProseMirror th': { bgcolor: `rgba(197,165,108,0.1)`, fontWeight: 'bold' },
        '& .ProseMirror hr': { border: 'none', borderTop: `2px solid rgba(197,165,108,0.3)`, my: 2 },
        '& .ProseMirror p.is-editor-empty:first-of-type::before': { content: `"${placeholder}"`, color: '#aaa', pointerEvents: 'none', float: 'right' },
        '& .ProseMirror [id]::before': { content: '"⚓ "', fontSize: '0.7em', color: colors.gold, opacity: 0.7 },
      }}>
        <EditorContent editor={editor} />
      </Box>

      {/* ── Dialogs ── */}

      {/* Link Dialog */}
      <Dialog open={linkDialog.open} onClose={() => setLinkDialog({ open: false, url: '', text: '' })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', direction: 'rtl' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: colors.primary, pb: 1 }}>افزودن لینک</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {linkDialog.text && <Box sx={{ p: 1.5, bgcolor: 'rgba(197,165,108,0.08)', borderRadius: '10px', fontSize: '0.85rem' }}>متن انتخاب‌شده: <strong>{linkDialog.text}</strong></Box>}
            <TextField label="آدرس لینک" value={linkDialog.url} onChange={(e) => setLinkDialog(p => ({ ...p, url: e.target.value }))}
              placeholder="https://example.com یا #anchor-id"
              size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
            <Box sx={{ p: 1.5, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: '10px', fontSize: '0.78rem', color: '#666' }}>
              💡 برای لینک داخلی (لنگر) از # استفاده کنید: <code>#my-section</code>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setLinkDialog({ open: false, url: '', text: '' })} sx={{ borderRadius: '10px' }}>لغو</Button>
          <Button onClick={applyLink} variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '10px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>اعمال</Button>
        </DialogActions>
      </Dialog>

      {/* Anchor Dialog */}
      <Dialog open={anchorDialog.open} onClose={() => setAnchorDialog({ open: false, id: '' })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', direction: 'rtl' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: colors.primary, pb: 1 }}>تنظیم لنگر (Anchor)</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="شناسه لنگر (ID)" value={anchorDialog.id} onChange={(e) => setAnchorDialog(p => ({ ...p, id: e.target.value.replace(/\s+/g, '-').toLowerCase() }))}
              placeholder="my-section" size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
            <Box sx={{ p: 1.5, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: '10px', fontSize: '0.78rem', color: '#666', lineHeight: 1.8 }}>
              💡 بعد از تنظیم لنگر، برای لینک دادن به آن از <code>#my-section</code> در فیلد لینک استفاده کنید.<br />
              مثال: کاربر روی لینک کلیک می‌کند و مستقیم به این بخش می‌رود.
            </Box>
            {anchorDialog.id && (
              <Box sx={{ p: 1.5, bgcolor: 'rgba(197,165,108,0.08)', borderRadius: '10px', fontSize: '0.82rem' }}>
                لینک این لنگر: <code style={{ color: colors.gold }}>#{anchorDialog.id}</code>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setAnchorDialog({ open: false, id: '' })} sx={{ borderRadius: '10px' }}>لغو</Button>
          <Button onClick={applyAnchor} variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '10px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>اعمال</Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialog.open} onClose={() => setImageDialog({ open: false, url: '', alt: '' })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', direction: 'rtl' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: colors.primary, pb: 1 }}>افزودن تصویر</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <ImageUploader
              label="آپلود تصویر"
              value={imageDialog.url}
              onChange={(url) => {
                setImageDialog(p => ({ ...p, url }));
                if (editor && url) {
                  editor.chain().focus().setImage({ src: url }).run();
                  setImageDialog({ open: false, url: '', alt: '' });
                }
              }}
              height={150}
            />
            <TextField label="توضیح تصویر (Alt) — اختیاری" value={imageDialog.alt} onChange={(e) => setImageDialog(p => ({ ...p, alt: e.target.value }))}
              size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setImageDialog({ open: false, url: '', alt: '' })} sx={{ borderRadius: '10px' }}>لغو</Button>
        </DialogActions>
      </Dialog>

      {/* YouTube Dialog */}
      <Dialog open={youtubeDialog.open} onClose={() => setYoutubeDialog({ open: false, url: '' })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', direction: 'rtl' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: colors.primary, pb: 1 }}>افزودن ویدیو یوتیوب</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField label="لینک یوتیوب" value={youtubeDialog.url} onChange={(e) => setYoutubeDialog(p => ({ ...p, url: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..." size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setYoutubeDialog({ open: false, url: '' })} sx={{ borderRadius: '10px' }}>لغو</Button>
          <Button onClick={applyYoutube} variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '10px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>افزودن</Button>
        </DialogActions>
      </Dialog>

      {/* Table Dialog */}
      <Dialog open={tableDialog.open} onClose={() => setTableDialog({ open: false, rows: 3, cols: 3 })} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', direction: 'rtl' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: colors.primary, pb: 1 }}>افزودن جدول</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
            <TextField label="تعداد ردیف" type="number" value={tableDialog.rows} onChange={(e) => setTableDialog(p => ({ ...p, rows: e.target.value }))}
              size="small" inputProps={{ min: 1, max: 20 }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
            <TextField label="تعداد ستون" type="number" value={tableDialog.cols} onChange={(e) => setTableDialog(p => ({ ...p, cols: e.target.value }))}
              size="small" inputProps={{ min: 1, max: 10 }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setTableDialog({ open: false, rows: 3, cols: 3 })} sx={{ borderRadius: '10px' }}>لغو</Button>
          <Button onClick={applyTable} variant="contained" sx={{ bgcolor: colors.gold, color: colors.dark, borderRadius: '10px', fontWeight: 'bold', '&:hover': { bgcolor: colors.primary, color: 'white' } }}>افزودن</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}