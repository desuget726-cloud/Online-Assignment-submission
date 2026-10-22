// Sample import activity shown in admin dashboards before a new upload is made.
export const mockImportHistory = [
  {
    id: 'import-sample-001',
    fileName: 'students-september.csv',
    type: 'student',
    admin: 'Daniel Tessema',
    createdAt: '2026-09-15T10:30:00.000Z',
    successful: 8,
    failed: 1,
    skipped: 2,
    total: 11,
    records: [
      {
        rowNumber: 4,
        status: 'Failed',
        reason: 'Email address is invalid.',
        userId: 'MAU010',
        email: 'invalid-email',
      },
      {
        rowNumber: 7,
        status: 'Skipped',
        reason: 'User ID or email already exists.',
        userId: 'MAU001',
        email: 'abebe@example.com',
      },
      {
        rowNumber: 9,
        status: 'Skipped',
        reason: 'Duplicate User ID or email in this file.',
        userId: 'MAU009',
        email: 'duplicate@example.com',
      },
    ],
  },
]
