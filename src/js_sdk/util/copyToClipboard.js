/**
 * 复制文本到剪贴板
 * @param {string} text 要复制的内容
 */
export const copyToClipboard = async (text) => {
    if (!text) return;

    try {
        // 1. 尝试使用现代 API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        
        // 2. 降级方案：使用 execCommand
        throw new Error('Clipboard API unavailable');
    } catch (err) {
        return fallbackCopyTextToClipboard(text);
    }
};

// 降级兼容函数
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // 隐藏文本域
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (err) {
        document.body.removeChild(textArea);
        return false;
    }
}