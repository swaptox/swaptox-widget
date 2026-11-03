'use strict';
/**
 * 安全地在全局对象上设置值，不覆盖已存在的层级
 */
export const safeSet = (root, path, value) => {
    const parts = path.split('.');
    let current = root;

    parts.forEach((part, index) => {
        if (index === parts.length - 1) {
            // 到达最后一层，如果已存在且是对象，进行合并；否则直接赋值
            if (typeof current[part] === 'object' && current[part] !== null) {
                current[part] = { ...current[part], ...value };
            } else {
                current[part] = value;
            }
        } else {
            // 中间层级不存在则创建
            current[part] = current[part] || {};
            current = current[part];
        }
    });
};
