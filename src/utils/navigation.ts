export const openInNewTab = (url: string | undefined) => {
    if (!url) {
        console.error('URL no definida');
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
};