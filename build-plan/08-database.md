## Database Schema – Tasks.org Desktop Application

### `tasks`

```ts
{
  id: string,                   // UUID or CalDAV UID
  title: string,
  description?: string,
  priority?: 'none' | 'low' | 'medium' | 'high',
  listId: string,
  tagIds: string[],            // Many-to-many with tags
  startDate?: string,          // ISO format
  dueDate?: string,
  recurrence?: string,         // RRULE string
  reminder?: string,           // Trigger time
  location?: string,
  attachments?: Attachment[],
  subtasks?: Subtask[],
  completed: boolean,
  createdAt: string,
  updatedAt: string,
  dirty: boolean,              // For sync
  deleted?: boolean            // For deferred deletion
}
```

### `lists`

```ts
{
  id: string,                  // CalDAV collection UID
  name: string,
  color: string,              // User-defined color
  icon: string,               // Optional icon name or ID
  createdAt: string,
  updatedAt: string
}
```

### `tags`

```ts
{
  id: string,
  name: string,
  color: string,              // User-defined color
  icon: string,               // Optional icon name or ID
  usageCount: number           // For filtering unused tags
}
```

### `settings`

```ts
{
  theme: string,
  caldavUrl: string,
  username: string,
  encryptedToken: string
}
```

> Note: All timestamps are in ISO string format. Attachments and subtasks will be stored inline for now; they can be separated later if needed.

