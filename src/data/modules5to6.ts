import { ModuleData } from '../types/course';

export const MODULES_5_TO_6: ModuleData[] = [
  {
    id: 'mod-abilities',
    indexLabel: '05. 技能与异步任务',
    title: '05. 技能与异步任务',
    titleEn: '05. Abilities & Tasks',
    folderColor: 'blue',
    lessons: [
      {
        slug: 'ability-lifecycle',
        title: '技能授予、生命周期与 UE 5.8 实例化新规',
        titleEn: 'Ability Lifecycle, Commit/End & UE 5.8 Instancing Policy',
        summary: '走通 Give → Activate → Commit → End 权威链路，掌握废弃 NonInstanced 后的 UE 5.8 工程规范。',
        durationMin: 12,
        difficulty: '入门',
        goals: [
          { id: 'g1', text: '掌握仅在 Server 调用 GiveAbility 并通过 SpecHandle 操作技能', unlockAtStep: 1 },
          { id: 'g2', text: '理解 CommitAbility 与漏调 EndAbility 导致技能永久卡死的原理', unlockAtStep: 2 },
          { id: 'g3', text: '知悉 NonInstanced 已废弃，正确清理 InstancedPerActor 状态与 UE 5.8 新访问器', unlockAtStep: 3 },
          { id: 'g4', text: '在 EnhancedInput 中通过 InputTag 优雅路由技能按下与松开', unlockAtStep: 4 },
          { id: 'g5', text: '用 AbilityTriggers 让受击/死亡等技能由 GameplayEvent 或标签自动触发', unlockAtStep: 5 },
          { id: 'g6', text: '配置 Cost/Cooldown GE，并用通用冷却 GE + SetByCaller 避免资产爆炸', unlockAtStep: 6 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '权威授予',
            phase: 'ARCHITECTURE',
            title: 'GiveAbility：角色必须先“学会”技能才能释放',
            paragraphs: [
              '与普通函数不同，角色不能随便激活任意 `UGameplayAbility` 类，必须先在**服务端 (`HasAuthority()`)** 调用 `ASC->GiveAbility(FGameplayAbilitySpec(AbilityClass, Level))` 授予技能！',
              '授予后，技能包装体存入 `ActivatableAbilities` 容器（基于高效的 `FFastArraySerializer` 增量数组复制），自动同步到拥有该角色的客户端，并返回唯一凭证 `FGameplayAbilitySpecHandle`。'
            ],
            callout: {
              kind: 'warn',
              label: '切勿在客户端调用 GiveAbility',
              text: 'GiveAbility 与 ClearAbility 严格属于服务端权威操作；如果在客户端本地调用，引擎会直接打印 Error 日志并返回无效的 SpecHandle，技能根本不会被授予。'
            },
            hud: [
              { key: 'auth', label: 'GiveAbility 调用端', value: '仅限 Server 权威端', status: 'good' },
              { key: 'sync', label: '同步数据结构', value: 'FFastArraySerializer', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'srv', col: -1.7, row: -0.4, color: 'green', icon: 'server', label: 'Server: GiveAbility()', sublabel: '生成 FGameplayAbilitySpec', state: 'active' },
                { id: 'arr', col: 0.2, row: 0.2, shape: 'cylinder', color: 'blue', icon: 'asc', label: 'ActivatableAbilities', sublabel: 'FastArray 增量复制' },
                { id: 'cli', col: 2, row: 0.7, color: 'teal', icon: 'client', label: 'Owning Client', badge: { text: '收到 SpecHandle 可预测激活', tone: 'good' } }
              ],
              edges: [
                { id: 'ga1', from: 'srv', to: 'arr', packet: 'input' },
                { id: 'ga2', from: 'arr', to: 'cli', packet: 'rep', label: '增量同步已学技能列表', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '生死闭环',
            phase: 'PITFALL',
            title: '头号卡死 Bug：忘了在分支终点调用 EndAbility()！',
            paragraphs: [
              '进入 `ActivateAbility` 后，标准流程是先调用 **`if (!CommitAbility(...)) { EndAbility(..., true); return; }`**（一次性扣除 Cost 并打上 Cooldown）。',
              '**致命陷阱**：`ActivateAbility` 函数执行完当前栈帧**并不代表技能结束**！只要你没显式调用 `EndAbility`，该技能就会一直处于 `Active` 运行态（用于等待异步蒙太奇或蓄力）。如果你在某个 `if` 提前 `return` 或动画被打断回调里漏写了 `EndAbility`，这个技能在本局游戏里就**永远按不出来了**！'
            ],
            codeSnippet: {
              title: '严谨的 ActivateAbility 骨架',
              code: `void UGA_Slash::ActivateAbility(...) {\n  if (!CommitAbility(Handle, ActorInfo, ActivationInfo)) {\n    // 蓝不够或冷却中：必须立刻取消结束!\n    EndAbility(Handle, ActorInfo, ActivationInfo, true, true);\n    return;\n  }\n  // 启动异步任务，并在成功/打断/取消所有回调中确保调用 EndAbility!\n}`
            },
            hud: [
              { key: 'commit', label: 'CommitAbility()', value: '扣 Cost + 挂 Cooldown', status: 'good' },
              { key: 'leak', label: '漏调 EndAbility 后果', value: '技能永久锁死无法再放!', status: 'bad' }
            ],
            scene: {
              nodes: [
                { id: 'try', col: -2, row: -0.6, color: 'blue', icon: 'ga', label: 'ActivateAbility', size: 'sm' },
                { id: 'com', col: -0.3, row: -0.6, color: 'amber', icon: 'shield', label: 'CommitAbility()', sublabel: 'Cost & Cooldown 校验' },
                { id: 'end', col: 1.7, row: -0.8, color: 'green', icon: 'asc', label: 'EndAbility()', sublabel: '正常释放锁 · 清理 Task', state: 'active' },
                { id: 'stuck', col: 1.5, row: 1.3, color: 'red', icon: 'ga', label: '漏写 EndAbility 分支', badge: { text: 'bIsActive 永远为 true ❌', tone: 'bad' }, state: 'crashed' }
              ],
              edges: [
                { id: 'lc1', from: 'try', to: 'com', packet: 'input' },
                { id: 'lc2', from: 'com', to: 'end', packet: 'rep', label: '所有出口必调' },
                { id: 'lc3', from: 'com', to: 'stuck', style: 'dashed', packet: 'error', label: '提前 return 漏调' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: 'UE 5.8 实例化新规',
            phase: 'UE5_NEW',
            title: '彻底告别 NonInstanced！UE 5.8 全面拥抱 InstancedPerActor',
            paragraphs: [
              '过去 GAS 有三种实例化策略：`NonInstanced`、`InstancedPerActor`、`InstancedPerExecution`。自 UE 5.5 起，Epic 官方已**正式废弃 `NonInstanced`**（因为直接在类默认对象 CDO 上跑逻辑极易引发多角色数据串台且无法安全绑定异步任务）。',
              '现代 UE 5.8 工程选型极其纯粹：\n• **99% 技能首选 `InstancedPerActor`**（也是 Lyra 默认值）：授予技能时只 `NewObject` 一次，反复复用零 GC 抖动！**唯一注意事项**：因为实例会跨多次施法留存，你自己在技能里声明的临时变量（如 `int32 HitCount`）必须在每次 `ActivateAbility` 开头或 `EndAbility` 里手动清零！\n• **`InstancedPerExecution`**：每次施放都新建对象，仅用于极少数“同一技能允许在结束前重叠双开”的特殊设计。'
            ],
            callout: {
              kind: 'ue5',
              label: 'UE 5.8 伴随 API 升级提醒',
              text: '除将 NonInstanced 统一迁移为 InstancedPerActor 外，在 UE 5.8 C++ 中：GA 内获取 ASC 请用 GetAbilitySystemComponentFromActorInfo_Ensured()（原 _Checked 已废弃）；蓝图库构造 GE Spec 请用 UAbilitySystemBlueprintLibrary::MakeSpecHandleByClass()（原 MakeSpecHandle 已废弃）。'
            },
            hud: [
              { key: 'non_inst', label: 'NonInstanced', value: '已正式废弃 Deprecated!', status: 'bad' },
              { key: 'per_actor', label: 'InstancedPerActor', value: 'UE 5.8 行业标准 · 零分配复用', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'cdo', col: -1.8, row: -0.8, color: 'slate', icon: 'code', label: 'NonInstanced (CDO)', sublabel: 'UE 5.5+ 已废弃!', state: 'crashed', size: 'sm' },
                {
                  id: 'actor',
                  col: 0.4,
                  row: -0.2,
                  color: 'green',
                  icon: 'ga',
                  label: 'InstancedPerActor',
                  sublabel: '单实例常驻 · 注意重置变量',
                  state: 'active',
                  size: 'lg',
                  badge: { text: 'Lyra 默认推荐 ✅', tone: 'good' }
                },
                { id: 'exec', col: 2.1, row: 1.1, color: 'amber', icon: 'ga', label: 'InstancedPerExecution', sublabel: '每次激活 NewObject (慎用)', size: 'sm' }
              ],
              edges: [
                { id: 'ip1', from: 'cdo', to: 'actor', packet: 'rep', label: '升级迁移' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: 'EnhancedInput 绑定',
            phase: 'SOLUTION',
            title: '告别旧枚举：Lyra 风格 EnhancedInput + InputTag 绑定',
            paragraphs: [
              '早期 GAS 强制要求写一个死板的 C++ `enum EAbilityInputID` 来绑定按键，导致策划每加一个新技能槽位都要改 C++ 枚举重编引擎。',
              '现代 UE5 标准做法（源自 Lyra）：授予技能时将 `InputTag.Ability.PrimaryFire` 塞入 `AbilitySpec.GetDynamicSpecSourceTags()`（UE 5.5 新访问器，旧名 `DynamicAbilityTags`）；当 `EnhancedInput` 收到按键按下/松开时，遍历匹配该 `InputTag` 的 Spec 调用激活或 `AbilitySpecInputPressed / Released`（驱动蓄力松手发射）！',
              '⚠️ 关键细节：引擎基类的 `AbilitySpecInputPressed / Released` 只更新 `Spec.InputPressed` 并通知技能实例，**不会触发泛型复制事件**，而 `WaitInputPress` / `WaitInputRelease` 任务监听的正是这些事件。因此需像 `ULyraAbilitySystemComponent` 一样重写这两个函数，在技能激活中时调用 `InvokeReplicatedEvent(EAbilityGenericReplicatedEvent::InputPressed / InputReleased, Spec.Handle, Spec.ActivationInfo.GetActivationPredictionKey())`，否则蓄力松手、连招预输入任务永远收不到回调。'
            ],
            hud: [
              { key: 'old', label: '旧式 InputID 枚举', value: '僵硬耦合 · 已淘汰', status: 'warn' },
              { key: 'new', label: 'DynamicSpecSourceTags', value: 'InputTag 纯数据驱动 ✅', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'ia', col: -1.9, row: 0, color: 'blue', icon: 'client', label: 'EnhancedInput', sublabel: 'IA_Shoot → InputTag.Fire' },
                { id: 'asc', col: 0.1, row: 0, color: 'violet', icon: 'asc', label: 'AbilityInputTagPressed', sublabel: '匹配 DynamicSpecSourceTags', state: 'active' },
                { id: 'ga', col: 2, row: 0, color: 'green', icon: 'ga', label: 'GA_RifleFire', sublabel: '支持蓄力松开通知' }
              ],
              edges: [
                { id: 'ei1', from: 'ia', to: 'asc', packet: 'input', label: '传入 FGameplayTag' },
                { id: 'ei2', from: 'asc', to: 'ga', packet: 'predict', label: 'TryActivateAbility', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's5',
            shortLabel: '事件触发技能',
            phase: 'TECHNIQUE',
            title: 'AbilityTriggers：受击、死亡与被动技能不靠按键也能自动激活',
            paragraphs: [
              '前面的课程多次写到“`SendGameplayEventToActor` 触发 `GA_HitReact` / `GA_Death`”——让这一切成立的是 `UGameplayAbility` 上的 **`AbilityTriggers`** 数组。每个条目配置一个 `TriggerTag` 与触发来源：\n• **`GameplayEvent`**：收到匹配标签的 GameplayEvent 时激活，事件载荷 `FGameplayEventData`（`Instigator`、`Target`、`EventMagnitude`、`TargetData` 等）会传入 **`ActivateAbilityFromEvent`**，蓝图里对应 `ActivateAbilityFromEvent` 事件节点；\n• **`OwnedTagAdded`**：ASC 获得该标签时激活一次（例如被眩晕时自动触发“挣扎”技能）；\n• **`OwnedTagPresent`**：标签存在期间保持激活，标签移除时自动取消。',
              '注意：事件触发的技能同样必须先 `GiveAbility` 授予；`SendGameplayEventToActor` 通常在服务端调用，若技能需要在本地预测执行，要在预测窗口内（例如 AbilityTask 回调里）发送事件。常驻被动技能（光环、被动回血）则常在 `OnAvatarSet` 中自行 `TryActivateAbility`——Lyra 把这一模式封装为 `ELyraAbilityActivationPolicy::OnSpawn`。'
            ],
            codeSnippet: {
              title: '服务端结算命中后触发受击技能',
              code: `FGameplayEventData Payload;\nPayload.Instigator = DamageInstigator;\nPayload.Target = HitActor;\nPayload.EventMagnitude = FinalDamage;\n// GA_HitReact 的 AbilityTriggers 配置: TriggerTag = Event.HitReact, Source = GameplayEvent\nUAbilitySystemBlueprintLibrary::SendGameplayEventToActor(HitActor, TAG_Event_HitReact, Payload);`
            },
            hud: [
              { key: 'trig', label: '触发来源', value: 'GameplayEvent / OwnedTagAdded / OwnedTagPresent', status: 'good' },
              { key: 'entry', label: '事件入口', value: 'ActivateAbilityFromEvent', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'srv', col: -1.9, row: 0, color: 'amber', icon: 'server', label: '伤害结算', sublabel: 'SendGameplayEventToActor' },
                { id: 'asc', col: 0.1, row: 0, color: 'violet', icon: 'asc', label: '受击者 ASC', sublabel: '匹配 AbilityTriggers', state: 'active' },
                { id: 'ga', col: 2, row: 0, color: 'green', icon: 'ga', label: 'GA_HitReact', sublabel: 'ActivateAbilityFromEvent' }
              ],
              edges: [
                { id: 'tr1', from: 'srv', to: 'asc', packet: 'rpc', label: 'Event.HitReact + Payload' },
                { id: 'tr2', from: 'asc', to: 'ga', packet: 'input', label: '自动激活', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's6',
            shortLabel: 'Cost 与冷却',
            phase: 'SOLUTION',
            title: 'Cost / Cooldown GE 配置要点与“通用冷却 GE”工程模式',
            paragraphs: [
              '`CommitAbility()` 会应用技能上配置的 **`CostGameplayEffectClass`**（通常是 Instant 扣蓝）与 **`CooldownGameplayEffectClass`**（HasDuration）。UE 5.3+ 中，冷却 GE 必须用 `UTargetTagsGameplayEffectComponent` 授予冷却标签（如 `Cooldown.Skill.Fireball`）；技能的 `CheckCooldown` 正是检查 ASC 上是否存在这些标签。两者都能随技能一起被客户端预测。',
              '朴素做法是每个技能建一个 `GE_Cooldown_XXX`，技能多了就是资产爆炸。常用工程方案（GASDocumentation 推荐）：只建**一个通用冷却 GE**，Duration 用 `SetByCaller`；技能类上配置 `CooldownDuration` 与 `CooldownTags`，并重写 **`GetCooldownTags()`**（返回自身冷却标签，供检查与 UI 查询）与 **`ApplyCooldown()`**（创建 Spec，注入 SetByCaller 时长，并把冷却标签加入 `Spec.DynamicGrantedTags`）。'
            ],
            codeSnippet: {
              title: '通用冷却 GE：重写 ApplyCooldown',
              code: `void UMyGameplayAbility::ApplyCooldown(const FGameplayAbilitySpecHandle Handle, const FGameplayAbilityActorInfo* ActorInfo, const FGameplayAbilityActivationInfo ActivationInfo) const {\n  if (UGameplayEffect* CooldownGE = GetCooldownGameplayEffect()) {\n    FGameplayEffectSpecHandle SpecHandle = MakeOutgoingGameplayEffectSpec(CooldownGE->GetClass(), GetAbilityLevel());\n    SpecHandle.Data->DynamicGrantedTags.AppendTags(CooldownTags); // 每个技能自己的冷却标签\n    SpecHandle.Data->SetSetByCallerMagnitude(TAG_Data_Cooldown, CooldownDuration.GetValueAtLevel(GetAbilityLevel()));\n    ApplyGameplayEffectSpecToOwner(Handle, ActorInfo, ActivationInfo, SpecHandle);\n  }\n}`
            },
            callout: {
              kind: 'tip',
              label: '别忘了 GetCooldownTags',
              text: '只重写 ApplyCooldown 而不重写 GetCooldownTags，CheckCooldown 拿不到你的动态冷却标签，技能会在冷却中被重复释放。'
            },
            hud: [
              { key: 'ge_count', label: '冷却 GE 资产数', value: '1 个通用模板', status: 'good' },
              { key: 'override', label: '必须重写', value: 'GetCooldownTags + ApplyCooldown', status: 'warn' }
            ],
            scene: {
              nodes: [
                { id: 'ga', col: -1.9, row: 0, color: 'blue', icon: 'ga', label: 'CommitAbility()', sublabel: 'Cost + Cooldown' },
                { id: 'ge', col: 0.1, row: 0, color: 'amber', icon: 'ge', label: 'GE_Cooldown_Generic', sublabel: 'SetByCaller 时长 + 动态标签', state: 'active' },
                { id: 'asc', col: 2, row: 0, color: 'green', icon: 'tag', label: 'Cooldown.Skill.Fireball', sublabel: 'CheckCooldown 查询此标签' }
              ],
              edges: [
                { id: 'cd1', from: 'ga', to: 'ge', packet: 'ge', label: 'ApplyCooldown()' },
                { id: 'cd2', from: 'ge', to: 'asc', packet: 'rep', label: 'DynamicGrantedTags', labelTone: 'green' }
              ]
            }
          }
        ]
      },
      {
        slug: 'ability-tasks',
        title: 'AbilityTask 异步编排与悬空回调防护',
        titleEn: 'AbilityTasks: Montage + GameplayEvent & C++ Safety Rules',
        summary: '用 PlayMontageAndWait + WaitGameplayEvent 编排动作连段，死守 ReadyForActivation 与委托安全守卫。',
        durationMin: 11,
        difficulty: '进阶',
        goals: [
          { id: 'g1', text: '掌握动画蒙太奇 + AnimNotify 发送 GameplayEvent 触发伤害的标准流水线', unlockAtStep: 2 },
          { id: 'g2', text: '绝不在 C++ 中漏写 Task->ReadyForActivation()', unlockAtStep: 3 },
          { id: 'g3', text: '编写自定义 AbilityTask 时必加 ShouldBroadcastAbilityTaskDelegates() 守卫', unlockAtStep: 4 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '裸 Timer 之祸',
            phase: 'PROBLEM',
            title: '为什么在技能里用 SetTimer 等前摇是一场灾难？',
            paragraphs: [
              '假设挥剑动画第 `0.4s` 刀刃砍中前方。如果在 `ActivateAbility` 里写 `GetWorld()->GetTimerManager().SetTimer(0.4f, DealDamage)`：万一第 `0.2s` 角色被敌人打断硬直取消了技能，到了第 `0.4s` 定时器照样触发——**角色躺在地上居然隔空砍出了伤害**！而且攻速 Buff 加快动画播放速率时，写死的 `0.4s` 完全对不上刀光帧！'
            ],
            hud: [
              { key: 'cancel_safe', label: '被打断自动清理', value: '裸 Timer 不会自动销毁!', status: 'bad' },
              { key: 'rate_sync', label: '攻速缩放同步', value: '秒数硬编码完全脱节', status: 'bad' }
            ],
            scene: {
              nodes: [
                { id: 'ga', col: -1.7, row: -0.5, color: 'red', icon: 'ga', label: 'GA_Slash (0.2s 被打断)', state: 'crashed' },
                { id: 'tmr', col: 1.4, row: 0.5, color: 'amber', icon: 'task', label: '裸 FTimerHandle (0.4s)', badge: { text: '躺在地上仍砍出伤害 ❌', tone: 'bad' } }
              ],
              edges: [
                { id: 'tm1', from: 'ga', to: 'tmr', packet: 'error', label: '生命周期脱钩失控!' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '黄金双任务组合',
            phase: 'SOLUTION',
            title: '动作游戏基石：PlayMontageAndWait + WaitGameplayEvent',
            paragraphs: [
              '`[[UAbilityTask|与所属 GameplayAbility 严密绑定生命周期的异步任务对象，EndAbility 时全部自动销毁]]` 与所属 GA 同生共死：一旦 `EndAbility` 被调用，名下所有挂起的 `AbilityTask` 瞬间自动清理！',
              '标准近战攻击由两个并发任务组成：\n1. **`PlayMontageAndWait` / `PlayAnimAndWait`（UE 5.8 内置）**：前者跨端同步播放蒙太奇；后者（`UAbilityTask_PlayAnimAndWait`）可直接传入原始 **`UAnimSequence*`** 以动态蒙太奇播放（支持 `SlotName`、`BlendIn/OutTime` 及 `OnBlendIn` 回调），省去为大量简单动作逐一创建蒙太奇资产的繁琐！\n2. **`WaitGameplayEvent`**：监听 `Event.Montage.HitFrame` 标签。美术在蒙太奇挥刀最猛那一帧放一个 `AnimNotify` 发送该标签事件，精准触发伤害结算！'
            ],
            callout: {
              kind: 'ue5',
              label: '技能外部监听怎么写？用 AbilityAsync_*！',
              text: 'AbilityTask 只能在 UGameplayAbility 内部使用；若需要在 UMG UI、PlayerController 或普通 Actor 蓝图中监听属性或标签变化，请使用引擎内置的 AbilityAsync 系列节点（UAbilityAsync_WaitAttributeChanged、WaitGameplayTagCountChanged、WaitGameplayEvent、WaitGameplayEffectApplied 等）！'
            },
            changes: [
              { op: 'add', text: 'PlayMontageAndWait 托管动画播放与打断自动收尾' },
              { op: 'add', text: 'WaitGameplayEvent 响应动画帧事件，天然随攻速伸缩对齐' }
            ],
            hud: [
              { key: 'lifecycle', label: '生命周期安全', value: '随 EndAbility 自动销毁', status: 'good' },
              { key: 'atk_spd', label: '2.0x 攻速自适应', value: 'AnimNotify 帧级精准对齐', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'ga', col: -2, row: 0, color: 'blue', icon: 'ga', label: 'GA_Slash', state: 'active' },
                { id: 't1', col: 0.2, row: -1, color: 'green', icon: 'task', label: 'PlayMontageAndWait', sublabel: '播放动画 + 打断收尾' },
                { id: 't2', col: 0.2, row: 1, color: 'violet', icon: 'task', label: 'WaitGameplayEvent', sublabel: '监听 Event.HitFrame' },
                { id: 'dmg', col: 2.2, row: 0.6, color: 'amber', icon: 'sword', label: '精准帧伤害结算', size: 'sm' }
              ],
              edges: [
                { id: 'at1', from: 'ga', to: 't1', packet: 'predict' },
                { id: 'at2', from: 'ga', to: 't2', packet: 'predict' },
                { id: 'at3', from: 't2', to: 'dmg', packet: 'ge', label: '刀刃帧触发', labelTone: 'amber' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: 'ReadyForActivation',
            phase: 'PITFALL',
            title: 'C++ 头号哑巴 Bug：建好了 Task 却忘了 ReadyForActivation()！',
            paragraphs: [
              '在蓝图里拖出一个 `PlayMontageAndWait` 节点时，蓝图编译器在幕后悄悄帮你生成了启动代码。但在 C++ 中调用静态工厂函数创建完 Task 并绑好 `AddDynamic` 委托后，**如果不写最后一行 `Task->ReadyForActivation()`，这个任务永远处于休眠态，一行报错都没有**！'
            ],
            codeSnippet: {
              title: 'C++ 启动 AbilityTask 必背三步曲',
              code: `// 1. 静态工厂创建实例\nauto* Task = UAbilityTask_PlayMontageAndWait::CreatePlayMontageAndWaitProxy(\n  this, NAME_None, SlashMontage, AttackSpeed);\n// 2. 先绑定全部输出委托（防止 Activate 同步瞬间完成错过回调!）\nTask->OnCompleted.AddDynamic(this, &UGA_Slash::OnMontageFinished);\nTask->OnInterrupted.AddDynamic(this, &UGA_Slash::OnMontageCancelled);\nTask->OnCancelled.AddDynamic(this, &UGA_Slash::OnMontageCancelled);\n// 3. 铁律：最后调用 ReadyForActivation() 正式点火！\nTask->ReadyForActivation();`
            },
            callout: {
              kind: 'tip',
              label: '为什么必须“先绑委托、再调 ReadyForActivation”？',
              text: '某些 AbilityTask（例如目标已就绪的 WaitTargetData 或 0 秒任务）在 Activate() 内部第一帧就会同步广播完成委托；若先启动再绑委托，你将永远收不到这次回调！'
            },
            hud: [
              { key: 'order', label: '严格调用顺序', value: 'Create → Bind → ReadyForActivation', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'c1', col: -1.9, row: 0, color: 'sand', icon: 'code', label: '1. CreateProxy()', size: 'sm' },
                { id: 'c2', col: 0, row: 0, color: 'blue', icon: 'code', label: '2. Bind Delegates', size: 'sm' },
                { id: 'c3', col: 1.9, row: 0, color: 'green', icon: 'task', label: '3. ReadyForActivation()', state: 'active', badge: { text: '正式点火运行!', tone: 'good' } }
              ],
              edges: [
                { id: 'rf1', from: 'c1', to: 'c2', packet: 'input' },
                { id: 'rf2', from: 'c2', to: 'c3', packet: 'rep' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: '自定义 Task 铁律',
            phase: 'TECHNIQUE',
            title: '编写自定义 UAbilityTask：广播前必查 ShouldBroadcast！',
            paragraphs: [
              '当你自己继承 `UAbilityTask` 编写诸如“每帧平滑转向锁定目标”或“异步射线蓄力”任务时，必须遵守引擎源码的黄金守卫规范：',
              '在触发任何 `UPROPERTY(BlueprintAssignable)` 委托前，**必须包裹在 `if (ShouldBroadcastAbilityTaskDelegates())` 判断内**！一旦某条委托里调用了 `EndAbility()`，后续紧接着的委托若不加此判断继续广播，就会在已经结束的僵尸技能上引发重入崩溃！任务使命达成后务必调用 `EndTask()`。'
            ],
            codeSnippet: {
              title: '自定义 AbilityTask 标准广播守卫',
              code: `void UMyAbilityTask_DashTo::OnArrival() {\n  if (ShouldBroadcastAbilityTaskDelegates()) {\n    OnReachedTarget.Broadcast();\n  }\n  EndTask();\n}`
            },
            hud: [
              { key: 'guard', label: '广播前置守卫', value: 'ShouldBroadcastAbilityTaskDelegates()', status: 'good' },
              { key: 'clean', label: '任务自毁收尾', value: 'EndTask() + OnDestroy()', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'task', col: -1.6, row: 0, color: 'violet', icon: 'task', label: 'Custom UAbilityTask', sublabel: '异步条件达成' },
                { id: 'chk', col: 0.3, row: 0, color: 'green', icon: 'shield', label: 'ShouldBroadcast()?', sublabel: '检查 Ability 仍处于 Active', state: 'active' },
                { id: 'out', col: 2.1, row: 0, color: 'blue', icon: 'ga', label: '安全广播 & EndTask()', size: 'sm' }
              ],
              edges: [
                { id: 'sb1', from: 'task', to: 'chk', packet: 'predict' },
                { id: 'sb2', from: 'chk', to: 'out', packet: 'rep', label: 'true 放行', labelTone: 'green' }
              ]
            }
          }
        ]
      },
      {
        slug: 'target-data',
        title: '目标选取与 TargetData 跨端防作弊校验',
        titleEn: 'TargetData Handles, Replication & Server Validation',
        summary: '通过 FGameplayAbilityTargetDataHandle 上传客户端准星与地板选圈数据，守住服务端反外挂防线。',
        durationMin: 10,
        difficulty: '进阶',
        goals: [
          { id: 'g1', text: '理解为什么地面选圈或摄像机准星射线需要从客户端上传 TargetData', unlockAtStep: 1 },
          { id: 'g2', text: '掌握 FGameplayAbilityTargetDataHandle 多态序列化机制', unlockAtStep: 2 },
          { id: 'g3', text: '在服务端接收 TargetData 时实施严格的距离、视野与冷却二次校验', unlockAtStep: 3 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '准星在客户端',
            phase: 'PROBLEM',
            title: '暴风雪砸地板：服务器怎么知道玩家鼠标指着哪里？',
            paragraphs: [
              '在第三人称射击或 MOBA 选圈施法中，摄像机屏幕射线 (`DeprojectScreenPositionToWorld`) 和准星微调发生在**玩家客户端本地**。如果每帧把鼠标坐标同步给服务器浪费带宽，只在开火或确认落点那一刻把命中信息打包上传才是正道。',
              'GAS 为此专门设计了支持网络多态序列化的标准信封：**`FGameplayAbilityTargetDataHandle`**！'
            ],
            hud: [
              { key: 'aim_src', label: '摄像机瞄准源头', value: 'Owning Client 本地计算', status: 'neutral' },
              { key: 'carrier', label: '跨网传输载体', value: 'FGameplayAbilityTargetDataHandle', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'cam', col: -1.8, row: 0.4, color: 'blue', icon: 'client', label: '客户端准星射线', sublabel: 'LineTrace 命中坐标/骨骼' },
                { id: 'td', col: 0.2, row: -0.2, color: 'violet', icon: 'code', label: 'TargetDataHandle', sublabel: '多态序列化信封', state: 'active' },
                { id: 'srv', col: 2, row: -0.6, color: 'green', icon: 'server', label: 'Server GA 实例', sublabel: '接收并权威结算' }
              ],
              edges: [
                { id: 'td1', from: 'cam', to: 'td', packet: 'input' },
                { id: 'td2', from: 'td', to: 'srv', packet: 'rpc', label: 'ServerSetReplicatedTargetData' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '多态数据结构',
            phase: 'TECHNIQUE',
            title: '内置三大 TargetData 子类与自定义扩展',
            paragraphs: [
              '`FGameplayAbilityTargetDataHandle` 内部持有一个 `TArray<TSharedPtr<FGameplayAbilityTargetData>>` 数组，引擎开箱自带三种常用载荷：\n• `SingleTargetHit`：包装完整的 `FHitResult`（命中 Actor、撞击点、法线、命中骨骼名如 `head` 爆头判定！）；\n• `ActorArray`：AOE 扇形扫描命中的多个目标弱指针列表；\n• `LocationInfo`：起点与终点变换（如传送门两端坐标）。',
              '若需附带自定义数据（如蓄力完美时机标记），只需派生 `FGameplayAbilityTargetData` 并重写 `NetSerialize` 与 `GetScriptStruct()`！'
            ],
            hud: [
              { key: 'hit', label: 'SingleTargetHit', value: '携带完整 FHitResult', status: 'good' },
              { key: 'aoe', label: 'ActorArray', value: '多目标弱指针数组', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'h', col: -1.7, row: 0, color: 'violet', icon: 'code', label: 'TargetDataHandle', state: 'active' },
                { id: 's1', col: 1.4, row: -1.2, color: 'amber', icon: 'sword', label: 'SingleTargetHit', sublabel: 'FHitResult (含爆头骨骼)', size: 'sm' },
                { id: 's2', col: 1.6, row: 0.1, color: 'blue', icon: 'users', label: 'ActorArray', sublabel: 'AOE 多个受击目标', size: 'sm' },
                { id: 's3', col: 1.4, row: 1.4, color: 'teal', icon: 'pawn', label: 'LocationInfo', sublabel: '地面落点 Transform', size: 'sm' }
              ],
              edges: [
                { id: 'p1', from: 'h', to: 's1', packet: 'predict' },
                { id: 'p2', from: 'h', to: 's2', packet: 'predict' },
                { id: 'p3', from: 'h', to: 's3', packet: 'predict' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: '服务端防外挂',
            phase: 'PITFALL',
            title: '铁血安全红线：TargetData 多维权威验真与缓存清理职责',
            paragraphs: [
              '作弊端不仅能伪造超远穿墙坐标，还能在距离合法的前提下**虚报命中的目标 Actor / 爆头骨骼名**，甚至在一次激活中高频刷发十几个 `TargetData` 包！注意：`ASC->ConsumeClientReplicatedTargetData(Handle, ActivationPredictionKey)` **仅仅是清空 `FAbilityReplicatedDataCache` 里的已缓存数据以防下次误读旧包**，它本身绝不是反作弊手段！',
              '真正的服务端权威验真必须层层设卡：\n1. **绑定本次激活与出手窗口**：核对当前 `AbilitySpecHandle` 与预测窗口、校验射速间隔/冷却状态，并在单次出手消费后立即拒绝同一窗口的重复请求；\n2. **服务端独立确认命中目标**：不仅检验施法距离与防穿墙遮挡，还应由服务端沿着受约束射线/扫掠体（或历史回溯包围盒）亲自确认是否真的擦碰了客户端声称的受击 Actor 与部位骨骼！'
            ],
            callout: {
              kind: 'warn',
              label: '竞技射击与网游安全底线',
              text: '客户端上传 TargetData 只是为了上报本地准星意图；ConsumeClientReplicatedTargetData 负责清缓存，而“这发请求在不在合法开火窗口、到底有没有打中这个人的头”，裁判权必须 100% 由服务端重新核验！'
            },
            hud: [
              { key: 'cheat', label: '伪造目标/高频刷包', value: '窗口频控 + 服务端重判拦截!', status: 'good' },
              { key: 'clean', label: 'ConsumeClientTargetData', value: '仅清理 ReplicatedDataCache', status: 'warn' }
            ],
            scene: {
              nodes: [
                { id: 'hack', col: -2, row: 0, color: 'red', icon: 'client', label: '篡改客户端请求', sublabel: '伪造受击者/部位或刷包', size: 'sm' },
                {
                  id: 'chk',
                  col: 0.2,
                  row: 0,
                  color: 'green',
                  icon: 'shield',
                  label: 'Server 权威验真网关',
                  sublabel: '激活窗口/频控 + 服务端确认命中',
                  state: 'active',
                  size: 'lg',
                  badge: { text: '拦截伪造命中与重放 ✅', tone: 'good' }
                },
                { id: 'victim', col: 2.2, row: 0, color: 'blue', icon: 'pawn', label: '远端正常玩家', sublabel: '毫发无损', size: 'sm' }
              ],
              edges: [
                { id: 'v1', from: 'hack', to: 'chk', packet: 'error', label: '伪造 TargetData' },
                { id: 'v2', from: 'chk', to: 'victim', style: 'dashed', packet: 'none', label: '已丢弃' }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mod-networking',
    indexLabel: '06. 网络预测与调优',
    title: '06. 网络预测与调优',
    titleEn: '06. Prediction & Networking',
    folderColor: 'teal',
    lessons: [
      {
        slug: 'client-prediction',
        title: '客户端预测窗口、FPredictionKey 与回滚',
        titleEn: 'Client-Side Prediction, PredictionKeys & Rollback',
        summary: '揭秘 GAS 皇冠上的明珠：如何在 100ms 延迟下实现零延迟施法手感，并在冲突时自动无痕回滚。',
        durationMin: 14,
        difficulty: '高阶',
        goals: [
          { id: 'g1', text: '掌握 LocalPredicted / ServerInitiated / ServerOnly / LocalOnly 四种网络执行策略', unlockAtStep: 1 },
          { id: 'g2', text: '跟踪 FPredictionKey 从本地签发、服务端回传确认到核销的完整闭环', unlockAtStep: 2 },
          { id: 'g3', text: '看懂服务端拒绝激活时，客户端如何凭 PredictionKey 自动回滚动画与属性', unlockAtStep: 3 },
          { id: 'g4', text: '明确 GAS 客户端预测的能力边界（什么能预测、什么绝对不能预测）', unlockAtStep: 4 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '四大执行策略',
            phase: 'ARCHITECTURE',
            title: 'NetExecutionPolicy：决定技能在谁的机器上先跑',
            paragraphs: [
              '每个 `UGameplayAbility` 通过 `NetExecutionPolicy` 定义跨端启动顺序：\n• **`LocalPredicted`（主角主动技能绝对主力）**：客户端按下瞬间**不等服务器**立即先行跑一遍，同时发 RPC 请服务器权威跑一遍！\n• **`ServerInitiated`**：服务器先启动，再通知客户端跟着跑（适用于被动触发技、Boss 投技）。\n• **`ServerOnly`**：仅在服务器运行（纯后台结算）。\n• **`LocalOnly`**：仅在本地客户端运行（如打开本地技能轮盘镜头特写，严禁改权威属性）。',
              '配套的安全围栏是 **`NetSecurityPolicy`**：`ClientOrServer`（默认）、`ServerOnlyExecution`（客户端请求执行会被服务端忽略）、`ServerOnlyTermination`（客户端无权取消/结束）、`ServerOnly`（两者兼有）。对“只能由服务端触发”或“不可被客户端中断”的技能（如受击硬直、处决），务必收紧该策略，防止篡改客户端伪造请求。'
            ],
            hud: [
              { key: 'hero', label: '玩家主动施法', value: 'LocalPredicted (0ms 手感)', status: 'good' },
              { key: 'passive', label: '服务端触发技', value: 'ServerInitiated', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'lp', col: -1.6, row: -0.6, color: 'green', icon: 'ga', label: 'LocalPredicted', sublabel: 'Client 先跑 + Server 仲裁', state: 'active', size: 'lg' },
                { id: 'si', col: 1.6, row: -0.8, color: 'blue', icon: 'server', label: 'ServerInitiated', sublabel: 'Server 启动 → 同步 Client', size: 'sm' },
                { id: 'so', col: 1.6, row: 1, color: 'amber', icon: 'shield', label: 'ServerOnly / LocalOnly', sublabel: '单端专用策略', size: 'sm' }
              ],
              edges: [
                { id: 'ne1', from: 'lp', to: 'si', style: 'dashed', packet: 'none' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '预测确认与追赶',
            phase: 'TECHNIQUE',
            title: 'FPredictionKey 双轨时序：RPC 确认激活 vs 属性复制追赶清理',
            paragraphs: [
              '当客户端预测激活技能时，本地开启初始 `[[FScopedPredictionWindow|作用域预测窗口：初始激活窗口仅覆盖同步 ActivateAbility 调用栈；跨异步任务节点后若还需预测，必须借由支持同步点（如 WaitInputPress / WaitTargetData）协商生成新的同步预测窗口]]` 并签发编号（如 `Key #42`）——注意**初始预测窗口仅限于同步激活调用栈**，一旦跨过异步等待（如 `WaitDelay`），没有新同步点就不再拥有有效预测密钥！',
              '服务端收到 `ServerTryActivateAbility(..., Key #42)` 后，回程其实是**两条独立异步轨道**（而非同一事件）：\n1. **激活结果 RPC（`ClientActivateAbilitySucceed`）**：约 1 个 RTT 即通知客户端“激活获批”；\n2. **状态复制追赶（`ReplicatedPredictionKeyMap` → `CatchUpTo`）**：等到权威 `ActiveGE`、属性与复制的 `PredictionKey #42` 经属性同步追上客户端后，才触发 `CatchUpTo` 精准撤掉 `#42` 关联的临时预测效果，避免在权威状态到达前提前撤掉造成闪烁跳变！'
            ],
            changes: [
              { op: 'add', text: 'Client 同步激活栈内签发 Key #42，零延迟播蒙太奇 + 挂临时预测 GE' },
              { op: 'add', text: '先收 Succeed RPC 确认激活，待 ReplicatedPredictionKey 追上后再 CatchUpTo 清理预测态' }
            ],
            hud: [
              { key: 'win_scope', label: '初始预测窗口范围', value: '仅限同步激活调用栈', status: 'warn' },
              { key: 'ack_rpc', label: '1. 激活确认 (RPC)', value: 'ClientActivateAbilitySucceed', status: 'good' },
              { key: 'catch_up', label: '2. 临时态清理时机', value: 'ReplicatedKey 追上后 CatchUpTo', status: 'good' }
            ],
            scene: {
              nodes: [
                {
                  id: 'cli',
                  col: -1.8,
                  row: 0.4,
                  color: 'violet',
                  icon: 'client',
                  label: 'Client 初始预测窗口',
                  sublabel: '同步栈内签发 Key #42',
                  state: 'predicted',
                  badge: { text: '0ms 即刻起手!', tone: 'good' }
                },
                {
                  id: 'srv',
                  col: 1.7,
                  row: -0.4,
                  color: 'green',
                  icon: 'server',
                  label: 'Dedicated Server',
                  sublabel: 'Succeed RPC + 属性复制双轨回传',
                  state: 'active'
                }
              ],
              edges: [
                { id: 'pk1', from: 'cli', to: 'srv', packet: 'rpc', label: 'ServerTryActivate (Key #42)' },
                { id: 'pk2', from: 'srv', to: 'cli', packet: 'rep', label: 'Succeed RPC → ReplicatedKey CatchUpTo', labelTone: 'green' }
              ],
              legend: [
                { type: 'rpc', label: '预测激活与确认 RPC 轨道' },
                { type: 'rep', label: '权威状态与 PredictionKey 复制追赶轨道' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: '拒绝与回滚边界',
            phase: 'SOLUTION',
            title: '服务端说“不”时：GAS 自动回滚账本与项目自理边界',
            paragraphs: [
              '极端竞态发生了：客户端在 `t=100ms` 按下闪现，本地预扣了 50 蓝并挂上预测加速 GE（`Key #43`）；然而服务器早在 `t=85ms` 就判定角色处于 `State.Rooted` 禁锢中！',
              '服务器收到请求后立即下发 `ClientActivateAbilityFailed(Handle, #43)` RPC（不受低频属性复制拖慢）。客户端收到拒绝回执后，**自动撤销登记在 `#43` 账本上的预测 `ActiveGE`、退回 50 蓝预测修改器、打断 `PlayMontageAndWait` 蒙太奇并移除持续型预测 `GameplayCue`**！但务必清醒：**已经播出口的一次性瞬发音效/粒子、手写的自定义成员变量或自行生成的本地临时 Actor 无法被引擎自动倒带**，需要项目在 `EndAbility` / 技能取消回调中自行兜底清理！'
            ],
            callout: {
              kind: 'insight',
              label: '自动回滚的范围边界',
              text: 'GAS 只会自动回滚绑定在 FPredictionKey 上的预测 GE/属性修饰、蒙太奇与持续型 Cue（触发 OnRemove）；对于不可撤回的重音效、自行 Spawn 的本地表现物或自定义状态位，请延后到确认点或手动绑定 Rejected 回调清理。'
            },
            hud: [
              { key: 'srv_res', label: 'Server 拒绝通道', value: 'ClientActivateAbilityFailed RPC', status: 'warn' },
              { key: 'rollback', label: 'GAS 账本内预测项', value: 'GE / 蓝耗 / 蒙太奇 / 持续Cue 回滚', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'srv', col: -1.7, row: -0.5, color: 'red', icon: 'server', label: 'Server 仲裁拒绝', sublabel: '检测到 State.Rooted' },
                {
                  id: 'cli',
                  col: 1.5,
                  row: 0.4,
                  color: 'green',
                  icon: 'asc',
                  label: 'Client 回滚预测账本',
                  sublabel: '撤 GE/蓝耗/蒙太奇 (自定状态需自清)',
                  state: 'active',
                  badge: { text: '账本内状态自动恢复 ✅', tone: 'good' }
                }
              ],
              edges: [
                { id: 'rb1', from: 'srv', to: 'cli', packet: 'error', label: 'ClientActivateAbilityFailed(#43)', labelTone: 'red' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: '预测边界清单',
            phase: 'PITFALL',
            title: '清醒认知：什么能预测，什么绝对不能在客户端预测？',
            paragraphs: [
              '客户端预测不是万能魔法，设计技能时必须严守这张**预测能力红绿灯清单**：\n✅ **原生完美预测**：蒙太奇播放、Cost/Cooldown、普通 GE 修改器与 MMC、GE 赋予的 GameplayTags、GameplayCues、结合 `CharacterMovementComponent` 的根运动/冲刺速度。',
              '❌ **严禁/无法预测**：\n1. **`SpawnActor` 生成真实联网投射物**（必须在 `if (HasAuthority())` 分支生成，客户端只用 GameplayCue 播枪口焰或假视觉弹道）；\n2. **`ExecCalc` 复杂暴击伤害与移除早已存在的权威 GE**；\n3. **随机逻辑若未对齐预测种子**。'
            ],
            hud: [
              { key: 'can', label: '动画 / Cost / MMC / Cue', value: '原生支持预测 ✅', status: 'good' },
              { key: 'cannot', label: 'SpawnActor / ExecCalc', value: '仅限 Server 权威执行!', status: 'warn' }
            ],
            scene: {
              nodes: [
                { id: 'ok', col: -1.5, row: 0, color: 'green', icon: 'cue', label: '可预测安全区', sublabel: 'Montage · GE · Tag · Cue', state: 'active' },
                { id: 'no', col: 1.6, row: 0, color: 'red', icon: 'server', label: 'Server 权威专属区', sublabel: 'SpawnActor · ExecCalc · 判死' }
              ],
              edges: [
                { id: 'bd1', from: 'ok', to: 'no', style: 'dashed', packet: 'rpc', label: 'HasAuthority() 严格分流' }
              ],
              inspectCard: {
                title: 'PREDICTION CHECKLIST',
                rows: [
                  { left: 'PlayMontage / Cue', right: '可预测 ✅', highlight: 'green' },
                  { left: 'Cost / Cooldown / MMC', right: '可预测 ✅', highlight: 'green' },
                  { left: 'ExecCalc 伤害结算', right: '仅 Server ❌', highlight: 'red' },
                  { left: 'SpawnActor 联网飞弹', right: '仅 Server ❌', highlight: 'red' }
                ]
              }
            }
          }
        ]
      },
      {
        slug: 'network-optimization',
        title: '高并发射击秘籍：RPC 批量合并与子对象复制',
        titleEn: 'FScopedServerAbilityRPCBatcher & SubObject Replication',
        summary: '掌握瞬发 Hitscan 技能单帧合并 RPC 的底层契约，启用 UE5 新一代注册子对象复制列表。',
        durationMin: 10,
        difficulty: '高阶',
        goals: [
          { id: 'g1', text: '牢记绝不开启 GameplayAbility 自身对象复制的官方铁律', unlockAtStep: 1 },
          { id: 'g2', text: '掌握 ShouldDoServerAbilityRPCBatch 与 FScopedServerAbilityRPCBatcher 合批条件', unlockAtStep: 2 },
          { id: 'g3', text: '了解 UE 5.1+ bReplicateUsingRegisteredSubObjectList 子对象同步优化', unlockAtStep: 3 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '禁复制 GA',
            phase: 'PITFALL',
            title: '官方建议：不要开启 GameplayAbility 的 ReplicationPolicy！',
            paragraphs: [
              '看到 `UGameplayAbility` 里有个旧属性 `ReplicationPolicy`，千万别手痒把它改成 `ReplicateYes`！Epic 官方与社区文档（如 GASDocumentation）一致建议**不要复制 GA 实例**；UE 5.5 废弃 `NonInstanced` 时也一并强调不要依赖 GA 上的复制属性（其复制时机与激活 RPC 之间没有顺序保证）。',
              '原因在于：技能激活、TargetData 上传与预测同步全部由 **ASC 组件自身的 RPC 通道**统一调度，给每个 GA 子对象单独建网络通道既昂贵又会破坏预测时序。'
            ],
            hud: [
              { key: 'ga_rep', label: 'Replicate Ability 实例', value: '官方不建议开启 ❌', status: 'bad' },
              { key: 'asc_rpc', label: '正确通信机制', value: '统一走 ASC 内置 RPC', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'bad', col: -1.6, row: 0, color: 'red', icon: 'ga', label: 'ReplicateYes (不建议)', state: 'crashed', size: 'sm' },
                { id: 'asc', col: 1.4, row: 0, color: 'green', icon: 'asc', label: 'ASC 统一调度通道', sublabel: '轻量 · 预测安全', state: 'active', size: 'lg' }
              ],
              edges: [
                { id: 'no1', from: 'bad', to: 'asc', packet: 'rep', label: '由 ASC 接管全部跨网通信' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '批量 RPC 合批',
            phase: 'SOLUTION',
            title: '瞬发 Hitscan 合批利器：FScopedServerAbilityRPCBatcher',
            paragraphs: [
              '考虑一把单帧即开即束的即时命中武器（如 Fortnite / GASShooter 瞬发 Hitscan 模式）：若不合批，同一帧内会连发 **3 个独立 Server RPC**：`CallServerTryActivateAbility`、`CallServerSetReplicatedTargetData` 与 `ServerEndAbility`！（注：**Lyra 5.5 原版 `GA_Weapon_Fire` 会等待射速间隔 Fire Delay 后才结束**，因此它不会把 `EndAbility` 塞进起手同一帧，切勿混为一谈。）',
              '若想实现单帧合批，必须在自定义 ASC 中重写 **`ShouldDoServerAbilityRPCBatch() const { return true; }`**，并让激活、同步上传 `TargetData` 与结束调用全部走支持合批的 ASC 接口且**严格落在同一个 `FScopedServerAbilityRPCBatcher` 作用域内**——退出作用域时引擎会自动打包为单次 **`ServerAbilityRPCBatch(FServerAbilityRPCBatch)`** 发出！'
            ],
            codeSnippet: {
              title: 'C++ 单帧瞬发技能 RPC 合批封装 (需重写 ShouldDoServerAbilityRPCBatch 返回 true)',
              code: `bool UMyASC::BatchRPCTryActivateAbility(FGameplayAbilitySpecHandle Handle, bool bEndAbilityImmediately) {
  FScopedServerAbilityRPCBatcher Batcher(this, Handle); // 作用域开始拦截合批调用
  const bool bActivated = TryActivateAbility(Handle, true); // 内部 ActivateAbility 同步调用 CallServerSetReplicatedTargetData
  if (bEndAbilityImmediately) {
    if (FGameplayAbilitySpec* Spec = FindAbilitySpecFromHandle(Handle); Spec && Spec->IsActive()) {
      // 必须在同一 Batcher 作用域内显式结束主实例（需在自定义 GA 暴露 ExternalEndAbility 封装 EndAbility）
      if (UMyGameplayAbility* GA = Cast<UMyGameplayAbility>(Spec->GetPrimaryInstance())) { GA->ExternalEndAbility(); }
    }
  }
  return bActivated; // Batcher 析构，合并发送单条 ServerAbilityRPCBatch!
}`
            },
            hud: [
              { key: 'switch', label: 'ASC 开启虚函数', value: 'ShouldDoServerAbilityRPCBatch()', status: 'good' },
              { key: 'rpc', label: '合并后底层 RPC', value: 'ServerAbilityRPCBatch (同作用域)', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 's1', col: -2, row: -1.1, color: 'blue', icon: 'ga', label: '1. TryActivate', size: 'sm' },
                { id: 's2', col: -2, row: 0.1, color: 'violet', icon: 'code', label: '2. SendTargetData', size: 'sm' },
                { id: 's3', col: -2, row: 1.3, color: 'teal', icon: 'task', label: '3. EndAbility', size: 'sm' },
                {
                  id: 'batch',
                  col: 0.5,
                  row: 0.1,
                  color: 'green',
                  icon: 'asc',
                  label: 'FServerAbilityRPCBatch',
                  sublabel: '单帧合并打包',
                  state: 'active'
                },
                { id: 'srv', col: 2.3, row: 0.1, color: 'amber', icon: 'server', label: 'Server 一次解包执行', size: 'sm' }
              ],
              edges: [
                { id: 'b1', from: 's1', to: 'batch', packet: 'input' },
                { id: 'b2', from: 's2', to: 'batch', packet: 'input' },
                { id: 'b3', from: 's3', to: 'batch', packet: 'input' },
                { id: 'b4', from: 'batch', to: 'srv', packet: 'rpc', label: '1 次 RPC 搞定!', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: '子对象列表与 Iris',
            phase: 'UE5_NEW',
            title: 'UE 5.8 子对象复制列表与 GAS × Iris 序列化管线',
            paragraphs: [
              '对于动态挂载到 ASC 的新 `UAttributeSet`（例如捡起能量武器动态挂载 `UWeaponAmmoAttributeSet`），UE5 提供了 Actor 级开关 `bReplicateUsingRegisteredSubObjectList = true` 的**注册式子对象复制列表**（**Iris** 下一代复制系统强制依赖它）。ASC 调用 `AddAttributeSetSubobject(NewSet)`（Outer 为 `ASC->GetOwner()`）会自动 `AddReplicatedSubObject`，卸载时用 `RemoveSpawnedAttribute` 移出，彻底告别每帧虚函数 `ReplicateSubobjects()` 轮询。',
              '在 **UE 5.8** 中，`GameplayAbilities` 已内置完整的 **Iris `Serialization/` NetSerializer 套件**：包括 `FGameplayTagCountContainerNetSerializer`（由 `CVarReplicateTagCountContainerWithIris` 控制新版标签容器复制）、`FGameplayEffectContextHandleNetSerializer`、`FGameplayAbilityTargetDataHandleNetSerializer` 与 `FMinimalGameplayCueReplicationProxyNetSerializer`。若项目开启 Iris 并自定义派生了 `FGameplayEffectContext` 或 `FGameplayAbilityTargetData`，引擎会通过多态结构体序列化缓存（`TPolymorphicStructNetSerializerImpl`）自动识别或按需注册自定义 NetSerializer！'
            ],
            hud: [
              { key: 'flag', label: 'UE5 子对象复制模式', value: 'RegisteredSubObjectList', status: 'good' },
              { key: 'iris', label: 'UE 5.8 Iris 适配', value: 'TagCount / Context / TargetData 全套 Serializer', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'asc', col: -1.4, row: 0, color: 'green', icon: 'asc', label: 'ASC (SubObjectList)', state: 'active' },
                { id: 'set', col: 1.5, row: 0, shape: 'cylinder', color: 'blue', icon: 'attr', label: '动态挂载 AttributeSet', sublabel: '事件驱动按需复制 · 零轮询' }
              ],
              edges: [
                { id: 'so1', from: 'asc', to: 'set', packet: 'rep', label: 'AddReplicatedSubObject', labelTone: 'green' }
              ]
            }
          }
        ]
      }
    ]
  }
];
