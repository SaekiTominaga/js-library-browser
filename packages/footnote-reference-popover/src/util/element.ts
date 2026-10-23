const getAnchorName = (prefix = ''): string => `--${prefix}${crypto.randomUUID().replaceAll('-', '')}`;

export { getAnchorName };
