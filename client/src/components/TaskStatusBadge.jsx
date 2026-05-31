import Badge from "./ui/Badge";
import { TASK_PRIORITIES, TASK_STATUSES } from "../utils/constants";

export function StatusBadge({ status }) {
  const item = TASK_STATUSES.find((s) => s.value === status) || TASK_STATUSES[0];
  return <Badge className={item.color}>{item.label}</Badge>;
}

export function PriorityBadge({ priority }) {
  const item = TASK_PRIORITIES.find((p) => p.value === priority) || TASK_PRIORITIES[1];
  return <Badge className={item.color}>{item.label}</Badge>;
}
