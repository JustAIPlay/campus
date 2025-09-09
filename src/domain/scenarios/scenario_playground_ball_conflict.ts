import { Scenario } from "./types";

// MVP 情景：操场"抢球误会"（易难度）
export const playgroundBallConflictEasy: Scenario = {
  id: "playground_ball_conflict_easy",
  title: "操场抢球误会",
  sceneName: "操场",
  difficulty: "easy",
  description:
    "课间在操场，同学误会你抢了球，情绪有点激动。你需要先还原事实、表达你的感受，并与同学协商一个公平的玩法。",
  roleCard: {
    name: "Charlie",
    role: "高年级学生",
    personality: "直率、好胜、在意规则",
    background: "Charlie是一个高年级学生，性格直率，比较好胜，很在意游戏规则的公平性。当他觉得有人不按规则来时会比较激动，但本质上是个讲道理的孩子。"
  },
  objectives: {
    obj_fact_finding: {
      description: "还原事实",
      competencies: {
        clarity: { weight: 0.6 },
        problem_solving: { weight: 0.4 },
      },
      successCriteria: [
        "能描述事件的时间与动作（比如'是谁把球踢过来'）",
        "避免绝对化语言（比如'你总是…'）",
      ],
    },
    obj_express_feelings: {
      description: "表达感受与需要",
      competencies: {
        empathy: { weight: 0.5 },
        assertiveness: { weight: 0.5 },
      },
      successCriteria: [
        "使用我信息（比如'我有点着急，因为…'）",
        "避免攻击性措辞（比如'都是你的错'）",
      ],
    },
    obj_find_solution: {
      description: "寻找双赢方案",
      competencies: {
        collaboration: { weight: 0.5 },
        problem_solving: { weight: 0.5 },
      },
      successCriteria: [
        "提出具体可执行的轮换或计时规则",
        "征求对方意见并微调方案",
      ],
    },
  },
  phases: {
    opening: {
      intent: "缓和情绪，确认对方的主要担心，并表明愿意好好说清楚。",
      coachingTips: [
        "先说'我想把事情说清楚'以降低对抗",
        "用简短句子，先表明合作意愿",
      ],
      exitConditions: [
        "孩子表达愿意沟通或示好",
        "NPC的指责程度降低",
      ],
    },
    probing: {
      intent: "还原事实，问清误会来源，补充关键信息。",
      coachingTips: [
        "先描述看到/听到的事实，不急着下判断",
        "提出一个澄清性问题：'你是怎么看到我拿球的？'",
      ],
      exitConditions: [
        "孩子给出时间/动作等客观描述",
        "提出至少一个澄清问题",
      ],
    },
    negotiation: {
      intent: "提出公平的轮换或计时规则，征求对方看法并调整。",
      coachingTips: [
        "提出一个具体方案并问'你觉得可以吗？'",
        "准备一个备选方案（比如'先你后我，每人两分钟'）",
      ],
      exitConditions: [
        "孩子提出可执行方案",
        "NPC表示大体同意或给出修改建议",
      ],
    },
    closure: {
      intent: "达成一致，确认新的规则并积极收尾。",
      coachingTips: [
        "复述一致点：'那就每人两分钟，按顺序来'",
        "用感谢语收尾，增强良好关系",
      ],
      exitConditions: [
        "双方确认具体的执行方式与顺序",
        "以积极/礼貌表达结束本轮",
      ],
    },
    reflection: {
      intent: "简短复盘，强化学到的表达与协商技巧。",
      coachingTips: [
        "说一条做得好的点",
        "说一条下次可改进的点",
      ],
      exitConditions: [
        "孩子能说出做得好与可改进各1条",
      ],
    },
  },
  starterPrompt:
    "你在操场玩球，Charlie 误会你抢走了球。他有点生气。请你先表明愿意好好沟通，试着把事情说清楚。",
  assets: {
    sceneImage: "/images-webp/scenes/playground.webp",
    npcAvatar: "/images-webp/avatar/student_bob.webp",
  },
};