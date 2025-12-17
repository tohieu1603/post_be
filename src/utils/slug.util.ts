/**
 * Slug utility - Auto generate slug from Vietnamese/English text
 */

// Vietnamese character mapping
const vietnameseMap: Record<string, string> = {
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd',
  'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
  'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
  'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
  'Đ': 'D',
  'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
  'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
  'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
  'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
  'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
  'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
  'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
  'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
  'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
};

/**
 * Remove Vietnamese diacritics from text
 */
export function removeVietnameseDiacritics(str: string): string {
  return str
    .split('')
    .map(char => vietnameseMap[char] || char)
    .join('');
}

/**
 * Slug generation options
 */
export interface SlugOptions {
  maxLength?: number;  // Default: 60 chars
  lowercase?: boolean; // Default: true
}

/**
 * Generate slug from text
 * - Removes Vietnamese diacritics
 * - Converts to lowercase
 * - Replaces spaces and special chars with hyphens
 * - Removes consecutive hyphens
 * - Limits to maxLength (default 60 chars)
 */
export function generateSlug(text: string, options: SlugOptions = {}): string {
  if (!text) return '';

  const { maxLength = 60, lowercase = true } = options;

  let slug = removeVietnameseDiacritics(text)
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters (only letters, numbers, spaces, hyphens)
    .replace(/[\s_]+/g, '-')   // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-')       // Remove consecutive hyphens
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens

  if (lowercase) {
    slug = slug.toLowerCase();
  }

  // Truncate to maxLength, but don't cut in middle of word
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    // Remove trailing hyphen if truncated mid-word
    const lastHyphen = slug.lastIndexOf('-');
    if (lastHyphen > maxLength - 10) {
      slug = slug.substring(0, lastHyphen);
    }
    slug = slug.replace(/-+$/g, ''); // Remove trailing hyphens
  }

  return slug;
}

/**
 * Generate unique slug by appending number if exists
 */
export async function generateUniqueSlug(
  text: string,
  checkExists: (slug: string) => Promise<boolean>,
  excludeId?: string
): Promise<string> {
  const baseSlug = generateSlug(text);
  let slug = baseSlug;
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;

    // Safety limit
    if (counter > 100) {
      slug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }

  return slug;
}
