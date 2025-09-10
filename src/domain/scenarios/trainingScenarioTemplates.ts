import { Scenario } from "./types";
import { NPCId } from "../npcs/personas";

// 训练场景模板配置
export interface TrainingScenarioTemplate {
  id: string;
  title: string;
  sceneName: string;
  sceneId: string; // 对应scenes数组中的场景ID
  difficulty: "easy" | "medium" | "hard";
  description: string;
  skillCategory: "conflict_resolution" | "empathy_building" | "assertiveness" | "collaboration" | "problem_solving";
  recommendedNPCs: NPCId[]; // 推荐的NPC角色
  objectives: {
    primary: string; // 主要学习目标
    secondary: string[]; // 次要学习目标
  };
  estimatedDuration: number; // 预计训练时长（分钟）
  prerequisites?: string[]; // 前置技能要求
}

// 场景-NPC映射配置
export interface SceneNPCMapping {
  sceneId: string;
  sceneName: string;
  availableNPCs: {
    npcId: NPCId;
    name: string;
    role: string;
    personality: string;
    avatar: string;
    suitableFor: string[]; // 适合的训练类型
  }[];
  trainingScenarios: TrainingScenarioTemplate[];
}

// 训练场景模板库
export const TRAINING_SCENARIO_TEMPLATES: TrainingScenarioTemplate[] = [
  {
    id: "playground_ball_conflict_easy",
    title: "操场抢球误会",
    sceneName: "操场",
    sceneId: "playground",
    difficulty: "easy",
    description: "课间在操场，同学误会你抢了球，情绪有点激动。你需要先还原事实、表达你的感受，并与同学协商一个公平的玩法。",
    skillCategory: "conflict_resolution",
    recommendedNPCs: ["senior_student", "shy_kid"],
    objectives: {
      primary: "学会冷静处理误会和冲突",
      secondary: ["练习事实澄清技巧", "学会表达个人感受", "掌握协商和妥协能力"]
    },
    estimatedDuration: 15,
    prerequisites: ["基础沟通技巧"]
  },
  {
    id: "classroom_homework_help",
    title: "课堂作业求助",
    sceneName: "教室",
    sceneId: "classroom",
    difficulty: "easy",
    description: "你在做作业时遇到困难，需要向老师或同学寻求帮助。学会如何礼貌地提出请求并表达感谢。",
    skillCategory: "assertiveness",
    recommendedNPCs: ["teacher_wang", "classmate_xiaoming"],
    objectives: {
      primary: "学会主动寻求帮助",
      secondary: ["练习礼貌用语", "学会表达困难", "掌握感谢表达"]
    },
    estimatedDuration: 10,
  },
  {
    id: "library_book_sharing",
    title: "图书馆分享图书",
    sceneName: "图书馆",
    sceneId: "library",
    difficulty: "medium",
    description: "在图书馆遇到同学在找你正在看的书，你需要学会分享和协商阅读时间。",
    skillCategory: "collaboration",
    recommendedNPCs: ["bookworm", "librarian"],
    objectives: {
      primary: "学会分享和协商",
      secondary: ["练习换位思考", "学会时间管理协商", "培养分享精神"]
    },
    estimatedDuration: 12,
  },
  {
    id: "cafeteria_lunch_invitation",
    title: "食堂邀请同桌",
    sceneName: "食堂",
    sceneId: "cafeteria",
    difficulty: "easy",
    description: "午餐时间，你想邀请一个独自吃饭的同学一起坐。学会主动交友和包容他人。",
    skillCategory: "empathy_building",
    recommendedNPCs: ["lunch_buddy"],
    objectives: {
      primary: "学会主动关心他人",
      secondary: ["练习邀请技巧", "学会观察他人情绪", "培养包容心态"]
    },
    estimatedDuration: 8,
  },
  {
    id: "health_room_care_giving",
    title: "医务室关怀同学",
    sceneName: "医务室",
    sceneId: "health_room",
    difficulty: "medium",
    description: "陪伴生病的同学到医务室，学会如何给予关怀和支持。",
    skillCategory: "empathy_building",
    recommendedNPCs: ["sick_student", "school_nurse"],
    objectives: {
      primary: "学会关怀和支持他人",
      secondary: ["练习安慰技巧", "学会观察他人需求", "培养责任感"]
    },
    estimatedDuration: 15,
  }
];

// 场景-NPC映射配置
export const SCENE_NPC_MAPPINGS: SceneNPCMapping[] = [
  {
    sceneId: "playground",
    sceneName: "操场",
    availableNPCs: [
      {
        npcId: "pe_teacher",
        name: "Coach Li",
        role: "体育老师",
        personality: "严格认真",
        avatar: "images-webp/avatar/pe_teacher.webp",
        suitableFor: ["规则学习", "团队协作", "纪律训练"]
      },
      {
        npcId: "senior_student",
        name: "Charlie",
        role: "高年级学生",
        personality: "友善热心",
        avatar: "images-webp/avatar/student_john.webp",
        suitableFor: ["冲突解决", "协商技巧", "领导力培养"]
      },
      {
        npcId: "shy_kid",
        name: "Diana",
        role: "低年级学生",
        personality: "害羞胆小",
        avatar: "images-webp/avatar/student_diana.webp",
        suitableFor: ["同理心培养", "保护意识", "耐心训练"]
      }
    ],
    trainingScenarios: [
      TRAINING_SCENARIO_TEMPLATES.find(t => t.id === "playground_ball_conflict_easy")!
    ]
  },
  {
    sceneId: "classroom",
    sceneName: "教室",
    availableNPCs: [
      {
        npcId: "teacher_wang",
        name: "Ms. Wang",
        role: "班主任",
        personality: "温和耐心",
        avatar: "images-webp/avatar/homeroom_teacher.webp",
        suitableFor: ["求助技巧", "尊重权威", "学习态度"]
      },
      {
        npcId: "classmate_xiaoming",
        name: "Bob",
        role: "同班同学",
        personality: "活泼开朗",
        avatar: "images-webp/avatar/student_bob.webp",
        suitableFor: ["同伴互助", "友谊建立", "合作学习"]
      },
      {
        npcId: "classmate_xiaoli",
        name: "Alice",
        role: "同班同学",
        personality: "文静内向",
        avatar: "images-webp/avatar/student_alice.webp",
        suitableFor: ["温柔沟通", "细心观察", "耐心倾听"]
      }
    ],
    trainingScenarios: [
      TRAINING_SCENARIO_TEMPLATES.find(t => t.id === "classroom_homework_help")!
    ]
  },
  {
    sceneId: "library",
    sceneName: "图书馆",
    availableNPCs: [
      {
        npcId: "librarian",
        name: "Ms. Chen",
        role: "图书管理员",
        personality: "温柔细心",
        avatar: "images-webp/avatar/图书管理员.webp",
        suitableFor: ["规则遵守", "礼貌用语", "求助技巧"]
      },
      {
        npcId: "bookworm",
        name: "Emma",
        role: "同学",
        personality: "爱读书安静",
        avatar: "images-webp/avatar/student_emma.webp",
        suitableFor: ["分享协商", "安静沟通", "兴趣交流"]
      }
    ],
    trainingScenarios: [
      TRAINING_SCENARIO_TEMPLATES.find(t => t.id === "library_book_sharing")!
    ]
  },
  {
    sceneId: "cafeteria",
    sceneName: "食堂",
    availableNPCs: [
      {
        npcId: "cafeteria_staff",
        name: "Aunt Mary",
        role: "食堂工作人员",
        personality: "亲切热情",
        avatar: "images-webp/avatar/cafeteria_staff.webp",
        suitableFor: ["礼貌用语", "感谢表达", "尊重他人"]
      },
      {
        npcId: "lunch_buddy",
        name: "Frank",
        role: "同学",
        personality: "开朗友好",
        avatar: "images-webp/avatar/student_april.webp",
        suitableFor: ["主动交友", "邀请技巧", "包容他人"]
      }
    ],
    trainingScenarios: [
      TRAINING_SCENARIO_TEMPLATES.find(t => t.id === "cafeteria_lunch_invitation")!
    ]
  },
  {
    sceneId: "health_room",
    sceneName: "医务室",
    availableNPCs: [
      {
        npcId: "school_nurse",
        name: "Nurse Kate",
        role: "校医",
        personality: "温柔关怀",
        avatar: "images-webp/avatar/校医阿姨.webp",
        suitableFor: ["寻求帮助", "表达不适", "配合治疗"]
      },
      {
        npcId: "sick_student",
        name: "身体不适的同学",
        role: "同学",
        personality: "虚弱需要关心",
        avatar: "images-webp/avatar/生病学生.webp",
        suitableFor: ["关怀他人", "安慰技巧", "责任感培养"]
      }
    ],
    trainingScenarios: [
      TRAINING_SCENARIO_TEMPLATES.find(t => t.id === "health_room_care_giving")!
    ]
  }
];

// 根据技能类别获取推荐场景
export function getScenariosBySkill(skillCategory: TrainingScenarioTemplate['skillCategory']): TrainingScenarioTemplate[] {
  return TRAINING_SCENARIO_TEMPLATES.filter(template => template.skillCategory === skillCategory);
}

// 根据难度获取场景
export function getScenariosByDifficulty(difficulty: TrainingScenarioTemplate['difficulty']): TrainingScenarioTemplate[] {
  return TRAINING_SCENARIO_TEMPLATES.filter(template => template.difficulty === difficulty);
}

// 根据场景ID获取可用的训练场景
export function getTrainingScenariosByScene(sceneId: string): TrainingScenarioTemplate[] {
  const mapping = SCENE_NPC_MAPPINGS.find(m => m.sceneId === sceneId);
  return mapping?.trainingScenarios || [];
}

// 根据NPC获取适合的训练场景
export function getScenariosByNPC(npcId: NPCId): TrainingScenarioTemplate[] {
  return TRAINING_SCENARIO_TEMPLATES.filter(template => 
    template.recommendedNPCs.includes(npcId)
  );
}