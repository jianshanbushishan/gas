import { ModuleData } from '../types/course';

export const MODULES_3_TO_4: ModuleData[] = [
  {
    id: 'mod-attributes',
    indexLabel: '03. 属性与数值集',
    title: '03. 属性与数值集',
    titleEn: '03. Attributes & AttributeSet',
    folderColor: 'green',
    lessons: [
      {
        slug: 'base-vs-current',
        title: 'BaseValue 与 CurrentValue 双轨模型及复制宏',
        titleEn: 'FGameplayAttributeData: BaseValue, CurrentValue & Replication',
        summary: '拆解 FGameplayAttributeData 双浮点数设计，理解为什么属性同步必须搭配 REPNOTIFY_Always。',
        durationMin: 11,
        difficulty: '入门',
        goals: [
          { id: 'g1', text: '分清 BaseValue（永久底数）与 CurrentValue（聚合当前值）', unlockAtStep: 2 },
          { id: 'g2', text: '掌握 ATTRIBUTE_ACCESSORS 宏生成的四个标准访问器', unlockAtStep: 3 },
          { id: 'g3', text: '理解为什么属性复制必须使用 REPNOTIFY_Always 与 GAMEPLAYATTRIBUTE_REPNOTIFY', unlockAtStep: 4 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: 'Buff 还原难',
            phase: 'PROBLEM',
            title: '单浮点数之痛：临时移速 Buff 结束后怎么无损还原？',
            paragraphs: [
              '如果用单个 `float MoveSpeed = 600.f` 存属性：角色踩上加速阵 `+20%` 变成 `720.f`；期间又升级永久加了 `+50` 基础移速变成 `770.f`；此时加速阵结束——如果粗暴除以 `1.2`，移速变成了错误的 `641.67f`（多扣了基础升级部分），加上浮点误差多次叠加后面目全非！',
              '要彻底杜绝“Buff 拆卸算不回去”，必须把**永久底数**与**临时修饰计算值**在数据结构层彻底分家。'
            ],
            hud: [
              { key: 'single_float', label: '单 float 方案', value: '拆卸 Buff 产生累积误差!', status: 'bad' },
              { key: 'upgrade_mix', label: '临时与永久混算', value: '不可逆污染', status: 'bad' }
            ],
            scene: {
              nodes: [
                { id: 'buff', col: -1.9, row: -0.7, color: 'amber', icon: 'ge', label: '+20% 加速阵', size: 'sm' },
                { id: 'lvl', col: -1.9, row: 1.1, color: 'green', icon: 'ge', label: '+50 升级永久移速', size: 'sm' },
                {
                  id: 'bad',
                  col: 1.3,
                  row: 0.2,
                  color: 'red',
                  icon: 'attr',
                  label: 'float MoveSpeed',
                  sublabel: '770 / 1.2 = 641.67 ❌',
                  badge: { text: '应为 650.0 (算错了!)', tone: 'bad' }
                }
              ],
              edges: [
                { id: 'bv1', from: 'buff', to: 'bad', packet: 'error' },
                { id: 'bv2', from: 'lvl', to: 'bad', packet: 'input' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '双轨结构',
            phase: 'ARCHITECTURE',
            title: 'FGameplayAttributeData：BaseValue 与 CurrentValue',
            paragraphs: [
              'GAS 中每个属性都是 `[[FGameplayAttributeData|包含 BaseValue 与 CurrentValue 两个 float 的结构体，严禁裸写 float 作为 GAS 属性]]` 结构体，内部包含两个浮点数：\n• **`BaseValue`（基础值）**：由 `Instant`（瞬间）或 `Periodic`（周期跳）GE **永久改变**，例如基础生命上限、当前真实剩余血量、裸装攻击力。\n• **`CurrentValue`（当前值）**：等于 `BaseValue` 加上当前所有活跃 `Duration` / `Infinite` Buff 经由 `FAggregator` 实时重算出的最终值！',
              '一旦某个临时加速 Buff 到期移除，ASC 只需拿完好无损的 `BaseValue (650)` 重新跑一遍剩余活跃修改器，`CurrentValue` 瞬间精确回到 `650.0f`，零累积误差！'
            ],
            changes: [
              { op: 'add', text: 'BaseValue：承载永久变更（升级、扣血、吃永久属性书）' },
              { op: 'add', text: 'CurrentValue：由 FAggregator 基于 BaseValue + 活跃 Buff 动态重算' }
            ],
            hud: [
              { key: 'base', label: 'MoveSpeed.BaseValue', value: '600 → 650 (永久)', status: 'good' },
              { key: 'cur', label: 'MoveSpeed.CurrentValue', value: '780 → Buff结束 → 650', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'base', col: -1.6, row: 0, shape: 'cylinder', color: 'green', icon: 'attr', label: 'BaseValue: 650', sublabel: 'Instant GE 永久修改' },
                { id: 'agg', col: 0.2, row: -1, color: 'violet', icon: 'asc', label: 'FAggregator', sublabel: '活跃 Buff 修饰通道', state: 'active' },
                { id: 'cur', col: 1.9, row: 0.4, shape: 'cylinder', color: 'blue', icon: 'attr', label: 'CurrentValue: 780', sublabel: '移除 Buff 自动归 650', badge: { text: '零浮点残留误差', tone: 'good' } }
              ],
              edges: [
                { id: 'dc1', from: 'base', to: 'agg', packet: 'rep', label: '输入基准值' },
                { id: 'dc2', from: 'agg', to: 'cur', packet: 'ge', label: '实时聚合求值', labelTone: 'violet' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: '访问器宏',
            phase: 'TECHNIQUE',
            title: 'UAttributeSet 标准声明与 ATTRIBUTE_ACCESSORS 宏',
            paragraphs: [
              '在自定义 `UAttributeSet` 头文件中，我们通常会定义官方推荐的组合宏 `ATTRIBUTE_ACCESSORS(ClassName, PropertyName)`。',
              '一行宏自动为你生成四个高频工具函数：\n• `GetHealthAttribute()`（返回反射句柄供 GE/UI 监听绑定）\n• `GetHealth()`（读取 `CurrentValue`）\n• `SetHealth(float)`（通过 ASC 安全修改 `BaseValue`）\n• `InitHealth(float)`（初始化时同时设定 `BaseValue` 和 `CurrentValue`）'
            ],
            codeSnippet: {
              title: 'MyAttributeSet.h 标准宏定义',
              code: `#define ATTRIBUTE_ACCESSORS(ClassName, PropertyName) \\\n  GAMEPLAYATTRIBUTE_PROPERTY_GETTER(ClassName, PropertyName) \\\n  GAMEPLAYATTRIBUTE_VALUE_GETTER(PropertyName) \\\n  GAMEPLAYATTRIBUTE_VALUE_SETTER(PropertyName) \\\n  GAMEPLAYATTRIBUTE_VALUE_INITTER(PropertyName)\n\nUPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Health, Category = "Vital")\nFGameplayAttributeData Health;\nATTRIBUTE_ACCESSORS(UMyAttributeSet, Health)`
            },
            hud: [
              { key: 'getter', label: 'GetHealth()', value: '返回 CurrentValue', status: 'good' },
              { key: 'setter', label: 'SetHealth(Val)', value: '修改 BaseValue', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'macro', col: -1.6, row: 0, color: 'amber', icon: 'code', label: 'ATTRIBUTE_ACCESSORS', sublabel: '编译期展开 4 个方法' },
                { id: 'aset', col: 1.5, row: 0, shape: 'cylinder', color: 'green', icon: 'attr', label: 'UMyAttributeSet', sublabel: 'Health / MaxHealth / Mana', state: 'active' }
              ],
              edges: [
                { id: 'mc1', from: 'macro', to: 'aset', packet: 'rep', label: 'Property + Value Getter/Setter/Initter' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: '复制与预测',
            phase: 'PITFALL',
            title: '深水区细节：为什么必须是 REPNOTIFY_Always？',
            paragraphs: [
              '在 `GetLifetimeReplicatedProps` 注册属性复制时，普通 UE 变量常用 `DOREPLIFETIME`，但在 GAS 中**必须使用 `DOREPLIFETIME_CONDITION_NOTIFY(..., COND_None, REPNOTIFY_Always)`**，并在 `OnRep_Health` 中调用 `GAMEPLAYATTRIBUTE_REPNOTIFY`！',
              '原因直指客户端预测：假设客户端本地预测放技能把 `Mana` 从 `100` 扣到 `70`；100ms 后服务端权威扣完也是 `70` 并复制回来。如果不用 `REPNOTIFY_Always`，引擎发现收到的值与本地值相同时就**不会调用 `OnRep_Mana`**，`GAMEPLAYATTRIBUTE_REPNOTIFY` 也就没有机会把权威 BaseValue 同步进本地聚合器 (`SetBaseAttributeValueFromReplication`)——等这次预测的临时修改器按 PredictionKey 撤销后，客户端数值就可能回跳或与服务端长期失步！'
            ],
            codeSnippet: {
              title: 'MyAttributeSet.cpp 预测安全的属性复制',
              code: `void UMyAttributeSet::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const {\n  Super::GetLifetimeReplicatedProps(OutLifetimeProps);\n  DOREPLIFETIME_CONDITION_NOTIFY(UMyAttributeSet, Health, COND_None, REPNOTIFY_Always);\n}\nvoid UMyAttributeSet::OnRep_Health(const FGameplayAttributeData& OldHealth) {\n  GAMEPLAYATTRIBUTE_REPNOTIFY(UMyAttributeSet, Health, OldHealth);\n}`
            },
            callout: {
              kind: 'warn',
              label: '绝不可省的两行配对',
              text: 'REPNOTIFY_Always + GAMEPLAYATTRIBUTE_REPNOTIFY 是客户端预测数值闭环的命脉，漏写任何一个都可能在高延迟连发技能时造成客户端蓝条/血条回跳或失步。'
            },
            hud: [
              { key: 'cond', label: '通知策略', value: 'REPNOTIFY_Always', status: 'good' },
              { key: 'macro', label: 'OnRep 内部宏', value: 'GAMEPLAYATTRIBUTE_REPNOTIFY', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'cli_pred', col: -1.9, row: -0.6, color: 'violet', icon: 'client', label: 'Client 本地预测', sublabel: 'Mana 提前预扣为 70', state: 'predicted' },
                { id: 'srv_rep', col: 0, row: -0.9, color: 'green', icon: 'server', label: 'Server 权威下发', sublabel: 'Mana = 70 (同值下发)' },
                {
                  id: 'onrep',
                  col: 1.8,
                  row: 0.7,
                  color: 'blue',
                  icon: 'asc',
                  label: 'OnRep 强制触发',
                  sublabel: '权威 BaseValue 写入聚合器',
                  state: 'active',
                  badge: { text: '与服务端权威值对齐 ✅', tone: 'good' }
                }
              ],
              edges: [
                { id: 'rp1', from: 'cli_pred', to: 'onrep', packet: 'predict', style: 'dashed' },
                { id: 'rp2', from: 'srv_rep', to: 'onrep', packet: 'rep', label: 'REPNOTIFY_Always 强制进回调', labelTone: 'green' }
              ]
            }
          }
        ]
      },
      {
        slug: 'attribute-clamping',
        title: '属性生命周期钩子与 Clamping 截断铁律',
        titleEn: 'PreAttributeChange, PreAttributeBaseChange & PostGameplayEffectExecute',
        summary: '彻底消灭“满血吃溢出伤害后喝药加不上血”的负值幽灵 Bug，厘清三大回调触发边界。',
        durationMin: 12,
        difficulty: '进阶',
        goals: [
          { id: 'g1', text: '复现仅在 PreAttributeChange 中 Clamp 导致的 BaseValue 负数污染 Bug', unlockAtStep: 2 },
          { id: 'g2', text: '精准区分 PreAttributeBaseChange、PreAttributeChange 与 PostGameplayEffectExecute', unlockAtStep: 3 },
          { id: 'g3', text: '记住非周期性 Duration/Infinite GE 绝不会触发 PostGameplayEffectExecute', unlockAtStep: 4 },
          { id: 'g4', text: '实现双层安全截断与 PostAttributeChange 上限下调血量重约束', unlockAtStep: 5 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '幽灵负血',
            phase: 'PROBLEM',
            title: '诡异现场：血条明明显示 0，喝 +20 血药为什么还是 0？',
            paragraphs: [
              '这是 GAS 新手必踩的第一大深坑：角色 `Health = 100`，吃了一记 `130` 伤害的 `Instant` GE。程序员只在 `PreAttributeChange` 里写了 `NewValue = FMath::Clamp(NewValue, 0.f, MaxHealth)`，看着 UI 血条停在 `0` 以为万事大吉。',
              '结果角色没死透被队友奶了一口 `+20` 治疗：血条居然只涨到 `0`（甚至刷新 Buff 时突然变成 `-10`）！因为底层 **`Health.BaseValue` 早在那记重击后变成了 `-30`**！'
            ],
            hud: [
              { key: 'ui_hp', label: '表面 CurrentValue', value: '0 (假象)', status: 'warn' },
              { key: 'real_base', label: '底层 BaseValue', value: '-30 (已被污染!)', status: 'bad' },
              { key: 'after_heal', label: '+20 治疗后 (-30+20)', value: '-10 → 截断仍为 0!', status: 'bad' }
            ],
            scene: {
              nodes: [
                { id: 'dmg', col: -2, row: -0.7, color: 'red', icon: 'sword', label: 'Instant -130 伤害', size: 'sm' },
                {
                  id: 'base',
                  col: 0.2,
                  row: 0,
                  shape: 'cylinder',
                  color: 'red',
                  icon: 'attr',
                  label: 'Health.BaseValue',
                  sublabel: '100 - 130 = -30 ❌',
                  badge: { text: '未被真正截断!', tone: 'bad' },
                  size: 'lg'
                },
                { id: 'heal', col: 2, row: 0.9, color: 'green', icon: 'ge', label: '+20 治疗药水', sublabel: '-30 + 20 = -10', size: 'sm' }
              ],
              edges: [
                { id: 'gh1', from: 'dmg', to: 'base', packet: 'error', label: '绕过真实 Base 截断' },
                { id: 'gh2', from: 'heal', to: 'base', packet: 'ge', label: '填坑失败!' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: 'Epic 警告',
            phase: 'PITFALL',
            title: '读懂 Epic 源码注释：PreAttributeChange 只管当次求值！',
            paragraphs: [
              '打开引擎 `AttributeSet.h`，Epic 工程师在 `PreAttributeChange` 上方留下了长篇警告：该函数在 **`CurrentValue` 即将改变前**触发，主要用于限制最终生效值（如不让移速低于 100）或联动调整关联属性。',
              '**它绝不会回写修改聚合器内部的 `BaseValue`**！每当后续有新的持续型 Buff 加入或移除、导致 `FAggregator` 重新以 `BaseValue` 为起点重算时，之前在 `PreAttributeChange` 做的截断就会被彻底冲刷掉！'
            ],
            callout: {
              kind: 'warn',
              label: 'AttributeSet.h 官方铁律',
              text: 'PreAttributeChange 管的是 CurrentValue 的实时表现边界；想要永久锁死 BaseValue 的合法区间，必须配合 PreAttributeBaseChange 与 PostGameplayEffectExecute！'
            },
            hud: [
              { key: 'hook', label: 'PreAttributeChange', value: '仅拦截 CurrentValue', status: 'warn' },
              { key: 'recalc', label: 'Aggregator 重算时', value: '仍从原始 BaseValue 出发', status: 'bad' }
            ],
            scene: {
              nodes: [
                { id: 'agg', col: -1.5, row: 0, color: 'violet', icon: 'asc', label: 'FAggregator 重算', sublabel: '读取未截断 BaseValue (-30)' },
                { id: 'pre', col: 1.5, row: 0, color: 'amber', icon: 'code', label: 'PreAttributeChange', sublabel: '仅临时改引用参数 NewValue', badge: { text: '治标不治本', tone: 'warn' } }
              ],
              edges: [
                { id: 'ep1', from: 'agg', to: 'pre', packet: 'ge', label: '每次 Buff 变动重新冲刷' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: '三大钩子对比',
            phase: 'ARCHITECTURE',
            title: '一张图彻底分清 AttributeSet 三大核心回调',
            paragraphs: [
              '1. **`PreAttributeBaseChange(Attribute, float& NewBaseValue)`**：每当 **`BaseValue`** 即将被修改前触发！在这里 `Clamp` 可以直接拦截 `BaseValue` 跌破 `0` 或超过 `MaxHealth`。\n2. **`PreAttributeChange(Attribute, float& NewValue)`**：每当 **`CurrentValue`** 即将改变前触发（含临时 Buff 加减）。在这里 `Clamp` 保证临时 Debuff 也不会把当前移速扣成负数。',
              '3. **`PostGameplayEffectExecute(const FGameplayEffectModCallbackData& Data)`**：在 **Instant GE（或周期性 GE 的每一跳）真正修改完 `BaseValue` 之后**触发，且携带完整的 `EffectSpec`、施法者 `Source`、命中上下文 `Context`——是结算伤害、破盾与死亡判定的主战场！',
              '补充两个常用钩子：**`PreGameplayEffectExecute(FGameplayEffectModCallbackData&)`** 在 Instant/周期执行**之前**调用，返回 `false` 即可一票否决本次执行（如无敌、伤害免疫标签检查，`ULyraHealthSet` 即在此处理）；**`PostAttributeChange(Attribute, OldValue, NewValue)`** 在 CurrentValue 落定之后调用，适合做 `MaxHealth` 下调后的跨属性联动（见本节第 5 步）。'
            ],
            hud: [
              { key: 'h1', label: 'PreAttributeBaseChange', value: '锁死 BaseValue 范围', status: 'good' },
              { key: 'h2', label: 'PreAttributeChange', value: '锁死 CurrentValue 范围', status: 'good' },
              { key: 'h3', label: 'PostGameplayEffectExecute', value: 'Instant/周期跳后置结算', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'pbase', col: -2, row: -0.5, color: 'green', icon: 'shield', label: '1. PreAttributeBaseChange', sublabel: '拦截 BaseValue 越界' },
                { id: 'pcur', col: 0, row: 0.9, color: 'blue', icon: 'shield', label: '2. PreAttributeChange', sublabel: '拦截 CurrentValue 越界' },
                { id: 'post', col: 2, row: -0.5, color: 'violet', icon: 'code', label: '3. PostGEExecute', sublabel: '读取 Spec / 触发死亡事件', state: 'active' }
              ],
              edges: [
                { id: 'hk1', from: 'pbase', to: 'pcur', packet: 'rep' },
                { id: 'hk2', from: 'pcur', to: 'post', packet: 'ge', label: '仅 Instant / Periodic 到达', labelTone: 'violet' }
              ],
              inspectCard: {
                title: 'WHO FIRES POST_GE_EXECUTE?',
                rows: [
                  { left: 'Instant GE', right: '触发 ✅', highlight: 'green' },
                  { left: 'Periodic GE (每跳)', right: '触发 ✅', highlight: 'green' },
                  { left: 'Duration/Infinite (无周期)', right: '绝不触发 ❌', highlight: 'red' }
                ]
              }
            }
          },
          {
            id: 's4',
            shortLabel: '持续Buff盲区',
            phase: 'TECHNIQUE',
            title: '关键认知：普通 Duration Buff 绝不会进 PostGameplayEffectExecute！',
            paragraphs: [
              '很多同学在 `PostGameplayEffectExecute` 里打断点，然后给角色挂了一个“持续 10 秒增加 50 攻击力”的 `HasDuration`（`Period = 0`）Buff，结果断点死活不触发，以为代码坏了！',
              '这不是 Bug，而是设计必然：因为 `Execute` 在 GAS 术语里专指**对 `BaseValue` 的不可逆执行**！非周期性的持续 Buff 只是往聚合器里挂载一个修改器改变 `CurrentValue`。如果你想监听任意属性 `CurrentValue` 变动以刷新 UI 进度条，应该在外部绑定 **`ASC->GetGameplayAttributeValueChangeDelegate(Attr)`**！'
            ],
            callout: {
              kind: 'insight',
              label: 'GAS 术语精确辨析："Apply" vs "Execute"',
              text: 'Duration/Infinite GE 被“Apply（挂载）”到容器里持续修饰 CurrentValue；Instant GE 与周期跳则是被“Execute（执行）”直接改写 BaseValue！'
            },
            hud: [
              { key: 'dur_buff', label: 'Duration Buff (Period=0)', value: '走 Apply · 改 CurrentValue', status: 'good' },
              { key: 'ui_bind', label: 'UI 监听属性正确姿势', value: 'GetGameplayAttributeValueChangeDelegate', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'dur', col: -1.8, row: -0.7, color: 'amber', icon: 'ge', label: 'Duration GE (+50 ATK)', sublabel: 'Period = 0' },
                { id: 'agg', col: 0.4, row: -0.7, color: 'blue', icon: 'asc', label: 'CurrentValue 更新', state: 'active' },
                { id: 'ui', col: 2, row: 0.8, color: 'green', icon: 'client', label: 'UI ValueChangeDelegate', badge: { text: '实时收到新值 ✅', tone: 'good' }, size: 'sm' },
                { id: 'post', col: -0.4, row: 1.4, color: 'slate', icon: 'code', label: 'PostGEExecute()', sublabel: '不会进入此函数', state: 'disabled', size: 'sm' }
              ],
              edges: [
                { id: 'du1', from: 'dur', to: 'agg', packet: 'ge' },
                { id: 'du2', from: 'agg', to: 'ui', packet: 'rep' },
                { id: 'du3', from: 'dur', to: 'post', style: 'dashed', packet: 'none', label: '跳过' }
              ]
            }
          },
          {
            id: 's5',
            shortLabel: '标准截断代码',
            phase: 'SOLUTION',
            title: '工业级模板：双层 Clamp + PostAttributeChange 上限下调重约束',
            paragraphs: [
              '参考 `ULyraHealthSet` 源码，将 `ClampAttribute` 抽成私有辅助函数，同时在 `PreAttributeBaseChange`（直接修改引用参数 `NewValue`，切勿在此调用非 `const` 的 `SetHealth` 以免编译报错与递归重入！）与 `PreAttributeChange` 中调用。',
              '别忘了跨属性联动细节：当脱下装备导致 `MaxHealth` 从 `200` 降回 `100` 时，若原本 `Health` 是 `180`，不应在 `PreAttributeChange` 求值中途篡改其他属性，而应在 **`PostAttributeChange`** 中检测 `Attribute == GetMaxHealthAttribute()` 并主动将超出新上限的 `Health` 压回 `NewValue`！'
            ],
            codeSnippet: {
              title: 'MyAttributeSet.cpp 截断与上限重约束范式 (对齐 LyraHealthSet)',
              code: `void UMyAttributeSet::PreAttributeBaseChange(const FGameplayAttribute& Attribute, float& NewValue) const {
  Super::PreAttributeBaseChange(Attribute, NewValue);
  ClampAttribute(Attribute, NewValue); // 直接改 NewValue 引用!
}
void UMyAttributeSet::PreAttributeChange(const FGameplayAttribute& Attribute, float& NewValue) {
  Super::PreAttributeChange(Attribute, NewValue);
  ClampAttribute(Attribute, NewValue);
}
void UMyAttributeSet::PostAttributeChange(const FGameplayAttribute& Attribute, float OldValue, float NewValue) {
  Super::PostAttributeChange(Attribute, OldValue, NewValue);
  if (Attribute == GetMaxHealthAttribute() && GetHealth() > NewValue) {
    // MaxHealth 下调时，主动把溢出的当前生命重约束到新上限 (Lyra 做法)
    GetOwningAbilitySystemComponentChecked()->ApplyModToAttribute(GetHealthAttribute(), EGameplayModOp::Override, NewValue);
  }
}
void UMyAttributeSet::ClampAttribute(const FGameplayAttribute& Attribute, float& NewValue) const {
  if (Attribute == GetHealthAttribute()) {
    NewValue = FMath::Clamp(NewValue, 0.0f, FMath::Max(GetMaxHealth(), 1.0f));
  } else if (Attribute == GetMaxHealthAttribute()) {
    NewValue = FMath::Max(NewValue, 1.0f);
  }
}`
            },
            hud: [
              { key: 'base_safe', label: 'BaseValue 下限', value: '严格 >= 0.0f', status: 'good' },
              { key: 'cur_safe', label: 'CurrentValue 范围', value: '[0, MaxHealth]', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'in', col: -2.2, row: 0, color: 'amber', icon: 'sword', label: '-130 溢出重击' },
                { id: 'clamp', col: -0.1, row: -0.2, color: 'green', icon: 'shield', label: '双层 ClampAttribute', sublabel: 'Base 与 Current 同步锁死', state: 'active' },
                { id: 'hp', col: 2.1, row: 0.6, shape: 'cylinder', color: 'teal', icon: 'attr', label: 'Health: 0 / 100', sublabel: 'BaseValue = 0.0f ✅', badge: { text: '+20 治疗立回 20 HP', tone: 'good' } }
              ],
              edges: [
                { id: 'sc1', from: 'in', to: 'clamp', packet: 'ge' },
                { id: 'sc2', from: 'clamp', to: 'hp', packet: 'rep', label: '干净归零', labelTone: 'green' }
              ]
            }
          }
        ]
      },
      {
        slug: 'meta-attributes',
        title: '元属性模式：IncomingDamage 与护盾伤害结算',
        titleEn: 'Meta Attributes: Server-Side Damage & Shield Pipeline',
        summary: '学习 Lyra 标准伤害结算范式：用非复制元属性承接伤害，优雅处理护盾抵扣、免死与击杀事件。',
        durationMin: 10,
        difficulty: '进阶',
        goals: [
          { id: 'g1', text: '理解为什么伤害 GE 不应直接扣减 Health 属性', unlockAtStep: 2 },
          { id: 'g2', text: '掌握非复制元属性 IncomingDamage 每次读取即清零的瞬态机制', unlockAtStep: 3 },
          { id: 'g3', text: '在 PostGameplayEffectExecute 中编排护盾优先吸收、剩余扣血与死亡广播', unlockAtStep: 4 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '直接扣血之困',
            phase: 'PROBLEM',
            title: '如果让伤害 GE 直接 -50 Health，遇到护盾怎么办？',
            paragraphs: [
              '假设角色有 `100 Health` 和 `30 Shield`（护盾）。如果火球术的伤害 GE 直接配置为修改器 `Health Additive -50`，那么护盾完全被无视，血量直接掉到 `50`！',
              '更糟的是：你还想统计“本次实际造成了多少有效伤害以计算吸血”、判定“是否携带免死金牌保留 1 滴血”、以及向击杀者发放赏金——直接改 `Health` 会让逻辑散落在无数个地方。'
            ],
            hud: [
              { key: 'shield', label: 'Shield (30)', value: '被直接绕过!', status: 'bad' },
              { key: 'lifesteal', label: '真实伤害统计', value: '难以拦截拆分', status: 'warn' }
            ],
            scene: {
              nodes: [
                { id: 'ge', col: -1.8, row: 0, color: 'red', icon: 'ge', label: 'GE_Damage (-50 HP)' },
                { id: 'sh', col: 0.4, row: -1.1, color: 'slate', icon: 'shield', label: 'Shield: 30', sublabel: '形同虚设!', state: 'disabled', size: 'sm' },
                { id: 'hp', col: 1.4, row: 0.6, shape: 'cylinder', color: 'red', icon: 'attr', label: 'Health: 50 / 100', badge: { text: '护盾未生效 ❌', tone: 'bad' } }
              ],
              edges: [
                { id: 'm1', from: 'ge', to: 'hp', packet: 'error', label: '直接扣血跳过护盾' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '元属性概念',
            phase: 'ARCHITECTURE',
            title: '引入 Meta Attribute（元属性）：单帧中转漏斗',
            paragraphs: [
              '**元属性 (`Meta Attribute`)** 是在 `UAttributeSet` 中声明的**不加 `Replicated` 标记**的普通 `FGameplayAttributeData`（最典型如 `IncomingDamage`、`IncomingHeal`、`IncomingXP`）。',
              '所有攻击技能的 GE **一律只往目标的 `IncomingDamage` 上累加正数伤害值**（如 `+50`）。因为它不需要网络同步，客户端只关心结算完成后最终复制过来的 `Shield` 和 `Health` 结果！'
            ],
            changes: [
              { op: 'add', text: '新增非复制属性 FGameplayAttributeData IncomingDamage' },
              { op: 'mod', text: '所有伤害 GE 统一改为 IncomingDamage Additive +Damage' }
            ],
            hud: [
              { key: 'rep', label: 'IncomingDamage 网络复制', value: '不复制 (仅 Server 瞬态)', status: 'good' },
              { key: 'entry', label: '全游戏伤害入口', value: '100% 收口至一处', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'd1', col: -2, row: -0.9, color: 'amber', icon: 'sword', label: '普攻砍击', size: 'sm' },
                { id: 'd2', col: -2, row: 1, color: 'violet', icon: 'ge', label: '火焰周期灼烧', size: 'sm' },
                {
                  id: 'meta',
                  col: 0.6,
                  row: 0,
                  color: 'green',
                  icon: 'asc',
                  label: 'IncomingDamage',
                  sublabel: 'Meta Attribute (中转站)',
                  state: 'active',
                  size: 'lg'
                }
              ],
              edges: [
                { id: 'mt1', from: 'd1', to: 'meta', packet: 'ge', label: '+50' },
                { id: 'mt2', from: 'd2', to: 'meta', packet: 'ge', label: '+15' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: '读取即清零',
            phase: 'TECHNIQUE',
            title: '黄金三步曲：取出缓存 → 立即归零 → 按 BaseValue 契约扣减',
            paragraphs: [
              '当伤害 GE 执行完毕进入服务端 `PostGameplayEffectExecute` 时，检查 `Data.EvaluatedData.Attribute == GetIncomingDamageAttribute()`：\n1. 先用局部变量拷出 `const float LocalDamage = GetIncomingDamage();` 并**立刻调用 `SetIncomingDamage(0.0f);` 清零**！\n2. **严守资源属性修改契约**：注意 `GetHealth()` 读的是 `CurrentValue`，而 `SetHealth()` 写回的是 `BaseValue`！若 `Health` 上挂着临时 `+20` 持续修饰器（`Base=100, Current=120`），吃 `10` 伤后用 `GetHealth()-10` 写回 `Base=110`，重算后 `Current` 反倒涨成 `130`！',
              '3. 因此必须明确项目规范（与 `LyraHealthSet` 一致）：**严禁对 `Health` / `Shield` 挂任何持续型修饰器**（临时加血上限统一改 `MaxHealth`），或显式基于 `BaseValue`（如 `Health.GetBaseValue()`）扣减写回！'
            ],
            codeSnippet: {
              title: 'PostGameplayEffectExecute 护盾+生命结算模板 (严禁持续修饰器改 Health/Shield)',
              code: `// 前置契约：Health 与 Shield 仅允许 Instant/Periodic 修改 (Base == Current)，上限加成请改 MaxHealth!
if (Data.EvaluatedData.Attribute == GetIncomingDamageAttribute()) {
  const float LocalDmg = GetIncomingDamage();
  SetIncomingDamage(0.f); // 铁律：第一时间清零!
  if (LocalDmg > 0.f && Shield.GetBaseValue() >= 0.f && Health.GetBaseValue() > 0.f) {
    const float CurShieldBase = Shield.GetBaseValue();
    const float Absorb = FMath::Clamp(LocalDmg, 0.f, CurShieldBase);
    if (Absorb > 0.f) { SetShield(CurShieldBase - Absorb); }
    const float Remain = LocalDmg - Absorb;
    SetHealth(FMath::Clamp(Health.GetBaseValue() - Remain, 0.f, GetMaxHealth()));
    if (GetHealth() <= 0.f) { HandleDeath(Data.EffectSpec); }
  }
}`
            },
            callout: {
              kind: 'warn',
              label: 'CurrentValue 读取 vs BaseValue 写回陷阱',
              text: 'ATTRIBUTE_ACCESSORS 生成的 GetX() 返回 CurrentValue，而 SetX() 改写 BaseValue。资源型属性（HP/Shield/Mana）务必禁止挂载 Duration/Infinite 修改器，并在结算时对 BaseValue 运算，杜绝活跃修饰器二次叠加放大！'
            },
            hud: [
              { key: 'in_dmg', label: 'IncomingDamage', value: '50 → 立即清零为 0', status: 'good' },
              { key: 'shield', label: 'Shield 抵扣', value: '30 → 0 (-30)', status: 'good' },
              { key: 'hp', label: 'Health 剩余扣减', value: '100 → 80 (-20)', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'meta', col: -1.8, row: 0, color: 'amber', icon: 'ge', label: 'LocalDmg = 50', sublabel: 'IncomingDamage 已归 0' },
                { id: 'sh', col: 0.6, row: -1, shape: 'cylinder', color: 'blue', icon: 'shield', label: 'Shield: 0 / 30', badge: { text: '吸收 30 点伤害', tone: 'good' } },
                { id: 'hp', col: 1.4, row: 1, shape: 'cylinder', color: 'green', icon: 'attr', label: 'Health: 80 / 100', badge: { text: '仅扣穿透的 20 点', tone: 'good' } }
              ],
              edges: [
                { id: 'sp1', from: 'meta', to: 'sh', packet: 'rep', label: '优先抵扣 30' },
                { id: 'sp2', from: 'meta', to: 'hp', packet: 'ge', label: '溢出 20 扣血', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: '受击与死亡闭环',
            phase: 'SOLUTION',
            title: '上下文溯源：从 EffectContext 派发受击硬直与击杀事件',
            paragraphs: [
              '`Data.EffectSpec.GetContext()` 里完整保存了是谁放的技能 (`GetInstigator()`)、哪把武器或投射物打中的 (`GetEffectCauser()`)、命中骨骼与坐标 (`GetHitResult()`)。',
              '当 `Health <= 0` 且尚未携带 `State.Dead` 标签时，我们通过 `SendGameplayEventToActor` 触发受击者的 `GA_Death` 死亡表现技能，并向凶手发送击杀助攻事件——整套战斗结算清晰、权威、无懈可击！'
            ],
            hud: [
              { key: 'ctx', label: '伤害溯源', value: 'EffectContext (凶手/部位)', status: 'good' },
              { key: 'death', label: '死亡触发方式', value: 'GameplayEvent.Death → GA_Death', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'post', col: -1.6, row: 0, color: 'violet', icon: 'code', label: 'PostGEExecute', sublabel: 'HP == 0 触发判死', state: 'active' },
                { id: 'death_ga', col: 1.4, row: -0.9, color: 'rose', icon: 'ga', label: 'GA_Death', sublabel: '播倒地蒙太奇 + Ragdoll' },
                { id: 'killer', col: 1.4, row: 1.1, color: 'green', icon: 'pawn', label: 'Instigator (凶手)', sublabel: '发放经验与击杀播报', size: 'sm' }
              ],
              edges: [
                { id: 'dt1', from: 'post', to: 'death_ga', packet: 'cue', label: 'Event.Death' },
                { id: 'dt2', from: 'post', to: 'killer', packet: 'rep', label: 'Event.KillCredit' }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'mod-effects',
    indexLabel: '04. 游戏效果 (UE 5.8)',
    title: '04. 游戏效果 (UE 5.8)',
    titleEn: '04. Gameplay Effects (UE 5.8)',
    folderColor: 'orange',
    lessons: [
      {
        slug: 'ge-duration-periodic',
        title: '时效策略、周期性跳动与堆叠池设计',
        titleEn: 'Instant, Duration, Periodic Ticks & Stacking Policies',
        summary: '看清周期性 DOT 每一跳永久改写 BaseValue 的本质，精准设计按源独立叠毒与按目标共享破甲。',
        durationMin: 11,
        difficulty: '入门',
        goals: [
          { id: 'g1', text: '区分 Instant、Duration、Infinite 三大 DurationPolicy 生命周期', unlockAtStep: 2 },
          { id: 'g2', text: '牢记 Period > 0 的周期性效果每一跳改 BaseValue 而非 CurrentValue', unlockAtStep: 3 },
          { id: 'g3', text: '掌握 bExecutePeriodicEffectOnApplication 首跳控制开关', unlockAtStep: 3 },
          { id: 'g4', text: '正确选型 AggregateBySource 与 AggregateByTarget 两种堆叠模型', unlockAtStep: 4 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '三大时效',
            phase: 'ARCHITECTURE',
            title: 'UGameplayEffect 的三种生命形态',
            paragraphs: [
              '`UGameplayEffect` 本身是**只读配置模板 (CDO)**，运行时先通过 `MakeOutgoingSpec` 包装成携带等级与上下文的 `FGameplayEffectSpec` 再施加给目标。按 `DurationPolicy` 分为三类：\n1. **`Instant`（瞬间）**：一锤子买卖修改 `BaseValue`（如单次扣血、捡血包），执行完立刻销毁，不进活跃容器。\n2. **`HasDuration`（有限时长）**：驻留 `ActiveGameplayEffects` 指定秒数（如 5 秒加速、8 秒技能冷却），默认修饰 `CurrentValue` 到期自动还原。\n3. **`Infinite`（无限时长）**：永久驻留直至手动移除（如穿戴装备属性加成、常驻光环）。'
            ],
            hud: [
              { key: 'inst', label: 'Instant', value: '改 BaseValue · 即用即焚', status: 'good' },
              { key: 'dur', label: 'HasDuration', value: '自动倒计时移除', status: 'good' },
              { key: 'inf', label: 'Infinite', value: '装备/被动常驻', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'spec', col: -2, row: 0, color: 'amber', icon: 'ge', label: 'FGameplayEffectSpec', sublabel: '运行时效果实例单' },
                { id: 'i1', col: 1.2, row: -1.3, color: 'red', icon: 'sword', label: 'Instant', sublabel: '直接改写 BaseValue', size: 'sm' },
                { id: 'i2', col: 1.5, row: 0, color: 'blue', icon: 'task', label: 'HasDuration (5s)', sublabel: '驻留容器 · 自动到期', state: 'active' },
                { id: 'i3', col: 1.2, row: 1.4, color: 'teal', icon: 'shield', label: 'Infinite', sublabel: '穿戴装备 · 手动卸载', size: 'sm' }
              ],
              edges: [
                { id: 'dp1', from: 'spec', to: 'i1', packet: 'ge' },
                { id: 'dp2', from: 'spec', to: 'i2', packet: 'predict' },
                { id: 'dp3', from: 'spec', to: 'i3', packet: 'rep' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '周期跳真相',
            phase: 'PITFALL',
            title: '极易搞反的机制：Periodic（周期性）GE 改的是 BaseValue！',
            paragraphs: [
              '假设你做一个“持续 5 秒、每秒扣 10 血”的中毒 DOT（`HasDuration = 5s`, `Period = 1.0s`）。请问 5 秒结束后，扣掉的 50 点血会自动涨回来吗？**当然不会！**',
              '因为一旦 `Period > 0`，引擎会把该 GE 的每一次周期跳动当作**一次微型的 `Instant` 效果来执行**：**永久修改 `BaseValue` 并触发 `PostGameplayEffectExecute`**！同时注意默认勾选的 `bExecutePeriodicEffectOnApplication = true` 意味着在 `t=0s` 挂上瞬间就会跳第 1 下（5 秒内总共跳 6 下：`0, 1, 2, 3, 4, 5` 视边界而定；若希望满 1 秒才跳第一下，务必取消勾选该开关）！'
            ],
            callout: {
              kind: 'warn',
              label: '5 秒跳了 6 次伤害的元凶',
              text: 'Duration = 5.0s, Period = 1.0s 且开启 ExecutePeriodicEffectOnApplication 时，t=0.0s 立刻跳第 1 次，随后 1s, 2s, 3s, 4s, 5s 各跳一次共 6 跳！策划要求“5 秒共跳 5 次”时，请关闭首跳开关或将时长设为 4.95s / 调整跳数节奏。'
            },
            hud: [
              { key: 'target_val', label: 'Period > 0 修改目标', value: 'BaseValue (永久生效!)', status: 'good' },
              { key: 'first_tick', label: 'OnApplication 默认值', value: 'true (挂上即跳第1次)', status: 'warn' }
            ],
            scene: {
              nodes: [
                { id: 'dot', col: -1.6, row: 0, color: 'violet', icon: 'ge', label: 'GE_Poison (DOT)', sublabel: 'Duration=5s · Period=1s', state: 'active' },
                {
                  id: 'hp',
                  col: 1.5,
                  row: 0,
                  shape: 'cylinder',
                  color: 'red',
                  icon: 'attr',
                  label: 'IncomingDamage / HP',
                  sublabel: '每跳永久扣血 · 触发 PostGE',
                  badge: { text: '到期移除不回血', tone: 'good' }
                }
              ],
              edges: [
                { id: 'pd1', from: 'dot', to: 'hp', packet: 'ge', packetRate: 'fast', label: '每 1.0s 执行一次 Execute', labelTone: 'violet' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: '堆叠策略',
            phase: 'TECHNIQUE',
            title: '多人叠毒 vs 全团共享破甲：AggregateBySource vs Target',
            paragraphs: [
              '当同一个持续型 GE 被反复施加时，GAS 提供两种截然不同的堆叠归属模型 (`StackingType`)：\n• **`AggregateBySource`（按施法源独立计数）**：上限 5 层时，盗贼 A 可以给 Boss 叠满自己的 5 层毒，盗贼 B 也能同时给同一个 Boss 叠满自己的 5 层毒，互不顶替！',
              '• **`AggregateByTarget`（按受击目标全局共享）**：上限 5 层时，无论全团多少个战士上去砍破甲，Boss 身上总共最多只有 5 层破甲（谁砍都能帮全团续杯刷新持续时间）！'
            ],
            hud: [
              { key: 'by_src', label: 'AggregateBySource', value: '每人独立叠层 (流血/毒)', status: 'good' },
              { key: 'by_tgt', label: 'AggregateByTarget', value: '目标共享上限 (破甲/易伤)', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'r1', col: -2, row: -1, color: 'green', icon: 'pawn', label: '盗贼 A', size: 'sm' },
                { id: 'r2', col: -2, row: 1, color: 'teal', icon: 'pawn', label: '盗贼 B', size: 'sm' },
                {
                  id: 'boss',
                  col: 1.2,
                  row: 0,
                  color: 'amber',
                  icon: 'asc',
                  label: 'Boss 堆叠容器',
                  sublabel: 'BySource: A(5层) + B(5层)',
                  badge: { text: 'ByTarget 则全团封顶 5 层', tone: 'good' },
                  size: 'lg'
                }
              ],
              edges: [
                { id: 'st1', from: 'r1', to: 'boss', packet: 'ge', label: 'Stack 5/5 (Source A)' },
                { id: 'st2', from: 'r2', to: 'boss', packet: 'ge', label: 'Stack 5/5 (Source B)' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: '溢出与清栈',
            phase: 'SOLUTION',
            title: '进阶机制：叠满 5 层后再命中引爆冰冻！(OverflowEffects)',
            paragraphs: [
              '想做“寒冰印记上限 5 层，**已叠满 5 层后再次施加（第 6 次命中）**瞬间清空印记并触发 2 秒冰冻爆发”？无需在 C++ 里手写层数判断，但配表时有两处极易踩坑的硬约束！',
              '正确配法：在寒冰印记 GE 本体的 **Stacking（堆叠）** 栏设定 `StackLimitCount = 5`，在 `OverflowEffects` 数组挂上 `GE_IceShatter_Freeze`，并**同时勾选 `bDenyOverflowApplication = true` 与 `bClearStackOnOverflow = true`**（源码中不开启拒绝溢出施加，`bClearStackOnOverflow` 不会生效！）。切勿将其配到 `UAdditionalEffectsGameplayEffectComponent` 的 `OnApplicationGameplayEffects` 里——后者在普通第 1 层施加时就会立即触发！'
            ],
            callout: {
              kind: 'warn',
              label: '配表防呆：OverflowEffects vs AdditionalEffectsComponent',
              text: 'OverflowEffects 仅在已达 StackLimitCount 上限后再次施加时触发，且清空叠层必须同时开启 bDenyOverflowApplication + bClearStackOnOverflow；而 AdditionalEffects 组件的 OnApplication 每次成功挂上都会触发，二者触发条件截然不同。'
            },
            hud: [
              { key: 'limit', label: 'StackLimitCount', value: '5 层 (满层后再施放溢出)', status: 'good' },
              { key: 'overflow', label: '清栈必配双开关', value: 'DenyOverflow + ClearStack', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'mark', col: -1.6, row: 0, color: 'blue', icon: 'ge', label: 'GE_FrostMark (5/5)', sublabel: '第 6 层溢出触发!' },
                { id: 'boom', col: 1.6, row: 0, color: 'violet', icon: 'cue', label: 'GE_IceShatter', sublabel: '清空层数 + 冰冻爆发', state: 'active', badge: { text: '零代码配表连招', tone: 'good' } }
              ],
              edges: [
                { id: 'ov1', from: 'mark', to: 'boom', packet: 'cue', packetRate: 'fast', label: 'OnStackOverflow 自动派发', labelTone: 'violet' }
              ]
            }
          }
        ]
      },
      {
        slug: 'ge-components-math',
        title: 'UE 5.8 模块化 GE 组件与聚合器公式',
        titleEn: 'UGameplayEffectComponent & UE 5.8 Modifier Math',
        summary: '掌握 UE 5.8 完整模块化 GEComponent 体系（含 CancelAbilityTags 与 UIData），吃透 FAggregator 五段乘区公式。',
        durationMin: 14,
        difficulty: '高阶',
        goals: [
          { id: 'g1', text: '掌握 UE 5.8 完整 UGameplayEffectComponent 模块化面板（含 CancelAbilityTags / UIData）', unlockAtStep: 2 },
          { id: 'g2', text: '永不混淆 AssetTagsComponent（自身标签）与 TargetTagsComponent（授予目标标签）', unlockAtStep: 2 },
          { id: 'g3', text: '理解 OngoingTagRequirements 动态暂停/恢复 Buff 的精妙用法', unlockAtStep: 3 },
          { id: 'g4', text: '精通 UE 5.8 FAggregator 五段算式及 MultiplyAdditive vs MultiplyCompound 差异', unlockAtStep: 4 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: '模块化组件体系',
            phase: 'UE5_NEW',
            title: '为什么在 UE 5.8 中，GE 蓝图里的旧标签栏“消失”了？',
            paragraphs: [
              '如果你对照早期 UE4/5.1 教程打开 UE 5.8 的 `GameplayEffect` 编辑器，会发现原有的 `GrantedTags`、`ApplicationTagRequirements`、`GrantedAbilities` 折叠栏全不见了！',
              '这是因为 Epic 自 UE 5.3 起对 `UGameplayEffect` 实施了彻底的**组合模式重构**并在 UE 5.4–5.8 持续完善：改为按需点击 **Components `+` 号** 挂载 `[[UGameplayEffectComponent|UE5 模块化 GE 子组件基类，按需挂载标签授予、打断/封锁技能、条件校验、赋予技能、免疫与 UI 数据等行为]]`。在 UE 5.8 中，除了常用的 `UTargetTags`、`UBlockAbilityTags`、`UImmunity` 外，还内置了 **`UCancelAbilityTagsGameplayEffectComponent`**（*Cancel Abilities with Tags*，支持 `OnApplication` / `OnExecution` 按 With/Without Tags 直接打断运行中技能），且 **`UGameplayEffectUIData`** 也已成为 GEComponent 子类（通过 `FindComponent<UGameplayEffectUIData>()` 获取）。'
            ],
            callout: {
              kind: 'ue5',
              label: 'UE 5.8 C++ API 校验与访问规范',
              text: 'UE 5.6 起旧的 ValidateGameplayEffect / ScalableFloat 校验与 GetModifierMagnitude(..., bFactorInStackCount) 已废弃，统一走 IsDataValid() 与 GetModifierMagnitude(Idx)；UE 5.7 起 StackingType 成员变量已标废弃，C++ 侧请改用 GetStackingType() / SetStackingType()！'
            },
            hud: [
              { key: 'ver', label: '当前对标版本', value: 'UE 5.8 (11+ 内置组件)', status: 'good' },
              { key: 'pattern', label: '架构模式', value: 'UGameplayEffectComponent', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'ge', col: 0, row: 0, color: 'amber', icon: 'ge', label: 'UGameplayEffect', sublabel: '轻量模块化宿主 (UE 5.8)', state: 'active', size: 'lg' },
                { id: 'c1', col: -2, row: -1, color: 'green', icon: 'tag', label: 'TargetTagsComp', sublabel: '授予目标标签', size: 'sm' },
                { id: 'c2', col: 2, row: -1, color: 'violet', icon: 'tag', label: 'AssetTagsComp', sublabel: 'GE 自身属性标签', size: 'sm' },
                { id: 'c3', col: -1.9, row: 1.3, color: 'blue', icon: 'ga', label: 'AbilitiesComp', sublabel: '存续期授予技能', size: 'sm' },
                { id: 'c4', col: 1.9, row: 1.3, color: 'teal', icon: 'shield', label: 'ImmunityComp', sublabel: '赋予标签免疫', size: 'sm' }
              ],
              edges: [
                { id: 'gc1', from: 'ge', to: 'c1', packet: 'rep' },
                { id: 'gc2', from: 'ge', to: 'c2', packet: 'predict' },
                { id: 'gc3', from: 'ge', to: 'c3', packet: 'input' },
                { id: 'gc4', from: 'ge', to: 'c4', packet: 'ge' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: '头号易混点',
            phase: 'PITFALL',
            title: '千万别填错：AssetTags vs TargetTags (Granted to Actor)！',
            paragraphs: [
              'UE 5.3+ 新手排名前三的报错：“我给眩晕 GE 加了标签组件填了 `State.Stun`，应用后目标为什么没被眩晕？！”——**99% 是因为选错了组件**！\n• **`UAssetTagsGameplayEffectComponent`**（面板名：*Tags This Effect Has*）：描述 **这个 GE 资产自己是什么类型**（如 `Damage.Type.Fire`），**绝不会挂到受击角色身上**！',
              '• **`UTargetTagsGameplayEffectComponent`**（面板名：*Granted Tags / Grant Tags to Target Actor*）：这才是**把 `State.Stun` 或 `Cooldown.Fireball` 真正注入受击者 ASC 标签计数表**的组件！'
            ],
            callout: {
              kind: 'warn',
              label: '一秒自检口诀',
              text: '想让角色身上多一个 Buff/冷却/控制状态标签 → 必选 TargetTagsGameplayEffectComponent (Grant Tags to Target)！描述这发效果属于火焰还是毒素供免疫系统识别 → 选 AssetTagsGameplayEffectComponent！'
            },
            hud: [
              { key: 'asset_comp', label: 'AssetTags 组件', value: '仅贴在 GE 自身 · 不给角色', status: 'warn' },
              { key: 'target_comp', label: 'TargetTags 组件', value: '真正授予受击者 ASC ✅', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'asset', col: -1.7, row: -0.9, color: 'violet', icon: 'tag', label: 'UAssetTagsComp', sublabel: 'Effect.Type.Magic (自留)', size: 'sm' },
                { id: 'target', col: -1.7, row: 1, color: 'green', icon: 'tag', label: 'UTargetTagsComp', sublabel: 'Grant: State.Stun', state: 'active' },
                {
                  id: 'enemy',
                  col: 1.6,
                  row: 0.4,
                  color: 'blue',
                  icon: 'asc',
                  label: '受击者 Target ASC',
                  badge: { text: '获得 State.Stun ✅', tone: 'good' }
                }
              ],
              edges: [
                { id: 'at1', from: 'asset', to: 'enemy', style: 'dashed', packet: 'error', label: '不会转移给目标!' },
                { id: 'at2', from: 'target', to: 'enemy', packet: 'rep', label: '注入目标 TagCountContainer', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: '动态暂停组件',
            phase: 'TECHNIQUE',
            title: 'UTargetTagRequirements：不销毁 Buff 的动态启停黑科技',
            paragraphs: [
              '在 `UTargetTagRequirementsGameplayEffectComponent` 中有三个极其强大的标签条件器：\n1. **`ApplicationTagRequirements`**：不满足则根本无法挂上该 GE；\n2. **`RemovalTagRequirements`**：一旦满足立刻把该 GE 驱散销毁；',
              '3. **`OngoingTagRequirements`（持续生效条件）**：最惊艳的设计！例如被动“脱战回血光环”要求 `IgnoreTags: State.InCombat`。一旦进入战斗获得 `InCombat` 标签，回血 Buff **不会被销毁，而是自动进入抑制 (`Inhibited`) 暂停状态**；脱离战斗移除标签瞬间，光环自动恢复生效！'
            ],
            hud: [
              { key: 'app', label: 'Application', value: '准入门槛', status: 'good' },
              { key: 'ongoing', label: 'Ongoing', value: '动态抑制暂停 / 自动恢复', status: 'good' },
              { key: 'rem', label: 'Removal', value: '条件满足立即销毁', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'passive', col: -1.7, row: 0, color: 'green', icon: 'ge', label: 'GE_OutOfCombatRegen', sublabel: 'Ongoing Ignore: InCombat' },
                { id: 'combat', col: 1.5, row: -0.9, color: 'amber', icon: 'sword', label: '进入战斗 (InCombat)', badge: { text: 'bIsInhibited = true (暂停)', tone: 'warn' } },
                { id: 'peace', col: 1.5, row: 1.1, color: 'teal', icon: 'shield', label: '脱离战斗', badge: { text: '自动恢复回血 ✅', tone: 'good' }, state: 'active' }
              ],
              edges: [
                { id: 'og1', from: 'passive', to: 'combat', packet: 'predict', style: 'dashed', label: '保留实例 · 暂停修饰' },
                { id: 'og2', from: 'passive', to: 'peace', packet: 'rep', label: '无缝恢复激活', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: 'UE 5.8 乘区公式',
            phase: 'SOLUTION',
            title: '吃透 FAggregator 算式：同一求值通道内的加乘与 Override',
            paragraphs: [
              '在**同一求值通道 (`EGameplayModEvaluationChannel`)** 内，早期 UE 5.0–5.4 的 `EGameplayModOp::Multiplicitive` 采用 **`1.0` 偏置同池相加法**：`1.0 + (1.2 - 1.0) + (1.2 - 1.0) = 1.4`（即两个 +20% 词条同通道相加为 `100 × 1.4 = 140`，而非 `144`）。过去若想做阶段顺序连乘，往往需要拆分配置多个 `Modifier Evaluation Channel`（如 `Channel0` 算完传入 `Channel1`）或改用 `ExecCalc`。',
              '而在 **UE 5.8**（自 5.5 引入）中，**单个通道内**直接提供完整的五段乘区枚举：\n`ChannelOut = ((InBase + AddBase) × MultiplyAdditive ÷ DivideAdditive × MultiplyCompound) + AddFinal`\n• **`MultiplyAdditive`**（原 `Multiplicitive`）：同池偏置加算百分比；\n• **`MultiplyCompound`**：单通道内直接独立连乘（`100 × 1.2 × 1.2 = 144`）！\n• **`AddFinal`**：乘算后平坦追加；\n• **`Override`**：覆盖**当前求值通道**的结果（同一通道内存在多个 Override 时，胜出者取决于聚合器内部顺序，工程上应避免并存；若启用了更高编号的后续 Evaluation Channel，后续通道仍会以该覆盖值为基底继续求值！）。'
            ],
            callout: {
              kind: 'ue5',
              label: 'UE 5.8 数值策划标准管线',
              text: '无需魔改源码，直接在 GE Modifier Op 下拉框中即可自由组合“基础固值(AddBase) → 同池增伤%(MultiplyAdditive) → 独立乘区(MultiplyCompound) → 最终固值(AddFinal)”四阶标准 RPG 公式！'
            },
            hud: [
              { key: 'mul_add', label: 'MultiplyAdditive (×2个+20%)', value: '× 1.40 (同池相加)', status: 'good' },
              { key: 'mul_cmp', label: 'MultiplyCompound', value: '× 1.44 (独立连乘)', status: 'good' },
              { key: 'add_fin', label: 'AddFinal', value: '乘算后平坦追加', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'b', col: -2.2, row: 0.4, color: 'sand', icon: 'attr', label: 'Base + AddBase', sublabel: '100 + 50 = 150', size: 'sm' },
                { id: 'ma', col: -0.7, row: -0.5, color: 'blue', icon: 'ge', label: '× MultiplyAdditive', sublabel: '× (1 + 0.2 + 0.2) = 210', size: 'sm' },
                { id: 'mc', col: 0.9, row: -0.2, color: 'violet', icon: 'ge', label: '× MultiplyCompound', sublabel: '× 1.5 (独立乘区) = 315', state: 'active' },
                { id: 'af', col: 2.2, row: 0.9, color: 'green', icon: 'attr', label: '+ AddFinal', sublabel: '+ 25 = 340 Final!', badge: { text: 'Final = 340.0', tone: 'good' } }
              ],
              edges: [
                { id: 'm1', from: 'b', to: 'ma', packet: 'ge' },
                { id: 'm2', from: 'ma', to: 'mc', packet: 'predict' },
                { id: 'm3', from: 'mc', to: 'af', packet: 'rep' }
              ],
              inspectCard: {
                title: 'UE 5.8 AGGREGATOR ORDER',
                rows: [
                  { left: '1. Base + AddBase', right: '基础加池' },
                  { left: '2. × MultiplyAdditive', right: '1 + Σ(M-1)' },
                  { left: '3. ÷ DivideAdditive', right: '1 + Σ(D-1)' },
                  { left: '4. × MultiplyCompound', right: 'Π(M) 独立连乘', highlight: 'violet' },
                  { left: '5. + AddFinal', right: '最终平加', highlight: 'green' }
                ]
              }
            }
          }
        ]
      },
      {
        slug: 'ge-calculations',
        title: '动态数值计算：SetByCaller、MMC 与 ExecCalc',
        titleEn: 'SetByCaller, ModMagnitudeCalculation (MMC) & ExecutionCalculation',
        summary: '厘清三种动态算值方案的能力边界，牢记 ExecCalc 不支持客户端预测与持续型聚合的关键限制。',
        durationMin: 12,
        difficulty: '高阶',
        goals: [
          { id: 'g1', text: '使用 SetByCaller 从技能代码或武器配置向 GE Spec 动态注入数值', unlockAtStep: 1 },
          { id: 'g2', text: '掌握 MMC 的属性捕获快照 (Snapshot) 机制及其全时效+客户端预测优势', unlockAtStep: 2 },
          { id: 'g3', text: '掌握 ExecCalc 多属性复杂战斗结算管线及其服务端专用限制', unlockAtStep: 3 },
          { id: 'g4', text: '在架构设计中精准选型 ScalableFloat / SetByCaller / MMC / ExecCalc', unlockAtStep: 4 }
        ],
        steps: [
          {
            id: 's1',
            shortLabel: 'SetByCaller',
            phase: 'TECHNIQUE',
            title: '外部动态传参：SetByCaller 告别创建一百个相似 GE',
            paragraphs: [
              '假设游戏里有 50 把手枪，每把枪伤害不同、蓄力时间越长伤害越高。难道要建 50 个 `GE_Damage` 蓝图吗？完全不必！',
              '只需建一个通用的 `GE_WeaponDamage`，将修改器 Magnitude 类型设为 **`SetByCaller`** 并绑定标签 `Data.Damage`。在发射瞬间通过 `SpecHandle.Data->SetSetByCallerMagnitude(TAG_Data_Damage, ChargedDamage)` 动态塞入本次数值即可！'
            ],
            codeSnippet: {
              title: 'C++ 使用 SetByCaller 注入动态蓄力伤害',
              code: `FGameplayEffectSpecHandle SpecHandle = ASC->MakeOutgoingSpec(DamageGEClass, 1.f, ASC->MakeEffectContext());\nSpecHandle.Data->SetSetByCallerMagnitude(TAG_Data_Damage, BaseDmg * ChargeRatio);\nASC->ApplyGameplayEffectSpecToTarget(*SpecHandle.Data.Get(), TargetASC);`
            },
            hud: [
              { key: 'ge_count', label: '所需 GE 资产数', value: '仅 1 个通用模板', status: 'good' },
              { key: 'key_type', label: '传参键推荐', value: 'GameplayTag (勿用 FName)', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'gun', col: -1.8, row: 0, color: 'blue', icon: 'ga', label: '蓄力射击技能', sublabel: '蓄力 1.8x → 90 Dmg' },
                { id: 'spec', col: 0.2, row: 0, color: 'amber', icon: 'ge', label: 'FGameplayEffectSpec', sublabel: 'Map[Data.Damage] = 90', state: 'active' },
                { id: 'tgt', col: 2, row: 0, color: 'green', icon: 'asc', label: 'Target ASC', size: 'sm' }
              ],
              edges: [
                { id: 'sb1', from: 'gun', to: 'spec', packet: 'input', label: 'SetSetByCallerMagnitude' },
                { id: 'sb2', from: 'spec', to: 'tgt', packet: 'ge' }
              ]
            }
          },
          {
            id: 's2',
            shortLabel: 'MMC 与快照时机',
            phase: 'TECHNIQUE',
            title: 'UGameplayModMagnitudeCalculation (MMC) 与 Source/Target 快照边界',
            paragraphs: [
              '当单个修改器或 `DurationMagnitude`（如冷却时长）需要组合多项属性做自定义公式（例如“护盾值 = `50 + 施法者法强 × 1.5 + 技能等级 × 20`”）时，继承 **MMC** 重写 `CalculateBaseMagnitude_Implementation` 非常顺手（注：简单单属性线性换算可直接选免代码的 **`AttributeBased`**，外部传入冷却秒数也可用 **`SetByCaller`**）。',
              '掌握 MMC 必须吃透两大细节：\n1. **快照 (`bSnapshot`) 捕获时机因对象而异**：设 `bSnapshot = true` 时，**`Source` 属性在 `MakeOutgoingSpec` 创建 Spec 时立即捕获**，而 **`Target` 属性要等到 Spec 真正施加到目标 (`Apply`) 时才捕获**！设 `bSnapshot = false` 时，持续型 GE 会在相关属性变化时动态重算修改器。\n2. **完整支持客户端本地预测**：与 `ScalableFloat`、`AttributeBased`、`SetByCaller` 一样可用于本地预测技能的 Cost 或动态 Cooldown！'
            ],
            hud: [
              { key: 'pred', label: '客户端预测支持', value: 'MMC / AttrBased / SetByCaller 均支持', status: 'good' },
              { key: 'snap_src', label: 'Snapshot: Source', value: 'MakeOutgoingSpec 创建时捕获', status: 'good' },
              { key: 'snap_tgt', label: 'Snapshot: Target', value: 'Apply 施加给目标时捕获', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'src', col: -1.9, row: -0.8, color: 'violet', icon: 'attr', label: '捕获 Source 法强', sublabel: 'Snapshot / Non-Snapshot', size: 'sm' },
                {
                  id: 'mmc',
                  col: 0.1,
                  row: 0,
                  color: 'green',
                  icon: 'code',
                  label: 'MMC 计算类',
                  sublabel: '支持预测 + 动态重算',
                  state: 'active',
                  size: 'lg'
                },
                { id: 'cd', col: 2, row: 0.6, color: 'blue', icon: 'ge', label: '动态冷却 / 护盾 GE', badge: { text: 'Client 预测零延迟 ✅', tone: 'good' } }
              ],
              edges: [
                { id: 'mm1', from: 'src', to: 'mmc', packet: 'predict' },
                { id: 'mm2', from: 'mmc', to: 'cd', packet: 'rep', label: '返回单个 float Magnitude', labelTone: 'green' }
              ]
            }
          },
          {
            id: 's3',
            shortLabel: 'ExecCalc 核武器',
            phase: 'PITFALL',
            title: 'UGameplayEffectExecutionCalculation：重型伤害管线与两大禁区',
            paragraphs: [
              '在复杂 ARPG 中，一刀砍下去要同时捕获攻击者的攻击力、暴击率、暴击伤害、破甲率，以及受击者的护甲、格挡率、火焰抗性、头部弱点倍率，做随机数暴击判定后同时输出 `IncomingDamage` 并反扣攻击者耐久度——这正是 **`ExecCalc`** 的主场！',
              '**但请死记 `ExecCalc` 的两大铁律禁区**：\n1. **不支持客户端预测（仅在 Server 权威运行）**！因此绝不能用来算本地预测技能的蓝耗或冷却时间。\n2. **仅在 `Execute` 阶段运行**：只支持 `Instant` 和带周期 (`Period > 0`) 的 GE，**绝不支持无周期的 `Duration` / `Infinite` 临时属性修饰**！'
            ],
            callout: {
              kind: 'warn',
              label: '为什么 ExecCalc 不能预测暴击？',
              text: '客户端与服务端各自掷随机数会导致暴击结果分叉，且敌方护甲/隐藏免伤词条未必同步到了攻击者客户端；因此复杂伤害结算天然属于服务端权威 ExecCalc！'
            },
            hud: [
              { key: 'multi', label: '多属性读写', value: '任意捕获 + 多路输出', status: 'good' },
              { key: 'pred', label: '客户端预测', value: '不支持! (仅 Server 执行)', status: 'bad' },
              { key: 'policy', label: '适用 GE 时效', value: '仅 Instant 与 Periodic', status: 'warn' }
            ],
            scene: {
              nodes: [
                { id: 's_attr', col: -2, row: -0.9, color: 'amber', icon: 'sword', label: 'Source: 攻/暴/穿', size: 'sm' },
                { id: 't_attr', col: -2, row: 1, color: 'blue', icon: 'shield', label: 'Target: 甲/抗/格挡', size: 'sm' },
                {
                  id: 'exec',
                  col: 0.3,
                  row: 0,
                  color: 'violet',
                  icon: 'server',
                  label: 'ExecCalc (Server Only)',
                  sublabel: 'Execute_Implementation()',
                  state: 'active',
                  size: 'lg'
                },
                { id: 'out', col: 2.2, row: 0.2, shape: 'cylinder', color: 'green', icon: 'attr', label: 'OutExecutionOutput', sublabel: '写入 IncomingDamage' }
              ],
              edges: [
                { id: 'ex1', from: 's_attr', to: 'exec', packet: 'input' },
                { id: 'ex2', from: 't_attr', to: 'exec', packet: 'input' },
                { id: 'ex3', from: 'exec', to: 'out', packet: 'ge', label: 'AddOutputModifier', labelTone: 'violet' }
              ]
            }
          },
          {
            id: 's4',
            shortLabel: '计算方案对照',
            phase: 'RECAP',
            title: '总结：精准选对你的 GE 数值计算方案',
            paragraphs: [
              '• 固定数值或单纯随等级查曲线表 → **`ScalableFloat` (`CurveTable`)**\n• 单个捕获属性的线性缩放与偏移（免写 C++） → **`AttributeBased`**\n• 技能激活时由外部代码/武器配置动态注入 → **`SetByCaller`**\n• 多属性自定义单值公式（如复杂急速冷却缩减或法强护盾）且需支持预测或持续重算 → **`MMC`**\n• 服务端多属性交叉结算并同时输出多个属性（暴击/护甲/抗性/弱点） → **`ExecCalc`**（仅限服务端 `Instant` / `Periodic`！）'
            ],
            hud: [
              { key: 'cd_cost', label: '动态冷却 / 蓝耗', value: 'MMC / AttrBased / SetByCaller', status: 'good' },
              { key: 'rpg_dmg', label: '多路复杂伤害', value: 'ExecCalc + MetaAttr (仅Server)', status: 'good' }
            ],
            scene: {
              nodes: [
                { id: 'n1', col: -2, row: -0.8, color: 'sand', icon: 'ge', label: 'Scalable / AttrBased', sublabel: '查表 · 单属性线性换算', size: 'sm' },
                { id: 'n2', col: -0.5, row: 0.9, color: 'blue', icon: 'code', label: 'SetByCaller', sublabel: 'Tag 键值外部注入', size: 'sm' },
                { id: 'n3', col: 0.7, row: -0.8, color: 'green', icon: 'asc', label: 'MMC', sublabel: '多属性单值 · 支持预测', state: 'active' },
                { id: 'n4', col: 2.1, row: 0.8, color: 'violet', icon: 'server', label: 'ExecCalc', sublabel: 'Server 权威多路结算' }
              ],
              edges: [
                { id: 'rc1', from: 'n2', to: 'n4', packet: 'ge', label: '可组合传参' }
              ],
              inspectCard: {
                title: 'CALCULATION SELECTOR',
                rows: [
                  { left: 'Scalable / AttrBased', right: '预测 ✅ | 全时效 ✅' },
                  { left: 'SetByCaller', right: '预测 ✅ | 全时效 ✅' },
                  { left: 'MMC', right: '预测 ✅ | 全时效 ✅', highlight: 'green' },
                  { left: 'ExecCalc', right: '预测 ❌ | 仅瞬发/周期', highlight: 'amber' }
                ]
              }
            }
          }
        ]
      }
    ]
  }
];
