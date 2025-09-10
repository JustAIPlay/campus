import { Scenario, RoleCard, Phase, PhaseKey } from "./types";
import { TrainingScenarioTemplate } from "./trainingScenarioTemplates";
import { NPC_PERSONAS, NPCId } from "../npcs/personas";

// 场景生成器配置
export interface ScenarioGeneratorConfig {
  template: TrainingScenarioTemplate;
  selectedNPC: NPCId;
  customization?: {
    difficulty?: "easy" | "medium" | "hard";
    focusObjectives?: string[];
    additionalTips?: string[];
  };
}

// 根据技能类别生成标准化的训练阶段
function generatePhasesBySkillCategory(skillCategory: string, npcName: string): Record<PhaseKey, Phase> {
  const basePhases: Record<PhaseKey, Phase> = {
    opening: {
      intent: "建立良好的沟通氛围，表明合作意愿。",
      coachingTips: [
        "用友好的语气开始对话",
        "表现出愿意沟通的态度",
        "注意观察对方的情绪状态"
      ],
      exitConditions: [
        "成功引起对方注意",
        "建立基本的对话基础",
        "双方都愿意继续交流"
      ]
    },
    probing: {
      intent: "了解情况，收集信息，明确问题所在。",
      coachingTips: [
        "提出开放性问题了解情况",
        "仔细倾听对方的回应",
        "避免急于下结论"
      ],
      exitConditions: [
        "清楚了解当前情况",
        "识别出关键问题点",
        "双方对事实有基本共识"
      ]
    },
    negotiation: {
      intent: "寻找解决方案，进行协商和妥协。",
      coachingTips: [
        "提出具体可行的解决方案",
        "询问对方的意见和建议",
        "展现灵活性和妥协精神"
      ],
      exitConditions: [
        "提出了可行的解决方案",
        "双方都表示基本同意",
        "达成初步共识"
      ]
    },
    closure: {
      intent: "确认协议，积极结束对话。",
      coachingTips: [
        "总结达成的共识",
        "确认具体的执行方式",
        "以积极友好的方式结束"
      ],
      exitConditions: [
        "双方确认了解决方案",
        "明确了后续行动",
        "保持良好的关系"
      ]
    },
    reflection: {
      intent: "回顾整个过程，总结学习收获。",
      coachingTips: [
        "回想刚才做得好的地方",
        "思考还可以改进的方面",
        "总结学到的沟通技巧"
      ],
      exitConditions: [
        "能说出做得好的地方",
        "识别出改进空间",
        "总结了学习要点"
      ]
    }
  };

  // 根据技能类别定制化阶段内容
  switch (skillCategory) {
    case "conflict_resolution":
      basePhases.opening.intent = "缓和紧张情绪，表明愿意解决问题的态度。";
      basePhases.opening.coachingTips = [
        "保持冷静，不要情绪化",
        "表明想要解决问题的意愿",
        "避免指责或攻击性语言"
      ];
      basePhases.probing.intent = "还原事实真相，了解冲突的根本原因。";
      basePhases.negotiation.intent = "寻找双赢的解决方案，进行公平协商。";
      break;
      
    case "empathy_building":
      basePhases.opening.intent = "观察对方情绪，表现出关心和理解。";
      basePhases.opening.coachingTips = [
        "注意观察对方的情绪状态",
        "用温和的语气表达关心",
        "给对方足够的表达空间"
      ];
      basePhases.probing.intent = "深入了解对方的感受和需求。";
      basePhases.negotiation.intent = "提供支持和帮助，寻找安慰方式。";
      break;
      
    case "assertiveness":
      basePhases.opening.intent = "明确表达自己的需求和立场。";
      basePhases.opening.coachingTips = [
        "清楚表达自己的想法",
        "保持自信但不强势",
        "尊重对方的观点"
      ];
      basePhases.probing.intent = "了解对方的立场，寻找共同点。";
      basePhases.negotiation.intent = "坚持合理要求，同时保持灵活性。";
      break;
      
    case "collaboration":
      basePhases.opening.intent = "建立合作氛围，强调共同目标。";
      basePhases.opening.coachingTips = [
        "强调大家的共同利益",
        "表现出团队合作精神",
        "邀请对方一起参与"
      ];
      basePhases.probing.intent = "了解各方需求，寻找合作机会。";
      basePhases.negotiation.intent = "制定合作计划，分配责任和任务。";
      break;
      
    case "problem_solving":
      basePhases.opening.intent = "明确问题，建立解决问题的框架。";
      basePhases.opening.coachingTips = [
        "清楚描述遇到的问题",
        "表达解决问题的决心",
        "邀请对方一起思考"
      ];
      basePhases.probing.intent = "分析问题原因，收集相关信息。";
      basePhases.negotiation.intent = "评估不同方案，选择最佳解决办法。";
      break;
  }

  return basePhases;
}

// 根据NPC生成角色卡
function generateRoleCard(npcId: NPCId, template: TrainingScenarioTemplate): RoleCard {
  const npcPersona = NPC_PERSONAS[npcId];
  if (!npcPersona) {
    throw new Error(`NPC persona not found for ID: ${npcId}`);
  }

  // 根据训练场景调整NPC的情绪基线和行为特征
  const adjustedPersona = { ...npcPersona };
  
  // 根据技能类别调整NPC状态
  switch (template.skillCategory) {
    case "conflict_resolution":
      if (adjustedPersona.emotionBaseline === "calm") {
        adjustedPersona.emotionBaseline = "irritated";
      }
      adjustedPersona.emotionVolatility = Math.min((adjustedPersona.emotionVolatility || 3) + 1, 5) as 1 | 2 | 3 | 4 | 5;
      break;
      
    case "empathy_building":
      if (adjustedPersona.emotionBaseline === "cheerful") {
        adjustedPersona.emotionBaseline = "anxious";
      }
      break;
      
    case "assertiveness":
      if (adjustedPersona.assertiveness === "high") {
        adjustedPersona.assertiveness = "medium";
      }
      break;
  }

  return {
    name: npcPersona.name || "Unknown",
    role: npcPersona.role || "NPC",
    personality: npcPersona.traits?.join("、") || "友好",
    background: `${npcPersona.name || "这个角色"}是一个${npcPersona.age}岁的${npcPersona.role || "角色"}，性格${npcPersona.traits?.join("、")}。在这个训练场景中，需要通过有效沟通来处理当前的情况。`,
    persona: adjustedPersona
  };
}

// 生成训练目标
function generateObjectives(template: TrainingScenarioTemplate) {
  const objectives: Record<string, any> = {};
  
  // 主要目标
  objectives.primary_objective = {
    description: template.objectives.primary,
    competencies: getCompetenciesBySkill(template.skillCategory),
    successCriteria: [
      "能够清楚表达自己的想法和感受",
      "展现出良好的倾听和理解能力",
      "成功达成沟通目标"
    ]
  };
  
  // 次要目标
  template.objectives.secondary.forEach((objective, index) => {
    objectives[`secondary_objective_${index + 1}`] = {
      description: objective,
      competencies: getSecondaryCompetencies(template.skillCategory),
      successCriteria: [
        "运用了相应的沟通技巧",
        "表现出积极的学习态度"
      ]
    };
  });
  
  return objectives;
}

// 根据技能类别获取能力权重
function getCompetenciesBySkill(skillCategory: string) {
  const competencyMaps: Record<string, any> = {
    conflict_resolution: {
      problem_solving: { weight: 0.4 },
      assertiveness: { weight: 0.3 },
      empathy: { weight: 0.3 }
    },
    empathy_building: {
      empathy: { weight: 0.6 },
      clarity: { weight: 0.4 }
    },
    assertiveness: {
      assertiveness: { weight: 0.5 },
      clarity: { weight: 0.5 }
    },
    collaboration: {
      collaboration: { weight: 0.5 },
      empathy: { weight: 0.3 },
      problem_solving: { weight: 0.2 }
    },
    problem_solving: {
      problem_solving: { weight: 0.6 },
      clarity: { weight: 0.4 }
    }
  };
  
  return competencyMaps[skillCategory] || competencyMaps.problem_solving;
}

// 获取次要能力权重
function getSecondaryCompetencies(skillCategory: string) {
  return {
    clarity: { weight: 0.6 },
    collaboration: { weight: 0.4 }
  };
}

// 生成开场提示和NPC开场白
function generateOpeningContent(template: TrainingScenarioTemplate, npcName: string) {
  const starterPrompt = `你现在在${template.sceneName}，${template.description}请运用你学到的沟通技巧来处理这个情况。`;
  
  // 根据NPC角色和技能类别提供合适的开场白
  const getOpeningByNPCAndSkill = (npcName: string, skillCategory: string): string[] => {
    // 校医专用开场白
    if (npcName === "Nurse Kate" || npcName.includes("校医") || npcName.includes("nurse")) {
      return [
        "小朋友，哪里不舒服呀？告诉阿姨",
        "来，先坐下休息一下，慢慢说",
        "别担心，阿姨会帮你处理的"
      ];
    }
    
    // 生病学生专用开场白
    if (npcName.includes("生病") || npcName.includes("sick") || npcName.includes("不适")) {
      return [
        "我...我有点不舒服...",
        "头有点晕，想休息一下",
        "谢谢你陪我来医务室"
      ];
    }
    
    // Emma（图书馆场景）专用开场白
    if (npcName === "Emma" && skillCategory === "collaboration") {
      return [
        "诶，你手里的那本书是《小王子》吗？我也在找这本书呢！",
        "不好意思，请问你看完这本书了吗？我想借来看看",
        "这本书我找了好久了，你能和我分享一下阅读时间吗？"
      ];
    }
    
    // 根据技能类别提供通用开场白
    const npcOpenings: Record<string, string[]> = {
      conflict_resolution: [
        "喂，你刚才做什么了？我觉得不太对！",
        "等等，这个不是你应该拿的吧？",
        "你怎么能这样做？我不同意！"
      ],
      empathy_building: [
        "我...我有点不舒服...",
        "没人愿意和我一起玩...",
        "我需要有人陪陪我..."
      ],
      assertiveness: [
        "你需要什么帮助吗？",
        "有什么我可以帮你的？",
        "看起来你遇到了困难？"
      ],
      collaboration: [
        "我们一起来做这个怎么样？",
        "你觉得我们应该怎么安排？",
        "我有个想法，你听听看？"
      ],
      problem_solving: [
        "这个问题有点复杂，你有什么想法？",
        "我们需要想个办法解决这个问题。",
        "你觉得应该从哪里开始？"
      ]
    };
    
    return npcOpenings[skillCategory] || npcOpenings.problem_solving;
  };
  
  const openings = getOpeningByNPCAndSkill(npcName, template.skillCategory);
  const npcOpening = openings[Math.floor(Math.random() * openings.length)];
  
  return { starterPrompt, npcOpening };
}

// 主要的场景生成函数
export function generateScenario(config: ScenarioGeneratorConfig): Scenario {
  const { template, selectedNPC, customization } = config;
  
  // 生成角色卡
  const roleCard = generateRoleCard(selectedNPC, template);
  
  // 生成训练阶段
  const phases = generatePhasesBySkillCategory(template.skillCategory, roleCard.name);
  
  // 生成训练目标
  const objectives = generateObjectives(template);
  
  // 生成开场内容
  const { starterPrompt, npcOpening } = generateOpeningContent(template, roleCard.name);
  
  // 应用自定义配置
  const finalDifficulty = customization?.difficulty || template.difficulty;
  
  // 根据难度调整阶段提示
  if (finalDifficulty === "hard") {
    Object.values(phases).forEach(phase => {
      phase.coachingTips = phase.coachingTips?.slice(0, 1) || []; // 困难模式减少提示
    });
  } else if (finalDifficulty === "easy") {
    Object.values(phases).forEach(phase => {
      if (customization?.additionalTips) {
        phase.coachingTips = [...(phase.coachingTips || []), ...customization.additionalTips];
      }
    });
  }
  
  return {
    id: `${template.id}_${selectedNPC}_${Date.now()}`,
    title: template.title,
    sceneName: template.sceneName,
    difficulty: finalDifficulty,
    description: template.description,
    roleCard,
    objectives,
    phases,
    starterPrompt,
    npcOpening,
    assets: {
      sceneImage: `/images-webp/scenes/${template.sceneId}.webp`,
      npcAvatar: roleCard.persona?.avatar || `/images-webp/avatar/default.webp`
    }
  };
}

// 批量生成场景的辅助函数
export function generateMultipleScenarios(templates: TrainingScenarioTemplate[], npcId: NPCId): Scenario[] {
  return templates.map(template => 
    generateScenario({ template, selectedNPC: npcId })
  );
}

// 根据用户偏好推荐场景
export function recommendScenarios(userPreferences: {
  skillFocus?: string[];
  difficulty?: "easy" | "medium" | "hard";
  timeLimit?: number;
}): TrainingScenarioTemplate[] {
  // 这里可以实现更复杂的推荐算法
  // 目前返回基础推荐
  return [];
}