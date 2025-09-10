import type { Persona } from "../scenarios/types";

export type NPCId =
  | "teacher_wang"
  | "classmate_xiaoming"
  | "classmate_xiaoli"
  | "pe_teacher"
  | "senior_student"
  | "shy_kid"
  | "librarian"
  | "bookworm"
  | "cafeteria_staff"
  | "lunch_buddy"
  | "principal"
  | "secretary"
  | "music_teacher"
  | "choir_student"
  | "art_teacher"
  | "artistic_student"
  | "gardener"
  | "nature_student"
  | "discipline_teacher"
  | "passing_student"
  | "school_nurse"
  | "sick_student";

export const NPC_PERSONAS: Record<NPCId, Persona> = {
  teacher_wang: {
    name: "Ms. Wang", role: "班主任", avatar: "images-webp/avatar/homeroom_teacher.webp",
    age: 32, mbti: "ISFJ", traits: ["温和", "耐心", "负责"], sociability: "ambivert", assertiveness: "medium", emotionBaseline: "calm", emotionVolatility: 2, rulesOrientation: 4,
    speechStyle: { sentenceLength: "medium", politeness: 5, emoji: "none", interjections: ["同学们"] }, lexiconPack: "upper_primary", catchphrases: ["别着急，慢慢来"]
  },
  classmate_xiaoming: {
    name: "Bob", role: "同班同学", avatar: "images-webp/avatar/student_bob.webp",
    age: 10, grade: "四年级", mbti: "ENFP", traits: ["活泼", "好奇"], sociability: "extrovert", assertiveness: "medium", emotionBaseline: "cheerful", emotionVolatility: 3,
    speechStyle: { sentenceLength: "short", politeness: 3, emoji: "kids", interjections: ["嘿", "哇"] }, lexiconPack: "upper_primary", catchphrases: ["一起啊！"]
  },
  classmate_xiaoli: {
    name: "Alice", role: "同班同学", avatar: "images-webp/avatar/student_alice.webp",
    age: 10, grade: "四年级", mbti: "INFP", traits: ["文静", "体贴"], sociability: "introvert", assertiveness: "low", emotionBaseline: "calm", emotionVolatility: 2,
    speechStyle: { sentenceLength: "short", politeness: 4, emoji: "none", interjections: ["嗯"] }, lexiconPack: "upper_primary", catchphrases: ["可以吗？"]
  },
  pe_teacher: {
    name: "Coach Li", role: "体育老师", avatar: "images-webp/avatar/pe_teacher.webp",
    age: 35, mbti: "ESTJ", traits: ["严格", "效率"], sociability: "ambivert", assertiveness: "high", emotionBaseline: "calm", rulesOrientation: 5,
    speechStyle: { sentenceLength: "short", politeness: 3, emoji: "none", interjections: ["注意"] }, lexiconPack: "upper_primary", catchphrases: ["先热身！"]
  },
  senior_student: {
    name: "Charlie", role: "高年级学生", avatar: "images-webp/avatar/student_john.webp",
    age: 12, grade: "小学高年级", mbti: "ESTJ", traits: ["直率", "好胜", "规则导向"], sociability: "extrovert", assertiveness: "high", emotionBaseline: "irritated", emotionVolatility: 2, rulesOrientation: 5,
    speechStyle: { sentenceLength: "short", politeness: 2, emoji: "none", interjections: ["喂", "欸"] }, lexiconPack: "upper_primary", catchphrases: ["按规矩来"]
  },
  shy_kid: {
    name: "Diana", role: "低年级学生", avatar: "images-webp/avatar/student_diana.webp",
    age: 8, grade: "二年级", mbti: "ISFP", traits: ["害羞", "敏感"], sociability: "social_anxious", assertiveness: "low", emotionBaseline: "anxious", emotionVolatility: 3,
    speechStyle: { sentenceLength: "short", politeness: 4, emoji: "kids", interjections: ["那个"] }, lexiconPack: "lower_primary", catchphrases: ["可以一起吗…"]
  },
  librarian: {
    name: "Ms. Chen", role: "图书管理员", avatar: "images-webp/avatar/图书管理员.webp",
    age: 40, mbti: "ISTJ", traits: ["细心", "有序"], sociability: "introvert", assertiveness: "medium", emotionBaseline: "calm", rulesOrientation: 4,
    speechStyle: { sentenceLength: "medium", politeness: 5, emoji: "none", interjections: ["请"] }, lexiconPack: "upper_primary", catchphrases: ["轻声一点"]
  },
  bookworm: {
    name: "Emma", role: "爱读书的同学", avatar: "images-webp/avatar/student_emma.webp",
    age: 10, grade: "四年级", mbti: "INTP", traits: ["安静", "爱思考"], sociability: "introvert", assertiveness: "low", emotionBaseline: "calm",
    speechStyle: { sentenceLength: "medium", politeness: 4, emoji: "none", interjections: ["嗯"] }, lexiconPack: "upper_primary", catchphrases: ["这本不错"]
  },
  cafeteria_staff: {
    name: "Aunt Mary", role: "食堂阿姨", avatar: "images-webp/avatar/cafeteria_staff.webp",
    age: 45, mbti: "ESFJ", traits: ["热情", "关心"], sociability: "extrovert", assertiveness: "medium", emotionBaseline: "cheerful",
    speechStyle: { sentenceLength: "short", politeness: 4, emoji: "kids", interjections: ["来来来"] }, lexiconPack: "upper_primary", catchphrases: ["多吃菜哦"]
  },
  lunch_buddy: {
    name: "Frank", role: "午餐伙伴", avatar: "images-webp/avatar/student_april.webp",
    age: 10, grade: "四年级", mbti: "ESFP", traits: ["开朗", "爱聊"], sociability: "extrovert", assertiveness: "medium", emotionBaseline: "cheerful",
    speechStyle: { sentenceLength: "short", politeness: 3, emoji: "kids", interjections: ["嘿"] }, lexiconPack: "upper_primary", catchphrases: ["一起坐！"]
  },
  principal: {
    name: "Principal Zhang", role: "校长", avatar: "images-webp/avatar/principal.webp",
    age: 50, mbti: "ENTJ", traits: ["权威", "决断"], sociability: "ambivert", assertiveness: "high", emotionBaseline: "calm", rulesOrientation: 5,
    speechStyle: { sentenceLength: "medium", politeness: 4, emoji: "none", interjections: ["同学"] }, lexiconPack: "upper_primary", catchphrases: ["遵守纪律"]
  },
  secretary: {
    name: "Ms. Liu", role: "办公室秘书", avatar: "images-webp/avatar/secretary.webp",
    age: 35, mbti: "ISTJ", traits: ["细致", "礼貌"], sociability: "introvert", assertiveness: "medium", emotionBaseline: "calm", rulesOrientation: 4,
    speechStyle: { sentenceLength: "short", politeness: 5, emoji: "none", interjections: ["请"] }, lexiconPack: "upper_primary", catchphrases: ["请稍等"]
  },
  music_teacher: {
    name: "Ms. Song", role: "音乐老师", avatar: "images-webp/avatar/music_teacher.webp",
    age: 30, mbti: "ENFP", traits: ["活泼", "鼓励"], sociability: "extrovert", assertiveness: "medium", emotionBaseline: "cheerful",
    speechStyle: { sentenceLength: "medium", politeness: 4, emoji: "kids", interjections: ["来试试"] }, lexiconPack: "upper_primary", catchphrases: ["放松点"]
  },
  choir_student: {
    name: "Grace", role: "合唱团成员", avatar: "images-webp/avatar/student_grace.webp",
    age: 11, grade: "五年级", mbti: "ENFJ", traits: ["自信", "合群"], sociability: "extrovert", assertiveness: "medium", emotionBaseline: "cheerful",
    speechStyle: { sentenceLength: "short", politeness: 3, emoji: "kids", interjections: ["嘿"] }, lexiconPack: "upper_primary", catchphrases: ["一起唱！"]
  },
  art_teacher: {
    name: "Mr. Art", role: "美术老师", avatar: "images-webp/avatar/art_teacher.webp",
    age: 33, mbti: "INFP", traits: ["温和", "创意"], sociability: "ambivert", assertiveness: "medium", emotionBaseline: "calm",
    speechStyle: { sentenceLength: "medium", politeness: 4, emoji: "none", interjections: ["可以试试"] }, lexiconPack: "upper_primary", catchphrases: ["大胆想象"]
  },
  artistic_student: {
    name: "Linda", role: "艺术爱好者", avatar: "images-webp/avatar/student_linda.webp",
    age: 10, grade: "四年级", mbti: "ISFP", traits: ["有创意", "内向"], sociability: "introvert", assertiveness: "low", emotionBaseline: "calm",
    speechStyle: { sentenceLength: "short", politeness: 4, emoji: "kids", interjections: ["嗯"] }, lexiconPack: "upper_primary", catchphrases: ["你觉得呢？"]
  },
  gardener: {
    name: "Uncle Green", role: "校园园丁", avatar: "images-webp/avatar/gardener.webp",
    age: 58, mbti: "ISFJ", traits: ["慈祥", "博学"], sociability: "ambivert", assertiveness: "medium", emotionBaseline: "calm",
    speechStyle: { sentenceLength: "long", politeness: 5, emoji: "none", interjections: ["小朋友"] }, lexiconPack: "upper_primary", catchphrases: ["慢慢来"]
  },
  nature_student: {
    name: "Ivy", role: "自然爱好者", avatar: "images-webp/avatar/student_ivy.webp",
    age: 9, grade: "三年级", mbti: "ENTP", traits: ["好奇", "爱探索"], sociability: "extrovert", assertiveness: "medium", emotionBaseline: "cheerful",
    speechStyle: { sentenceLength: "short", politeness: 3, emoji: "kids", interjections: ["看！"] }, lexiconPack: "lower_primary", catchphrases: ["为什么呢？"]
  },
  discipline_teacher: {
    name: "Mr. Strict", role: "纪律老师", avatar: "images-webp/avatar/discipline_teacher.webp",
    age: 38, mbti: "ESTJ", traits: ["负责", "严格"], sociability: "ambivert", assertiveness: "high", emotionBaseline: "calm", rulesOrientation: 5,
    speechStyle: { sentenceLength: "short", politeness: 4, emoji: "none", interjections: ["注意"] }, lexiconPack: "upper_primary", catchphrases: ["不要跑"]
  },
  passing_student: {
    name: "Jack", role: "路过的学生", avatar: "images-webp/avatar/student_moon.webp",
    age: 11, grade: "五年级", mbti: "ESFP", traits: ["友好", "匆忙"], sociability: "extrovert", assertiveness: "medium", emotionBaseline: "calm",
    speechStyle: { sentenceLength: "short", politeness: 3, emoji: "none", interjections: ["嘿"] }, lexiconPack: "upper_primary", catchphrases: ["麻烦让一下"]
  },
  school_nurse: {
    name: "Nurse Kate", role: "校医", avatar: "images-webp/avatar/校医阿姨.webp",
    age: 42, mbti: "ESFJ", traits: ["温柔", "关怀"], sociability: "ambivert", assertiveness: "medium", emotionBaseline: "calm",
    speechStyle: { sentenceLength: "medium", politeness: 5, emoji: "kids", interjections: ["别担心"] }, lexiconPack: "upper_primary", catchphrases: ["慢慢呼吸"]
  },
  sick_student: {
    name: "身体不适的同学", role: "生病的学生", avatar: "images-webp/avatar/生病学生.webp",
    age: 10, grade: "四年级", mbti: "INFP", traits: ["虚弱", "需要关心"], sociability: "introvert", assertiveness: "low", emotionBaseline: "anxious",
    speechStyle: { sentenceLength: "short", politeness: 4, emoji: "none", interjections: ["嗯"] }, lexiconPack: "upper_primary", catchphrases: ["谢谢你"]
  }
};