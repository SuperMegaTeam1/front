const groupNameCollator = new Intl.Collator('ru-RU', {
  numeric: true,
  sensitivity: 'base',
});

function normalizeGroupSortValue(value: string) {
  return value.trim();
}

export function compareGroupNames(left: string, right: string) {
  const normalizedLeft = normalizeGroupSortValue(left);
  const normalizedRight = normalizeGroupSortValue(right);

  return groupNameCollator.compare(normalizedLeft, normalizedRight);
}

export function sortGroupNames<T extends string>(groupNames: readonly T[]) {
  return [...groupNames].sort(compareGroupNames);
}

export function sortGroupsByName<T extends { groupName: string; groupId?: string }>(groups: readonly T[]) {
  return [...groups].sort((left, right) => {
    const compareByName = compareGroupNames(left.groupName, right.groupName);

    if (compareByName !== 0) {
      return compareByName;
    }

    return compareGroupNames(left.groupId ?? '', right.groupId ?? '');
  });
}
