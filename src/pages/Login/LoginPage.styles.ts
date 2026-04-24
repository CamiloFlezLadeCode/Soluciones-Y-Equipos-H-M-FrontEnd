export const textFieldStyles = {
    borderRadius: 999,
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
    '& fieldset': { border: 'none' },
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused fieldset': { border: 'none' },
    '& .MuiOutlinedInput-input': { py: 1.2 },
} as const;

export const textFieldLabelStyles = {
    '& .MuiInputLabel-root.MuiInputLabel-shrink': {
        transform: 'translate(14px, -18px) scale(0.85)',
        transformOrigin: 'top left',
    },
} as const;
