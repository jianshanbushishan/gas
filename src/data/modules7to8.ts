import { ModuleData } from '../types/course';

export const MODULES_7_TO_8: ModuleData[] = [
  {
    id: 'mod-cues',
    indexLabel: '07. 表现层解耦 (Cues)',
    title: '07. 表现层解耦 (Cues)',
    titleEn: '07. Gameplay Cues',
    folderColor: 'rose',
    lessons: [
      {
        slug: 'gameplay-cues',
        title: 'GameplayCue 架构、双载体选型与对象池陷阱',
        titleEn: 'GameplayCue Static vs Actor, WhileActive & Pooling',
        summary: '彻底剥离战斗代码与粒子音效硬引用，避开 OnActive 视野盲区与 Actor 对象池脏状态残留坑。',
        durationMin: 11,
        difficulty: '入门',
        goals: [
          { id: 'g1', text: '遵守所有 Cue 标签必须以 GameplayCue. 根前缀开头的引擎硬约束', unlockAtStep: 1 },
          { id: 'g2', text: '正确选型 UGameplayCueNotify_Static (Burst) 与 AGameplayCueNotify_Actor (Looping)', unlockAtStep: 2 },
          { id: 'g3', text: '分清 OnActive 与 WhileActive 在玩家刚进入视野 (NetRelevancy) 时的关键差异', unlockAtStep: 3 },
          { id: 'g4', text: '规避 AGameplayCueNotify_Actor 对象池复用导致的特效残留或不显示 Bug', unlockAtStep: 4 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '解耦表现层',
            phase: 'ARCHITECTURE',
            title: '为什么 C++ 技能代码里绝不该直接引用 Niagara 粒子资产？',
            paragraphs: [
              '如果在服务端也会加载的 `UGameplayAbility` 或 `UGameplayEffect` 里直接硬引用几十兆的 Niagara 粒子、4K 贴图与 Wwise 音效，不仅连无头服务器 (`Dedicated Server`) 内存都会被特效塞满，美术改个粒子路径还得找程序改代码。',
              'GAS 的解法是 **`GameplayCue`**：战斗逻辑只发出一个纯文本标签（**强制规定必须以 `GameplayCue.` 开头**，如 `GameplayCue.Fireball.Impact`），客户端的 `UGameplayCueManager` 捕获该标签后异步/按需匹配对应的表现蓝图播放特效，**Dedicated Server 自动跳过一切视听渲染**！'
            ],
            hud: [
              { key: 'prefix', label: '强制标签前缀', value: 'GameplayCue.*', status: 'good' },
              { key: 'ds_mem', label: 'Dedicated Server 视听开销', value: '0 MB (纯逻辑跳过)', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'ge', col: -1.8, row: 0, color: 'amber', icon: 'ge', label: 'GE / ASC 战斗逻辑', sublabel: '仅发送 Tag + Parameters' },
                { id: 'mgr', col: 0.2, row: -0.6, color: 'rose', icon: 'cue', label: 'GameplayCueManager', sublabel: '仅在客户端响应分派', state: 'active' },
                { id: 'vfx', col: 2, row: 0.4, color: 'violet', icon: 'client', label: 'Niagara + Sound + 震屏', badge: { text: '零硬引用解耦 ✅', tone: 'good' } }
              ],
              edges: [
                { id: 'gc1', from: 'ge', to: 'mgr', packet: 'cue', label: 'GameplayCue.Slash.Hit' },
                { id: 'gc2', from: 'mgr', to: 'vfx', packet: 'rep' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: 'Static vs Actor',
            phase: 'TECHNIQUE',
            title: '两类 Cue 载体：瞬发选 Static/Burst，持续选 Actor/Looping',
            paragraphs: [
              '引擎 `GameplayAbilities` 插件提供两套核心基类体系（且已在引擎插件内直接内置了现代封装子类 `UGameplayCueNotify_Burst`、`AGameplayCueNotify_BurstLatent` 与 `AGameplayCueNotify_Looping`）：\n1. **`UGameplayCueNotify_Static`（或 `UGameplayCueNotify_Burst`）**：不生成任何 Actor，直接在 CDO 上执行函数！开销极低，专用于**一瞬间播完即止 (`OnExecute`)** 的受击火花、枪口火焰、挥刀音效。',
              '2. **`AGameplayCueNotify_Actor`（或 `AGameplayCueNotify_Looping`）**：在世界里生成真实 Actor 并挂接在目标身上，专用于**需要跟随状态存续 (`WhileActive` → `OnRemove`)** 的火焰缠身、护盾球体、冰冻材质切换。'
            ],
            callout: {
              kind: 'ue5',
              label: '动画时间轴直出：UAnimNotify_GameplayCue',
              text: 'UE 5.8 内置了 UAnimNotify_GameplayCue（面板名 GameplayCue (Burst)）与 UAnimNotify_GameplayCueState（GameplayCue (Looping)），美术可直接拖进动画蒙太奇时间轴触发瞬发或持续型 Cue，并支持编辑器内实时预览！'
            },
            hud: [
              { key: 'burst', label: '瞬发特效 (受击/爆炸)', value: 'GCN_Static / Burst (零Spawn)', status: 'good' },
              { key: 'loop', label: '持续状态 (灼烧/护盾)', value: 'GCN_Actor / Looping', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'st', col: -1.5, row: -0.6, color: 'green', icon: 'cue', label: 'GCN_Static (Burst)', sublabel: 'CDO 无状态 · 零 Spawn 开销', state: 'active' },
                { id: 'ac', col: 1.5, row: 0.6, color: 'rose', icon: 'cue', label: 'GCN_Actor (Looping)', sublabel: '真实 Actor · 随 Buff 启停' }
              ],
              edges: [
                { id: 'sa1', from: 'st', to: 'ac', style: 'dashed', packet: 'none', label: '按是否有持续状态选型' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: 'WhileActive 铁律',
            phase: 'PITFALL',
            title: '经典视野 Bug：为什么远方跑过来的玩家看不到 Boss 着火？',
            paragraphs: [
              '在 `AGameplayCueNotify_Actor` 中有 `OnActive` 和 `WhileActive` 两个高度相似的事件。很多新手把“开启火焰粒子”连在 `OnActive` 上，结果遇到诡异客诉：Boss 在房间里被点燃时，**当时站在门外（超出网络相关性距离 `NetCullDistance`）的队友跑进房间后，看到 Boss 在持续掉血，身上却一丁点火焰都没有**！',
              '真相在于（**前提：该常驻 Cue 是通过仍然有效的持续型 GE 或 `AddGameplayCue` 状态复制同步到客户端的，而非瞬发 `ExecuteGameplayCue`**）：\n• **`OnActive`**：只在 Buff **刚挂上那一刻**对在场客户端触发（适合播“轰”的一声起火冲击声）；\n• **`WhileActive`**：只要客户端收到了仍然有效的活跃 Cue 状态——无论是刚挂上，还是**中途进入网络相关范围、乃至断线重连回来**都会触发！**一切持续循环粒子与材质变色必须写在 `WhileActive` 中**！'
            ],
            callout: {
              kind: 'warn',
              label: '面试与实战高频必考点',
              text: 'OnActive = 入场瞬间单次冲击表现（起火音效）；WhileActive = 状态存续期间常驻表现（持续燃烧火焰，保证晚进入视野者可见）；OnRemove = 退场清理与熄灭烟雾！'
            },
            hud: [
              { key: 'on_act', label: 'OnActive', value: '晚进视野者不会补触发!', status: 'warn' },
              { key: 'wh_act', label: 'WhileActive', value: '中途进视野/重连均补触发 ✅', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'boss', col: -1.6, row: 0, color: 'amber', icon: 'pawn', label: '已着火 10 秒的 Boss', sublabel: 'Replicated Burning Cue' },
                {
                  id: 'late',
                  col: 1.6,
                  row: 0,
                  color: 'green',
                  icon: 'client',
                  label: '刚跑进视野的队友',
                  sublabel: '进入 NetCullDistance',
                  state: 'active',
                  badge: { text: '自动调用 WhileActive 点火 ✅', tone: 'good' }
                }
              ],
              edges: [
                { id: 'wa1', from: 'boss', to: 'late', packet: 'cue', label: '属性同步触发 WhileActive', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: '对象池脏数据',
            phase: 'PITFALL',
            title: '对象池陷阱：AGameplayCueNotify_Actor 第二次触发怎么坏了？',
            paragraphs: [
              '为了避免团战频繁 `SpawnActor` / `Destroy` 卡顿，`GameplayCueManager` 会把用完的 `AGameplayCueNotify_Actor` **回收到内存对象池复用**（默认开启池化）。',
              '如果你在第一次播放时修改了内部变量、`SetRelativeScale3D` 或隐藏了某个网格组件，却没有在 `OnRemove` 或重写的 `Recycle()` 中还原初始值，下一次这个实例从池子里分配给另一个人时就会带着上次的脏状态！强烈推荐使用**引擎 `GameplayAbilities` 插件自带的 `AGameplayCueNotify_Looping` 基类**（内部规范管理 Niagara/Audio 的生成与回收复位）；排查时也可临时通过控制台变量 `AbilitySystem.GameplayCueActorRecycle 0` 关闭池化，若问题消失即可确认是复用脏状态。'
            ],
            hud: [
              { key: 'pool', label: 'GCN_Actor 默认行为', value: '对象池循环复用 (Recycle)', status: 'good' },
              { key: 'rule', label: '状态还原要求', value: 'OnRemove 必须彻底复位组件', status: 'warn' }
            ],
            scene: {
              nodes: [
                { id: 'pool', col: -1.6, row: 0, shape: 'cylinder', color: 'rose', icon: 'cue', label: 'Cue Actor 对象池', sublabel: 'Preallocated Instances' },
                { id: 'clean', col: 1.5, row: 0, color: 'green', icon: 'shield', label: 'OnRemove / Recycle', sublabel: '重置 Transform / 变量 / 粒子', state: 'active' }
              ],
              edges: [
                { id: 'pl1', from: 'pool', to: 'clean', packet: 'rep', bidirectional: true, label: '借出与归还复位' }
              ]
            }
          }
        ]
      },
      {
        slug: 'cue-networking',
        title: 'Cue 不可靠多播限制与自定义暴击 Context',
        titleEn: 'Unreliable Multicast Limits & Custom FGameplayEffectContext',
        summary: '认识 ExecuteGameplayCue 不可靠丢包特性，扩展自定义 EffectContext 位序列化向客户端传递暴击字。',
        durationMin: 12,
        difficulty: '高阶',
        goals: [
          { id: 'g1', text: '牢记瞬发 ExecuteGameplayCue 底层为 NetMulticast Unreliable，绝不放游戏逻辑', unlockAtStep: 1 },
          { id: 'g2', text: '避免单帧 AOE 循环触发数十次独立 Cue RPC 触发引擎截断', unlockAtStep: 2 },
          { id: 'g3', text: '派生自定义 FGameplayEffectContext 并重写 NetSerialize 传递暴击/元素标志', unlockAtStep: 3 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '不可靠多播',
            phase: 'PITFALL',
            title: '绝不在 Cue 里写逻辑：ExecuteGameplayCue 允许丢包！',
            paragraphs: [
              '瞬发调用 `ASC->ExecuteGameplayCue(...)` 在网络底层是 **`NetMulticast(Unreliable)`**（不可靠多播 RPC）！当玩家 Wi-Fi 波动或同屏包量突增时，UE 网络驱动会**优先直接丢弃 Unreliable 包**以保住核心移动与血量同步。',
              '因此：**千万不要在 GameplayCue 蓝图里写加血、开门、刷怪或解锁成就逻辑**——特效漏播一朵火花无伤大雅，逻辑丢包则会直接卡死关卡！'
            ],
            hud: [
              { key: 'burst_net', label: 'ExecuteGameplayCue 底层', value: 'NetMulticast (Unreliable)', status: 'warn' },
              { key: 'logic_in_cue', label: '在 Cue 内写权威逻辑', value: '绝对禁止 ❌', status: 'bad' }
            ],
            scene: {
              nodes: [
                { id: 'srv', col: -1.7, row: 0, color: 'blue', icon: 'server', label: 'Server ExecuteCue' },
                { id: 'ok', col: 1.5, row: -0.9, color: 'green', icon: 'client', label: '网络良好客户端', sublabel: '播放火花特效', size: 'sm' },
                { id: 'drop', col: 1.5, row: 1, color: 'amber', icon: 'client', label: 'Wi-Fi 抖动客户端', badge: { text: '丢包跳过火花 · 不影响血量', tone: 'good' }, size: 'sm' }
              ],
              edges: [
                { id: 'u1', from: 'srv', to: 'ok', packet: 'cue' },
                { id: 'u2', from: 'srv', to: 'drop', style: 'dashed', packet: 'error', label: 'Unreliable 允许丢弃' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: 'AOE 洪泛优化',
            phase: 'TECHNIQUE',
            title: '团战优化：手雷炸中 20 个小兵，别连发 20 个爆炸 RPC！',
            paragraphs: [
              '一颗手雷炸中 20 只扎堆小兵：如果把大爆炸声光绑在每只小兵挨打的 GE 上，服务器一帧内会瞬间迸发 **20 条多播 Cue RPC**，不仅震聋玩家耳朵（音量叠加 20 倍），还会撞上引擎单次更新不可靠 RPC 限流导致后续特效静默！',
              '正确做法：**把“手雷中心大爆炸”拆出来作为 1 次独立坐标 Cue 在爆心播放**，小兵身上的受击 GE 不挂重型爆炸 Cue（或仅用客户端材质受击反应）！注意避坑：单靠套一层 `FScopedGameplayCueSendContext` **只会把待发项延迟到退出作用域时调用 `FlushPendingCues()`**，引擎默认实现仍会逐条派发——除非你自定义子类化 `UGameplayCueManager` 重写 `FlushPendingCues()` 编写自定义打包 RPC，否则它并不会自动合并不同目标上的 Cue！'
            ],
            hud: [
              { key: 'naive', label: '逐怪独立发大爆炸', value: '20 条多播 RPC (爆音+限流)', status: 'bad' },
              { key: 'opt', label: '爆心单次 Cue 拆离', value: '1 条爆心 RPC (SendContext仅延迟)', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'nade', col: -1.6, row: 0, color: 'amber', icon: 'ge', label: 'AOE 手雷引爆', sublabel: '命中 20 个单位' },
                { id: 'one', col: 1.5, row: 0, color: 'green', icon: 'cue', label: '单次爆心 Cue (Location)', sublabel: '1x 爆炸粒子 + 音效', state: 'active', badge: { text: 'RPC 削减 95% ✅', tone: 'good' } }
              ],
              edges: [
                { id: 'ao1', from: 'nade', to: 'one', packet: 'cue', label: '传入爆心坐标 Parameters', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: '自定义 Context',
            phase: 'SOLUTION',
            title: '高阶必学：派生 FGameplayEffectContext 传递暴击与克制飘字',
            paragraphs: [
              '服务端 `ExecCalc` 掷骰子算出了“本次攻击触发 **暴击 (`bIsCriticalHit = true`)** 且 **火属性克制**”，怎么把这个结果顺着伤害 GE 一路带到客户端的受击 `GameplayCue` 里弹出金色暴击大字？',
              '标准工程方案（参考 Lyra / Aura）：\n1. 继承 `FGameplayEffectContext` 定义 `FMyGameplayEffectContext`，添加 `bool bIsCriticalHit`；\n2. 重写 `GetScriptStruct()`、`Duplicate()` 以及 **`NetSerialize(FArchive& Ar, ...)`**（把布尔压进 `RepBits` 位掩码里仅占 1 bit 带宽！）；\n3. 继承 `UAbilitySystemGlobals` 重写 `AllocGameplayEffectContext()`，并在 **Project Settings → Game → Gameplay Abilities Settings**（`UGameplayAbilitiesDeveloperSettings::AbilitySystemGlobalsClassName`）注册——从此全游戏的 `ExecCalc`、`PostGameplayEffectExecute` 与 `GameplayCueParameters` 都能随时强转取出暴击信息！'
            ],
            callout: {
              kind: 'ue5',
              label: 'UE 5.8 Iris 网络复制兼容性提示',
              text: '在 UE 5.8 中开启 Iris 复制系统时，FGameplayEffectContextHandle 通过内置的 FGameplayEffectContextHandleNetSerializer（基于 TPolymorphicStructNetSerializerImpl 多态类型缓存）处理子类序列化；确保自定义子类保持 USTRUCT() 反射完整并正确特化 WithNetSerializer，必要时可按 Iris 规范配套自定义 NetSerializer。'
            },
            codeSnippet: {
              title: '自定义 FMyGameplayEffectContext 关键重写三件套',
              code: `USTRUCT()\nstruct FMyGameplayEffectContext : public FGameplayEffectContext {\n  GENERATED_BODY()\n  bool bIsCriticalHit = false;\n  virtual UScriptStruct* GetScriptStruct() const override { return StaticStruct(); }\n  virtual FMyGameplayEffectContext* Duplicate() const override { ... }\n  virtual bool NetSerialize(FArchive& Ar, UPackageMap* Map, bool& bOutSuccess) override;\n}; // 别忘了特化 TStructOpsTypeTraits 开启 WithNetSerializer = true!`
            },
            hud: [
              { key: 'bw_cost', label: '暴击标志额外带宽', value: '仅 1 Bit (位掩码序列化)', status: 'good' },
              { key: 'traits', label: '反射序列化必配宏', value: 'TStructOpsTypeTraits (WithNetSerializer)', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'exec', col: -2, row: 0, color: 'violet', icon: 'server', label: 'Server ExecCalc', sublabel: 'SetIsCriticalHit(true)' },
                { id: 'ctx', col: 0, row: 0, color: 'amber', icon: 'code', label: 'FMyEffectContext', sublabel: 'NetSerialize (1-bit)', state: 'active' },
                { id: 'dmgnum', col: 2, row: 0, color: 'rose', icon: 'cue', label: 'Client 受击飘字 Cue', badge: { text: '💥 暴击! 1,280', tone: 'good' } }
              ],
              edges: [
                { id: 'cx1', from: 'exec', to: 'ctx', packet: 'ge' },
                { id: 'cx2', from: 'ctx', to: 'dmgnum', packet: 'cue', label: '随 CueParameters 跨网抵达', labelTone: 'green' }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mod-systems',
    indexLabel: '08. 完整实战系统',
    title: '08. 完整实战系统',
    titleEn: '08. Whole Systems (Lyra Style)',
    folderColor: 'olive',
    lessons: [
      {
        slug: 'design-melee-combo',
        title: '实战架构 I：设计一套联机三段近战连招系统',
        titleEn: 'System Design: Networked 3-Hit Melee Combo Pipeline',
        summary: '将输入预测、蒙太奇连招窗口、刀刃判定、ExecCalc 暴击与顿帧特效串联为工业级闭环。',
        durationMin: 15,
        difficulty: '高阶',
        goals: [
          { id: 'g1', text: '用蒙太奇 Section + AnimNotifyWindow 控制连招预输入窗口', unlockAtStep: 2 },
          { id: 'g2', text: '处理近战武器碰撞盒检测与单次挥砍去重列表 (HitActors)', unlockAtStep: 3 },
          { id: 'g3', text: '串联 ExecCalc → IncomingDamage → 受击硬直 GA → 刀光顿帧 Cue 完整链路', unlockAtStep: 4 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '需求指标',
            phase: 'ARCHITECTURE',
            title: '从一行策划案到工程指标：丝滑的联机三段斩',
            paragraphs: [
              '我们要实现一套媲美主机动作手感的联网三段轻击连招：\n• 玩家在 100ms 延迟下按下普攻 **0ms 立即挥出第一刀** (`LocalPredicted`)；\n• 在收刀连招窗口期内再次按键，平滑衔接 `Combo2` → `Combo3`；若不按则自然收刀进入短冷却；\n• 每一刀横扫支持同时命中多个敌人（同一刀内不重复结算同一人），支持暴击、护盾抵扣与受击硬直！'
            ],
            hud: [
              { key: 'feel', label: '起手响应延迟', value: '0 ms (LocalPredicted)', status: 'good' },
              { key: 'combo', label: '连段架构', value: '单 GA + Montage Sections', status: 'good' },
              { key: 'auth', label: '伤害裁判权', value: '100% Server 权威结算', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'in', col: -2, row: 0, color: 'blue', icon: 'client', label: 'EnhancedInput 连点', size: 'sm' },
                { id: 'ga', col: 0, row: 0, color: 'green', icon: 'sword', label: 'GA_MeleeCombo', sublabel: 'Combo 1 → 2 → 3', state: 'active', size: 'lg' },
                { id: 'tgt', col: 2, row: 0, color: 'amber', icon: 'users', label: '扇形多目标受击', size: 'sm' }
              ],
              edges: [
                { id: 'mc1', from: 'in', to: 'ga', packet: 'predict', label: '本地预测激活' },
                { id: 'mc2', from: 'ga', to: 'tgt', packet: 'ge', label: '去重结算' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '连招窗口推进',
            phase: 'TECHNIQUE',
            title: '连招推进器：GA::MontageSetNextSectionName 零闪断切段',
            paragraphs: [
              '无需拆成三个互相打断的碎技能，使用单个 `InstancedPerActor` 的 `GA_MeleeCombo` 配合一条含 `Slash1`、`Slash2`、`Slash3` 三个 Section 的动画蒙太奇最稳健：\n1. 美术在每段挥砍后半程放置 `AnimNotifyState_ComboWindow`，窗口期内通过带同步预测点的任务（如 `WaitInputPress`）捕获二次按键；\n2. 捕获输入后，在技能内调用 **`UGameplayAbility::MontageSetNextSectionName("Slash1", "Slash2")`**（底层转发至 **ASC 的 `CurrentMontageSetNextSectionName`** 并更新复制蒙太奇信息）——当前段播完瞬间丝滑滑入第二刀，双端与旁观端严格对齐！'
            ],
            hud: [
              { key: 'api', label: 'GA / ASC 跳段方法', value: 'GA::MontageSetNext / ASC::CurrentMontage...', status: 'good' },
              { key: 'reset', label: 'EndAbility 收尾', value: '重置 ComboIndex = 0', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 's1', col: -2, row: 0, color: 'blue', icon: 'task', label: 'Section: Slash1', sublabel: '0.0s ~ 0.6s' },
                { id: 'win', col: 0, row: -0.6, color: 'violet', icon: 'tag', label: 'ComboWindow 开启', sublabel: '捕获预输入按键!', state: 'active' },
                { id: 's2', col: 2, row: 0, color: 'green', icon: 'sword', label: 'Section: Slash2', badge: { text: '无缝连段衔接 ✅', tone: 'good' } }
              ],
              edges: [
                { id: 'cw1', from: 's1', to: 'win', packet: 'predict' },
                { id: 'cw2', from: 'win', to: 's2', packet: 'rep', label: 'SetNextSectionName', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: '扫掠去重与DS骨骼',
            phase: 'TECHNIQUE',
            title: '刀刃扫掠判定：单刀 TSet 去重与 Dedicated Server 骨骼刷新铁律',
            paragraphs: [
              '若采用服务端权威 `AnimNotifyState_WeaponTrace` 读取武器刀根与刀尖插槽做球体扫掠 (`SphereTraceMulti`)，必须维护 `TSet<TWeakObjectPtr<AActor>> HitActorsThisSwing` 并在**每进入新的一刀 Section 时清空集合**，保证每一刀对同一目标精确只结算 1 次！',
              '**Dedicated Server 必查大坑**：无头服务器没有屏幕渲染，骨骼网格体默认的 `VisibilityBasedAnimTickOption` 常处于不刷新骨骼矩阵模式——此时即便 Notify 触发了，服务端读到的武器插槽坐标也会冻结在原地导致挥刀全空！采用服务端插槽扫掠时，必须确认开启 **`AlwaysTickPoseAndRefreshBones`**（或至少在播放蒙太奇期间刷新骨骼矩阵）！'
            ],
            callout: {
              kind: 'warn',
              label: 'Listen Server 正常、一上 Dedicated Server 全砍空的真凶',
              text: 'Dedicated Server 默认优化会跳过不可见角色的骨骼变换更新（仅推进动画时间触发 Notify）。凡依赖服务端读取手部/武器 Socket 坐标做碰撞检测的项目，必查 USkeletalMeshComponent::VisibilityBasedAnimTickOption！'
            },
            hud: [
              { key: 'ds_bone', label: 'DS 骨骼插槽刷新必配', value: 'AlwaysTickPoseAndRefreshBones', status: 'warn' },
              { key: 'dedup', label: '防多帧重复扣血', value: '每段清空 HitActors 集合', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'blade', col: -1.7, row: 0, color: 'amber', icon: 'sword', label: '刀刃插槽扫掠', sublabel: 'StartSocket → TipSocket' },
                { id: 'set', col: 0.2, row: 0, shape: 'cylinder', color: 'teal', icon: 'code', label: 'HitActorsThisSwing', sublabel: 'TSet 去重过滤器', state: 'active' },
                { id: 'enemy', col: 2, row: 0, color: 'blue', icon: 'pawn', label: '受击敌人', badge: { text: '每刀精确命中 1 次', tone: 'good' } }
              ],
              edges: [
                { id: 'sw1', from: 'blade', to: 'set', packet: 'input', packetRate: 'fast' },
                { id: 'sw2', from: 'set', to: 'enemy', packet: 'ge', label: '首次命中放行' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: '完整战斗交响曲',
            phase: 'RECAP',
            title: '终局串联：从刀锋入肉到暴击飘字与受击硬直',
            paragraphs: [
              '看看全套 GAS 模块在这一瞬间如何像瑞士钟表般咬合运转：\n1. 命中确认后构建 `GE_MeleeDamage`（通过 `SetByCaller` 注入第 3 段重击 `1.6x` 倍率）；\n2. 服务端 `ExecCalc` 算护甲与暴击，写入自定义 `EffectContext` 并输出 `IncomingDamage`；\n3. 受击者 `AttributeSet::PostGameplayEffectExecute` 扣盾扣血，向受击者发送 `Event.HitReact` 激活受击仰头技能，同时触发 `GameplayCue.Melee.Hit` 在客户端绽放刀光火花、顿帧与暴击数字！'
            ],
            hud: [
              { key: 'scale', label: '第 3 段倍率', value: 'SetByCaller 1.6x', status: 'good' },
              { key: 'calc', label: '权威结算', value: 'ExecCalc + MetaAttr', status: 'good' },
              { key: 'fx', label: '视听反馈', value: 'HitReact GA + Burst Cue', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'ga', col: -2.2, row: 0, color: 'blue', icon: 'sword', label: 'GA_MeleeCombo', size: 'sm' },
                { id: 'exec', col: -0.6, row: -0.7, color: 'violet', icon: 'server', label: 'ExecCalc_Damage', size: 'sm' },
                { id: 'attr', col: 0.9, row: -0.2, shape: 'cylinder', color: 'green', icon: 'attr', label: 'PostGEExecute', state: 'active' },
                { id: 'react', col: 2.2, row: -1.1, color: 'amber', icon: 'pawn', label: 'GA_HitReact', size: 'sm' },
                { id: 'cue', col: 2.2, row: 1.1, color: 'rose', icon: 'cue', label: 'GCN_SlashImpact', size: 'sm' }
              ],
              edges: [
                { id: 'fn1', from: 'ga', to: 'exec', packet: 'ge' },
                { id: 'fn2', from: 'exec', to: 'attr', packet: 'ge' },
                { id: 'fn3', from: 'attr', to: 'react', packet: 'input' },
                { id: 'fn4', from: 'attr', to: 'cue', packet: 'cue' }
              ]
            }
          }
        ]
      },
      {
        slug: 'design-lyra-abilityset',
        title: '实战架构 II：Lyra 模块化装备与 AbilitySet',
        titleEn: 'System Design: Lyra Modular AbilitySet & GrantedHandles',
        summary: '借鉴 Epic 旗舰示例 Lyra 的 ULyraAbilitySet 模式，实现拾取/丢弃武器时技能、Buff 与属性集的一键装卸。',
        durationMin: 13,
        difficulty: '高阶',
        goals: [
          { id: 'g1', text: '理解为什么不应把全部武器和职业技能硬编码在角色基类上', unlockAtStep: 1 },
          { id: 'g2', text: '设计打包 GA + GE + AttributeSet 的 UMyAbilitySet 数据资产', unlockAtStep: 2 },
          { id: 'g3', text: '利用 GrantedHandles 凭证袋实现切枪/下车时零泄漏一键卸载', unlockAtStep: 3 },
          { id: 'g4', text: '融会贯通整套 UE 5.8 GAS 生产级架构规范', unlockAtStep: 4 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '换装卸载之痛',
            phase: 'PROBLEM',
            title: '捡起喷火器、丢掉步枪：怎么保证不留半点垃圾状态？',
            paragraphs: [
              '在英雄射击、搜打撤或暗黑类装备系统中：玩家捡起一把“传奇火焰喷射器”时，需要同时获得 **开火技能 (`GA_Flamethrower`)、过热换弹技能 (`GA_VentHeat`)、燃料热量属性集 (`UHeatAttributeSet`) 以及常驻移速减缓 (`GE_HeavyWeaponSlow`)**。',
              '当玩家 10 秒后把喷火器扔在地上换成匕首时，如果漏卸了 `GE_HeavyWeaponSlow` 或漏删了技能句柄，角色就会背着幽灵减速跑完下半场！'
            ],
            hud: [
              { key: 'grant_items', label: '单件装备涉及项', value: '2 GA + 1 GE + 1 AttrSet', status: 'warn' },
              { key: 'manual_clean', label: '手写逐个卸载', value: '极易遗漏句柄泄漏!', status: 'bad' }
            ],
            scene: {
              nodes: [
                { id: 'wpn', col: -1.7, row: 0, color: 'amber', icon: 'sword', label: '丢弃旧武器', sublabel: '散装卸载逻辑' },
                { id: 'leak', col: 1.5, row: 0, color: 'red', icon: 'asc', label: 'ASC 残留垃圾句柄', sublabel: '幽灵减速 GE 未清理!', badge: { text: '状态泄漏 Bug ❌', tone: 'bad' } }
              ],
              edges: [
                { id: 'lk1', from: 'wpn', to: 'leak', packet: 'error', label: '漏删 ActiveGEHandle' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: 'AbilitySet 资产',
            phase: 'ARCHITECTURE',
            title: 'Lyra 核心模式：UPrimaryDataAsset 技能包 (AbilitySet)',
            paragraphs: [
              'Epic 在 **Lyra Starter Game** 中给出了教科书级答案：创建一个继承自 `UPrimaryDataAsset` 的 **`UMyAbilitySet`** 类，内部包含三个配置数组：\n1. `GrantedGameplayAbilities`（技能类 + 等级 + **InputTag**）；\n2. `GrantedGameplayEffects`（被动/常驻 GE 类 + 等级）；\n3. `GrantedAttributes`（需要动态挂载的 `UAttributeSet` 类）。',
              '无论是英雄出生基础包、一把散弹枪、一件暗金胸甲，还是坐进一辆坦克，策划只需在编辑器里拼装一个 `DA_AbilitySet_Tank` 数据资产！'
            ],
            changes: [
              { op: 'add', text: '定义 UMyAbilitySet 数据资产统一聚合 GA + GE + AttributeSet' },
              { op: 'add', text: '将按键 InputTag 直接配在资产条目内自动注入 Spec' }
            ],
            hud: [
              { key: 'asset', label: '数据载体', value: 'UPrimaryDataAsset', status: 'good' },
              { key: 'mod', label: '适用范围', value: '职业 / 武器 / 装备 / 载具', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'da', col: -1.8, row: 0, color: 'green', icon: 'code', label: 'DA_AbilitySet_Shotgun', sublabel: '模块化数据资产包', state: 'active' },
                { id: 'ga', col: 1.4, row: -1.4, color: 'blue', icon: 'ga', label: 'GA_Fire + GA_Reload', sublabel: '含 InputTag 映射', size: 'sm' },
                { id: 'ge', col: 1.9, row: 0.1, color: 'amber', icon: 'ge', label: 'GE_ShotgunPassive', sublabel: '近距破甲光环', size: 'sm' },
                { id: 'at', col: 1.3, row: 1.6, shape: 'cylinder', color: 'teal', icon: 'attr', label: 'UAmmoAttributeSet', sublabel: '弹药与散射度属性', size: 'sm' }
              ],
              edges: [
                { id: 'as1', from: 'da', to: 'ga', packet: 'input' },
                { id: 'as2', from: 'da', to: 'ge', packet: 'ge' },
                { id: 'as3', from: 'da', to: 'at', packet: 'rep' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: 'GrantedHandles 边界',
            phase: 'SOLUTION',
            title: 'GrantedHandles 凭证袋回收与共享叠层池注意事项',
            paragraphs: [
              '配合 `AbilitySet` 的是收据结构体 **`FMyAbilitySet_GrantedHandles`**（参考 `LyraAbilitySet.cpp`）：装备时调用 `GiveToAbilitySystem` 记录返回的 `FGameplayAbilitySpecHandle`、`FActiveGameplayEffectHandle` 与动态 `UAttributeSet*`；卸装时调用 `TakeFromAbilitySystem(ASC)` 统一移除。',
              '**源码级边界警告（切勿盲信“无条件零误删”）**：`ASC->RemoveActiveGameplayEffect(Handle)` 默认参数 `StacksToRemove = -1` 会**一次性清空该句柄的全部叠层**！若两枚戒指给同一个 `AggregateByTarget`（或同源 `AggregateBySource`）可堆叠 GE 加层，它们会共用同一个 `ActiveGE` 句柄，摘下一枚戒指就会把两枚的层数全删光！因此：**装备词条 GE 应设为不堆叠 (`GetStackingType() == None`) 使其各自生成独立 `ActiveGE`**（或显式传 `StacksToRemove = 1` 按层扣减），且共享的 `UAttributeSet` 应按角色生命周期托管或做引用计数后再调用 `RemoveSpawnedAttribute`！'
            ],
            callout: {
              kind: 'ue5',
              label: 'UE 5.8 C++ 句柄与授予组件变更提示',
              text: 'UE 5.8 起：FActiveGameplayEffectHandle 废弃了整型构造与全局 TMap（ResetGlobalHandleMap/RemoveFromGlobalMap），改用 GenerateNewHandle() / GetInstantExecutedHandle()；自定义子类重写 UAbilitiesGameplayEffectComponent::GrantAbilities / RemoveAbilities 时，需改用接收 (UAbilitySystemComponent&, const FActiveGameplayEffect&) 的新重载。'
            },
            codeSnippet: {
              title: 'Lyra 风格装备授予与安全回收规范',
              code: `// 1. 装备赋予 (仅 Server 权威调用；装备被动 GE 推荐设为 StackingType = None 独立实例)
ShotgunAbilitySet->GiveToAbilitySystem(ASC, &EquippedHandles, this);

// 2. 卸装回收：若存在跨装备共用叠层 GE，内部应调用 RemoveActiveGameplayEffect(Handle, 1) 而非默认 -1 全清!
EquippedHandles.TakeFromAbilitySystem(ASC);`
            },
            hud: [
              { key: 'grant', label: '装备被动 GE 推荐', value: 'StackingType = None (独立句柄)', status: 'good' },
              { key: 'revoke', label: 'RemoveActiveGE 默认值', value: 'StacksToRemove=-1 (注意共享池!)', status: 'warn' }
            ],
            scene: {
              nodes: [
                { id: 'set', col: -1.9, row: -0.6, color: 'blue', icon: 'code', label: 'GiveToAbilitySystem', size: 'sm' },
                {
                  id: 'bag',
                  col: 0,
                  row: 0,
                  color: 'violet',
                  icon: 'shield',
                  label: 'GrantedHandles 收据袋',
                  sublabel: '记录全部 Spec & GE Handles',
                  state: 'active',
                  size: 'lg'
                },
                { id: 'asc', col: 2, row: 0.5, color: 'green', icon: 'asc', label: 'ASC 精准回收', badge: { text: '100% 干净卸载 ✅', tone: 'good' } }
              ],
              edges: [
                { id: 'gh1', from: 'set', to: 'bag', packet: 'input', label: '登记句柄' },
                { id: 'gh2', from: 'bag', to: 'asc', packet: 'rep', label: 'TakeFromAbilitySystem()', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: '全局知识蓝图',
            phase: 'RECAP',
            title: '通关全图：现代 UE 5.8 GAS 生产级架构总览',
            paragraphs: [
              '恭喜你走完从核心基石到 Lyra 模块化系统的全部旅程！现在你可以自信地搭建任何规模的 UE 5.8 战斗框架：\n• **宿主与复制**：玩家挂 `PlayerState`（`Mixed` + `100Hz`），AI 挂 `Character`（`Minimal`），配合 `RegisteredSubObjectList` 与 Iris 序列化管线；\n• **标签与属性**：善用 `EGameplayTagReplicationState` 统一复制标签、双层 `Clamp` 搭配 `IncomingDamage` 元属性；\n• **UE 5.8 现代标准**：用 `UGameplayEffectComponent`（含 `CancelAbilityTags` / `UIData`）拼装效果，理解五段乘区公式，全面拥抱 `InstancedPerActor` + `PlayAnimAndWait` + `AbilityAsync` + `AbilitySet`！',
              '接下来，不妨点击顶部导航栏进入 **🎯 实战诊断 (Practice)** 挑战真实线上 Bug 排查，或在 **🧪 架构沙盒 (Design Lab)** 亲手拨动修改器与网络延迟观察实时仿真！'
            ],
            hud: [
              { key: 'course', label: '核心课程模块', value: '8 大模块 · 全部解锁', status: 'good' },
              { key: 'std', label: '知识对标基准', value: 'UE 5.8 + Lyra', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'ps', col: -2, row: -0.9, color: 'sand', icon: 'playerstate', label: 'PlayerState + ASC', sublabel: 'Mixed · 100Hz', size: 'sm' },
                { id: 'abset', col: -2, row: 1.1, color: 'blue', icon: 'ga', label: 'AbilitySet + Tasks', sublabel: 'InstancedPerActor', size: 'sm' },
                { id: 'core', col: 0.1, row: 0, color: 'green', icon: 'asc', label: 'UE 5.8 GAS 架构大师', sublabel: '预测 · 解耦 · Iris', state: 'active', size: 'lg' },
                { id: 'gec', col: 2.1, row: -0.9, color: 'amber', icon: 'ge', label: 'GEComponents + Exec', sublabel: 'UE 5.8 模块化管线', size: 'sm' },
                { id: 'cue', col: 2.1, row: 1.1, color: 'rose', icon: 'cue', label: 'GameplayCues', sublabel: 'Custom EffectContext', size: 'sm' }
              ],
              edges: [
                { id: 'f1', from: 'ps', to: 'core', packet: 'rep' },
                { id: 'f2', from: 'abset', to: 'core', packet: 'predict' },
                { id: 'f3', from: 'core', to: 'gec', packet: 'ge' },
                { id: 'f4', from: 'core', to: 'cue', packet: 'cue' }
              ]
            }
          }
        ]
      }
    ]
  }
];
