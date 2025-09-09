// Scenario and training types for goal-directed conversational practice

export type CompetencyKey =
  | "empathy"
  | "clarity"
  | "assertiveness"
  | "collaboration"
  | "problem_solving";

export interface Objective {
  description: string; // 目标解释与使用场景
  // 能力权重映射（总和应为 1.0）
  competencies: Partial<Record<CompetencyKey, { weight: number }>>;
  // 成功标准（用于评估）
  successCriteria: string[];
}

export interface RoleCard {
  name: string; // NPC 名称（如"Charlie"）
  role: string; // NPC 角色（如"高年级学生"）
  personality: string; // 性格特征描述
  background: string; // NPC 背景故事
}

export type PhaseKey =
  | "opening"
  | "probing"
  | "negotiation"
  | "closure"
  | "reflection";

export interface Phase {
  intent: string; // 阶段意图描述（例如"了解事实"、"表达立场"、"寻找双赢方案"）
  coachingTips?: string[]; // 对孩子的内联建议候选
  exitConditions: string[]; // 触发进入下一阶段的条件（关键词/行为要点）
}

export interface Scenario {
  id: string; // 全局唯一 ID，例如 "playground_ball_conflict_easy"
  title: string; // 场景标题
  sceneName: string; // 场景可读名称（操场/教室/食堂…）
  difficulty: "easy" | "medium" | "hard";
  description: string; // 场景背景描述，用于 prompt
  roleCard: RoleCard; // NPC 角色卡
  objectives: Record<string, Objective>; // 本次训练的目标映射
  phases: Record<PhaseKey, Phase>; // 分阶段推进映射
  starterPrompt?: string; // 可选：用于替代固定话术的开场设定
  // 可选资源（后续用于 UI 展示）
  assets?: {
    sceneImage?: string; // 背景图路径（相对 public 根）
    npcAvatar?: string; // NPC 头像路径
  };
}