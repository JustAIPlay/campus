export { type Scenario, type Phase, type PhaseKey, type RoleCard, type Objective, type CompetencyKey } from "./types";
import { playgroundBallConflictEasy } from "./scenario_playground_ball_conflict";
export { 
  type TrainingScenarioTemplate, 
  type SceneNPCMapping,
  TRAINING_SCENARIO_TEMPLATES,
  SCENE_NPC_MAPPINGS,
  getScenariosBySkill,
  getScenariosByDifficulty,
  getTrainingScenariosByScene,
  getScenariosByNPC
} from "./trainingScenarioTemplates";
export {
  type ScenarioGeneratorConfig,
  generateScenario,
  generateMultipleScenarios,
  recommendScenarios
} from "./scenarioGenerator";

// 可扩展：集中导出所有可用场景，便于在 App 中列出入口
export const AVAILABLE_SCENARIOS = [
  playgroundBallConflictEasy,
];

// 重新导出场景
export { playgroundBallConflictEasy };