
/**
 * 更新页面根节点的 lang 属性
/* export const updateDocumentLang = (locale) => {
    if (!locale) return;
    try {
        const htmlElement = document.documentElement;
        if (htmlElement) {
            htmlElement.setAttribute('lang', locale);
        }
    } catch (error) {
        console.error('Failed to update HTML lang attribute:', error);
    }
}; */


/**
 * 安全地更新页面语言标识（同时支持 <html> lang 和 meta language）
 * @param {string} locale - 当前语言标符，例如 'zh-CN', 'en'
 */
export const updateDocumentLang = (locale) => {
    if (!locale) return;
    
    try {
        // 1. 总是更新最外层的 <html> lang 属性（标准核心）
        const htmlElement = document.documentElement;
        if (htmlElement) {
            htmlElement.setAttribute('lang', locale);
        }

        // 2. 如果页面中存在对应的 meta 标签，则安全地更新它
        const metaLang = document.querySelector('meta[name="language"]');
        if (metaLang) {
            metaLang.setAttribute('content', locale);
        }
    } catch (error) {
        console.error('Failed to update document language:', error);
    }
};


