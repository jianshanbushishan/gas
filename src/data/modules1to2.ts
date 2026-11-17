import { ModuleData } from '../types/course';

export const MODULES_1_TO_2: ModuleData[] = [
  {
    id: 'mod-foundations',
    indexLabel: '01. 核心基石',
    title: '01. 核心基石',
    titleEn: '01. Foundations',
    folderColor: 'sand',
    lessons: [
      {
        slug: 'why-gas',
        title: '为什么需要 GAS？数据驱动战斗全景',
        titleEn: 'Why GAS? Data-Driven Combat Architecture',
        summary: '从意大利面条式的硬编码技能，走向 UE5 官方解耦、可预测、可扩展的战斗框架。',
        durationMin: 10,
        difficulty: '入门',
        goals: [
          { id: 'g1', text: '理解硬编码战斗逻辑的状态耦合与联机同步痛点', unlockAtStep: 2 },
          { id: 'g2', text: '认识核心中枢 UAbilitySystemComponent (ASC) 的职责', unlockAtStep: 3 },
          { id: 'g3', text: '理清 GA / GE / AttributeSet / Tag / Cue 五大模块边界', unlockAtStep: 4 },
          { id: 'g4', text: '追踪一次火球术从按键到受击特效的完整数据流', unlockAtStep: 5 },
          { id: 'g5', text: '掌握 UE5 项目启用 GAS 所需的插件与模块依赖', unlockAtStep: 6 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '状态泥潭',
            phase: 'PROBLEM',
            title: '硬编码技能：每加一个状态都要改十个类',
            paragraphs: [
              '假设你在 `AMyCharacter` 里直接写了一个 `CastFireball()` 函数。起初只需判断 `Mana >= 30`；但策划很快追加了眩晕、沉默、冰冻、霸体、减蓝耗光环与护盾吸收。',
              '很快，每个技能函数开头都塞满了 `if (!bIsStunned && !bIsSilenced && !bIsDashing)`，角色类膨胀到上万行，任何新 Buff 都可能破坏已有技能。'
            ],
            codeSnippet: {
              title: '反面教材：紧耦合的技能分支',
              code: `void AHero::CastFireball() {\n  if (bStunned || bSilenced || bRolling || bChanneling) return;\n  float Cost = bArcaneBuff ? 30.f * 0.8f : 30.f;\n  if (Mana < Cost) return;\n  // 还要手动扣蓝、记冷却 Timer、播蒙太奇、发 RPC...\n}`
            },
            callout: {
              kind: 'warn',
              label: '耦合复杂度 O(N²)',
              text: '当 N 个技能直接读写 M 种角色布尔变量时，状态交互路径呈乘积级增长，极易出现“技能被打断但冷却没进、无敌残留无法清除”的恶性 Bug。'
            },
            hud: [
              { key: 'coupling', label: '代码耦合度', value: 'O(N²) 极高', status: 'bad' },
              { key: 'net', label: '联机客户端预测', value: '无 (纯手写)', status: 'bad' },
              { key: 'designer', label: '策划配表独立性', value: '每次改 C++', status: 'warn' }
            ],
            scene: {
              nodes: [
                {
                  id: 'char',
                  col: 0,
                  row: 0,
                  color: 'red',
                  icon: 'pawn',
                  label: 'AHeroCharacter',
                  sublabel: '8,500 lines C++',
                  badge: { text: '耦合过载 98%', tone: 'bad', progress: 98 },
                  size: 'lg'
                },
                { id: 'skill1', col: -2, row: -0.5, color: 'amber', icon: 'ga', label: 'Fireball()', size: 'sm' },
                { id: 'skill2', col: -1.8, row: 1.5, color: 'amber', icon: 'sword', label: 'DashSlash()', size: 'sm' },
                { id: 'buff1', col: 1.9, row: -1.2, color: 'slate', icon: 'shield', label: 'bIsStunned', size: 'sm' },
                { id: 'buff2', col: 2, row: 1, color: 'slate', icon: 'ge', label: 'Mana / Timers', size: 'sm' }
              ],
              edges: [
                { id: 'e1', from: 'skill1', to: 'char', packet: 'error', bidirectional: true },
                { id: 'e2', from: 'skill2', to: 'char', packet: 'error', bidirectional: true },
                { id: 'e3', from: 'char', to: 'buff1', packet: 'input', bidirectional: true },
                { id: 'e4', from: 'char', to: 'buff2', packet: 'input', bidirectional: true }
              ],
              legend: [
                { type: 'input', label: '硬编码直接读写' },
                { type: 'error', label: '状态冲突 / 竞态 Bug' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '联机灾难',
            phase: 'PITFALL',
            title: '多人联机：延迟手感与防作弊的两难',
            paragraphs: [
              '一旦进入多人联机（Dedicated Server），手写技能立刻撞上物理延迟之墙：如果按下按键后傻等 `Server RPC` 往返确认再播挥剑动画，100ms 延迟就会让动作游戏手感像踩在泥里。',
              '可如果让客户端先播动画、先扣蓝，万一服务器那一帧判定角色刚好被眩晕拒绝施法，客户端怎么安全地把扣掉的蓝、挂上的加速 Buff 和蒙太奇动画**精准回滚**？'
            ],
            callout: {
              kind: 'insight',
              label: 'GAS 诞生的核心驱动力',
              text: 'GAS 源自 Epic 的 MOBA《Paragon》与《Fortnite》，其最不可替代的护城河正是内置的客户端预测窗口 (Scoped Prediction) 与自动状态回滚机制。'
            },
            changes: [
              { op: 'add', text: '引入 Dedicated Server 权威校验链路' },
              { op: 'mod', text: '暴露 120ms RTT 下的手感延迟与回滚难题' }
            ],
            hud: [
              { key: 'rtt', label: '网络往返 RTT', value: '120 ms', status: 'warn' },
              { key: 'feel', label: '纯服务端驱动手感', value: '粘滞卡顿', status: 'bad' },
              { key: 'rollback', label: '手写预测回滚', value: '极易不同步', status: 'bad' }
            ],
            scene: {
              nodes: [
                {
                  id: 'client',
                  col: -1.8,
                  row: 0.8,
                  color: 'blue',
                  icon: 'client',
                  label: 'Client (玩家)',
                  sublabel: '按下技能键',
                  badge: { text: '等待 120ms...', tone: 'warn' }
                },
                {
                  id: 'server',
                  col: 1.6,
                  row: -0.8,
                  color: 'red',
                  icon: 'server',
                  label: 'Dedicated Server',
                  sublabel: '权威仲裁：已被眩晕!',
                  badge: { text: 'Reject 拒绝激活', tone: 'bad' }
                }
              ],
              edges: [
                {
                  id: 'rpc1',
                  from: 'client',
                  to: 'server',
                  label: 'Server_TryCast() · 60ms',
                  labelTone: 'amber',
                  packet: 'rpc'
                },
                {
                  id: 'rpc2',
                  from: 'server',
                  to: 'client',
                  style: 'dashed',
                  label: '失败! 本地已播动画无法自动回滚',
                  labelTone: 'red',
                  packet: 'error'
                }
              ],
              legend: [
                { type: 'rpc', label: 'Server RPC 请求' },
                { type: 'error', label: '预测失配 / 状态撕裂' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: 'ASC 中枢',
            phase: 'ARCHITECTURE',
            title: '引入核心大脑：UAbilitySystemComponent',
            paragraphs: [
              'GAS 的解法是在 Actor 上挂载唯一中枢组件 `[[UAbilitySystemComponent|GAS 核心组件（简称 ASC），统一管理技能授予与激活、属性集、活跃 GameplayEffect、标签计数与预测密钥]]`（简称 **ASC**）。',
              '从此，攻击者**不需要知道受击者是英雄、防御塔还是可破坏木桶**——只要能从对方身上拿到 `ASC` 指针，就能通过统一协议施加效果与查询标签。'
            ],
            callout: {
              kind: 'tip',
              label: '面向接口解耦',
              text: '任何拥有 ASC 的 Actor 只需继承 IAbilitySystemInterface 并实现 GetAbilitySystemComponent()，即可无缝接入整套战斗生态。'
            },
            changes: [
              { op: 'add', text: '挂载 UAbilitySystemComponent 作为统一交互总线' },
              { op: 'del', text: '移除角色类之间直接强转类型的硬编码依赖' }
            ],
            hud: [
              { key: 'coupling', label: '对象间依赖', value: '仅依赖 ASC 接口', status: 'good' },
              { key: 'targets', label: '可交互目标', value: '英雄 / AI / 建筑 / 机关', status: 'good' }
            ],
            scene: {
              nodes: [
                {
                  id: 'asc',
                  col: 0,
                  row: 0,
                  color: 'green',
                  icon: 'asc',
                  label: 'ASC 核心中枢',
                  sublabel: 'UAbilitySystemComponent',
                  state: 'active',
                  size: 'lg'
                },
                { id: 'hero', col: -2, row: 0.6, color: 'blue', icon: 'pawn', label: '玩家英雄', size: 'sm' },
                { id: 'boss', col: 0.2, row: -2, color: 'violet', icon: 'pawn', label: 'Boss 怪物', size: 'sm' },
                { id: 'tower', col: 2, row: 0.4, color: 'amber', icon: 'shield', label: '防御塔 / 宝箱', size: 'sm' }
              ],
              edges: [
                { id: 'a1', from: 'hero', to: 'asc', packet: 'input', label: 'IAbilitySystemInterface' },
                { id: 'a2', from: 'asc', to: 'boss', packet: 'ge' },
                { id: 'a3', from: 'asc', to: 'tower', packet: 'ge' }
              ],
              legend: [
                { type: 'input', label: '统一接口调用' },
                { type: 'ge', label: '标准化效果施加' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: '五大支柱',
            phase: 'TECHNIQUE',
            title: '职责严明：五大核心子系统各司其职',
            paragraphs: [
              'GAS 将战斗拆解为五个正交模块：`[[FGameplayTag|层级化状态标签，充当所有模块之间的通用解耦语言]]` 是通用语言；`[[UAttributeSet|存储并复制生命值、法力值、攻击力等 FGameplayAttributeData 数值容器]]` 存储属性；`[[UGameplayEffect|纯数据资产（简称 GE），定义如何修改属性、付与标签与持续时间]]`（GE）负责改数值与挂 Buff；`[[UGameplayAbility|封装技能激活生命周期与异步动作序列的逻辑单元（简称 GA）]]`（GA）编排技能动作；`[[GameplayCue|纯客户端表现层通知机制，负责粒子特效、音效与相机震动，绝不承载权威逻辑]]` 负责纯视听表现。',
              '黄金准则：**GA 负责“过程编排”，GE 负责“数据变更”，Cue 负责“声光表现”**——绝不在 Cue 里扣血，也绝不在 GA 里直接 `Health -= 50` 绕过 GE！'
            ],
            changes: [
              { op: 'add', text: 'GameplayTags：全局层级状态与事件字典' },
              { op: 'add', text: 'AttributeSet + GameplayEffect：受控属性修改管线' },
              { op: 'add', text: 'GameplayAbility + GameplayCue：逻辑与表现分离' }
            ],
            hud: [
              { key: 'pillars', label: '核心支柱', value: '5 大正交模块', status: 'good' },
              { key: 'rule', label: '属性修改入口', value: '统一经由 GE', status: 'good' },
              { key: 'vfx', label: '特效音效解耦', value: 'GameplayCue', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'asc', col: 0, row: 0, color: 'green', icon: 'asc', label: 'ASC', sublabel: '调度核心', state: 'active' },
                { id: 'ga', col: -2, row: -0.8, color: 'blue', icon: 'ga', label: 'GameplayAbility', sublabel: '技能流程 / 异步任务' },
                { id: 'ge', col: 0, row: -1.9, color: 'amber', icon: 'ge', label: 'GameplayEffect', sublabel: '纯数据修改器 / Buff' },
                { id: 'attr', col: 2, row: -0.6, shape: 'cylinder', color: 'teal', icon: 'attr', label: 'AttributeSet', sublabel: 'HP / Mana / ATK' },
                { id: 'tag', col: -1.6, row: 1.6, color: 'violet', icon: 'tag', label: 'GameplayTags', sublabel: '引用计数状态树' },
                { id: 'cue', col: 1.7, row: 1.5, color: 'rose', icon: 'cue', label: 'GameplayCue', sublabel: 'VFX / SFX 纯表现' }
              ],
              edges: [
                { id: 'p1', from: 'ga', to: 'asc', packet: 'input' },
                { id: 'p2', from: 'ga', to: 'ge', packet: 'ge', label: 'MakeOutgoingSpec' },
                { id: 'p3', from: 'ge', to: 'attr', packet: 'ge' },
                { id: 'p4', from: 'asc', to: 'tag', packet: 'predict', bidirectional: true },
                { id: 'p5', from: 'asc', to: 'cue', packet: 'cue' }
              ],
              legend: [
                { type: 'input', label: '技能调度' },
                { type: 'ge', label: 'GE 数值变更' },
                { type: 'predict', label: 'Tag 查询/计数' },
                { type: 'cue', label: '客户端视听触发' }
              ]
            }
          },
          {
            id: 's5',
            shortLabel: '火球全链路',
            phase: 'SOLUTION',
            title: '实战串联：一发火球术在 GAS 中的完整旅程',
            paragraphs: [
              '1) 玩家按下按键，本地预测激活 `GA_Fireball`，调用 `CommitAbility()` 自动应用 `GE_Fireball_Cost`（扣 30 蓝）与 `GE_Fireball_Cooldown`（挂载 `Cooldown.Fireball` 标签 5 秒）。',
              '2) `PlayMontageAndWait` 播放施法动画，收到动画通知事件后服务端生成火球投射物；命中敌人时将 `GE_Fireball_Damage` 施加给目标 ASC，扣减生命并自动广播 `GameplayCue.Fireball.Impact` 爆炸粒子！'
            ],
            callout: {
              kind: 'tip',
              label: '策划零代码调优',
              text: '想把火球改成“命中后附加 3 秒灼烧并沉默目标”？策划只需在 GE_Fireball_Burn 资产上配置 Period 和 Granted Tags，无需程序员重编一行 C++。'
            },
            changes: [
              { op: 'add', text: 'Source ASC → CommitAbility 扣除 Cost 并挂载 Cooldown Tag' },
              { op: 'add', text: 'Target ASC → ApplyGameplayEffectSpecToTarget 结算伤害与特效' }
            ],
            hud: [
              { key: 'mana', label: '施法者 Mana', value: '100 → 70', status: 'good' },
              { key: 'cd', label: '冷却标签', value: 'Cooldown.Fireball (5s)', status: 'warn' },
              { key: 'hp', label: '受击者 Health', value: '100 → 65', status: 'good' }
            ],
            scene: {
              nodes: [
                {
                  id: 'src',
                  col: -2.1,
                  row: 0.7,
                  color: 'blue',
                  icon: 'asc',
                  label: 'Source ASC',
                  sublabel: '法师 (施法端)',
                  badge: { text: 'Mana: 70 | CD: 5s', tone: 'good', progress: 70 }
                },
                {
                  id: 'ga',
                  col: -0.5,
                  row: -1.1,
                  color: 'violet',
                  icon: 'ga',
                  label: 'GA_Fireball',
                  sublabel: 'Montage + Projectile',
                  state: 'active'
                },
                {
                  id: 'tgt',
                  col: 1.8,
                  row: 0.2,
                  color: 'amber',
                  icon: 'asc',
                  label: 'Target ASC',
                  sublabel: '受击敌人',
                  badge: { text: 'HP: 65 / 100', tone: 'warn', progress: 65 }
                },
                {
                  id: 'cue',
                  col: 2.2,
                  row: 1.9,
                  color: 'rose',
                  icon: 'cue',
                  label: 'GC_Impact',
                  sublabel: '爆炸火焰 + 音效',
                  size: 'sm'
                }
              ],
              edges: [
                { id: 'f1', from: 'src', to: 'ga', packet: 'predict', label: 'TryActivate (本地预测)', labelTone: 'violet' },
                { id: 'f2', from: 'ga', to: 'tgt', packet: 'ge', label: 'FGameplayEffectSpec', labelTone: 'amber', packetRate: 'fast' },
                { id: 'f3', from: 'tgt', to: 'cue', packet: 'cue' }
              ],
              inspectCard: {
                title: 'FIREBALL ASSETS',
                rows: [
                  { left: 'GA_Fireball', right: '技能蓝图/C++' },
                  { left: 'GE_Cost', right: 'Instant -30 Mana' },
                  { left: 'GE_Cooldown', right: 'Duration 5.0s' },
                  { left: 'GE_Damage', right: 'ExecCalc / -35 HP', highlight: 'green' }
                ]
              },
              legend: [
                { type: 'predict', label: '本地预测激活' },
                { type: 'ge', label: 'GE Spec 传递' },
                { type: 'cue', label: '受击表现广播' }
              ]
            }
          },
          {
            id: 's6',
            shortLabel: '工程配置',
            phase: 'RECAP',
            title: '总结与工程起步：正确引入 GAS 三大模块',
            paragraphs: [
              '在 UE5 中，GAS 以内置插件形式提供（默认未勾选）。使用前必须在 `.uplugin` 或 `.uproject` 中启用 `GameplayAbilities` 插件，并在项目的 `*.Build.cs` 中添加三个核心模块依赖。',
              '注意：UE 5.3 起无需再像早期 UE4 那样手动调用 `UAbilitySystemGlobals::Get().InitGlobalData()`——引擎已在模块启动阶段自动完成初始化！'
            ],
            codeSnippet: {
              title: 'MyGame.Build.cs 必配模块依赖',
              code: `PublicDependencyModuleNames.AddRange(new string[] {\n  "Core", "CoreUObject", "Engine", "InputCore",\n  "GameplayAbilities", // ASC、GA、GE、AttributeSet\n  "GameplayTags",      // FGameplayTag 与容器\n  "GameplayTasks"      // AbilityTask 异步任务基石\n});`
            },
            callout: {
              kind: 'ue5',
              label: 'UE5 版本演进提示 (5.0+)',
              text: '许多老教程（UE 4.24–5.2 时代）要求重写 AssetManager 并手动调用 InitGlobalData()；自 UE 5.3 起引擎会自动完成该初始化（保留旧调用也无害，函数会提前返回）。只有当你需要自定义全局 FGameplayEffectContext 或扩展 AbilitySystemGlobals 子类时才需配置 DefaultGame.ini。'
            },
            hud: [
              { key: 'plugin', label: '必需插件', value: 'GameplayAbilities', status: 'good' },
              { key: 'modules', label: 'Build.cs 模块', value: 'Abilities + Tags + Tasks', status: 'good' },
              { key: 'init', label: 'InitGlobalData()', value: 'UE5 自动执行', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'uproj', col: -1.8, row: 0, color: 'sand', icon: 'code', label: '.uproject', sublabel: 'Plugin: GameplayAbilities' },
                { id: 'build', col: 0, row: 0, color: 'green', icon: 'code', label: 'Build.cs', sublabel: '3 Core Modules', state: 'active' },
                { id: 'ready', col: 1.9, row: 0, color: 'blue', icon: 'asc', label: 'GAS Ready', sublabel: 'UE 5.3 – 5.5' }
              ],
              edges: [
                { id: 'r1', from: 'uproj', to: 'build', packet: 'rep' },
                { id: 'r2', from: 'build', to: 'ready', packet: 'rep', label: '编译就绪', labelTone: 'green' }
              ],
              inspectCard: {
                title: 'WHEN TO USE GAS?',
                rows: [
                  { left: 'ARPG / MOBA / 英雄射击', right: '强烈推荐', highlight: 'green' },
                  { left: '多人协作生存 / MMO', right: '强烈推荐', highlight: 'green' },
                  { left: '纯叙事步行模拟 / 简单三消', right: '无需引入', highlight: 'amber' }
                ]
              }
            }
          }
        ]
      },
      {
        slug: 'asc-architecture',
        title: 'ASC 挂载架构与双端初始化时序',
        titleEn: 'ASC Placement: OwnerActor, AvatarActor & Init Timing',
        summary: '彻底搞懂 Pawn vs PlayerState 挂载抉择、双端 InitAbilityActorInfo 时序与 NetUpdateFrequency 巨坑。',
        durationMin: 12,
        difficulty: '入门',
        goals: [
          { id: 'g1', text: '区分 OwnerActor（逻辑宿主）与 AvatarActor（物理躯壳）', unlockAtStep: 2 },
          { id: 'g2', text: '掌握 AI 挂 Character、玩家挂 PlayerState 的架构选型', unlockAtStep: 2 },
          { id: 'g3', text: '正确在 Character 上转发 IAbilitySystemInterface', unlockAtStep: 3 },
          { id: 'g4', text: '写出无竞态漏洞的 PossessedBy 与 OnRep_PlayerState 双端初始化', unlockAtStep: 4 },
          { id: 'g5', text: '规避 PlayerState 默认 NetUpdateFrequency=1 导致的严重同步延迟', unlockAtStep: 5 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '死亡丢失',
            phase: 'PROBLEM',
            title: '把玩家 ASC 挂在 Character 上会发生什么？',
            paragraphs: [
              '新手最直觉的做法是直接在 `ACharacter` 构造函数里 `CreateDefaultSubobject<UAbilitySystemComponent>()`。对于死后直接销毁的野怪小兵，这完全没问题。',
              '但在 MOBA、射击（如 **Lyra**）或魂类联机中，玩家死亡时旧 `ACharacter` 会被 `Destroy()`，5 秒后生成全新的 `ACharacter`！如果 ASC 挂在 Character 上，**技能等级、大招冷却、金币经验属性会随尸体一起被销毁**！'
            ],
            callout: {
              kind: 'warn',
              label: '架构返工重灾区',
              text: '项目后期从 Character 迁移 ASC 到 PlayerState 涉及大量初始化与 UI 绑定重构，务必在立项第一天定好宿主位置。'
            },
            hud: [
              { key: 'host', label: '当前挂载点', value: 'ACharacter (Pawn)', status: 'warn' },
              { key: 'respawn', label: '角色死亡重生后', value: '属性与冷却全丢!', status: 'bad' }
            ],
            scene: {
              nodes: [
                { id: 'pc', col: -2, row: 0, color: 'blue', icon: 'client', label: 'PlayerController', sublabel: '持久存活' },
                {
                  id: 'oldpawn',
                  col: 0.4,
                  row: -0.9,
                  color: 'red',
                  icon: 'pawn',
                  label: 'Old Character',
                  sublabel: '死亡 Destroy()',
                  state: 'crashed',
                  badge: { text: 'ASC + 60s 大招CD 销毁!', tone: 'bad' }
                },
                {
                  id: 'newpawn',
                  col: 1.5,
                  row: 1.2,
                  color: 'amber',
                  icon: 'pawn',
                  label: 'New Character',
                  sublabel: '5秒后重生生成',
                  badge: { text: '空白 ASC (数据归零)', tone: 'warn' }
                }
              ],
              edges: [
                { id: 'd1', from: 'pc', to: 'oldpawn', style: 'dashed', packet: 'error', label: 'UnPossess & Destroy' },
                { id: 'd2', from: 'pc', to: 'newpawn', packet: 'input', label: 'Possess 新躯壳' }
              ],
              legend: [
                { type: 'error', label: '随 Pawn 销毁丢失数据' },
                { type: 'input', label: '重新附身' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: 'Owner与Avatar',
            phase: 'ARCHITECTURE',
            title: '精妙分离：OwnerActor vs AvatarActor',
            paragraphs: [
              '为此，ASC 内部专门维护了两个 Actor 弱引用指针：`[[OwnerActor|真正拥有 ASC 组件生命周期的逻辑 Actor（如 APlayerState）]]` 与 `[[AvatarActor|代表角色在 3D 世界中移动、播放动画蒙太奇与碰撞的物理 Actor（如 ACharacter）]]`。',
              '在 **Lyra 标准架构**中：玩家英雄将 ASC 与核心 `AttributeSet` 挂在跨越死亡持久存在的 `APlayerState` 上（`Owner = PlayerState`, `Avatar = Character`）；而无需复活的 AI 敌人则直接挂在 `ACharacter` 基类或子类上（`Owner = Avatar = AI_Character`）。'
            ],
            changes: [
              { op: 'add', text: 'APlayerState 持久持有 ASC 与 AttributeSet (OwnerActor)' },
              { op: 'mod', text: 'ACharacter 仅作为物理躯壳提供骨骼网格与位置 (AvatarActor)' }
            ],
            hud: [
              { key: 'owner', label: 'OwnerActor', value: 'APlayerState (持久)', status: 'good' },
              { key: 'avatar', label: 'AvatarActor', value: 'ACharacter (可换壳)', status: 'good' },
              { key: 'ai', label: 'AI 小兵方案', value: 'Owner = Avatar = Pawn', status: 'good' }
            ],
            scene: {
              nodes: [
                {
                  id: 'ps',
                  col: -1.4,
                  row: -0.6,
                  color: 'green',
                  icon: 'playerstate',
                  label: 'APlayerState',
                  sublabel: 'OwnerActor (持久)',
                  size: 'lg',
                  state: 'active'
                },
                {
                  id: 'asc',
                  col: -1.4,
                  row: 1.3,
                  color: 'teal',
                  icon: 'asc',
                  label: 'ASC + AttributeSet',
                  sublabel: 'Subobjects on PS'
                },
                {
                  id: 'char',
                  col: 1.6,
                  row: 0,
                  color: 'blue',
                  icon: 'pawn',
                  label: 'ACharacter',
                  sublabel: 'AvatarActor (物理世界)',
                  badge: { text: '死亡换壳不丢数据', tone: 'good' }
                }
              ],
              edges: [
                { id: 'oa1', from: 'ps', to: 'asc', packet: 'rep', label: '持有组件' },
                { id: 'oa2', from: 'asc', to: 'char', packet: 'predict', bidirectional: true, label: 'AvatarActor 引用', labelTone: 'violet' }
              ],
              inspectCard: {
                title: 'ASC PLACEMENT RULE',
                rows: [
                  { left: '需要重生/换载具的玩家', right: 'PlayerState', highlight: 'green' },
                  { left: '死后即销毁的 AI 怪物', right: 'Character', highlight: 'green' },
                  { left: '可破坏木桶 / 机关门', right: 'Actor 自身', highlight: 'amber' }
                ]
              }
            }
          },
          {
            id: 's3',
            shortLabel: '接口转发',
            phase: 'TECHNIQUE',
            title: '极其容易遗漏的一步：Character 必须转发接口！',
            paragraphs: [
              '当火球击中玩家的胶囊体时，`Overlap` 事件拿到的是物理世界里的 `ACharacter`，而不是幕后的 `APlayerState`！引擎工具函数 `UAbilitySystemBlueprintLibrary::GetAbilitySystemComponent(HitActor)` 会检查被击中者是否实现了 `IAbilitySystemInterface`。',
              '因此：**不仅 `APlayerState` 要继承 `IAbilitySystemInterface`，`ACharacter` 也必须继承该接口**，并在 `GetAbilitySystemComponent()` 中返回缓存或从 `PlayerState` 取出的 ASC 指针！'
            ],
            codeSnippet: {
              title: 'MyHeroCharacter.cpp 接口转发',
              code: `UAbilitySystemComponent* AMyHeroCharacter::GetAbilitySystemComponent() const {\n  // AbilitySystemComponent 是在初始化时缓存自 PlayerState 的指针\n  return AbilitySystemComponent.Get();\n}`
            },
            callout: {
              kind: 'tip',
              label: '公有基类优雅设计',
              text: '声明 AMyCharacterBase 继承 IAbilitySystemInterface 并持有 TObjectPtr<UAbilitySystemComponent> 弱指针：AI 子类在构造函数直接创建实例赋给它，玩家子类在初始化时将 PlayerState 上的 ASC 赋给它，业务代码 100% 统一！'
            },
            hud: [
              { key: 'ps_iface', label: 'PlayerState 接口', value: '已实现', status: 'good' },
              { key: 'char_iface', label: 'Character 接口转发', value: '已实现 (防空指针)', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'proj', col: -2.2, row: 0.5, color: 'amber', icon: 'sword', label: '攻击碰撞检测', sublabel: 'HitActor = Character', size: 'sm' },
                { id: 'char', col: 0, row: 0.4, color: 'blue', icon: 'pawn', label: 'AHeroCharacter', sublabel: 'IAbilitySystemInterface' },
                { id: 'ps_asc', col: 2, row: -0.6, color: 'green', icon: 'asc', label: 'PlayerState->ASC', state: 'active' }
              ],
              edges: [
                { id: 'i1', from: 'proj', to: 'char', packet: 'input', label: 'GetASC(HitActor)' },
                { id: 'i2', from: 'char', to: 'ps_asc', packet: 'ge', label: '转发返回真实 ASC', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: '双端初始化',
            phase: 'SOLUTION',
            title: '双端 InitAbilityActorInfo 黄金调用时机',
            paragraphs: [
              'ASC 必须在**服务端和客户端各自调用一次** `InitAbilityActorInfo(InOwnerActor, InAvatarActor)`，才能正确绑定骨骼动画实例 (`UAnimInstance`)、网络角色 (`ENetRole`) 与预测路由。',
              '当 ASC 在 `APlayerState` 上时：\n• **服务端**：在 `ACharacter::PossessedBy(AController*)` 中调用（此时 Controller 和 PlayerState 均已就绪）。\n• **客户端**：`PlayerState` 通过网络异步复制到达，必须在 `ACharacter::OnRep_PlayerState()` 中调用！',
              '若 ASC 挂在 **Pawn 自身**（如 AI 小兵，通常没有 PlayerState），客户端永远不会进 `OnRep_PlayerState`：应在服务端 `PossessedBy`（或 `BeginPlay`）与客户端 `BeginPlay` 中调用 `InitAbilityActorInfo(this, this)`。'
            ],
            codeSnippet: {
              title: '双端初始化与重生防重复授予范式 (ASC on PlayerState)',
              code: `// Server 端：控制器附身时触发（首次出生与每次死亡重生都会进入!）
void AHeroCharacter::PossessedBy(AController* NewController) {
  Super::PossessedBy(NewController);
  if (AMyPlayerState* PS = GetPlayerState<AMyPlayerState>()) {
    AbilitySystemComponent = PS->GetAbilitySystemComponent();
    AbilitySystemComponent->InitAbilityActorInfo(PS, this);
    PS->TryGrantStartupAbilities(); // 内部用 bStartupAbilitiesGiven 守卫，严防重生重复授予!
  }
}
// Client 端：PlayerState 复制到达时触发
void AHeroCharacter::OnRep_PlayerState() {
  Super::OnRep_PlayerState();
  if (AMyPlayerState* PS = GetPlayerState<AMyPlayerState>()) {
    AbilitySystemComponent = PS->GetAbilitySystemComponent();
    AbilitySystemComponent->InitAbilityActorInfo(PS, this);
  }
}`
            },
            changes: [
              { op: 'add', text: 'Server: PossessedBy 内刷新 ActorInfo，并仅在首次出生时授予初始技能包' },
              { op: 'add', text: 'Client: OnRep_PlayerState 内完成客户端 ActorInfo 与 AnimInstance 绑定' }
            ],
            hud: [
              { key: 'srv_init', label: 'Server 初始化点', value: 'PossessedBy()', status: 'good' },
              { key: 'cli_init', label: 'Client 初始化点', value: 'OnRep_PlayerState()', status: 'good' },
              { key: 'grant', label: 'GiveAbility 权限', value: '仅 Server 权威调用', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'srv', col: -1.6, row: -1, color: 'green', icon: 'server', label: 'Server: PossessedBy', sublabel: 'InitActorInfo + GiveAbility' },
                { id: 'psrep', col: 0, row: 0.2, color: 'amber', icon: 'playerstate', label: 'PlayerState 复制', sublabel: '网络异步到达客户端' },
                { id: 'cli', col: 1.8, row: 1.1, color: 'blue', icon: 'client', label: 'Client: OnRep_PS', sublabel: 'InitAbilityActorInfo(PS, this)', state: 'active' }
              ],
              edges: [
                { id: 'in1', from: 'srv', to: 'psrep', packet: 'rep', label: '属性与 AbilitySpec 复制' },
                { id: 'in2', from: 'psrep', to: 'cli', packet: 'rep', label: '触发 OnRep 回调', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's5',
            shortLabel: '1Hz 巨坑',
            phase: 'PITFALL',
            title: '头号性能陷阱：APlayerState 默认每秒只同步 1 次！',
            paragraphs: [
              '无数开发者把 ASC 移到 `APlayerState` 后惊恐地发现：释放技能扣血或恢复法力时，客户端 UI 竟然有高达 **0.5～1 秒的诡异延迟**，连预测状态追赶核销也严重滞后！',
              '真相藏在引擎 `PlayerState.cpp` 构造函数里：为了节省传统计分板带宽，UE 默认把 `APlayerState` 的 `NetUpdateFrequency` 设成了极低的 **`1.0f`（每秒最多参与 1 次属性复制评估）**！参考 Lyra 的 `ALyraPlayerState`，应在构造函数中调高（例如 **`100.0f`**）。注意：`NetUpdateFrequency` 决定的是 Actor **多久有资格参与一次复制评估**，实际到达间隔还受服务器 `NetServerMaxTickRate`（如 30Hz/60Hz）、网络相关性与连接带宽制约。'
            ],
            codeSnippet: {
              title: 'AMyPlayerState 构造函数必配项 (Lyra 示例基准)',
              code: `AMyPlayerState::AMyPlayerState() {
  ASC = CreateDefaultSubobject<UMyASC>(TEXT("ASC"));
  ASC->SetIsReplicated(true);
  ASC->SetReplicationMode(EGameplayEffectReplicationMode::Mixed);

  // 关键！解除引擎默认 1.0f 节流（Lyra 示例设为 100.0f，实际频率受 Server Tick 上限约束）
  SetNetUpdateFrequency(100.0f);
}`
            },
            callout: {
              kind: 'warn',
              label: '必查 Checklist',
              text: '凡是将 ASC 挂载在 APlayerState 上的项目，忘记调高 SetNetUpdateFrequency 几乎必现属性 RepNotify 与预测状态追赶（CatchUpTo）滞后；实际同步粒度不会超过服务器 Tick 频率。'
            },
            changes: [
              { op: 'mod', text: 'PlayerState NetUpdateFrequency: 1.0 Hz → 100.0 Hz (Lyra 示例值)' },
              { op: 'mod', text: '解除 1Hz 人为节流，属性同步紧跟服务器 Tick 上限' }
            ],
            hud: [
              { key: 'default_hz', label: '引擎默认上限', value: '1.0 Hz (严重节流!)', status: 'bad' },
              { key: 'lyra_hz', label: 'Lyra 示例配置', value: '100.0 Hz', status: 'good' },
              { key: 'sync_lag', label: '实际到达粒度', value: '对齐 Server Tick', status: 'good' }
            ],
            scene: {
              nodes: [
                {
                  id: 'badps',
                  col: -1.6,
                  row: -0.6,
                  color: 'red',
                  icon: 'playerstate',
                  label: '默认 PlayerState',
                  sublabel: 'NetUpdateFreq = 1.0f',
                  badge: { text: '~1s 才有资格复制!', tone: 'bad', progress: 10 },
                  state: 'disabled'
                },
                {
                  id: 'goodps',
                  col: 1.2,
                  row: 0.7,
                  color: 'green',
                  icon: 'playerstate',
                  label: 'AMyPlayerState',
                  sublabel: 'SetNetUpdateFrequency(100.f)',
                  badge: { text: '解除节流 · 紧跟 Tick', tone: 'good', progress: 100 },
                  state: 'active',
                  size: 'lg'
                }
              ],
              edges: [
                { id: 'hz1', from: 'badps', to: 'goodps', packet: 'rep', packetRate: 'fast', label: '解除复制资格上限瓶颈', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's6',
            shortLabel: '换壳闭环',
            phase: 'RECAP',
            title: '总结：角色死亡解绑、防重复授予与重生无缝换壳',
            paragraphs: [
              '现在串起完整的重生闭环：当旧 `ACharacter` 死亡即将销毁或脱离控制时，先清理“死亡需移除的临时 Debuff”，并调用 **`ASC->ClearActorInfo()`**（或参考 Lyra `UninitializeFromAbilitySystem` 解绑旧 `AvatarActor` 与动画实例），避免悬空躯壳指针。',
              '当新 `ACharacter` 生成并附身时，双端再次调用 `ASC->InitAbilityActorInfo(PS, NewPawn)` 将 `AvatarActor` 指向新躯壳；同时靠 `PlayerState` 上的 `bStartupAbilitiesGiven` 布尔守卫**跳过重复 `GiveAbility`**，实现大招 CD 保留、零重复技能授予的完美换壳！'
            ],
            hud: [
              { key: 'owner', label: 'OwnerActor', value: 'PlayerState 零丢失', status: 'good' },
              { key: 'avatar', label: 'AvatarActor 切换', value: 'InitAbilityActorInfo 刷新', status: 'good' },
              { key: 'netfreq', label: 'NetUpdateFrequency', value: '100.0f 已就绪', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'ps', col: -1.6, row: 0, color: 'green', icon: 'playerstate', label: 'PlayerState (ASC)', sublabel: '大招CD / 等级完好保留', state: 'active' },
                { id: 'newchar', col: 1.5, row: -0.7, color: 'blue', icon: 'pawn', label: '重生新 Character', sublabel: '新 AvatarActor' },
                { id: 'mech', col: 1.5, row: 1.3, color: 'violet', icon: 'shield', label: '机甲 / 载具 Pawn', sublabel: '动态切换 Avatar', size: 'sm' }
              ],
              edges: [
                { id: 'rc1', from: 'ps', to: 'newchar', packet: 'rep', label: 'InitAbilityActorInfo(PS, NewPawn)', labelTone: 'green' },
                { id: 'rc2', from: 'ps', to: 'mech', style: 'dashed', packet: 'predict' }
              ]
            }
          }
        ]
      },
      {
        slug: 'replication-modes',
        title: '复制模式抉择：Full / Mixed / Minimal',
        titleEn: 'GameplayEffect Replication Modes Explained',
        summary: '精准控制 FActiveGameplayEffect 网络复制范围，守住多人游戏服务器带宽红线。',
        durationMin: 11,
        difficulty: '进阶',
        goals: [
          { id: 'g1', text: '理解为什么多人游戏绝不能对全场单位开启 Full 模式', unlockAtStep: 2 },
          { id: 'g2', text: '掌握 Mixed 模式对 AutonomousProxy 与 SimulatedProxy 的差异化同步', unlockAtStep: 3 },
          { id: 'g3', text: '避开 Mixed 模式要求 OwnerActor 拥有链指向 PlayerController 的陷阱', unlockAtStep: 4 },
          { id: 'g4', text: '为 AI 敌人正确选用 Minimal 模式并理解属性复制的独立性', unlockAtStep: 5 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '带宽危机',
            phase: 'PROBLEM',
            title: '团战现场：为什么活跃 GE 结构体不能全网广播？',
            paragraphs: [
              '每个挂载在角色身上的持续型 Buff 都是一个沉重的 `FActiveGameplayEffect` 实例——里面包含完整的 `FGameplayEffectSpec`、起始服务器时间戳、持续时间、堆叠层数、捕获的快照属性与动态修改器数组。',
              '假设场上有 30 个单位，每人身上 12 个被动/装备/Buff，如果任一 GE 层数刷新都要广播给全部玩家，单帧网络序列化就会击穿服务器的每连接带宽上限！'
            ],
            hud: [
              { key: 'units', label: '同屏战斗单位', value: '30 Actors', status: 'neutral' },
              { key: 'ges', label: '活跃 GE 总数', value: '360 ActiveGEs', status: 'warn' },
              { key: 'bw', label: '全量广播负载', value: 'N² 带宽饱和!', status: 'bad' }
            ],
            scene: {
              nodes: [
                {
                  id: 'srv',
                  col: 0,
                  row: -0.8,
                  color: 'red',
                  icon: 'server',
                  label: 'Dedicated Server',
                  sublabel: 'ReplicationMode = Full',
                  badge: { text: '带宽占用 99%', tone: 'bad', progress: 99 },
                  size: 'lg'
                },
                { id: 'c1', col: -2.1, row: 1.2, color: 'blue', icon: 'client', label: 'Client A', size: 'sm' },
                { id: 'c2', col: 0, row: 1.7, color: 'blue', icon: 'client', label: 'Client B', size: 'sm' },
                { id: 'c3', col: 2.1, row: 1.2, color: 'blue', icon: 'client', label: 'Client C', size: 'sm' }
              ],
              edges: [
                { id: 'b1', from: 'srv', to: 'c1', packet: 'ge', packetRate: 'fast', label: '全量 ActiveGEs' },
                { id: 'b2', from: 'srv', to: 'c2', packet: 'ge', packetRate: 'fast', label: '全量 ActiveGEs' },
                { id: 'b3', from: 'srv', to: 'c3', packet: 'ge', packetRate: 'fast', label: '全量 ActiveGEs' }
              ],
              legend: [{ type: 'ge', label: '沉重的 FActiveGameplayEffect 全量包' }]
            }
          },
          {
            id: 's2',
            shortLabel: 'Full 模式',
            phase: 'PITFALL',
            title: 'Full 模式：默认面向单机或确需全员检视完整 ActiveGE 的特殊场景',
            paragraphs: [
              '当调用 `ASC->SetReplicationMode(EGameplayEffectReplicationMode::Full)` 时，每个 `FActiveGameplayEffect` 都会无差别复制到所有相关连接的客户端。',
              '常规竞技或 MMO 中，客户端 A 并不需要知道 50 米外另一个玩家身上“回蓝药水还剩 4.32 秒、快照精神力是 85”这种内部规格！除非是单机游戏，或极少数如小规模协作检视面板、全知观战/回放系统等**确实要求每个客户端读取他人完整 `ActiveGE` 详情**的场景，否则多人联机切勿滥用 `Full`。'
            ],
            callout: {
              kind: 'warn',
              label: 'Epic 源码注释与选型权衡',
              text: '引擎头文件注释推荐将 Full 用于 Singleplayer；在常规多人对局中全场开启 Full 既造成高昂序列化带宽开销，也会向敌方客户端下发隐藏 Buff 的精确剩余时间与修改器明细。'
            },
            hud: [
              { key: 'mode', label: '当前模式', value: 'Full', status: 'warn' },
              { key: 'usecase', label: '适用场景', value: '单机 / 特需全量检视场景', status: 'warn' }
            ],
            scene: {
              nodes: [
                { id: 'srv', col: -1.5, row: 0, color: 'amber', icon: 'asc', label: 'Hero A (Server)', sublabel: 'Full Mode' },
                {
                  id: 'enemy',
                  col: 1.6,
                  row: 0,
                  color: 'red',
                  icon: 'client',
                  label: '敌方客户端 B',
                  sublabel: '收到 Hero A 全部隐藏 GE 明细!',
                  badge: { text: '信息泄露 + 浪费带宽', tone: 'bad' }
                }
              ],
              edges: [
                { id: 'fl1', from: 'srv', to: 'enemy', packet: 'error', label: 'FActiveGameplayEffectsContainer 全量复制', labelTone: 'red' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: 'Mixed 模式',
            phase: 'SOLUTION',
            title: '玩家控制角色黄金标准：Mixed 混合复制模式',
            paragraphs: [
              '`EGameplayEffectReplicationMode::Mixed` 做出了最聪明的区分对待：\n• 对**拥有该角色的本机客户端 (`AutonomousProxy`)**：完整同步 `FActiveGameplayEffect`！这样玩家自己的屏幕左下角能精确绘制每个 Buff 图标的倒计时扇形，且本地预测的 GE 能与服务端无缝对齐。',
              '• 对**所有其他旁观/敌方客户端 (`SimulatedProxy`)**：**绝不发送** `FActiveGameplayEffect`！只同步精简的 **Gameplay Tags 计数**与 **GameplayCues**——旁观者依然能看到你头顶的眩晕图标和身上的护盾特效，带宽骤降 85% 以上！'
            ],
            changes: [
              { op: 'mod', text: 'Owning Client：接收完整 FActiveGameplayEffects (支持本地预测与 CD/Buff UI)' },
              { op: 'mod', text: 'Simulated Proxies：仅接收精简 MinimalReplicationTags 与 GameplayCues' }
            ],
            hud: [
              { key: 'mode', label: '玩家角色推荐', value: 'Mixed', status: 'good' },
              { key: 'own_cli', label: '本机客户端', value: 'Full ActiveGE + 预测', status: 'good' },
              { key: 'sim_cli', label: '旁观客户端', value: '仅 Tags + Cues', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'srv', col: 0, row: -1.1, color: 'green', icon: 'server', label: 'Server: Player A ASC', sublabel: 'ReplicationMode = Mixed', state: 'active' },
                {
                  id: 'own',
                  col: -1.9,
                  row: 1.1,
                  color: 'blue',
                  icon: 'client',
                  label: 'Player A 本机',
                  sublabel: 'AutonomousProxy',
                  badge: { text: '完整 GE + 倒计时 UI', tone: 'good' }
                },
                {
                  id: 'sim',
                  col: 1.9,
                  row: 1.1,
                  color: 'teal',
                  icon: 'users',
                  label: '其他玩家 B / C',
                  sublabel: 'SimulatedProxy',
                  badge: { text: '轻量 Tags + 特效 Cues', tone: 'good' }
                }
              ],
              edges: [
                { id: 'mx1', from: 'srv', to: 'own', packet: 'ge', label: 'ActiveGEs (Condition: OwnerOnly)', labelTone: 'amber' },
                { id: 'mx2', from: 'srv', to: 'sim', packet: 'cue', label: 'MinimalTags + Cues', labelTone: 'green' }
              ],
              legend: [
                { type: 'ge', label: '完整 ActiveGE (仅发给主人)' },
                { type: 'cue', label: '轻量 Tag/Cue (发给全员)' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: 'Owner 链陷阱',
            phase: 'PITFALL',
            title: 'Mixed 模式的铁律：OwnerActor 拥有链必须通向 PlayerController！',
            paragraphs: [
              '`Mixed` 模式依赖 `COND_OwnerOnly` 语义决定把完整的 `ActiveGameplayEffects` 发给哪个连接，底层查找的是 **`OwnerActor->GetNetConnection()`**（顺着 `AActor::GetOwner()` 链向上定位 `APlayerController`）。',
              '• `APlayerState` 的 `Owner` 引擎自动设为对应的 `APlayerController` ✅\n• 被玩家 `Possess` 的 `APawn`，其 `Owner` 也是该 `APlayerController` ✅\n• **常见误配**：若给由 `AAIController` 控制的 AI 怪物或无主 Actor 设成 `Mixed`，由于没有拥有连接（`GetNetConnection() == nullptr`），**结果只是没有任何客户端会收到完整 `ActiveGE`**（退化得像 `Minimal`，却白白承担容器脏标记开销）；而若是玩家控制单位的自定义宿主忘了 `SetOwner(PC)`，本机客户端就会收不到 `ActiveGE` 且无法正常发起预测 Server RPC！'
            ],
            callout: {
              kind: 'warn',
              label: '生产环境必背口诀',
              text: 'Mixed 专给拥有有效 UNetConnection（背后有真人 PlayerController）的角色使用；无玩家连接的 AI 单位在多人模式下请统一使用 Minimal。'
            },
            hud: [
              { key: 'ps_owner', label: 'PlayerState->GetOwner()', value: 'PlayerController ✅', status: 'good' },
              { key: 'ai_owner', label: 'AI Pawn->GetOwner()', value: 'AIController (无客户端收完整GE)', status: 'warn' }
            ],
            scene: {
              nodes: [
                { id: 'pc', col: -2, row: -0.6, color: 'green', icon: 'client', label: 'APlayerController', sublabel: '持有 UNetConnection' },
                { id: 'ps', col: -0.3, row: 0.7, color: 'blue', icon: 'playerstate', label: 'PlayerState (Mixed)', badge: { text: 'Owner 链畅通 ✅', tone: 'good' } },
                { id: 'aic', col: 2, row: -0.6, color: 'red', icon: 'server', label: 'AAIController', sublabel: '仅在服务端 · 无连接', state: 'crashed' },
                { id: 'aipawn', col: 2, row: 1.3, color: 'slate', icon: 'pawn', label: 'AI 误设 Mixed', badge: { text: '无 Owner 客户端 · 等同 Minimal', tone: 'warn' }, state: 'disabled' }
              ],
              edges: [
                { id: 'ow1', from: 'ps', to: 'pc', packet: 'rep', label: 'GetOwner()' },
                { id: 'ow2', from: 'aipawn', to: 'aic', style: 'dashed', packet: 'error' }
              ]
            }
          },
          {
            id: 's5',
            shortLabel: 'Minimal 模式',
            phase: 'TECHNIQUE',
            title: 'AI 与海量单位救星：Minimal 极简复制模式',
            paragraphs: [
              '对于 AI 怪物、小兵与 Boss，调用 `ASC->SetReplicationMode(EGameplayEffectReplicationMode::Minimal)`：**服务端绝不向任何客户端复制任何 `FActiveGameplayEffect`**，只把 GE 赋予的标签计数与 GameplayCue 同步给所有客户端。',
              '常见误区澄清：**开启 `Minimal` 后客户端还能看到 Boss 的血条变化吗？当然能！** 因为 `ReplicationMode` 控制的是 `GameplayEffect` 容器的复制，而生命值、最大生命值存储在 `UAttributeSet` 中，走标准 UE 属性复制 (`DOREPLIFETIME_CONDITION_NOTIFY`)，完全不受影响！'
            ],
            callout: {
              kind: 'insight',
              label: '核心概念区分',
              text: 'ASC 的 ReplicationMode 只管 ActiveGameplayEffects（Buff 容器）怎么同步；AttributeSet 里的 Health/MaxHealth 是标准的 UPROPERTY(ReplicatedUsing=OnRep_Health)，任何模式下都会正常同步血条！'
            },
            changes: [
              { op: 'add', text: 'AI ASC 启用 Minimal：ActiveGE 网络带宽降至 0' },
              { op: 'mod', text: 'AttributeSet (Health) 仍通过标准 RepNotify 精准更新血条' }
            ],
            hud: [
              { key: 'ai_mode', label: 'AI 怪物标准模式', value: 'Minimal', status: 'good' },
              { key: 'ge_bw', label: 'ActiveGE 同步量', value: '0 Bytes', status: 'good' },
              { key: 'hp_rep', label: '怪物血条 (Attribute)', value: '正常 RepNotify 同步', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'boss', col: -1.4, row: -0.3, color: 'violet', icon: 'asc', label: 'Boss ASC (Minimal)', sublabel: 'Server 权威结算全部 GE', state: 'active' },
                { id: 'attr', col: -1.4, row: 1.5, shape: 'cylinder', color: 'green', icon: 'attr', label: 'Boss AttributeSet', sublabel: 'Health: 4200 / 5000' },
                { id: 'players', col: 1.8, row: 0.4, color: 'blue', icon: 'users', label: '所有玩家客户端', badge: { text: '血条 + 眩晕Tag + 特效齐全', tone: 'good' } }
              ],
              edges: [
                { id: 'mn1', from: 'boss', to: 'players', packet: 'cue', label: 'MinimalTags + Cues (超轻量)' },
                { id: 'mn2', from: 'attr', to: 'players', packet: 'rep', label: 'OnRep_Health (标准属性同步)', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's6',
            shortLabel: '选型矩阵',
            phase: 'RECAP',
            title: '总结：一张表锁定所有项目的 ReplicationMode',
            paragraphs: [
              '记住这三条选型准则，即可清晰规划项目的 `ReplicationMode`：\n1. **纯单机游戏（或确需全员检视完整 ActiveGE 的特殊联机系统）** → 设为 `Full`。\n2. **多人游戏中的玩家控制角色（Owner 链通向 PlayerController）** → 设为 `Mixed`。\n3. **多人游戏中的 AI 敌人、中立生物、召唤物、可破坏物** → 设为 `Minimal`。'
            ],
            hud: [
              { key: 'sp', label: '单机游戏', value: 'Full', status: 'good' },
              { key: 'mp_player', label: '多人玩家角色', value: 'Mixed', status: 'good' },
              { key: 'mp_ai', label: '多人 AI / 召唤物', value: 'Minimal', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'n1', col: -2, row: 0.4, color: 'amber', icon: 'pawn', label: 'Full', sublabel: '单机 / 特需全量检视' },
                { id: 'n2', col: 0, row: 0, color: 'green', icon: 'playerstate', label: 'Mixed', sublabel: '多人玩家 (PlayerState)', state: 'active', size: 'lg' },
                { id: 'n3', col: 2, row: -0.4, color: 'teal', icon: 'asc', label: 'Minimal', sublabel: '多人 AI 怪物 (Pawn)' }
              ],
              edges: [
                { id: 's61', from: 'n1', to: 'n2', style: 'dashed', packet: 'none' },
                { id: 's62', from: 'n2', to: 'n3', style: 'dashed', packet: 'none' }
              ],
              inspectCard: {
                title: 'REPLICATION MATRIX',
                rows: [
                  { left: 'Full', right: '全员收 ActiveGE (单机)', highlight: 'amber' },
                  { left: 'Mixed', right: '仅主人收 GE + 全员收 Tag', highlight: 'green' },
                  { left: 'Minimal', right: '无人收 GE + 全员收 Tag', highlight: 'violet' }
                ]
              }
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mod-tags',
    indexLabel: '02. 游戏标签系统',
    title: '02. 游戏标签系统',
    titleEn: '02. Gameplay Tags',
    folderColor: 'violet',
    lessons: [
      {
        slug: 'gameplay-tags-core',
        title: '层级标签、引用计数与 Loose Tag 铁律',
        titleEn: 'Hierarchical Tags, Reference Counting & Loose Tags',
        summary: '深入 FGameplayTagCountContainer 引用计数原理，避开叠加控制提前失效与松散标签不同步陷阱。',
        durationMin: 10,
        difficulty: '入门',
        goals: [
          { id: 'g1', text: '区分父级包含匹配 (MatchesTag) 与精确匹配 (MatchesTagExact)', unlockAtStep: 2 },
          { id: 'g2', text: '理解 ASC 标签引用计数如何完美解决多个同类 Buff 重叠覆盖 Bug', unlockAtStep: 3 },
          { id: 'g3', text: '牢记 AddLooseGameplayTag 不自动网络复制且不参与预测回滚的铁律', unlockAtStep: 4 },
          { id: 'g4', text: '使用 UE5 Native Gameplay Tags 宏替代脆弱的字符串硬编码', unlockAtStep: 5 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '布尔失效',
            phase: 'PROBLEM',
            title: '经典重叠 Bug：两个 3 秒眩晕叠加，为何提前醒了？',
            paragraphs: [
              '在传统 `bool bIsStunned` 设计里：第 0 秒法师对 Boss 施放 3 秒眩晕（`bIsStunned = true`）；第 2 秒战士又补了一记 3 秒盾击眩晕（`bIsStunned = true`）。',
              '灾难在第 3 秒发生了：法师的定时器到期，执行 `bIsStunned = false`——尽管战士的盾击本该控到第 5 秒，**Boss 却在第 3 秒提前解除眩晕一斧头秒了全队**！'
            ],
            hud: [
              { key: 'stun_a', label: '法师眩晕 (0~3s)', value: '第 3s 到期置 false', status: 'warn' },
              { key: 'stun_b', label: '战士眩晕 (2~5s)', value: '被提前覆盖吞掉!', status: 'bad' }
            ],
            scene: {
              nodes: [
                { id: 'mage', col: -2, row: -0.8, color: 'violet', icon: 'ga', label: '法师眩晕 (0~3s)', size: 'sm' },
                { id: 'war', col: -2, row: 1.2, color: 'amber', icon: 'shield', label: '战士盾击 (2~5s)', size: 'sm' },
                {
                  id: 'boss',
                  col: 1.2,
                  row: 0.2,
                  color: 'red',
                  icon: 'pawn',
                  label: 'Boss (bool bStunned)',
                  sublabel: 't=3s 被错误置为 false!',
                  badge: { text: '提前 2 秒醒来!', tone: 'bad' },
                  size: 'lg'
                }
              ],
              edges: [
                { id: 'tb1', from: 'mage', to: 'boss', packet: 'error', label: 't=3s: bStunned = false' },
                { id: 'tb2', from: 'war', to: 'boss', packet: 'input', label: 't=2s: bStunned = true' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '层级树匹配',
            phase: 'ARCHITECTURE',
            title: '树状语义字典：MatchesTag vs MatchesTagExact',
            paragraphs: [
              '`FGameplayTag` 采用点号分层的树形命名，例如 `State.Debuff.CrowdControl.Stun` 与 `State.Debuff.CrowdControl.Freeze`。底层本质是全局标签字典注册的 `FName`，复制与哈希比对开销极小。',
              '• **父级宽泛匹配 (`HasMatchingGameplayTag` / `MatchesTag`)**：询问目标是否拥有 `State.Debuff.CrowdControl`？只要目标身上有 `Stun` **或** `Freeze` 任一子标签，均返回 `true`！\n• **精确匹配 (`MatchesTagExact`)**：必须分毫不差等于该节点才返回 `true`。'
            ],
            callout: {
              kind: 'tip',
              label: '语义化威力',
              text: '“免控霸体药水”只需配置免疫父标签 State.Debuff.CrowdControl，未来策划新增“魅惑”、“击飞”、“石化”等任意子标签，无需改一行代码自动生效！'
            },
            hud: [
              { key: 'tag', label: '当前持有标签', value: '...CrowdControl.Stun', status: 'good' },
              { key: 'parent', label: '查询 State.Debuff', value: 'true (父级命中)', status: 'good' },
              { key: 'exact', label: 'Exact 查 State.Debuff', value: 'false (非精确叶节点)', status: 'neutral' }
            ],
            scene: {
              nodes: [
                { id: 'root', col: -1.8, row: 0, color: 'violet', icon: 'tag', label: 'State.Debuff', sublabel: '父级分类标签' },
                { id: 'cc', col: 0, row: 0, color: 'blue', icon: 'tag', label: '...CrowdControl', sublabel: '硬控子类', state: 'active' },
                { id: 'stun', col: 1.9, row: -1, color: 'green', icon: 'tag', label: '...Stun (眩晕)', size: 'sm' },
                { id: 'freeze', col: 1.9, row: 1, color: 'teal', icon: 'tag', label: '...Freeze (冰冻)', size: 'sm' }
              ],
              edges: [
                { id: 'tr1', from: 'root', to: 'cc', packet: 'predict' },
                { id: 'tr2', from: 'cc', to: 'stun', packet: 'predict' },
                { id: 'tr3', from: 'cc', to: 'freeze', packet: 'predict' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: '引用计数表',
            phase: 'SOLUTION',
            title: 'FGameplayTagCountContainer：基于引用计数的完美叠加',
            paragraphs: [
              'ASC 内部并非用 `TSet` 存标签，而是维护了一张 **`TMap<FGameplayTag, int32>` 引用计数表**（且同时维护父级标签的聚合计数）！',
              '回到双眩晕场景：法师眩晕使 `Stun` 计数 `0 → 1`（触发 `NewOrRemoved` 委托进入眩晕）；战士补控使计数 `1 → 2`；第 3 秒法师 GE 到期移除，计数 `2 → 1`（仍 `> 0`，**不触发移除事件**！）；直到第 5 秒战士 GE 到期，计数 `1 → 0`，Boss 才真正恢复行动！'
            ],
            changes: [
              { op: 'add', text: 'ASC 内部维护 Tag -> Count 映射表（含父级链自动累加）' },
              { op: 'mod', text: '仅当 Count 在 0 ↔ 1 跨越时才广播 EGameplayTagEventType::NewOrRemoved' }
            ],
            hud: [
              { key: 't0', label: 't=0s 法师控', value: 'Count = 1 (进入眩晕)', status: 'good' },
              { key: 't2', label: 't=2s 战士补控', value: 'Count = 2', status: 'good' },
              { key: 't3', label: 't=3s 法师到期', value: 'Count = 1 (继续眩晕!)', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'ge1', col: -2, row: -0.9, color: 'slate', icon: 'ge', label: 'GE_MageStun', sublabel: 't=3s 已到期移除', state: 'disabled', size: 'sm' },
                { id: 'ge2', col: -2, row: 1.1, color: 'amber', icon: 'ge', label: 'GE_WarriorStun', sublabel: '剩余 2.0s 生效中', state: 'active', size: 'sm' },
                {
                  id: 'map',
                  col: 0.8,
                  row: 0.1,
                  shape: 'cylinder',
                  color: 'green',
                  icon: 'tag',
                  label: 'TagCountContainer',
                  sublabel: 'State.Stun → Count: 1',
                  badge: { text: 'Count > 0 · 保持眩晕', tone: 'good' },
                  size: 'lg'
                }
              ],
              edges: [
                { id: 'c1', from: 'ge1', to: 'map', style: 'dashed', packet: 'none', label: '-1 (已退栈)' },
                { id: 'c2', from: 'ge2', to: 'map', packet: 'ge', label: '+1 (维持生效)', labelTone: 'green' }
              ],
              inspectCard: {
                title: 'TAG EVENT TYPES',
                rows: [
                  { left: 'NewOrRemoved', right: '仅 0↔1 触发 (最常用)', highlight: 'green' },
                  { left: 'AnyCountChange', right: '每次层数变化均触发', highlight: 'violet' }
                ]
              }
            }
          },
          {
            id: 's4',
            shortLabel: 'Loose Tag 铁律',
            phase: 'PITFALL',
            title: '避坑指南：Loose Gameplay Tags 绝不会自动网络复制！',
            paragraphs: [
              '看到 `ASC->AddLooseGameplayTag()` 很顺手，很多人在服务端直接调它给角色加状态，结果发现客户端动画蓝图怎么也读不到这个标签！',
              '记住核心铁律：**普通 `LooseGameplayTag` 纯属调用端本地计数，绝不通过网络同步**！虽然 UE5 提供了 `AddReplicatedLooseGameplayTag()` 可以同步给客户端，但它**不支持客户端预测回滚**，且漏调一次 `Remove` 就会造成永久计数泄漏。正式战斗状态请优先使用 `UGameplayEffect` 授予标签！'
            ],
            callout: {
              kind: 'warn',
              label: '什么时候才能用 Loose Tag？',
              text: '仅适用于纯单端临时标记（例如客户端本地 UI 折叠锁、纯服务端 AI 行为树临时冷却锁），或者由框架底层（如 ActivationOwnedTags）严格托管生命周期的场景。'
            },
            hud: [
              { key: 'loose', label: 'AddLooseGameplayTag', value: '仅本地 · 不复制!', status: 'bad' },
              { key: 'ge_tag', label: 'GE Granted Tags', value: '自动复制 + 预测回滚', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'srv', col: -1.6, row: -0.4, color: 'amber', icon: 'server', label: 'Server ASC', sublabel: 'AddLooseGameplayTag()', badge: { text: 'Local Count = 1', tone: 'warn' } },
                { id: 'cli', col: 1.7, row: 0.6, color: 'red', icon: 'client', label: 'Client ASC', sublabel: 'HasMatchingTag() == false', badge: { text: 'Count = 0 (收不到!)', tone: 'bad' } }
              ],
              edges: [
                { id: 'lt1', from: 'srv', to: 'cli', style: 'dashed', packet: 'error', label: '无网络通道传输 Loose Tag!', labelTone: 'red' }
              ]
            }
          },
          {
            id: 's5',
            shortLabel: 'C++ 原生标签',
            phase: 'UE5_NEW',
            title: 'UE5 现代写法：NativeGameplayTags 零拼写错误宏',
            paragraphs: [
              '告别老项目里脆弱的 `FGameplayTag::RequestGameplayTag(FName("State.Stunn"))` 字符串拼写噩梦！UE5 内置了 `<NativeGameplayTags.h>` 声明与定义宏。',
              '编译期强类型检查，模块加载时自动注册进全局标签树，蓝图下拉框与 C++ 代码共享同一份静态符号引用！'
            ],
            codeSnippet: {
              title: 'MyGameplayTags.h / .cpp (UE5 标准写法)',
              code: `// MyGameplayTags.h\n#include "NativeGameplayTags.h"\nUE_DECLARE_GAMEPLAY_TAG_EXTERN(TAG_State_CrowdControl_Stun);\n\n// MyGameplayTags.cpp\nUE_DEFINE_GAMEPLAY_TAG_COMMENT(\n  TAG_State_CrowdControl_Stun,\n  "State.CrowdControl.Stun",\n  "角色处于眩晕硬控状态，禁止移动与普通施法"\n);`
            },
            hud: [
              { key: 'macro', label: '头文件', value: 'NativeGameplayTags.h', status: 'good' },
              { key: 'safety', label: '类型安全', value: '编译期强校验', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'cpp', col: -1.6, row: 0, color: 'blue', icon: 'code', label: 'UE_DEFINE_GAMEPLAY_TAG', sublabel: '编译期符号绑定' },
                { id: 'mgr', col: 1.5, row: 0, color: 'green', icon: 'tag', label: 'UGameplayTagsManager', sublabel: 'C++ 与蓝图零误差共享', state: 'active' }
              ],
              edges: [
                { id: 'nt1', from: 'cpp', to: 'mgr', packet: 'rep', label: '模块启动自动注册', labelTone: 'green' }
              ]
            }
          }
        ]
      },
      {
        slug: 'tag-queries-blocking',
        title: '标签协同：零代码编排打断、互斥与解控',
        titleEn: 'Ability Tag Containers & State Orchestration',
        summary: '利用 GA 六大标签容器与 ActivationOwnedTags 的复制边界，优雅编排复杂动作游戏状态机。',
        durationMin: 11,
        difficulty: '进阶',
        goals: [
          { id: 'g1', text: '掌握 GA 上 Cancel / Block / ActivationOwned / Required / Blocked 标签职责', unlockAtStep: 2 },
          { id: 'g2', text: '注意 UE 5.5 将 AbilityTags 重命名为 AssetTags (GetAssetTags)', unlockAtStep: 2 },
          { id: 'g3', text: '厘清 ActivationOwnedTags 的复制配置 (ReplicateActivationOwnedTags) 与联机排错要点', unlockAtStep: 3 },
          { id: 'g4', text: '实现“眩晕封锁全技能，唯独净化解控技能可破局释放”经典机制', unlockAtStep: 4 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '状态互斥',
            phase: 'PROBLEM',
            title: '动作游戏的复杂规则：冲刺、格挡、普攻与解控',
            paragraphs: [
              '思考四个真实战斗规则：\n1. 按下**举盾格挡**时，若正在**冲刺**，必须立刻打断冲刺；\n2. **举盾期间**禁止释放**火球术**，但允许随时释放**翻滚闪避**；\n3. 被敌人**眩晕**时，所有常规技能灰掉不可按，但**“净化解控”**技能恰恰只能在被控时释放！',
              '如果用传统状态机画连线，4 个技能就要画十几条转换边；而在 GAS 里，只需在资产面板勾选标签！'
            ],
            hud: [
              { key: 'rules', label: '并发互斥规则', value: '打断 + 封锁 + 特例放行', status: 'warn' },
              { key: 'cpp_lines', label: 'GAS 所需 if-else', value: '0 行分支代码', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'sprint', col: -1.8, row: -0.9, color: 'blue', icon: 'ga', label: 'GA_Sprint (冲刺)', size: 'sm' },
                { id: 'block', col: 0, row: 0, color: 'amber', icon: 'shield', label: 'GA_Block (举盾)', state: 'active' },
                { id: 'fire', col: 1.8, row: -0.9, color: 'red', icon: 'ga', label: 'GA_Fireball', state: 'crashed', size: 'sm' },
                { id: 'cleanse', col: 1.8, row: 1.2, color: 'green', icon: 'cue', label: 'GA_Cleanse (净化)', size: 'sm' }
              ],
              edges: [
                { id: 'q1', from: 'block', to: 'sprint', packet: 'error', label: '打断 Cancel' },
                { id: 'q2', from: 'block', to: 'fire', packet: 'error', label: '封锁 Block' },
                { id: 'q3', from: 'block', to: 'cleanse', style: 'dashed', packet: 'predict' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '六大标签槽',
            phase: 'ARCHITECTURE',
            title: 'UGameplayAbility 上的六大标签规则槽位',
            paragraphs: [
              '每个 `UGameplayAbility` 都自带六个标签容器，在 `CanActivateAbility` 与 `ActivateAbility` 时由引擎自动判定：\n• **`AssetTags`**（UE 5.5 新名，旧称 `AbilityTags`）：本技能自身的分类名，如 `Ability.Action.Sprint`。\n• **`CancelAbilitiesWithTag`**：本技能激活瞬间，立刻强行终止正在运行且拥有该 AssetTag 的其他技能。\n• **`BlockAbilitiesWithTag`**：本技能运行期间，阻止拥有该 AssetTag 的技能被激活。',
              '• **`ActivationOwnedTags`**：本技能运行期间临时挂到自身 ASC 上的状态标签（结束时自动减计数）。\n• **`ActivationRequiredTags` / `ActivationBlockedTags`**：激活前检查自身 ASC 必须拥有 / 严禁拥有的标签。'
            ],
            callout: {
              kind: 'ue5',
              label: 'UE 5.5 API 变更提醒',
              text: '在 UE 5.5 中，UGameplayAbility::AbilityTags 成员变量已标记废弃，C++ 构造函数中请改用 SetAssetTags(FGameplayTagContainer) 与 GetAssetTags() 访问，以与 GE 的 AssetTags 命名统一。'
            },
            hud: [
              { key: 'id_tag', label: '技能身份证 (UE5.5)', value: 'AssetTags', status: 'good' },
              { key: 'active_ctl', label: '主动打断 / 封锁', value: 'Cancel / BlockAbilities', status: 'good' },
              { key: 'self_req', label: '激活前置门槛', value: 'Required / BlockedTags', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'ga', col: 0, row: 0, color: 'blue', icon: 'ga', label: 'UGameplayAbility', sublabel: '6 Tag Containers', state: 'active', size: 'lg' },
                { id: 'cancel', col: -2, row: -1, color: 'red', icon: 'sword', label: 'CancelAbilities', sublabel: '激活即强断同行', size: 'sm' },
                { id: 'block', col: 2, row: -1, color: 'amber', icon: 'shield', label: 'BlockAbilities', sublabel: '运行期禁止同行', size: 'sm' },
                { id: 'req', col: -1.8, row: 1.3, color: 'green', icon: 'tag', label: 'ActivationRequired', sublabel: '必须持有才可放', size: 'sm' },
                { id: 'blk', col: 1.8, row: 1.3, color: 'violet', icon: 'tag', label: 'ActivationBlocked', sublabel: '持有则禁止施放', size: 'sm' }
              ],
              edges: [
                { id: 'tg1', from: 'ga', to: 'cancel', packet: 'input' },
                { id: 'tg2', from: 'ga', to: 'block', packet: 'ge' },
                { id: 'tg3', from: 'req', to: 'ga', packet: 'rep' },
                { id: 'tg4', from: 'blk', to: 'ga', packet: 'predict' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: 'ActivationOwned复制',
            phase: 'PITFALL',
            title: '校准旧误区：ActivationOwnedTags 的复制开关与旁观动画排错',
            paragraphs: [
              '早期 UE4 教程常断言“`GA` 的 `ActivationOwnedTags` 绝不会同步给 `SimulatedProxy`”。**在 UE 5.3–5.5 中必须校准这一说法**：引擎提供全局开关 **`ReplicateActivationOwnedTags`**（`UAbilitySystemGlobals::ShouldReplicateActivationOwnedTags()`，现代引擎默认开启；可在项目 ini 中显式配置，具体以所用版本的 `AbilitySystemGlobals` / `GameplayAbilitiesDeveloperSettings` 源码为准）。开启时，技能激活后服务端除了本地 `AddLooseGameplayTags`，还会把这些标签写入复制容器：`LocalPredicted` / `ServerInitiated` 技能走 **`MinimalReplicationTags`**，其余走 **`ReplicatedLooseTags`**——旁观客户端因此能看到这些标签（存在一次网络往返延迟，旁观端不做预测）。',
              '那为什么实战中仍常遇到“本机举盾正常，旁观玩家看不到举盾动画”？请按三步排查：\n1. 检查项目配置是否沿用老工程关掉了 `ReplicateActivationOwnedTags=False`（或在代码里手调了非复制的 `AddLooseGameplayTag`）；\n2. 检查网络角色与 **AnimBP 读取的 ASC 指针**（当 ASC 在 `PlayerState` 上时，`SimulatedProxy` 的 `AnimBP` 若在 `OnRep_PlayerState` 到达前初始化并缓存了空指针，就永远读不到标签！）；\n3. 若该状态还需附带常驻 `GameplayCue`、叠层或抑制规则，通过持续型 `GameplayEffect`（配 `UTargetTagsGameplayEffectComponent`）授予标签依然是非常稳健的工程方案。'
            ],
            callout: {
              kind: 'ue5',
              label: '架构选型建议',
              text: '纯技能期间的状态（举盾、蓄力）可直接依赖 ReplicateActivationOwnedTags 同步；需要绑定持续特效 Cue、叠层、抑制规则或跨技能留存的战斗状态，优先采用持续型 GameplayEffect 授予。'
            },
            hud: [
              { key: 'cfg_on', label: 'ReplicateActivationOwnedTags', value: '开启时同步给旁观端', status: 'good' },
              { key: 'debug_chk', label: '旁观失灵三必查', value: '配置开关 / LooseTag / AnimBP空ASC', status: 'warn' }
            ],
            scene: {
              nodes: [
                { id: 'ga', col: -1.8, row: -0.4, color: 'blue', icon: 'ga', label: 'GA_Block', sublabel: 'ActivationOwned: State.Block' },
                { id: 'cfg', col: 0.2, row: -1.1, color: 'violet', icon: 'asc', label: 'AbilitySystemGlobals', sublabel: 'ReplicateActivationOwnedTags', state: 'active', size: 'sm' },
                { id: 'sim', col: 1.7, row: 0.8, color: 'green', icon: 'users', label: 'SimulatedProxy 旁观端', sublabel: '需确保 AnimBP 晚绑定有效 ASC', badge: { text: '开启复制或用持续 GE ✅', tone: 'good' } }
              ],
              edges: [
                { id: 'ao1', from: 'ga', to: 'cfg', packet: 'predict', label: '检查全局复制配置' },
                { id: 'ao2', from: 'cfg', to: 'sim', packet: 'rep', label: 'MinimalReplicationTags / 持续 GE 同步', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: '解控设计',
            phase: 'SOLUTION',
            title: '优雅破局：眩晕封锁一切，唯独“净化”可释放',
            paragraphs: [
              '如何设计“被眩晕时除了净化术以外什么都不能放”？千万不要让眩晕 GE 去枚举封锁所有技能名，而应采用**双向约定**：\n1. 在所有普通技能公有基类 `UGA_Base` 的 `ActivationBlockedTags` 中填入 `State.CrowdControl.Stun`；\n2. 在 `GA_Cleanse`（净化技能）子类中，从 `ActivationBlockedTags` 移除 `Stun`，反而把 `State.CrowdControl` 填进 `ActivationRequiredTags`（只有被控时才能按）！',
              '激活净化瞬间，通过一个附带 `URemoveOtherGameplayEffectComponent` 的瞬间 GE，一键驱散目标身上所有带 `State.CrowdControl` 的负面效果！'
            ],
            changes: [
              { op: 'add', text: 'UGA_Base 默认配置 ActivationBlockedTags = State.CrowdControl.Stun' },
              { op: 'add', text: 'GA_Cleanse 豁免封锁，并用 GE 驱散全部 CrowdControl 效果' }
            ],
            hud: [
              { key: 'normal_ga', label: '普通技能激活', value: '被 Stun 自动拦截', status: 'warn' },
              { key: 'cleanse_ga', label: 'GA_Cleanse 激活', value: '放行并驱散控制!', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'asc', col: -1.6, row: 0, color: 'violet', icon: 'asc', label: '受控角色 ASC', sublabel: '持有 State.CrowdControl.Stun' },
                { id: 'atk', col: 1.4, row: -1.1, color: 'slate', icon: 'sword', label: 'GA_NormalAttack', sublabel: 'Blocked by Stun', state: 'crashed', size: 'sm' },
                {
                  id: 'cleanse',
                  col: 1.5,
                  row: 0.9,
                  color: 'green',
                  icon: 'cue',
                  label: 'GA_Cleanse (净化)',
                  sublabel: 'Required: CrowdControl',
                  state: 'active',
                  badge: { text: '成功激活并驱散 Stun!', tone: 'good' }
                }
              ],
              edges: [
                { id: 'cl1', from: 'asc', to: 'atk', packet: 'error', label: 'ActivationBlocked 拦截' },
                { id: 'cl2', from: 'asc', to: 'cleanse', packet: 'rep', label: '满足 Required → 驱散!', labelTone: 'green' }
              ]
            }
          }
        ]
      }
    ]
  }
];
