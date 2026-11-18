import React from 'react';
import { DiagramMeta, DiagramProps, StageDiagramId } from './types';
import {
  AscInitSequenceDiagram,
  CueRelevancyTimelineDiagram,
  PredictionKeySwimlaneDiagram,
  RpcBatcherTimelineDiagram
} from './SequenceDiagrams';
import {
  Aggregator55PipelineDiagram,
  BaseVsCurrentGaugeDiagram,
  ClampingDualGaugeDiagram,
  GeStackingBarsDiagram,
  MetaDamageFunnelDiagram,
  PeriodicTickTimelineDiagram
} from './MathAndGaugeDiagrams';
import {
  GaSixTagGatesDiagram,
  TagHierarchyTreeDiagram,
  TagRefcountWaveformDiagram
} from './TagAndGateDiagrams';
import {
  CoupledVsGasDiagram,
  CueContextBitstreamDiagram,
  GasFivePillarsBlueprintDiagram,
  Ge53ComponentPuzzleDiagram,
  LyraAbilitySetAnatomyDiagram,
  OwnerAvatarAnatomyDiagram,
  TargetDataPipelineDiagram
} from './AnatomyAndPuzzleDiagrams';
import {
  AbilityTaskLifecycleDiagram,
  CuePoolingRingDiagram,
  GaLifecycleStateMachineDiagram,
  GeCalculatorDecisionTreeDiagram,
  MeleeComboMontageSweepDiagram,
  ReplicationModeMatrixDiagram
} from './LifecycleAndCombatDiagrams';

export const DIAGRAM_META_MAP: Record<StageDiagramId, DiagramMeta> = {
  'coupled-vs-gas-decoupled': {
    id: 'coupled-vs-gas-decoupled',
    shortTitle: '解耦与联机矩阵',
    shortTitleEn: 'Decoupling Matrix',
    title: '硬编码网状耦合 vs GAS 总线解耦与联机三岔路',
    categoryLabel: '架构对比图'
  },
  'gas-five-pillars-blueprint': {
    id: 'gas-five-pillars-blueprint',
    shortTitle: '五大支柱全链路',
    shortTitleEn: '5-Pillar Blueprint',
    title: 'GAS 五大核心支柱与火球术 7 步全链路蓝图',
    categoryLabel: '全局蓝图'
  },
  'owner-avatar-anatomy': {
    id: 'owner-avatar-anatomy',
    shortTitle: '灵肉分离解剖',
    shortTitleEn: 'Owner vs Avatar',
    title: 'OwnerActor (PlayerState) 与 AvatarActor (Character) 架构解剖',
    categoryLabel: '结构解剖图'
  },
  'asc-init-sequence': {
    id: 'asc-init-sequence',
    shortTitle: '双端初始化泳道',
    shortTitleEn: 'Init Swimlane',
    title: 'PossessedBy / OnRep_PlayerState 异步泳道与 100Hz 刻度尺',
    categoryLabel: '时序泳道图'
  },
  'replication-mode-matrix': {
    id: 'replication-mode-matrix',
    shortTitle: '三模式网络剖面',
    shortTitleEn: 'Replication Matrix',
    title: 'Full / Mixed / Minimal 三端下发剖面与拥有链铁律',
    categoryLabel: '网络剖面图'
  },
  'tag-refcount-waveform': {
    id: 'tag-refcount-waveform',
    shortTitle: '引用计数阶梯波',
    shortTitleEn: 'RefCount Waveform',
    title: '重叠眩晕 bool 失效 vs 引用计数阶梯波形与 LooseTag 铁律',
    categoryLabel: '时序波形图'
  },
  'tag-hierarchy-tree': {
    id: 'tag-hierarchy-tree',
    shortTitle: '标签树匹配范围',
    shortTitleEn: 'Tag Tree Scope',
    title: '层级标签字典树 MatchesTag vs MatchesTagExact 作用域图',
    categoryLabel: '层级树图'
  },
  'ga-six-tag-gates': {
    id: 'ga-six-tag-gates',
    shortTitle: '六槽位安检闸门',
    shortTitleEn: '6-Slot Tag Gates',
    title: 'GA 六大标签槽位准入闸门、跨网同步与打断压制矩阵',
    categoryLabel: '逻辑闸门图'
  },
  'base-vs-current-gauge': {
    id: 'base-vs-current-gauge',
    shortTitle: '双轨数值水位',
    shortTitleEn: 'Dual-Value Gauge',
    title: 'BaseValue vs CurrentValue 双轨容器与 REPNOTIFY_Always 对齐',
    categoryLabel: '数值水位图'
  },
  'clamping-dual-gauge': {
    id: 'clamping-dual-gauge',
    shortTitle: '负血刻度与五钩子',
    shortTitleEn: 'Clamp Scale & Hooks',
    title: '[-30, 0, 100] 负血幽灵刻度尺与 AttributeSet 五大钩子拦截位',
    categoryLabel: '双轨刻度图'
  },
  'meta-damage-funnel': {
    id: 'meta-damage-funnel',
    shortTitle: '元属性破盾漏斗',
    shortTitleEn: 'Damage Funnel',
    title: 'IncomingDamage 元属性伤害接收、拆盾扣血与清零漏斗',
    categoryLabel: '管道漏斗图'
  },
  'periodic-tick-timeline': {
    id: 'periodic-tick-timeline',
    shortTitle: '周期跳时间刻度',
    shortTitleEn: 'Periodic Timeline',
    title: '三大时效对比与 Periodic 周期跳首跳时间刻度尺',
    categoryLabel: '时间刻度图'
  },
  'ge-stacking-bars': {
    id: 'ge-stacking-bars',
    shortTitle: '叠层池与退栈阶梯',
    shortTitleEn: 'Stacking Staircase',
    title: 'AggregateByTarget / Source 叠层池与到期退栈阶梯图',
    categoryLabel: '叠层阶梯图'
  },
  'ge-53-component-puzzle': {
    id: 'ge-53-component-puzzle',
    shortTitle: '5.3 组件与标签归属',
    shortTitleEn: '5.3 GE Components',
    title: 'UE 5.3+ GEComponents 插槽拼图与 AssetTags/TargetTags 解剖',
    categoryLabel: '组件解剖图'
  },
  'aggregator-55-pipeline': {
    id: 'aggregator-55-pipeline',
    shortTitle: '5.5 五段乘区管道',
    shortTitleEn: '5.5 Math Pipeline',
    title: 'UE 5.5 FAggregator 同池相加 vs MultiplyCompound 独立连乘流水线',
    categoryLabel: '算式流水线'
  },
  'ge-calculator-decision-tree': {
    id: 'ge-calculator-decision-tree',
    shortTitle: '五计算器决策树',
    shortTitleEn: 'Calc Decision Tree',
    title: '五种 GE 数值计算方案选型决策树与 Snapshot 快照对比',
    categoryLabel: '选型决策树'
  },
  'ga-lifecycle-state-machine': {
    id: 'ga-lifecycle-state-machine',
    shortTitle: 'GA 状态机与5.5新规',
    shortTitleEn: 'GA State Machine',
    title: 'GA 授予激活五阶段闭环、UE 5.5 实例化新规与 InputTag 路由',
    categoryLabel: '状态机图'
  },
  'ability-task-lifecycle': {
    id: 'ability-task-lifecycle',
    shortTitle: 'Task 作用域与三步栈',
    shortTitleEn: 'Task Lifecycle',
    title: '裸 Timer 悬空崩溃 vs AbilityTask 生命周期与三步激活时序',
    categoryLabel: '异步时序图'
  },
  'target-data-pipeline': {
    id: 'target-data-pipeline',
    shortTitle: 'TargetData 防外挂漏斗',
    shortTitleEn: 'Anti-Cheat Funnel',
    title: 'FGameplayAbilityTargetData 多态上传与 Server 三重防外挂安检门',
    categoryLabel: '安全管道图'
  },
  'prediction-key-swimlane': {
    id: 'prediction-key-swimlane',
    shortTitle: '预测双轨与回滚泳道',
    shortTitleEn: 'Prediction Swimlane',
    title: 'FPredictionKey 双轨确认追赶 (RPC vs CatchUpTo) 与拒绝回滚账本',
    categoryLabel: '预测泳道图'
  },
  'rpc-batcher-timeline': {
    id: 'rpc-batcher-timeline',
    shortTitle: 'RPC 合批与子对象表',
    shortTitleEn: 'RPC Batcher',
    title: '常规 3 次 RPC vs FScopedServerAbilityRPCBatcher 单帧合批时序',
    categoryLabel: '网络时序图'
  },
  'cue-pooling-ring': {
    id: 'cue-pooling-ring',
    shortTitle: 'Cue 载体与对象池环',
    shortTitleEn: 'Cue Pool Ring',
    title: 'Static vs Actor 载体选型与 GCN_Actor 对象池脏数据环形状态机',
    categoryLabel: '状态环图'
  },
  'cue-relevancy-timeline': {
    id: 'cue-relevancy-timeline',
    shortTitle: '视野圈与 WhileActive',
    shortTitleEn: 'Relevancy Timeline',
    title: 'NetCullDistance 视野相关性圆圈与 WhileActive 补播时间轴',
    categoryLabel: '空间时序图'
  },
  'cue-context-bitstream': {
    id: 'cue-context-bitstream',
    shortTitle: 'AOE 节流与位序列化',
    shortTitleEn: 'Context Bitstream',
    title: 'AOE 爆炸多播优化与自定义 FMyGameplayEffectContext 位掩码解剖',
    categoryLabel: '内存位流图'
  },
  'melee-combo-montage-sweep': {
    id: 'melee-combo-montage-sweep',
    shortTitle: '连招轨道与刀刃扫掠',
    shortTitleEn: 'Montage & Sweep',
    title: '三段斩 Montage 窗口轨道与多帧扇形扫掠 TSet 去重俯视图',
    categoryLabel: '轨道与几何图'
  },
  'lyra-abilityset-anatomy': {
    id: 'lyra-abilityset-anatomy',
    shortTitle: 'AbilitySet 凭证袋解剖',
    shortTitleEn: 'AbilitySet Anatomy',
    title: 'Lyra ULyraAbilitySet 注入 ASC 与 GrantedHandles 无残留回收图',
    categoryLabel: '架构解剖图'
  }
};

/**
 * Returns the primary diagram ID for a given (lessonSlug, stepId) and all diagrams available in that lesson
 */
export function getDiagramsForLessonStep(
  lessonSlug: string,
  stepId: string
): { primary: StageDiagramId; available: StageDiagramId[] } {
  switch (lessonSlug) {
    case 'why-gas':
      return {
        primary: stepId === 's1' || stepId === 's2' ? 'coupled-vs-gas-decoupled' : 'gas-five-pillars-blueprint',
        available: ['coupled-vs-gas-decoupled', 'gas-five-pillars-blueprint']
      };
    case 'asc-architecture':
      return {
        primary:
          stepId === 's1' || stepId === 's2' || stepId === 's3'
            ? 'owner-avatar-anatomy'
            : 'asc-init-sequence',
        available: ['owner-avatar-anatomy', 'asc-init-sequence']
      };
    case 'replication-modes':
      return {
        primary: 'replication-mode-matrix',
        available: ['replication-mode-matrix']
      };
    case 'gameplay-tags-core':
      return {
        primary: stepId === 's2' || stepId === 's5' ? 'tag-hierarchy-tree' : 'tag-refcount-waveform',
        available: ['tag-refcount-waveform', 'tag-hierarchy-tree']
      };
    case 'tag-queries-blocking':
      return {
        primary: 'ga-six-tag-gates',
        available: ['ga-six-tag-gates']
      };
    case 'base-vs-current':
      return {
        primary: 'base-vs-current-gauge',
        available: ['base-vs-current-gauge']
      };
    case 'attribute-clamping':
      return {
        primary: 'clamping-dual-gauge',
        available: ['clamping-dual-gauge']
      };
    case 'meta-attributes':
      return {
        primary: 'meta-damage-funnel',
        available: ['meta-damage-funnel']
      };
    case 'ge-duration-periodic':
      return {
        primary: stepId === 's1' || stepId === 's2' ? 'periodic-tick-timeline' : 'ge-stacking-bars',
        available: ['periodic-tick-timeline', 'ge-stacking-bars']
      };
    case 'ge-components-math':
      return {
        primary: stepId === 's4' ? 'aggregator-55-pipeline' : 'ge-53-component-puzzle',
        available: ['ge-53-component-puzzle', 'aggregator-55-pipeline']
      };
    case 'ge-calculations':
      return {
        primary: 'ge-calculator-decision-tree',
        available: ['ge-calculator-decision-tree']
      };
    case 'ability-lifecycle':
      return {
        primary: 'ga-lifecycle-state-machine',
        available: ['ga-lifecycle-state-machine']
      };
    case 'ability-tasks':
      return {
        primary: 'ability-task-lifecycle',
        available: ['ability-task-lifecycle']
      };
    case 'target-data':
      return {
        primary: 'target-data-pipeline',
        available: ['target-data-pipeline']
      };
    case 'client-prediction':
      return {
        primary: 'prediction-key-swimlane',
        available: ['prediction-key-swimlane']
      };
    case 'network-optimization':
      return {
        primary: 'rpc-batcher-timeline',
        available: ['rpc-batcher-timeline']
      };
    case 'gameplay-cues':
      return {
        primary: stepId === 's3' ? 'cue-relevancy-timeline' : 'cue-pooling-ring',
        available: ['cue-pooling-ring', 'cue-relevancy-timeline']
      };
    case 'cue-networking':
      return {
        primary: 'cue-context-bitstream',
        available: ['cue-context-bitstream']
      };
    case 'design-melee-combo':
      return {
        primary: 'melee-combo-montage-sweep',
        available: ['melee-combo-montage-sweep']
      };
    case 'design-lyra-abilityset':
      return {
        primary: stepId === 's4' ? 'gas-five-pillars-blueprint' : 'lyra-abilityset-anatomy',
        available: ['lyra-abilityset-anatomy', 'gas-five-pillars-blueprint']
      };
    default:
      return {
        primary: 'gas-five-pillars-blueprint',
        available: ['gas-five-pillars-blueprint']
      };
  }
}

export const StageDiagramContent: React.FC<{ diagramId: StageDiagramId } & DiagramProps> = ({
  diagramId,
  ...props
}) => {
  switch (diagramId) {
    case 'coupled-vs-gas-decoupled':
      return <CoupledVsGasDiagram {...props} />;
    case 'gas-five-pillars-blueprint':
      return <GasFivePillarsBlueprintDiagram {...props} />;
    case 'owner-avatar-anatomy':
      return <OwnerAvatarAnatomyDiagram {...props} />;
    case 'asc-init-sequence':
      return <AscInitSequenceDiagram {...props} />;
    case 'replication-mode-matrix':
      return <ReplicationModeMatrixDiagram {...props} />;
    case 'tag-refcount-waveform':
      return <TagRefcountWaveformDiagram {...props} />;
    case 'tag-hierarchy-tree':
      return <TagHierarchyTreeDiagram {...props} />;
    case 'ga-six-tag-gates':
      return <GaSixTagGatesDiagram {...props} />;
    case 'base-vs-current-gauge':
      return <BaseVsCurrentGaugeDiagram {...props} />;
    case 'clamping-dual-gauge':
      return <ClampingDualGaugeDiagram {...props} />;
    case 'meta-damage-funnel':
      return <MetaDamageFunnelDiagram {...props} />;
    case 'periodic-tick-timeline':
      return <PeriodicTickTimelineDiagram {...props} />;
    case 'ge-stacking-bars':
      return <GeStackingBarsDiagram {...props} />;
    case 'ge-53-component-puzzle':
      return <Ge53ComponentPuzzleDiagram {...props} />;
    case 'aggregator-55-pipeline':
      return <Aggregator55PipelineDiagram {...props} />;
    case 'ge-calculator-decision-tree':
      return <GeCalculatorDecisionTreeDiagram {...props} />;
    case 'ga-lifecycle-state-machine':
      return <GaLifecycleStateMachineDiagram {...props} />;
    case 'ability-task-lifecycle':
      return <AbilityTaskLifecycleDiagram {...props} />;
    case 'target-data-pipeline':
      return <TargetDataPipelineDiagram {...props} />;
    case 'prediction-key-swimlane':
      return <PredictionKeySwimlaneDiagram {...props} />;
    case 'rpc-batcher-timeline':
      return <RpcBatcherTimelineDiagram {...props} />;
    case 'cue-pooling-ring':
      return <CuePoolingRingDiagram {...props} />;
    case 'cue-relevancy-timeline':
      return <CueRelevancyTimelineDiagram {...props} />;
    case 'cue-context-bitstream':
      return <CueContextBitstreamDiagram {...props} />;
    case 'melee-combo-montage-sweep':
      return <MeleeComboMontageSweepDiagram {...props} />;
    case 'lyra-abilityset-anatomy':
      return <LyraAbilitySetAnatomyDiagram {...props} />;
  }
};
