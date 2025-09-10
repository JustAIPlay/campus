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
  persona?: Persona; // 可选：更细的“人设与说话风格”参数
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
  starterPrompt?: string; // 可选：用于替代固定话术的开场设定（通常面向用户的指引）
  npcOpening?: string; // 可选：NPC 第一人称的开场台词（用于更真实的对话开场）
  // 可选资源（后续用于 UI 展示）
  assets?: {
    sceneImage?: string; // 背景图路径（相对 public 根）
    npcAvatar?: string; // NPC 头像路径
  };
}

// 说话方式与词汇约束
export type SentenceLength = 'short' | 'medium' | 'long';
export type EmojiLevel = 'none' | 'light' | 'kids';
export type LexiconPack = 'lower_primary' | 'upper_primary' | 'junior_high';
export type Sociability = 'introvert' | 'ambivert' | 'extrovert' | 'social_anxious';
export type Assertiveness = 'low' | 'medium' | 'high';
export type EmotionBaseline = 'calm' | 'irritated' | 'anxious' | 'cheerful';

export interface SpeechStyle {
  sentenceLength?: SentenceLength; // 句长
  politeness?: 1 | 2 | 3 | 4 | 5; // 礼貌等级（1最低，5最高）
  interjections?: string[]; // 常用语气词（如“喂、欸、哼”）
  emoji?: EmojiLevel; // 表情符使用
  slangLevel?: 0 | 1 | 2; // 口语/俚语程度
  fillerWords?: string[]; // 口头填充词（如“嗯、唔、那个”）
}

export interface Persona {
  name?: string; // NPC名称
  role?: string; // NPC角色
  avatar?: string; // 头像路径
  age?: number; // 年龄
  grade?: string; // 年级文字描述（如"二年级/五年级"）
  mbti?: string; // 可选：MBTI 标签（仅作风格参考）
  traits?: string[]; // 特质标签（如"直率、好胜、规则导向"）
  sociability?: Sociability; // 社交倾向
  assertiveness?: Assertiveness; // 表达主张强度
  emotionBaseline?: EmotionBaseline; // 情绪基线
  emotionVolatility?: 1 | 2 | 3 | 4 | 5; // 情绪波动强度
  rulesOrientation?: 1 | 2 | 3 | 4 | 5; // 规则导向强度
  speechStyle?: SpeechStyle; // 说话方式
  lexiconPack?: LexiconPack; // 年龄适配词汇包
  catchphrases?: string[]; // 口头禅
  doNotSay?: string[]; // 禁用词或不符合年龄的表达
  slangLevel?: number; // 俚语使用程度
}