import { useCallback, useEffect, useMemo, useState } from "react";

export interface DailyTask {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  completedAt?: number;
}

const KEY_DAILY_TASKS = "focus-space:daily-tasks";

function readTasks() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY_DAILY_TASKS);
    return raw ? (JSON.parse(raw) as DailyTask[]) : [];
  } catch {
    return [];
  }
}

function createTask(title: string): DailyTask {
  return {
    id: crypto.randomUUID(),
    title,
    done: false,
    createdAt: Date.now(),
  };
}

export function useDailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);

  useEffect(() => {
    setTasks(readTasks());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY_DAILY_TASKS, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((current) => [createTask(trimmed), ...current]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task;
        const done = !task.done;
        return {
          ...task,
          done,
          completedAt: done ? Date.now() : undefined,
        };
      }),
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  const clearDone = useCallback(() => {
    setTasks((current) => current.filter((task) => !task.done));
  }, []);

  const doneCount = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);

  return { tasks, doneCount, addTask, toggleTask, removeTask, clearDone };
}
