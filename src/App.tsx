import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { ArrowLeft, MessageCircle, Lightbulb, Users, BookOpen, Coffee, TreePine, Crown, Music, Palette, Flower, Building, Heart, Target, Play } from 'lucide-react';
import { aiService, useAIServiceStore, createMessage, type ChatMessage } from './services/aiService';
import { TypingEffect, AIThinking } from './components/ui/typing-effect';
import { type Scenario, type PhaseKey, type Objective, AVAILABLE_SCENARIOS } from './domain/scenarios';

// 场景数据
const scenes = [
  {
    id: 'classroom',
    name: '教室',
    description: '上课和课间时间',
    image: '/images/场景/教室.png',
    icon: BookOpen,
    npcs: [
      {
        id: 'teacher_wang',
        name: 'Ms. Wang',
        role: '班主任',
        personality: '温和耐心',
        avatar: 'images-webp/avatar/homeroom_teacher.webp',
        topics: [
          '你好，你的作业写完了吗？',
          '今天的课堂表现很棒，继续保持！',
          '有什么不懂的地方可以问我哦',
          '记得按时交作业，养成好习惯'
        ]
      },
      {
        id: 'classmate_xiaoming',
        name: 'Bob',
        role: '同班同学',
        personality: '活泼开朗',
        avatar: 'images-webp/avatar/student_bob.webp',
        topics: [
          '嗨！要不要一起做这道数学题？',
          '你带笔了吗？我的笔坏了',
          '下课后要不要一起去操场玩？',
          '你觉得今天的作业难吗？'
        ]
      },
      {
        id: 'classmate_xiaoli',
        name: 'Alice',
        role: '同班同学',
        personality: '文静内向',
        avatar: 'images-webp/avatar/student_alice.webp',
        topics: [
          '请问可以借我一下橡皮吗？',
          '你知道今天的作业是什么吗？',
          '谢谢你昨天帮我捡铅笔',
          '我们可以一起复习吗？'
        ]
      }
    ]
  },
  {
    id: 'playground',
    name: '操场',
    description: '体育课和课间活动',
    image: '/images/场景/操场.png',
    icon: TreePine,
    npcs: [
      {
        id: 'pe_teacher',
        name: 'Coach Li',
        role: '体育老师',
        personality: '严格认真',
        avatar: 'images-webp/avatar/pe_teacher.webp',
        topics: [
          '今天我们练习跑步，准备好了吗？',
          '运动前要记得热身哦',
          '你的体育技能进步很大！',
          '多运动对身体健康很重要'
        ]
      },
      {
        id: 'senior_student',
        name: 'Charlie',
        role: '高年级学生',
        personality: '友善热心',
        avatar: 'images-webp/avatar/student_john.webp',
        topics: [
          '小朋友，要不要一起踢球？',
          '我教你怎么投篮吧！',
          '在操场要注意安全哦',
          '你们班在学什么新运动？'
        ]
      },
      {
        id: 'shy_kid',
        name: 'Diana',
        role: '低年级学生',
        personality: '害羞胆小',
        avatar: 'images-webp/avatar/student_diana.webp',
        topics: [
          '大哥哥，可以和你们一起玩吗？',
          '我不太会这个游戏...',
          '你们能教教我吗？',
          '我想和大家一起玩'
        ]
      }
    ]
  },
  {
    id: 'library',
    name: '图书馆',
    description: '安静的阅读和学习空间',
    image: '/images/场景/图书室.png',
    icon: BookOpen,
    npcs: [
      {
        id: 'librarian',
        name: 'Ms. Zhang',
        role: '图书管理员',
        personality: '温柔细心',
        avatar: 'images-webp/avatar/图书管理员.webp',
        topics: [
          '小朋友，需要找什么书吗？',
          '记得轻声说话，保持安静哦',
          '这本书很适合你的年级',
          '看完记得把书放回原位'
        ]
      },
      {
        id: 'bookworm',
        name: 'Emma',
        role: '同学',
        personality: '爱读书安静',
        avatar: 'images-webp/avatar/student_emma.webp',
        topics: [
          '这本书真的很好看！',
          '你也喜欢看故事书吗？',
          '我们可以交换书看',
          '安静一点，大家都在学习'
        ]
      }
    ]
  },
  {
    id: 'cafeteria',
    name: '食堂',
    description: '午餐时间和休息',
    image: '/images/场景/食堂.png',
    icon: Coffee,
    npcs: [
      {
        id: 'cafeteria_staff',
        name: '食堂阿姨',
        role: '食堂工作人员',
        personality: '亲切热情',
        avatar: 'images-webp/avatar/食堂阿姨.webp',
        topics: [
          '今天想吃什么呀？',
          '多吃蔬菜对身体好哦',
          '记得说谢谢，有礼貌真棒！',
          '饭后记得收拾餐具哦'
        ]
      },
      {
        id: 'lunch_buddy',
        name: 'Frank',
        role: '同学',
        personality: '开朗友好',
        avatar: 'images-webp/avatar/student_april.webp',
        topics: [
          '一起坐吃饭吧！',
          '今天的菜看起来很香',
          '你带了什么好吃的？',
          '我们聊聊今天发生的事情吧'
        ]
      }
    ]
  },
  {
    id: 'principal_office',
    name: '校长办公室',
    description: '正式的会面和重要对话',
    image: '/images/场景/校长办公室.png',
    icon: Crown,
    npcs: [
      {
        id: 'principal',
        name: 'Principal Chen',
        role: '校长',
        personality: '严肃权威',
        avatar: 'images-webp/avatar/principal.webp',
        topics: [
          '小朋友，你今天来找我有什么事吗？',
          '在学校要遵守纪律，做个好学生',
          '有困难可以找老师和同学帮忙',
          '记住要尊重老师和同学'
        ]
      },
      {
        id: 'secretary',
        name: '秘书阿姨',
        role: '办公室秘书',
        personality: '细致认真',
        avatar: 'images-webp/avatar/校长办公室秘书.webp',
        topics: [
          '请在这里等一下，校长马上就来',
          '需要填写这个表格吗？',
          '请保持安静，这里是办公区',
          '有什么需要帮助的尽管说'
        ]
      }
    ]
  },
  {
    id: 'music_room',
    name: '音乐教室',
    description: '音乐课和艺术表演',
    image: '/images/场景/音乐室.png',
    icon: Music,
    npcs: [
      {
        id: 'music_teacher',
        name: 'Ms. Li',
        role: '音乐老师',
        personality: '活泼有趣',
        avatar: 'images-webp/avatar/音乐老师.webp',
        topics: [
          '今天我们来学一首新歌好吗？',
          '音乐可以表达我们的情感',
          '你喜欢什么乐器呢？',
          '大家一起唱歌很开心！'
        ]
      },
      {
        id: 'choir_student',
        name: 'Grace',
        role: '合唱团成员',
        personality: '自信开朗',
        avatar: 'images-webp/avatar/student_grace.webp',
        topics: [
          '你要不要加入我们合唱团？',
          '这首歌的节拍是这样的',
          '唱歌要放松，不要紧张',
          '我们一起练习吧！'
        ]
      }
    ]
  },
  {
    id: 'art_room',
    name: '美术教室',
    description: '绘画和手工制作',
    image: '/images/场景/美术室.png',
    icon: Palette,
    npcs: [
      {
        id: 'art_teacher',
        name: '张美术老师',
        role: '美术老师',
        personality: '创意温和',
        avatar: 'images-webp/avatar/美术老师.webp',
        topics: [
          '今天我们画什么主题呢？',
          '艺术没有对错，发挥你的想象力',
          '这个颜色搭配很漂亮！',
          '记得收拾好画具哦'
        ]
      },
      {
        id: 'artistic_student',
        name: 'Henry',
        role: '同学',
        personality: '有创意内向',
        avatar: 'images-webp/avatar/student_linda.webp',
        topics: [
          '你觉得我画得怎么样？',
          '可以借我一下你的蜡笔吗？',
          '我最喜欢画彩虹了',
          '我们交换作品看看吧'
        ]
      }
    ]
  },
  {
    id: 'school_garden',
    name: '校园花园',
    description: '户外休息和自然观察',
    image: '/images/场景/小花园.png',
    icon: Flower,
    npcs: [
      {
        id: 'gardener',
        name: '园丁爷爷',
        role: '校园园丁',
        personality: '慈祥博学',
        avatar: 'images-webp/avatar/园丁爷爷.webp',
        topics: [
          '小朋友，这些花漂亮吗？',
          '植物需要阳光和水才能长大',
          '你知道这是什么花吗？',
          '要爱护花草树木哦'
        ]
      },
      {
        id: 'nature_student',
        name: 'Ivy',
        role: '同学',
        personality: '好奇爱探索',
        avatar: 'images-webp/avatar/student_ivy.webp',
        topics: [
          '我发现了一只小蝴蝶！',
          '你知道这片叶子为什么变黄了吗？',
          '我们来观察小昆虫吧',
          '大自然真的很神奇！'
        ]
      }
    ]
  },
  {
    id: 'hallway',
    name: '走廊',
    description: '课间走动和偶遇',
    image: '/images/场景/教室走廊.png',
    icon: Building,
    npcs: [
      {
        id: 'discipline_teacher',
        name: '值日老师',
        role: '值日教师',
        personality: '负责严格',
        avatar: 'images-webp/avatar/值日老师.webp',
        topics: [
          '走廊里不要跑，注意安全',
          '上课铃响了，快回教室吧',
          '你的红领巾很整齐，真棒！',
          '有没有同学需要帮助？'
        ]
      },
      {
        id: 'passing_student',
        name: 'Jack',
        role: '其他班同学',
        personality: '友好匆忙',
        avatar: 'images-webp/avatar/student_moon.webp',
        topics: [
          '不好意思，请问洗手间在哪里？',
          '你知道几年级几班在哪吗？',
          '你掉了这支笔吗？',
          '谢谢你让路！'
        ]
      }
    ]
  },
  {
    id: 'health_room',
    name: '医务室',
    description: '身体不适时的关怀',
    image: '/images/场景/医务室.png',
    icon: Heart,
    npcs: [
      {
        id: 'school_nurse',
        name: '校医阿姨',
        role: '校医',
        personality: '温柔关怀',
        avatar: 'images-webp/avatar/校医阿姨.webp',
        topics: [
          '哪里不舒服呀？告诉阿姨',
          '喝点温水，休息一下就好了',
          '以后要注意保护好自己',
          '感觉好些了吗？'
        ]
      },
      {
        id: 'sick_student',
        name: '身体不适的同学',
        role: '同学',
        personality: '虚弱需要关心',
        avatar: 'images-webp/avatar/生病学生.webp',
        topics: [
          '我头有点晕...',
          '谢谢你陪我来医务室',
          '我想给妈妈打电话',
          '我能帮我请假吗？'
        ]
      }
    ]
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'scene' | 'chat' | 'training'>('home');
  const [selectedScene, setSelectedScene] = useState<typeof scenes[0] | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<typeof scenes[0]['npcs'][0] | null>(null);
  
  // 新增训练场景状态
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [currentPhase, setCurrentPhase] = useState<PhaseKey>('opening');
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: 'npc' | 'user' | 'ai' | 'narrator', content: string}>>([]);
  const [showAIHelp, setShowAIHelp] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  // AI服务状态
  const { isLoading: aiLoading, error: aiError } = useAIServiceStore();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 预加载背景图片
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => setBackgroundLoaded(true);
    img.onerror = () => setBackgroundLoaded(true); // 即使加载失败也继续显示
    img.src = '/images-webp/school.webp';
  }, []);

  const startChat = (npc: typeof scenes[0]['npcs'][0]) => {
    setSelectedNPC(npc);
    const initialTopic = npc.topics[Math.floor(Math.random() * npc.topics.length)];
    setChatMessages([
      {
        id: '1',
        sender: 'npc',
        content: initialTopic
      }
    ]);
    setCurrentView('chat');
  };

  // 启动训练场景
  const startTrainingScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    setCurrentPhase('opening');
    setIsTrainingMode(true);
    
    // 使用旁白+NPC开场作为初始消息（NPC优先使用第一人称 npcOpening）
    const now = Date.now();
    const npcOpening = scenario.npcOpening || '喂，你刚刚为什么把球拿走？那是我们在玩的。';
    setChatMessages([
      {
        id: String(now),
        sender: 'narrator',
        content: `${scenario.sceneName} · 开场：${scenario.description}`
      },
      {
        id: String(now + 1),
        sender: 'npc',
        content: npcOpening
      }
    ]);
    setCurrentView('training');
  };

  // 重置到普通聊天模式
  const exitTrainingMode = () => {
    setIsTrainingMode(false);
    setCurrentScenario(null);
    setCurrentPhase('opening');
    setChatMessages([]);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    
    // 训练模式下需要scenario，普通聊天模式需要selectedNPC
    if (isTrainingMode && !currentScenario) return;
    if (!isTrainingMode && !selectedNPC) return;

    const newUserMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      content: userInput
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput('');

    // 检查AI服务是否配置
    if (!aiService.isConfigured()) {
      const errorMessage = createMessage('assistant', '⚠️ AI服务未配置，请在.env文件中设置VITE_SILICONFLOW_API_KEY');
      setChatMessages(prev => [...prev, errorMessage]);
      return;
    }

    try {
      // 显示AI正在思考的状态
      const thinkingMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'npc' as const,
        content: '正在思考中...'
      };
      setChatMessages(prev => [...prev, thinkingMessage]);

      // 构建对话历史（转换格式）
      const conversationHistory: ChatMessage[] = chatMessages
        .filter(msg => !msg.content.includes('正在思考中') && msg.sender !== 'narrator')
        .map(msg => ({
          id: msg.id,
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: parseInt(msg.id) || Date.now()
        }));
      
      // 添加当前用户消息
      conversationHistory.push({
        id: newUserMessage.id,
        role: 'user',
        content: newUserMessage.content,
        timestamp: Date.now()
      });

      let aiResponse: string;
      
      if (isTrainingMode && currentScenario) {
        // 训练模式：基于scenario和当前phase构建NPC信息
        const currentPhaseConfig = currentScenario.phases[currentPhase];
        const enhancedNpcInfo = {
          name: currentScenario.roleCard.name,
          role: currentScenario.roleCard.role,
          personality: currentScenario.roleCard.personality,
          topics: [],
          background: currentScenario.roleCard.background,
          scenario: currentScenario.title,
          currentPhase: currentPhaseConfig?.intent || currentPhase,
          coachingTips: currentPhaseConfig?.coachingTips || [],
          persona: currentScenario.roleCard.persona
        };
        
        aiResponse = await aiService.sendMessage(conversationHistory, enhancedNpcInfo);
      } else {
        // 普通聊天模式：使用原有逻辑
        aiResponse = await aiService.sendMessage(
          conversationHistory,
          {
            name: selectedNPC!.name,
            role: selectedNPC!.role,
            personality: selectedNPC!.personality,
            topics: selectedNPC!.topics
          }
        );
      }

      // 移除思考状态消息，添加AI回复
      setChatMessages(prev => {
        const withoutThinking = prev.filter(msg => !msg.content.includes('正在思考中'));
        const npcResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'npc' as const,
          content: aiResponse
        };
        return [...withoutThinking, npcResponse];
      });

    } catch (error) {
      console.error('AI服务调用失败:', error);
      
      // 移除思考状态消息，显示错误信息
      setChatMessages(prev => {
        const withoutThinking = prev.filter(msg => !msg.content.includes('正在思考中'));
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'npc' as const,
          content: '抱歉，我现在有点忙，稍后再聊吧！'
        };
        return [...withoutThinking, errorMessage];
      });
    }
  };

  const getAIAdvice = () => {
    const advice = [
      '记住要保持眼神交流，这样显得更友好',
      '可以用"请"和"谢谢"让对话更礼貌',
      '倾听别人说话很重要，不要急着打断',
      '微笑能让对话氛围更轻松愉快',
      '如果不明白可以礼貌地请对方再说一遍',
      '分享自己的想法时要清楚表达',
      '尊重不同的观点，即使不同意也要礼貌'
    ];

    const randomAdvice = advice[Math.floor(Math.random() * advice.length)];
    
    const aiMessage = {
      id: (Date.now() + 2).toString(),
      sender: 'ai' as const,
      content: randomAdvice
    };

    setChatMessages(prev => [...prev, aiMessage]);
    setShowAIHelp(false);
  };

  // 在背景图片加载完成前显示加载状态
  if (!backgroundLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏫</div>
          <p className="text-lg text-muted-foreground">校园社交训练加载中...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'home') {
    return (
      <div 
        className="min-h-screen p-4 lg:p-8"
        style={{
          backgroundImage: 'url("/images-webp/school.webp")',
          backgroundSize: windowWidth < 768 ? 'cover' : 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-md mx-auto lg:max-w-6xl relative z-10">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl mb-2">🏫 校园社交训练</h1>
            <p className="text-muted-foreground lg:text-lg">选择一个场景开始练习社交技能</p>
            
            {/* 训练模式入口 */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => {
                  // 直接启动第一个可用的训练场景
                  if (AVAILABLE_SCENARIOS.length > 0) {
                    startTrainingScenario(AVAILABLE_SCENARIOS[0]);
                  }
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                size="lg"
              >
                <Target className="w-5 h-5" />
                开始目标训练
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                自由聊天模式
              </Button>
            </div>
          </div>

          <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 xl:grid-cols-3">
            {scenes.map((scene) => (
              <Card 
                key={scene.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setSelectedScene(scene);
                  setCurrentView('scene');
                }}
              >
                <div className="relative h-32 lg:h-48">
                  <ImageWithFallback
                    src={scene.image}
                    alt={scene.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <CardContent className="p-4 lg:p-6">
                  <p className="text-sm lg:text-base text-muted-foreground">{scene.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {scene.npcs.length} 个角色
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'scene' && selectedScene) {
    // 根据场景ID获取对应的本地背景图片
     const getSceneBackgroundImage = (sceneId: string) => {
        const sceneImageMap: { [key: string]: string } = {
          'classroom': '/images-webp/scenes/classroom.webp',
          'playground': '/images-webp/scenes/playground.webp',
          'library': '/images-webp/scenes/library.webp',
          'cafeteria': '/images-webp/scenes/cafeteria.webp',
          'principal_office': '/images-webp/scenes/principal_office.webp',
          'music_room': '/images-webp/scenes/music_room.webp',
          'art_room': '/images-webp/scenes/art_room.webp',
          'school_garden': '/images-webp/scenes/school_garden.webp',
          'hallway': '/images-webp/scenes/hallway.webp',
          'health_room': '/images-webp/scenes/health_room.webp'
        };
        return sceneImageMap[sceneId] || '';
      };

    const backgroundImage = getSceneBackgroundImage(selectedScene.id);
    console.log('Scene ID:', selectedScene.id, 'Background Image:', backgroundImage);

    return (
      <div 
        className="min-h-screen p-4 lg:p-8 relative"
        style={{
          backgroundImage: backgroundImage ? `url("${backgroundImage}")` : 'linear-gradient(to bottom, rgb(239 246 255), rgb(250 245 255))',
          backgroundSize: windowWidth < 768 ? 'cover' : 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >

        <div className="max-w-md mx-auto lg:max-w-6xl relative z-10">
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCurrentView('home')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl">{selectedScene.name}</h1>
              <p className="text-sm lg:text-base text-muted-foreground">{selectedScene.description}</p>
            </div>
          </div>

          <div>
            <div className="space-y-3">
              <h2 className="text-lg lg:text-xl mb-3 lg:mb-4">选择一个角色开始对话：</h2>
              {selectedScene.npcs.map((npc) => (
                <Card 
                  key={npc.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => startChat(npc)}
                >
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                        {npc.avatar.includes('.webp') ? (
                          <ImageWithFallback
                            src={npc.avatar}
                            alt={npc.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-2xl lg:text-3xl">{npc.avatar}</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium lg:text-lg">{npc.name}</h3>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs lg:text-sm">{npc.role}</Badge>
                          <Badge variant="secondary" className="text-xs lg:text-sm">{npc.personality}</Badge>
                        </div>
                      </div>
                      <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'training' && currentScenario) {
    // 跳过旁白（仅在训练视图作用域内）
    const skipNarrator = () => {
      setChatMessages(prev => prev.filter(m => m.sender !== 'narrator'));
    };
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <div className="flex-1 max-w-md mx-auto lg:max-w-4xl w-full flex flex-col">
          {/* 训练头部 - 显示目标和进度 */}
          <div className="bg-white/95 backdrop-blur-sm border-b border-blue-100 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  exitTrainingMode();
                  setCurrentView('home');
                }}
                className="flex items-center gap-2 hover:bg-gray-100 transition-colors duration-200"
                style={{
                  ':hover': {
                    backgroundColor: '#f3f4f6'
                  }
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                退出训练
              </Button>
              
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-lg lg:text-xl font-semibold text-blue-800" style={{ fontWeight: '600' }}>{currentScenario.title}</span>
              </div>
            </div>
            
            {/* 训练目标展示 */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 mb-3 border border-blue-100">
              <h4 className="font-medium text-sm mb-2 text-blue-800">🎯 训练目标</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(currentScenario.objectives).map(([key, objective], index) => (
                  <div
                    key={key}
                    className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-all duration-200 ${
                      index === 0 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'bg-transparent border border-blue-500 text-blue-600 hover:bg-blue-50'
                    }`}
                    style={{
                      backgroundColor: index === 0 ? '#4096ff' : 'transparent',
                      borderColor: '#4096ff',
                      color: index === 0 ? 'white' : '#4096ff'
                    }}
                  >
                    {(objective as Objective).description}
                  </div>
                ))}
              </div>
            </div>
            
            {/* 阶段进度 */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500" style={{ color: '#888' }}>当前阶段:</span>
              <Badge variant="outline" className="bg-white">
                {currentScenario.phases[currentPhase]?.intent || currentPhase}
              </Badge>
            </div>
          </div>

          {/* 聊天消息 */}
          <div className="flex-1 overflow-y-auto space-y-3 lg:space-y-4" style={{ padding: '16px', marginTop: '24px' }}>
            {chatMessages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  message.sender === 'user' ? 'justify-end' : message.sender === 'narrator' ? 'justify-center' : 'justify-start'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* NPC头像 - 左侧显示 */}
                {message.sender === 'npc' && (
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 flex-shrink-0">
                    <ImageWithFallback
                      src={currentScenario.assets.npcAvatar}
                      alt={currentScenario.roleCard.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div
                  className={`px-3 py-2 lg:px-4 lg:py-3 relative shadow-sm ${
                    message.sender === 'user'
                      ? 'max-w-[75%] lg:max-w-[65%] bg-orange-50 text-gray-800 rounded-lg rounded-br-md border border-orange-200'
                      : message.sender === 'ai'
                      ? 'w-80 lg:w-96 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg rounded-bl-md'
                      : message.sender === 'narrator'
                      ? 'w-full lg:w-[80%] mx-auto bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-center'
                      : 'w-80 lg:w-96 bg-cyan-50 text-gray-800 rounded-lg rounded-bl-md border border-cyan-200'
                  }`}
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {message.sender === 'ai' && (
                    <div className="flex items-center gap-1 mb-1">
                      <Lightbulb className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="text-xs lg:text-sm font-medium">AI助手建议</span>
                    </div>
                  )}
                  {message.sender === 'narrator' && (
                    <div className="flex items-center justify-between mb-1 text-xs text-gray-500">
                      <span>旁白</span>
                      {index === 0 && (
                        <button onClick={skipNarrator} className="text-gray-400 hover:text-gray-600 underline underline-offset-2">跳过旁白</button>
                      )}
                    </div>
                  )}
                  <p className="text-sm lg:text-base text-gray-700" style={{ lineHeight: '1.5' }}>{message.content}</p>
                </div>
                
                {/* 用户头像 - 右侧显示 */}
                {message.sender === 'user' && (
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-purple-200 border border-purple-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src="images-webp/avatar/student_grace.webp"
                      alt="Grace"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 输入区域 */}
          <div className="p-4 lg:p-6 bg-white border-t">
            <div className="flex gap-2 lg:gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="输入你的回应..."
                className="flex-1 px-3 py-2 lg:px-4 lg:py-3 border rounded-lg focus:outline-none text-sm lg:text-base transition-all duration-200"
                style={{
                  borderColor: userInput.trim() ? '#4096ff' : '#d1d5db',
                  boxShadow: userInput.trim() ? '0 0 0 2px rgba(64, 150, 255, 0.1)' : 'none',
                  transform: userInput.trim() ? 'scale(1.01)' : 'scale(1)'
                }}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              {userInput.trim() && (
                <Button 
                  onClick={sendMessage} 
                  className="px-4 lg:px-6 py-2 lg:py-3 bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200 animate-in slide-in-from-right-2"
                  style={{ backgroundColor: '#8b5cf6', color: 'white' }}
                >
                  发送
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'chat' && selectedNPC) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
        <div className="flex-1 max-w-md mx-auto lg:max-w-4xl w-full flex flex-col">
          {/* 头部 */}
          <div className="flex items-center gap-3 p-4 lg:p-6 bg-white shadow-sm">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCurrentView('scene')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                {selectedNPC.avatar.includes('.webp') ? (
                  <ImageWithFallback
                    src={selectedNPC.avatar}
                    alt={selectedNPC.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-xl lg:text-2xl">{selectedNPC.avatar}</div>
                )}
              </div>
              <div>
                <h2 className="font-medium lg:text-lg">{selectedNPC.name}</h2>
                <p className="text-xs lg:text-sm text-muted-foreground">{selectedNPC.role} • {selectedNPC.personality}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIHelp(true)}
              className="flex items-center gap-1 lg:gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span className="hidden lg:inline">获取建议</span>
            </Button>
          </div>

          {/* 聊天消息 */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-3 lg:space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* NPC头像 - 左侧显示 */}
                {message.sender === 'npc' && (
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 flex-shrink-0">
                    {selectedNPC?.avatar.includes('.webp') ? (
                      <ImageWithFallback
                        src={selectedNPC.avatar}
                        alt={selectedNPC.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-sm lg:text-base">{selectedNPC?.avatar}</div>
                    )}
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] lg:max-w-[65%] rounded-2xl px-3 py-2 lg:px-4 lg:py-3 relative ${
                    message.sender === 'user'
                      ? 'bg-pink-200 text-gray-900 rounded-br-md border border-pink-300'
                      : message.sender === 'ai'
                      ? 'bg-yellow-100 text-yellow-900 border border-yellow-200 rounded-bl-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="flex items-center gap-1 mb-1">
                      <Lightbulb className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="text-xs lg:text-sm font-medium">AI助手建议</span>
                    </div>
                  )}
                  {message.sender === 'ai' ? (
                    <TypingEffect text={message.content} className="text-sm lg:text-base" />
                  ) : (
                    <p className="text-sm lg:text-base leading-relaxed">{message.content}</p>
                  )}
                </div>
                
                {/* 用户头像 - 右侧显示 */}
                {message.sender === 'user' && (
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-pink-200 border border-pink-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src="images-webp/avatar/student_grace.webp"
                      alt="Grace"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
            
            {/* AI思考状态 */}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] lg:max-w-[70%] rounded-lg p-3 lg:p-4 bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center gap-1 mb-1">
                    <Lightbulb className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-600" />
                    <span className="text-xs lg:text-sm font-medium text-yellow-800">AI助手</span>
                  </div>
                  <AIThinking />
                </div>
              </div>
            )}
            
            {/* AI错误状态 */}
            {aiError && (
              <div className="flex justify-start">
                <div className="max-w-[80%] lg:max-w-[70%] rounded-lg p-3 lg:p-4 bg-red-50 border border-red-200">
                  <div className="flex items-center gap-1 mb-1">
                    <Lightbulb className="w-3 h-3 lg:w-4 lg:h-4 text-red-600" />
                    <span className="text-xs lg:text-sm font-medium text-red-800">AI助手</span>
                  </div>
                  <p className="text-sm lg:text-base text-red-700">
                    抱歉，AI助手暂时无法回复。请稍后再试。
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 内联建议气泡 */}
          {currentScenario && currentScenario.phases[currentPhase]?.coachingTips && currentScenario.phases[currentPhase].coachingTips.length > 0 && (
            <div className="px-4 lg:px-6 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">💡 建议回复</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentScenario.phases[currentPhase].coachingTips.map((tip, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setUserInput(tip);
                    }}
                    className="px-3 py-1.5 bg-white border border-blue-200 rounded-full text-sm text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer shadow-sm"
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 输入区域 */}
          <div className="p-4 lg:p-6 bg-white border-t">
            <div className="flex gap-2 lg:gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="输入你的回复..."
                className="flex-1 px-3 py-2 lg:px-4 lg:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm lg:text-base"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!userInput.trim()}
                className="lg:px-6"
              >
                发送
              </Button>
            </div>
          </div>
        </div>

        {/* AI帮助对话框 */}
        <Dialog open={showAIHelp} onOpenChange={setShowAIHelp}>
          <DialogContent className="max-w-sm mx-auto lg:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                AI 社交建议
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm lg:text-base text-muted-foreground">
                需要一些社交技巧的建议吗？AI助手可以帮助你更好地与他人交流。
              </p>
              <Button onClick={getAIAdvice} className="w-full">
                获取建议
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
}