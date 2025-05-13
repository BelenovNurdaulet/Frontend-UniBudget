import { parse } from 'regexparam';

export function isSelectedItem(link, location) {
  if (!link || !location) {
    return false;
  }

  return parse(link, link !== '/').pattern.test(location);
}
