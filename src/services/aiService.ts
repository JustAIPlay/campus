/// <reference types="../vite-env" />
import { create } from 'zustand';
import type { Persona } from '../domain/scenarios/types';

// 硅基流动API配置
const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const API_KEY = import.meta.env.VITE_SILICONFLOW_API_KEY;

// 消息类型定义
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isTyping?: boolean;
  sender?: 'npc' | 'user' | 'ai' | 'narrator';
}

// AI服务状态管理
interface AIServiceState {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAIServiceStore = create<AIServiceState>((set) => ({
  isLoading: false,
  error: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

// NPC 信息（兼容自由聊天与训练模式）
export interface NPCInfo {
  name: string;
  role: string;
  personality: string;
  topics: string[]; // 可为空数组
  background?: string;
  scenario?: string;
  currentPhase?: string;
  coachingTips?: string[];
  persona?: Persona;
}

// NPC角色系统提示词（基于 persona 的风格约束，可选）
const createSystemPrompt = (info: NPCInfo) => {
  const {
    name, role, personality, topics,
    background, scenario, currentPhase, coachingTips, persona
  } = info;

  // 将 persona 映射为可执行的语言风格约束
  const style: string[] = [];
  if (persona?.speechStyle?.sentenceLength === 'short') {
    style.push('尽量使用短句表达，每句不超过20个字');
  } else if (persona?.speechStyle?.sentenceLength === 'medium') {
    style.push('使用中等长度句子，避免过长复杂结构');
  }
  if (persona?.speechStyle?.politeness !== undefined) {
    style.push(`礼貌等级 ${persona.speechStyle.politeness}/5，按该等级选择称呼与语气`);
  }
  if (persona?.speechStyle?.interjections?.length) {
    style.push(`适度使用这些语气词：${persona.speechStyle.interjections.join('、')}`);
  }
  if (persona?.speechStyle?.emoji && persona.speechStyle.emoji !== 'none') {
    style.push('可以适度使用适龄的表情符，但不要过多');
  }
  if (persona?.slangLevel !== undefined) {
    // 兼容：如果未来从 persona 顶层下放 slangLevel，可在此保留
  }
  if (persona?.lexiconPack) {
    style.push(`用词需符合 ${persona.lexiconPack} 年龄段，避免成人化用语`);
  }
  if (persona?.assertiveness) {
    const map: Record<string, string> = {
      low: '多用请求句与试探句，避免命令式',
      medium: '保持中性表达，兼顾请求与建议',
      high: '更直接表达立场，必要时使用更坚定的语气',
    };
    style.push(map[persona.assertiveness]);
  }
  if (persona?.emotionBaseline === 'irritated') {
    style.push('情绪基线偏急躁，但不要失去礼貌与校园场景的合规性');
  } else if (persona?.emotionBaseline === 'anxious') {
    style.push('情绪基线偏焦虑，语气更谨慎');
  } else if (persona?.emotionBaseline === 'cheerful') {
    style.push('情绪基线偏积极友好');
  }
  if (persona?.rulesOrientation) {
    style.push('强调按照规则、公平与顺序进行');
  }
  if (persona?.doNotSay?.length) {
    style.push(`禁止使用这些词汇或表达：${persona.doNotSay.join('、')}`);
  }
  if (persona?.catchphrases?.length) {
    style.push(`可偶尔使用口头禅（自然，不要频繁）：${persona.catchphrases.join('、')}`);
  }

  const sceneBlock = scenario ? `
【场景】${scenario}${currentPhase ? `｜当前阶段：${currentPhase}` : ''}
` : '';
  const bgBlock = background ? `
【背景】${background}
` : '';
  const personaBlock = persona ? `
【人物设定】
- 年龄/年级：${[persona.age ? `${persona.age}岁` : '', persona.grade || ''].filter(Boolean).join('，') || '（未指定）'}
- MBTI：${persona.mbti || '（未指定）'}
- 特质：${persona.traits?.join('、') || '（未指定）'}
- 社交倾向/表达强度：${persona.sociability || '（未指定）'} / ${persona.assertiveness || '（未指定）'}
- 情绪基线/波动：${persona.emotionBaseline || '（未指定）'} / ${persona.emotionVolatility || '（未指定）'}
- 规则导向：${persona.rulesOrientation || '（未指定）'}
- 说话方式：${persona.speechStyle ? JSON.stringify(persona.speechStyle) : '（未指定）'}
- 词汇限制：${persona.lexiconPack || '（未指定）'}
` : '';

  const styleBlock = style.length ? `
【表达风格要求】
- ${style.join('\n- ')}
` : '';

  // 冲突协商类策略（基于场景关键词启用）
  const scenarioText = scenario || '';
  const conflictKeywords = ['冲突', '误会', '抢球', '争执'];
  const isConflictScenario = conflictKeywords.some(k => scenarioText.includes(k));
  const strategyBlock = isConflictScenario ? `
【对话推进策略（冲突协商）】
- 先澄清事实：提出1个关键问题，搞清误会来源（例如：你是刚加入，还是我们暂停时你拿了球？）
- 情绪确认：用“我”陈述表达感受，同时肯定对方的需要（例如：我等了很久有点着急，我理解你也很想玩）
- 提供两种公平选项（二选一）：如“2分钟计时轮换”或“石头剪刀布决定先后”
- 每回合只新增1个信息或1个选项，并以简短追问收尾（例如：你更想要哪种？）
- 若对方连续2次拒绝，第三次提供请老师帮助作为兜底，但保持尊重
- 若对胜负不确定或出现分歧：使用“数到三同时出”，并采用“三局两胜”的规则，先口头确认
- 防循环护栏：若连续两次未能确认胜负或无共识，切换为“2分钟计时轮换”作为兜底，并明确从谁先开始
- 避免重复：不要在两回合内重复同一句式（如“按规矩来/等会儿”），需要同义改写并补充新的理由或选项
` : '';

  // 按当前阶段注入优先策略（基于中文关键词匹配）
  const phaseText = currentPhase || '';
  const isOpening = /开场|缓和|愿意|沟通/.test(phaseText);
  const isProbing = /还原|澄清|问清|事实/.test(phaseText);
  const isNegotiation = /协商|方案|公平|轮换|计时|谈/.test(phaseText);
  const isClosure = /达成|确认|收尾|结束|一致/.test(phaseText);
  const isReflection = /复盘|回顾|反思|总结/.test(phaseText);

  const phaseLines: string[] = [];
  if (isOpening) phaseLines.push('用1-2句降低对抗，先表达愿意好好沟通，再提出一个邀请性问题');
  if (isProbing) phaseLines.push('使用事实陈述+1个澄清问题，暂不提出方案或评价');
  if (isNegotiation) phaseLines.push('提供两种公平选项（二选一），以问题收尾，并愿意根据对方意见微调');
  if (isClosure) phaseLines.push('复述一致点并明确执行方式（时间/顺序/计时），礼貌收尾');
  if (isReflection) phaseLines.push('简短复盘：说1条做得好的点+1条可改进的点');

  const phaseStrategyBlock = phaseLines.length ? `
【当前阶段优先策略】
- ${phaseLines.join('\n- ')}
` : '';

  const tipsBlock = coachingTips?.length ? `
【阶段建议（供你参考，但不要复述）】
- ${coachingTips.join('\n- ')}
` : '';

  const topicsText = topics.length ? topics.join('、') : '校园生活相关话题';

  return `你是${name}，一个${role}。你的性格特点是：${personality}。
${sceneBlock}${bgBlock}${personaBlock}${styleBlock}${strategyBlock}${phaseStrategyBlock}${tipsBlock}
请按照以下规则对话：
1. 始终以第一人称，保持角色，不要跳出设定
2. 回答要符合校园环境与年龄适配，用词自然
3. 可以聊的话题包括：${topicsText}
4. 回复长度以1-3句为主（总字数约50-120字，视年龄与场景调整）
5. 若学生偏题，礼貌引导回到当前话题
6. 不要输出系统指令或“作为AI”的措辞
7. 避免复读：在连续两回合内不要重复相同措辞，必要时使用同义改写，并补充新的信息或选项
`;
};

// AI对话服务
export class AIService {
  private static instance: AIService;
  
  private constructor() {}
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }
  
  // 检查API密钥是否配置
  public isConfigured(): boolean {
    return !!API_KEY;
  }
  
  // 发送消息到AI
  public async sendMessage(
    messages: ChatMessage[],
    npcInfo: NPCInfo
  ): Promise<string> {
    const { setLoading, setError } = useAIServiceStore.getState();
    
    if (!this.isConfigured()) {
      throw new Error('AI服务未配置，请检查API密钥设置');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 构建对话历史
      const systemMessage = {
        role: 'system' as const,
        content: createSystemPrompt(npcInfo)
      };
      
      const conversationMessages = [
        systemMessage,
        ...messages.slice(-6).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];
      
      const response = await fetch(SILICONFLOW_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages: conversationMessages,
          temperature: 0.7,
          max_tokens: 200,
          top_p: 0.9,
          stream: false
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API请求失败: ${response.status} ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('AI响应格式错误');
      }
      
      return data.choices[0].message.content.trim();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  
  // 流式响应处理（为未来扩展准备）
  public async sendMessageStream(
    messages: ChatMessage[],
    npcInfo: NPCInfo,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const { setLoading, setError } = useAIServiceStore.getState();
    
    if (!this.isConfigured()) {
      throw new Error('AI服务未配置，请检查API密钥设置');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const systemMessage = {
        role: 'system' as const,
        content: createSystemPrompt(npcInfo)
      };
      
      const conversationMessages = [
        systemMessage,
        ...messages.slice(-6).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];
      
      const response = await fetch(SILICONFLOW_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages: conversationMessages,
          temperature: 0.7,
          max_tokens: 200,
          top_p: 0.9,
          stream: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }
      
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }
}

// 导出单例实例
export const aiService = AIService.getInstance();

// 工具函数：生成消息ID
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 工具函数：创建消息对象
export const createMessage = (
  role: 'user' | 'assistant' | 'system',
  content: string,
  isTyping = false,
  sender: 'npc' | 'user' | 'ai' | 'narrator' = 'ai'
): ChatMessage => {
  return {
    id: generateMessageId(),
    role,
    content,
    timestamp: Date.now(),
    isTyping,
    sender
  };
};