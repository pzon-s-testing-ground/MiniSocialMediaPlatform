export const parseBBCode = (text) => {
    if (!text) return '';

    let html = text
        // Encode basic HTML tags to prevent XSS
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        
        // Bold
        .replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>')
        // Italic
        .replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em>$1</em>')
        // Underline
        .replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '<u>$1</u>')
        // Image
        .replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" alt="Image" style="max-width: 100%; border: 1px solid var(--forum-border-dark);" />')
        // Quote
        .replace(/\[quote=(.*?)\]([\s\S]*?)\[\/quote\]/gi, '<blockquote style="border: 1px solid var(--forum-border-light); background: var(--forum-row-odd); padding: 5px 10px; margin: 10px 0; font-style: italic;"><div style="font-weight: bold; border-bottom: 1px solid var(--forum-border-light); margin-bottom: 5px; font-size: 0.9em;">$1 wrote:</div>$2</blockquote>')
        .replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, '<blockquote style="border: 1px solid var(--forum-border-light); background: var(--forum-row-odd); padding: 5px 10px; margin: 10px 0; font-style: italic;">$1</blockquote>')
        // Newlines to <br>
        .replace(/\n/g, '<br />');

    return html;
};
