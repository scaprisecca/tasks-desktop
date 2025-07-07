export interface Task {
  id?: number;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  parentId?: number;
  order: number;
}

export interface TaskList {
  id?: number;
  name: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export interface TaskWithList extends Task {
  listId: number;
  list?: TaskList;
} 