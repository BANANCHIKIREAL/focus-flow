import { FormEvent, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import type { DailyTask } from "@/hooks/useDailyTasks";
import type { translations } from "@/lib/i18n";

interface Props {
  tasks: DailyTask[];
  doneCount: number;
  onAdd: (title: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onClearDone: () => void;
  copy: typeof translations.en;
}

export function TodayTasks({
  tasks,
  doneCount,
  onAdd,
  onToggle,
  onRemove,
  onClearDone,
  copy,
}: Props) {
  const [draft, setDraft] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAdd(draft);
    setDraft("");
  };

  return (
    <section className="glass w-full max-w-md rounded-2xl p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {copy.today}
          </div>
          <h2 className="font-display text-2xl">{copy.tasks}</h2>
        </div>
        <div className="text-xs tabular-nums text-muted-foreground">
          {doneCount}/{tasks.length}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="min-w-0 flex-1 rounded-full border border-border bg-foreground/5 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          placeholder={copy.addTask}
          aria-label={copy.addTask}
        />
        <button
          type="submit"
          className="h-10 w-10 shrink-0 rounded-full bg-foreground text-background inline-flex items-center justify-center hover:scale-105 transition-transform"
          aria-label={copy.addTask}
        >
          <Plus size={16} />
        </button>
      </form>

      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            {copy.noTasks}
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-3 rounded-2xl bg-foreground/5 px-3 py-2.5"
            >
              <button
                onClick={() => onToggle(task.id)}
                className={`h-6 w-6 shrink-0 rounded-full border inline-flex items-center justify-center transition-colors ${
                  task.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary"
                }`}
                aria-label={task.done ? copy.markTaskNotDone : copy.markTaskDone}
              >
                {task.done && <Check size={13} />}
              </button>
              <div
                className={`min-w-0 flex-1 text-sm leading-snug ${
                  task.done ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              >
                {task.title}
              </div>
              <button
                onClick={() => onRemove(task.id)}
                className="h-7 w-7 shrink-0 rounded-full inline-flex items-center justify-center text-muted-foreground opacity-70 transition-colors hover:text-foreground md:opacity-0 md:group-hover:opacity-100"
                aria-label={copy.deleteTask}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {doneCount > 0 && (
        <button
          onClick={onClearDone}
          className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copy.clearCompleted}
        </button>
      )}
    </section>
  );
}
