const getAnchorName = (): string => `--${crypto.randomUUID().replaceAll('-', '')}`;

export { getAnchorName };
