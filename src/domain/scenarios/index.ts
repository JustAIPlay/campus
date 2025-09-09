export { type Scenario, type Phase, type PhaseKey, type RoleCard, type Objective, type CompetencyKey } from "./types";
import { playgroundBallConflictEasy } from "./scenario_playground_ball_conflict";

// 可扩展：集中导出所有可用场景，便于在 App 中列出入口
export const AVAILABLE_SCENARIOS = [
  playgroundBallConflictEasy,
];

// 重新导出场景
export { playgroundBallConflictEasy };