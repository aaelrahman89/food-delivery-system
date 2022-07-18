import { ListTasksComplaintsResponse } from '../definitions/tasks-complaints';

export function listTasksComplaintsStub(): ListTasksComplaintsResponse {
  return {
    metadata: {
      skipped: 0,
      limit: 0,
      totalCount: 0,
      totalReturned: 0,
    },
    complaints: [
      {
        taskId: 2165529378315486700,
        branchId: 2165529378315486700,
        branchLabel: 'Name',
        compensation: {
          compensationType: 'NONE',
          amount: {
            amount: 31.01,
            currency: 'EGP',
          },
          compensationDate: '2018-09-05T19:04:53.178Z',
          compensatorId: 123654789,
          compensatorEmail: 'example@domain.com',
        },
        complaint: {
          category: 'PILOT_AVAILABILITY',
          crmLink: 'https://www.test.com',
          createdBy: 'dummy@email.com',
          creationDate: '2018-09-01T18:04:53.178Z',
        },
      },
    ],
  };
}
