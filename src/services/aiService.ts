import { create } from 'zustand';

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

// NPC角色系统提示词
const createSystemPrompt = (npcName: string, npcRole: string, npcPersonality: string, npcTopics: string[]) => {
  return `你是${npcName}，一个${npcRole}。你的性格特点是：${npcPersonality}。

请按照以下要求进行对话：
1. 始终保持角色身份，用第一人称回答
2. 回答要符合校园环境和你的身份
3. 语言要亲切自然，适合与学生交流
4. 可以聊的话题包括：${npcTopics.join('、')}
5. 回答长度控制在50-150字之间
6. 如果学生问到超出你角色范围的问题，要礼貌地引导回到合适的话题

现在开始对话吧！`;
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
    npcInfo: {
      name: string;
      role: string;
      personality: string;
      topics: string[];
    }
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
        content: createSystemPrompt(npcInfo.name, npcInfo.role, npcInfo.personality, npcInfo.topics)
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
    npcInfo: {
      name: string;
      role: string;
      personality: string;
      topics: string[];
    },
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
        content: createSystemPrompt(npcInfo.name, npcInfo.role, npcInfo.personality, npcInfo.topics)
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
  isTyping = false
): ChatMessage => {
  return {
    id: generateMessageId(),
    role,
    content,
    timestamp: Date.now(),
    isTyping
  };
};