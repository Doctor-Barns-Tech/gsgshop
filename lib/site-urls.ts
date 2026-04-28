/**
 * Cross-subdomain URL helpers.
 *
 * In production we serve the storefront at https://goods.gsgbrands.com.gh and
 * the personal-shopper experience at https://shopper.gsgbrands.com.gh. The
 * shopper subdomain is wired up in `middleware.ts` (host-based rewrite).
 *
 * Use these helpers any time a link on the goods host needs to take the user
 * over to the shopper host (or vice versa). Internal links inside the shopper
 * route group should stay as `/shopper/...` paths so they keep working in
 * development and on the goods host.
 */

const DEFAULT_GOODS_URL = 'https://goods.gsgbrands.com.gh';
const DEFAULT_SHOPPER_URL = 'https://shopper.gsgbrands.com.gh';

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

/** Public base URL for the goods storefront (no trailing slash). */
export function getGoodsBaseUrl(): string {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_GOODS_URL || DEFAULT_GOODS_URL);
}

/** Public base URL for the personal-shopper site (no trailing slash). */
export function getShopperBaseUrl(): string {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_SHOPPER_URL || DEFAULT_SHOPPER_URL);
}

/**
 * Build a shopper-site URL from a path. The `path` should be relative to the
 * shopper site root (e.g. `/`, `/how-it-works`, `/shopping-list`). If you
 * accidentally pass a `/shopper/...` path, the leading prefix is stripped so
 * the resulting URL stays clean.
 */
export function shopperUrl(path: string = '/'): string {
  let normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized.startsWith('/shopper')) {
    normalized = normalized.slice('/shopper'.length) || '/';
  }
  return `${getShopperBaseUrl()}${normalized === '/' ? '' : normalized}`;
}

/** Build a goods-storefront URL from a path. Mirrors `shopperUrl`. */
export function goodsUrl(path: string = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getGoodsBaseUrl()}${normalized === '/' ? '' : normalized}`;
}
