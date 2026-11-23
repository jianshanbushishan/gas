import { GlossaryConcept, PracticeQuestion } from '../types/course';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'q1',
    moduleTag: '01. 核心基石',
    difficulty: '入门',
    title: '诊断案例 #1：迁移到 PlayerState 后技能同步出现 0.8 秒卡顿',
    scenario:
      '为了支持英雄死亡重生保留技能冷却，你把 ASC 和 AttributeSet 从 ACharacter 移到了自定义的 AMyPlayerState 上，并在 PossessedBy 与 OnRep_PlayerState 中正确调用了 InitAbilityActorInfo。但在多人联机测试时，每次受伤扣血和属性更新在客户端 UI 上都有将近 1 秒的明显卡顿延迟。最根本的原因是什么？',
    codeContext: `AMyPlayerState::AMyPlayerState() {\n  ASC = CreateDefaultSubobject<UMyASC>(TEXT("ASC"));\n  ASC->SetIsReplicated(true);\n  ASC->SetReplicationMode(EGameplayEffectReplicationMode::Mixed);\n}`,
    options: [
      {
        id: 'a',
        text: '应该把 ReplicationMode 改成 Full，Mixed 模式本身有 1 秒节流延迟',
        isCorrect: false,
        explanation: 'Mixed 模式没有任何人为延迟，且对拥有连接的本机客户端本来就会同步 ActiveGameplayEffects；常规多人对局不应盲目改用 Full。'
      },
      {
        id: 'b',
        text: '引擎默认将 APlayerState 的 NetUpdateFrequency 设得极低（1.0f），未在构造函数调高（如 Lyra 示例的 100.0f）',
        isCorrect: true,
        explanation: '完全正确！UE 默认 APlayerState 的 NetUpdateFrequency 为 1.0f（每秒仅允许参与约 1 次属性复制评估）。挂载 ASC 后应参考 Lyra 调高（如 SetNetUpdateFrequency(100.0f)）以解除人为节流，使属性复制紧跟服务器更新频率（实际到达时间仍受服务器 Tick 率、相关性与带宽制约）。'
      },
      {
        id: 'c',
        text: '客户端不应该在 OnRep_PlayerState 初始化 ASC，应该改在 BeginPlay 初始化',
        isCorrect: false,
        explanation: '客户端 BeginPlay 执行时 PlayerState 往往尚未通过网络复制到达（指针为空），OnRep_PlayerState 才是正确的客户端初始化时机。'
      }
    ],
    takeaway: 'ASC 挂载于 APlayerState 时，务必调高 SetNetUpdateFrequency（如 100.0f）解除 1Hz 节流，并在重生时做好防重复授予与旧 Avatar 解绑。',
    relatedLessonSlug: 'asc-architecture'
  },
  {
    id: 'q2',
    moduleTag: '03. 属性与数值集',
    difficulty: '进阶',
    title: '诊断案例 #2：100 血吃 140 伤害后，喝 +25 治疗药水血量仍为 0',
    scenario:
      '角色当前 Health = 100, MaxHealth = 100（带免死锁血状态未触发死亡销毁）。吃了一记 Instant -140 伤害后，UI 显示血量为 0；紧接着使用一瓶 Instant +25 生命药水，结果血量依然显示 0！检查代码发现程序员只在 PreAttributeChange 中写了 Clamp。为什么会这样？',
    codeContext: `void UMyAttributeSet::PreAttributeChange(const FGameplayAttribute& Attribute, float& NewValue) {\n  if (Attribute == GetHealthAttribute()) {\n    NewValue = FMath::Clamp(NewValue, 0.f, GetMaxHealth());\n  }\n}`,
    options: [
      {
        id: 'a',
        text: 'PreAttributeChange 只截断当次求值的 CurrentValue，底层 BaseValue 已经变成了 -40（-40 + 25 = -15，再次截断后仍是 0）',
        isCorrect: true,
        explanation: '一针见血！Epic 在 AttributeSet.h 中明确说明 PreAttributeChange 不会永久改写聚合器内部的 BaseValue。应在 PreAttributeBaseChange 中直接修改引用参数 NewValue（切勿在其中调用 SetHealth：不仅违反 const 签名无法编译，还会触发重入风险！），并在 MaxHealth 下降时于 PostAttributeChange 重约束当前血量。'
      },
      {
        id: 'b',
        text: 'Instant 类型的 GameplayEffect 根本不会触发 PreAttributeChange',
        isCorrect: false,
        explanation: 'Instant GE 修改属性时同样会触发 PreAttributeChange，只是它没有把截断结果固化回底层 BaseValue 源数据。'
      },
      {
        id: 'c',
        text: '治疗药水必须用 HasDuration 不能用 Instant，否则无法增加 BaseValue',
        isCorrect: false,
        explanation: '恰恰相反，永久回血药水正应该使用 Instant（或 Periodic）来永久增加 BaseValue。'
      }
    ],
    takeaway: '在 PreAttributeBaseChange 直接 Clamp 引用参数 NewValue（勿调 Setter），配合 PostAttributeChange 处理上限下调与 IncomingDamage 元属性按 BaseValue 扣血。',
    relatedLessonSlug: 'attribute-clamping'
  },
  {
    id: 'q3',
    moduleTag: '04. 游戏效果 (UE 5.3+)',
    difficulty: '入门',
    title: '诊断案例 #3：UE 5.4 中配置了眩晕标签，受击者却毫发无损',
    scenario:
      '升级到 UE 5.4 后，策划新建了一个 3 秒眩晕 GE_Stun，在 Components 面板添加了“Tags This Effect Has (Asset Tags)”组件并填入了 State.CrowdControl.Stun。对敌人施加该 GE 后，敌人身上的技能（配置了 ActivationBlockedTags = State.CrowdControl.Stun）依然能正常释放！问题出在哪？',
    options: [
      {
        id: 'a',
        text: 'UE 5.4 中 GameplayEffect 已经不支持授予标签，必须在蓝图里手动调 AddLooseGameplayTag',
        isCorrect: false,
        explanation: '绝对错误！GE 依然是授予状态标签的核心正规途径，且切勿用不复制的 LooseTag 替代。'
      },
      {
        id: 'b',
        text: '加错了组件！UAssetTagsGameplayEffectComponent 只描述 GE 自身属性，不会授予目标；应添加 UTargetTagsGameplayEffectComponent (Grant Tags to Target)',
        isCorrect: true,
        explanation: '完全正确！这是 UE 5.3+ 模块化重构后最高频的配表失误：AssetTags 留在 GE 自己身上，TargetTags (Granted Tags) 才会真正注入受击者 ASC 的标签计数表。'
      },
      {
        id: 'c',
        text: '3 秒太短，HasDuration 低于 5 秒时不会触发标签封锁',
        isCorrect: false,
        explanation: '哪怕持续 0.05 秒的 HasDuration GE，只要在活跃期内都会立即增减目标的标签引用计数。'
      }
    ],
    takeaway: 'UE 5.3+ 给目标挂状态标签必选 UTargetTagsGameplayEffectComponent (Granted to Actor)。',
    relatedLessonSlug: 'ge-components-math'
  },
  {
    id: 'q4',
    moduleTag: '02. 游戏标签系统',
    difficulty: '进阶',
    title: '诊断案例 #4：老项目关闭标签复制配置后，旁观玩家看不到“举盾格挡”姿势',
    scenario:
      '某从旧工程迁移来的项目在 DefaultGame.ini 中保留了 ReplicateActivationOwnedTags=False。你在 GA_ShieldBlock 的 ActivationOwnedTags 中配置了 State.Blocking，并在角色动画蓝图 (AnimBP) 每帧读取 ASC->HasMatchingGameplayTag(State.Blocking) 切换举盾姿势。本机和服务器看都正常，唯独旁观的第三个玩家客户端 (SimulatedProxy) 看你一直垂着手没举盾！原因与正确排查思路是什么？',
    codeContext: `[/Script/GameplayAbilities.AbilitySystemGlobals]
ReplicateActivationOwnedTags=False`,
    options: [
      {
        id: 'a',
        text: '关闭 ReplicateActivationOwnedTags 时，ActivationOwnedTags 仅以本地非复制 LooseTag 方式加在 Server 与 Owning Client 上，不会同步给 SimulatedProxy',
        isCorrect: true,
        explanation: '精准命中！UE 5.8 默认在 Project Settings → Gameplay Abilities Settings（UGameplayAbilitiesDeveloperSettings）中开启 ReplicateActivationOwnedTags：服务端激活技能时统一通过 AddLooseGameplayTags(..., EGameplayTagReplicationState::CountToOwner) 走新版 GameplayTagCountContainer 同步给本机与旁观客户端（旧的 MinimalReplicationTags / ReplicatedLooseTags 已于 UE 5.7 废弃）；题设项目沿用老配置把开关关掉后，就退化为纯本地 None 状态。实战排错三步：1) 检查 Project Settings 中的 ReplicateActivationOwnedTags；2) 检查 SimulatedProxy 的 AnimBP 是否在 OnRep_PlayerState 到达前误缓存了空 ASC；3) 或直接通过持续型 GameplayEffect（含 UTargetTagsGameplayEffectComponent）授予标签。'
      },
      {
        id: 'b',
        text: '动画蓝图不能读取 GameplayTag，只能在角色 Tick 里发多播 RPC',
        isCorrect: false,
        explanation: '动画蓝图非常适合读取 ASC 标签（支持 FGameplayTagBlueprintPropertyMap 自动映射），只需确保开启 ReplicateActivationOwnedTags 或通过持续 GE 授予，并在 OnRep_PlayerState 后正确绑定有效 ASC。'
      },
      {
        id: 'c',
        text: 'SimulatedProxy 上根本不存在 ASC 组件',
        isCorrect: false,
        explanation: 'PlayerState 或 Character 上的 ASC 组件会正常复制到 SimulatedProxy 并接收复制标签（EGameplayTagReplicationState）与 GameplayCues。'
      }
    ],
    takeaway: '排查旁观端标签动画失灵三步曲：检查 ReplicateActivationOwnedTags 配置、核实 AnimBP 绑定的 ASC 非空、或用持续型 GE 授予状态标签。',
    relatedLessonSlug: 'tag-queries-blocking'
  },
  {
    id: 'q5',
    moduleTag: '05. 技能与异步任务',
    difficulty: '入门',
    title: '诊断案例 #5：C++ 编写的 PlayMontageAndWait 任务毫无反应',
    scenario:
      '你在 C++ 的 ActivateAbility 中调用了 UAbilityTask_PlayMontageAndWait::CreatePlayMontageAndWaitProxy(...) 并绑定好了 OnCompleted 与 OnCancelled 委托，CommitAbility 也返回了 true，但运行游戏按下按键后既不播动画也不进回调，技能还从此卡死再也放不出来。漏了哪句关键代码？',
    codeContext: `auto* Task = UAbilityTask_PlayMontageAndWait::CreatePlayMontageAndWaitProxy(this, NAME_None, Montage);\nTask->OnCompleted.AddDynamic(this, &UMyGA::OnDone);\nTask->OnCancelled.AddDynamic(this, &UMyGA::OnDone);\n// 结束了 ActivateAbility 函数体`,
    options: [
      {
        id: 'a',
        text: '漏掉了 Task->ReadyForActivation()，导致异步任务根本没有启动，进而永远走不到 OnDone 里的 EndAbility()',
        isCorrect: true,
        explanation: '完全正确！蓝图节点会自动生成 ReadyForActivation 调用，但在 C++ 中创建并绑好委托后必须显式调用 Task->ReadyForActivation() 才会真正激活任务！'
      },
      {
        id: 'b',
        text: 'C++ 里不能使用 PlayMontageAndWait，只能直接调 AnimInstance->Montage_Play',
        isCorrect: false,
        explanation: '直接调 AnimInstance->Montage_Play 会失去 GAS 的跨端蒙太奇复制与预测回滚能力，使用 PlayMontageAndWait 任务正是官方推荐做法。'
      },
      {
        id: 'c',
        text: '应该在 ActivateAbility 最后一行立刻写上 EndAbility()',
        isCorrect: false,
        explanation: '如果在启动异步蒙太奇的同一帧立刻调 EndAbility()，任务刚启动就会被随同技能一起强行终止打断！'
      }
    ],
    takeaway: 'C++ 使用 AbilityTask 铁律：CreateProxy → 绑定全部输出委托 → 调用 ReadyForActivation()。',
    relatedLessonSlug: 'ability-tasks'
  },
  {
    id: 'q6',
    moduleTag: '04. 游戏效果 (UE 5.3+)',
    difficulty: '高阶',
    title: '诊断案例 #6：用 ExecCalc 计算敏捷缩减冷却，客户端冷却圈异常',
    scenario:
      '为了根据角色的敏捷与急速属性复杂计算技能冷却时长，程序员写了一个 UGameplayEffectExecutionCalculation 挂在 Cooldown GE（HasDuration）上。结果运行发现冷却时间不仅没有生效，本地预测施法也出现异常。核心原因是什么？',
    options: [
      {
        id: 'a',
        text: 'ExecCalc 不支持驱动 HasDuration 的 DurationMagnitude，也不支持客户端预测；动态冷却时长应改用支持预测的 MMC、AttributeBased 或 SetByCaller',
        isCorrect: true,
        explanation: '满分回答！Cooldown GE 的 DurationMagnitude 属于 FGameplayEffectModifierMagnitude，可根据复杂度选用自定义 MMC（多属性公式）、AttributeBased（单属性换算）或 SetByCaller（技能代码动态注入秒数），三者均完整支持客户端本地预测；而 ExecCalc 仅在服务端 Execute 阶段（Instant / Periodic）运行！'
      },
      {
        id: 'b',
        text: 'GAS 的冷却时间只能写死固定秒数，不能根据角色属性动态缩减',
        isCorrect: false,
        explanation: 'Cooldown GE 的 DurationMagnitude 原生支持 AttributeBased、Custom Calculation Class (MMC) 以及 SetByCaller，均可实现可预测的急速冷却缩减（CDR）。'
      },
      {
        id: 'c',
        text: '需要在客户端本地先发一次 RPC 让服务器算好秒数再按键',
        isCorrect: false,
        explanation: '前置 RPC 等待会彻底摧毁 0ms 本地预测手感，使用 MMC / AttributeBased / SetByCaller 即可在客户端本地同步预测出冷却时长。'
      }
    ],
    takeaway: 'HasDuration 的持续时间与可预测修改器选 ScalableFloat / AttributeBased / SetByCaller / MMC；服务端多属性瞬发或周期伤害结算选 ExecCalc。',
    relatedLessonSlug: 'ge-calculations'
  },
  {
    id: 'q7',
    moduleTag: '07. 表现层解耦 (Cues)',
    difficulty: '进阶',
    title: '诊断案例 #7：断线重连或从远处跑近的队友看不见 Boss 护盾光罩',
    scenario:
      'Boss 开启了持续 30 秒的无敌能量罩（Infinite GE 绑定 AGameplayCueNotify_Actor）。设计师把“激活护盾网格与循环粒子”连在了 Cue 蓝图的 OnActive 节点上。当时在跟前的玩家都能看见护盾，但 5 秒后从复活点跑进视野的队友看 Boss 身上空空如也！该如何修复？',
    options: [
      {
        id: 'a',
        text: '把持续显示的护盾网格与循环粒子逻辑从 OnActive 移到 WhileActive 事件中',
        isCorrect: true,
        explanation: '完全正确！当常驻 Cue 通过活跃 GE（或 AddGameplayCue）把有效状态同步给新进入网络相关性范围 (NetRelevancy) 的客户端时，引擎会触发 WhileActive 恢复常驻表现；而 OnActive 仅在刚施加那一瞬触发。'
      },
      {
        id: 'b',
        text: '在 Tick 里每 0.5 秒广播一次 ExecuteGameplayCue 刷新护盾',
        isCorrect: false,
        explanation: '定时轮询发不可靠多播既浪费带宽又会导致已在场玩家的特效反复闪烁重置。'
      },
      {
        id: 'c',
        text: '把 Boss 的 NetCullDistance 改成无穷大',
        isCorrect: false,
        explanation: '取消网络裁剪距离会让大地图所有怪物全图同步拖垮服务器，且依然解决不了中途断线重连加入对局的玩家。'
      }
    ],
    takeaway: 'AGameplayCueNotify_Actor 中：瞬时开场音效放 OnActive，常驻循环粒子/模型放 WhileActive，清理复位放 OnRemove。',
    relatedLessonSlug: 'gameplay-cues'
  },
  {
    id: 'q8',
    moduleTag: '04. 游戏效果 (UE 5.3+)',
    difficulty: '高阶',
    title: '诊断案例 #8：两个 +20% 增伤 Buff 叠算结果与 UE 5.5 乘区选型',
    scenario:
      '角色基础攻击力 100，身上在同一求值通道 (Channel0) 内同时挂了两个持续型增伤 Buff，修改器数值均填 1.2。在默认 MultiplyAdditive（旧称 Multiplicitive）模式下最终攻击力是多少？如果策划要求单通道内直接独立连乘算出 144，在 UE 5.5 中应改选哪个操作符？',
    options: [
      {
        id: 'a',
        text: '默认算出 240；应改选 Override',
        isCorrect: false,
        explanation: '同一求值通道内 MultiplyAdditive 采用 1.0 偏置算法 1 + (1.2 - 1) + (1.2 - 1) = 1.4（即 140），而 Override 会把当前通道的输出直接覆盖成 1.2！'
      },
      {
        id: 'b',
        text: '默认按 1 + Σ(Mod - 1) 偏置同池加算得出 140；UE 5.5 中若需独立连乘得出 144，直接改选新增的 MultiplyCompound',
        isCorrect: true,
        explanation: '精准无误！MultiplyAdditive 将各词条减去 1.0 后求和再加 1.0（1 + 0.2 + 0.2 = 1.4 → 140）；UE 5.5 原生新增了 EGameplayModOp::MultiplyCompound 支持真正的独立连乘（100 × 1.2 × 1.2 = 144）！'
      },
      {
        id: 'c',
        text: '默认就是 144；如果想算出 140 必须手写 C++',
        isCorrect: false,
        explanation: '恰恰说反了！GAS 历史默认的 Multiplicitive 一直都是偏置同池加算得出 140，直到 UE 5.5 才原生加入 MultiplyCompound 连乘操作。'
      }
    ],
    takeaway: 'UE 5.5 聚合管线：((Base + AddBase) × MultiplyAdditive ÷ DivideAdditive × MultiplyCompound) + AddFinal。',
    relatedLessonSlug: 'ge-components-math'
  }
];

export const GLOSSARY_CONCEPTS: GlossaryConcept[] = [
  {
    term: 'UAbilitySystemComponent (ASC)',
    category: '核心架构',
    summary: 'GAS 唯一核心调度组件，管理技能授予激活、AttributeSet、活跃 GE、标签引用计数与网络预测。',
    lessonSlug: 'why-gas',
    stepIndex: 3
  },
  {
    term: 'OwnerActor vs AvatarActor',
    category: '核心架构',
    summary: 'OwnerActor 持久持有 ASC（如 APlayerState），AvatarActor 代表世界物理躯壳（如 ACharacter）。',
    lessonSlug: 'asc-architecture',
    stepIndex: 2
  },
  {
    term: 'InitAbilityActorInfo',
    category: '核心架构',
    summary: '双端初始化绑定函数：Server 在 PossessedBy 调用（配合守卫防重生重复授予），Client 在 OnRep_PlayerState 调用，旧躯壳销毁前解绑。',
    lessonSlug: 'asc-architecture',
    stepIndex: 4
  },
  {
    term: 'NetUpdateFrequency (PlayerState 1Hz 节流)',
    category: '网络同步',
    summary: '决定 Actor 多久有资格参与复制评估。APlayerState 默认 1.0f，挂载 ASC 后应参考 Lyra 调高（如 100.0f），实际到达仍受 Server Tick 与带宽制约。',
    lessonSlug: 'asc-architecture',
    stepIndex: 5
  },
  {
    term: 'ReplicationMode: Mixed / Minimal / Full',
    category: '网络同步',
    summary: '控制 ActiveGE 复制范围：单机或特需全量检视场景用 Full，有拥有连接的玩家用 Mixed，无玩家连接的 AI 用 Minimal。',
    lessonSlug: 'replication-modes',
    stepIndex: 3
  },
  {
    term: 'FGameplayTagCountContainer (引用计数)',
    category: '标签系统',
    summary: 'ASC 内部按 Tag -> int32 维护叠层计数，彻底防止多个眩晕 Buff 先后到期导致的提前解控 Bug。',
    lessonSlug: 'gameplay-tags-core',
    stepIndex: 3
  },
  {
    term: 'Loose Gameplay Tags & EGameplayTagReplicationState (UE 5.8)',
    category: '标签系统',
    summary: 'AddLooseGameplayTag 默认 TagRepState=None（仅本地不复制）；UE 5.7+ 移除 AddReplicatedLooseGameplayTag，统一用五档 EGameplayTagReplicationState 控制复制粒度。',
    lessonSlug: 'gameplay-tags-core',
    stepIndex: 4
  },
  {
    term: 'ActivationOwnedTags 与复制开关',
    category: '标签系统',
    summary: 'UE 5.8 默认在 GameplayAbilitiesDeveloperSettings 开启 ReplicateActivationOwnedTags，统一走 CountToOwner 同步给旁观端；排错需同查配置开关、AnimBP 绑定的 ASC 与持续 GE 方案。',
    lessonSlug: 'tag-queries-blocking',
    stepIndex: 3
  },
  {
    term: 'BaseValue vs CurrentValue',
    category: '属性数值',
    summary: 'Instant/Periodic GE 永久改写 BaseValue；非周期 Duration/Infinite GE 经聚合器修饰 CurrentValue。资源属性应禁挂持续修改器以免读写错位。',
    lessonSlug: 'base-vs-current',
    stepIndex: 2
  },
  {
    term: 'REPNOTIFY_Always & GAMEPLAYATTRIBUTE_REPNOTIFY',
    category: '属性数值',
    summary: '属性复制必配组合：即使服务端回传值与客户端预测值相同也强制触发 OnRep，把权威 BaseValue 同步进本地聚合器，避免预测撤销后数值回跳。',
    lessonSlug: 'base-vs-current',
    stepIndex: 4
  },
  {
    term: 'PreAttributeBaseChange / PostAttributeChange / PostGEExecute',
    category: '属性数值',
    summary: 'PreAttributeBaseChange 直接改 NewValue 锁死 BaseValue；PostAttributeChange 处理上限下调重约束；PostGEExecute 处理元属性扣血与判死。',
    lessonSlug: 'attribute-clamping',
    stepIndex: 3
  },
  {
    term: 'IncomingDamage (Meta Attribute 元属性)',
    category: '属性数值',
    summary: '非网络复制的服务端瞬态中转属性，在 PostGameplayEffectExecute 中读取清零并统一结算护盾与生命扣减。',
    lessonSlug: 'meta-attributes',
    stepIndex: 3
  },
  {
    term: 'UGameplayEffectComponent (UE 5.8)',
    category: '游戏效果',
    summary: 'UE 5.8 模块化 GE 子组件体系（含 TargetTags / AssetTags / CancelAbilityTags / BlockAbilityTags / UIData 等）；授予目标标签必选 UTargetTagsGameplayEffectComponent。',
    lessonSlug: 'ge-components-math',
    stepIndex: 1
  },
  {
    term: 'MultiplyAdditive vs MultiplyCompound (UE 5.8)',
    category: '游戏效果',
    summary: '单求值通道内 MultiplyAdditive 同池加算，MultiplyCompound 独立连乘，AddFinal 平坦追加；Override 覆盖当前通道输出。',
    lessonSlug: 'ge-components-math',
    stepIndex: 4
  },
  {
    term: 'MMC / AttributeBased / SetByCaller vs ExecCalc',
    category: '游戏效果',
    summary: '前四类量级计算支持全时效与客户端预测（Snapshot 须区分 Source 创建时与 Target 施加时捕获）；ExecCalc 仅限服务端 Instant/Periodic。',
    lessonSlug: 'ge-calculations',
    stepIndex: 3
  },
  {
    term: 'InstancedPerActor & PlayAnimAndWait (UE 5.8)',
    category: '技能与任务',
    summary: 'NonInstanced 已废弃，首选 InstancedPerActor；除 PlayMontageAndWait 外，UE 5.8 内置 PlayAnimAndWait 直播 AnimSequence，GA 外部监听可用 AbilityAsync_*。',
    lessonSlug: 'ability-lifecycle',
    stepIndex: 3
  },
  {
    term: 'ReadyForActivation & ShouldBroadcastAbilityTaskDelegates',
    category: '技能与任务',
    summary: 'C++ 创建 AbilityTask 后必调 ReadyForActivation() 启动；自定义任务广播委托前必查 ShouldBroadcast。',
    lessonSlug: 'ability-tasks',
    stepIndex: 3
  },
  {
    term: 'FPredictionKey & FScopedPredictionWindow',
    category: '网络预测',
    summary: '初始窗口仅覆盖同步激活栈；Succeed/Failed RPC 确认激活结果，复制的 PredictionKey 追上后经 CatchUpTo 清理临时预测效果。',
    lessonSlug: 'client-prediction',
    stepIndex: 2
  },
  {
    term: 'FScopedServerAbilityRPCBatcher',
    category: '网络预测',
    summary: '重写 ShouldDoServerAbilityRPCBatch() 返回 true 后，将同作用域内的激活、TargetData 与结束合并为 ServerAbilityRPCBatch 发送。',
    lessonSlug: 'network-optimization',
    stepIndex: 2
  },
  {
    term: 'WhileActive vs OnActive (GameplayCue)',
    category: '表现解耦',
    summary: '当客户端收到仍然有效的常驻 Cue 状态时，WhileActive 可为中途进入相关范围的玩家恢复表现；引擎内置 AGameplayCueNotify_Looping 基类。',
    lessonSlug: 'gameplay-cues',
    stepIndex: 3
  },
  {
    term: 'ULyraAbilitySet & GrantedHandles',
    category: '实战架构',
    summary: '打包授予 GA + GE + AttributeSet；注意 RemoveActiveGameplayEffect 默认移除全部叠层，共享被动 GE 应设为不堆叠或按层移除。',
    lessonSlug: 'design-lyra-abilityset',
    stepIndex: 3
  }
];
