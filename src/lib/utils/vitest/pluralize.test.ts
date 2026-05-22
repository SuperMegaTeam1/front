import { describe, expect, it } from 'vitest';
import { pluralizeRu } from '@/lib/utils/pluralize';

const SUBJECT_FORMS = ['предмет', 'предмета', 'предметов'] as const;

describe('pluralizeRu', () => {
  it('selects one, few and many forms for common counts', () => {
    expect(pluralizeRu(1, SUBJECT_FORMS)).toBe('предмет');
    expect(pluralizeRu(2, SUBJECT_FORMS)).toBe('предмета');
    expect(pluralizeRu(5, SUBJECT_FORMS)).toBe('предметов');
  });

  it('uses the many form for teen counts', () => {
    expect(pluralizeRu(11, SUBJECT_FORMS)).toBe('предметов');
    expect(pluralizeRu(14, SUBJECT_FORMS)).toBe('предметов');
    expect(pluralizeRu(111, SUBJECT_FORMS)).toBe('предметов');
  });

  it('uses the absolute value for negative counts', () => {
    expect(pluralizeRu(-1, SUBJECT_FORMS)).toBe('предмет');
    expect(pluralizeRu(-3, SUBJECT_FORMS)).toBe('предмета');
    expect(pluralizeRu(-12, SUBJECT_FORMS)).toBe('предметов');
  });
});
