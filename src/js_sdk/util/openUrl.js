'use strict';

export const openUrl = (url) => {
    if (!url) return;

    window.open(url, '_blank');
};
