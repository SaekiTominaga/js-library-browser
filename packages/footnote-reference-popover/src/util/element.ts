/**
 * Get CSS anchor name <https://drafts.csswg.org/css-anchor-position-1/#typedef-anchor-name>
 *
 * @param prefix - Prefix
 *
 * @returns CSS anchor name
 */
const getUniqueCSSAnchorName = (prefix = ''): string => `--${prefix}${crypto.randomUUID().replaceAll('-', '')}`;

export { getUniqueCSSAnchorName };
