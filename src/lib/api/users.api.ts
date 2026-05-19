import api from './axios';
import { normalizeGroupStudentsResponse } from './types';
import type { GroupStudentsApiResponse } from './types';

export function getStudentsByGroup(groupId: string) {
  return api.get<GroupStudentsApiResponse>(`/${groupId}/students`).then((response) => ({
    ...response,
    data: normalizeGroupStudentsResponse(response.data),
  }));
}
