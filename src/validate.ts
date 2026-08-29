import { STAGES, type Stage } from "./types.js";

export function isValidStage(value: string): value is Stage {
  return (STAGES as readonly string[]).includes(value);
}
