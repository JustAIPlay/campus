import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Target, Clock, Users, Star, ChevronRight, Info } from 'lucide-react';
import { 
  TrainingScenarioTemplate, 
  TRAINING_SCENARIO_TEMPLATES,
  SCENE_NPC_MAPPINGS,
  getScenariosBySkill,
  getScenariosByDifficulty 
} from '../../domain/scenarios';
import { NPCId } from '../../domain/npcs/personas';

interface TrainingScenarioSelectorProps {
  onScenarioSelect: (template: TrainingScenarioTemplate, npcId: NPCId) => void;
  onBack: () => void;
}

interface ScenarioCardProps {
  template: TrainingScenarioTemplate;
  onSelect: () => void;
  onPreview: () => void;
}

const ScenarioCard = ({ template, onSelect, onPreview }: ScenarioCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      conflict_resolution: '冲突解决',
      empathy_building: '同理心培养',
      assertiveness: '自信表达',
      collaboration: '合作协商',
      problem_solving: '问题解决'
    };
    return labels[category] || category;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {template.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getDifficultyColor(template.difficulty)}>
                {template.difficulty === 'easy' ? '简单' : template.difficulty === 'medium' ? '中等' : '困难'}
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {getSkillCategoryLabel(template.skillCategory)}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {template.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{template.estimatedDuration}分钟</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{template.recommendedNPCs.length}个角色</span>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium text-gray-700">主要目标：</span>
            <p className="text-xs text-gray-600">{template.objectives.primary}</p>
          </div>
        </div>

        <Button 
          onClick={onSelect}
          className="w-full mt-4 group-hover:bg-blue-600 transition-colors"
        >
          开始训练
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

interface NPCSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: TrainingScenarioTemplate | null;
  onNPCSelect: (npcId: NPCId) => void;
}

const NPCSelectionDialog = ({ 
  isOpen, 
  onClose, 
  template, 
  onNPCSelect 
}: NPCSelectionDialogProps) => {
  if (!template) return null;

  const sceneMapping = SCENE_NPC_MAPPINGS.find(m => m.sceneId === template.sceneId);
  const availableNPCs = sceneMapping?.availableNPCs.filter(npc => 
    template.recommendedNPCs.includes(npc.npcId)
  ) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            选择训练角色 - {template.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">训练场景</h4>
            <p className="text-blue-700 text-sm">{template.description}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">可选择的训练角色</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableNPCs.map((npc) => (
                <Card 
                  key={npc.npcId} 
                  className="hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                  onClick={() => onNPCSelect(npc.npcId)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        <ImageWithFallback
                          src={npc.avatar}
                          alt={npc.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{npc.name}</h5>
                        <p className="text-sm text-gray-600">{npc.role}</p>
                        <p className="text-xs text-gray-500 mt-1">{npc.personality}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-2">适合训练：</p>
                      <div className="flex flex-wrap gap-1">
                        {npc.suitableFor.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ScenarioPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: TrainingScenarioTemplate | null;
  onStartTraining: () => void;
}

const ScenarioPreviewDialog = ({ 
  isOpen, 
  onClose, 
  template, 
  onStartTraining 
}: ScenarioPreviewDialogProps) => {
  if (!template) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            {template.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-lg font-semibold ${getDifficultyColor(template.difficulty)}`}>
                {template.difficulty === 'easy' ? '简单' : template.difficulty === 'medium' ? '中等' : '困难'}
              </div>
              <div className="text-xs text-gray-600">难度等级</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">{template.estimatedDuration}分钟</div>
              <div className="text-xs text-gray-600">预计时长</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-600">{template.sceneName}</div>
              <div className="text-xs text-gray-600">训练场景</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">{template.recommendedNPCs.length}</div>
              <div className="text-xs text-gray-600">可选角色</div>
            </div>
          </div>

          {/* 场景描述 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">场景描述</h4>
            <p className="text-blue-700">{template.description}</p>
          </div>

          {/* 学习目标 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">学习目标</h4>
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">主要目标</span>
                </div>
                <p className="text-green-700">{template.objectives.primary}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">次要目标</span>
                </div>
                <ul className="space-y-1">
                  {template.objectives.secondary.map((objective, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 前置要求 */}
          {template.prerequisites && template.prerequisites.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">前置要求</h4>
              <div className="flex flex-wrap gap-2">
                {template.prerequisites.map((prereq, index) => (
                  <Badge key={index} variant="outline" className="text-orange-600 border-orange-200">
                    {prereq}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              返回选择
            </Button>
            <Button onClick={onStartTraining} className="flex-1">
              开始训练
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const TrainingScenarioSelector = ({ 
  onScenarioSelect, 
  onBack 
}: TrainingScenarioSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null as TrainingScenarioTemplate | null);
  const [showNPCSelection, setShowNPCSelection] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [filterSkill, setFilterSkill] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const handleScenarioSelect = (template: TrainingScenarioTemplate) => {
    setSelectedTemplate(template);
    setShowNPCSelection(true);
  };

  const handleScenarioPreview = (template: TrainingScenarioTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleNPCSelect = (npcId: NPCId) => {
    if (selectedTemplate) {
      onScenarioSelect(selectedTemplate, npcId);
    }
  };

  const handlePreviewStart = () => {
    setShowPreview(false);
    if (selectedTemplate) {
      setShowNPCSelection(true);
    }
  };

  // 过滤场景
  const filteredScenarios = TRAINING_SCENARIO_TEMPLATES.filter(template => {
    const skillMatch = filterSkill === 'all' || template.skillCategory === filterSkill;
    const difficultyMatch = filterDifficulty === 'all' || template.difficulty === filterDifficulty;
    return skillMatch && difficultyMatch;
  });

  const skillCategories = [
    { value: 'all', label: '全部技能' },
    { value: 'conflict_resolution', label: '冲突解决' },
    { value: 'empathy_building', label: '同理心培养' },
    { value: 'assertiveness', label: '自信表达' },
    { value: 'collaboration', label: '合作协商' },
    { value: 'problem_solving', label: '问题解决' }
  ];

  const difficulties = [
    { value: 'all', label: '全部难度' },
    { value: 'easy', label: '简单' },
    { value: 'medium', label: '中等' },
    { value: 'hard', label: '困难' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 hover:bg-white/50"
          >
            ← 返回首页
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎯 选择训练场景
            </h1>
            <p className="text-gray-600">
              选择适合的训练场景，提升你的沟通技巧
            </p>
          </div>
        </div>

        {/* 过滤器 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">技能类别</label>
              <select 
                value={filterSkill} 
                onChange={(e) => setFilterSkill(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {skillCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">难度等级</label>
              <select 
                value={filterDifficulty} 
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 场景列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((template) => (
            <ScenarioCard
              key={template.id}
              template={template}
              onSelect={() => handleScenarioSelect(template)}
              onPreview={() => handleScenarioPreview(template)}
            />
          ))}
        </div>

        {filteredScenarios.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Target className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的训练场景</h3>
            <p className="text-gray-600">请尝试调整筛选条件</p>
          </div>
        )}
      </div>

      {/* NPC选择对话框 */}
      <NPCSelectionDialog
        isOpen={showNPCSelection}
        onClose={() => setShowNPCSelection(false)}
        template={selectedTemplate}
        onNPCSelect={handleNPCSelect}
      />

      {/* 场景预览对话框 */}
      <ScenarioPreviewDialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        template={selectedTemplate}
        onStartTraining={handlePreviewStart}
      />
    </div>
  );
};