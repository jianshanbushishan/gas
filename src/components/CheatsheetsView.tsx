import React from 'react';

export const CheatsheetsView: React.FC = () => {
  return (
    <div className="alt-view">
      <div className="alt-container">
        <div className="alt-hero">
          <div className="breadcrumb">ARCHITECT CHEATSHEETS · 随查随用速查手册</div>
          <h1>UE 5.8 GAS 核心规范与调试速查表</h1>
          <p>浓缩源码级规则：组件迁移映射、网络复制选型、数值计算对比与控制台调试命令。</p>
        </div>

        <div className="card-grid">
          {/* Card 1: UE 5.8 GE Components */}
          <div className="panel-card">
            <h3>1. UE 5.8 UGameplayEffectComponent 对照表</h3>
            <table className="cheat-table">
              <thead>
                <tr>
                  <th>需求目标</th>
                  <th>对应模块化组件类名</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>给受击目标挂标签</strong> (如眩晕/冷却)
                  </td>
                  <td>
                    <code>UTargetTagsGameplayEffectComponent</code>
                    <br />
                    <span style={{ color: 'var(--muted)' }}>面板名: Grant Tags to Target Actor</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>描述 GE 自身类型标签</strong> (不传给角色!)
                  </td>
                  <td>
                    <code>UAssetTagsGameplayEffectComponent</code>
                    <br />
                    <span style={{ color: 'var(--muted)' }}>面板名: Tags This Effect Has</span>
                  </td>
                </tr>
                <tr>
                  <td>准入 / 暂停(Ongoing) / 驱散条件</td>
                  <td>
                    <code>UTargetTagRequirementsGameplayEffectComponent</code>
                  </td>
                </tr>
                <tr>
                  <td>Buff 存续期间临时授予技能</td>
                  <td>
                    <code>UAbilitiesGameplayEffectComponent</code>
                  </td>
                </tr>
                <tr>
                  <td>免疫特定标签的其他负面 GE</td>
                  <td>
                    <code>UImmunityGameplayEffectComponent</code>
                  </td>
                </tr>
                <tr>
                  <td>施加瞬间驱散目标身上匹配的旧 GE</td>
                  <td>
                    <code>URemoveOtherGameplayEffectComponent</code>
                  </td>
                </tr>
                <tr>
                  <td>Debuff 存续期间封锁带指定标签的技能</td>
                  <td>
                    <code>UBlockAbilityTagsGameplayEffectComponent</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>施加/周期跳瞬间打断</strong>正在运行的技能
                  </td>
                  <td>
                    <code>UCancelAbilityTagsGameplayEffectComponent</code>
                    <br />
                    <span style={{ color: 'var(--muted)' }}>
                      面板名: Cancel Abilities with Tags（支持 OnApplication / OnExecution 与 With/Without Tags）
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>附带 Buff 图标/描述等 UI 元数据</td>
                  <td>
                    <code>UGameplayEffectUIData</code>（如 <code>_TextOnly</code>）
                    <br />
                    <span style={{ color: 'var(--muted)' }}>
                      已转为 GEComponent 子类，C++ 用 <code>FindComponent&lt;UGameplayEffectUIData&gt;()</code>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>施加 / 到期 / 被驱散时联动派生其他 GE</td>
                  <td>
                    <code>UAdditionalEffectsGameplayEffectComponent</code>
                    <br />
                    <span style={{ color: 'var(--muted)' }}>注意：叠层溢出 OverflowEffects 仍在 GE 本体 Stacking 栏</span>
                  </td>
                </tr>
                <tr>
                  <td>按概率施加 / 自定义 C++ 准入校验</td>
                  <td>
                    <code>UChanceToApplyGameplayEffectComponent</code>
                    <br />
                    <code>UCustomCanApplyGameplayEffectComponent</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card 2: Replication Modes */}
          <div className="panel-card">
            <h3>2. ASC 宿主与 ReplicationMode 铁律矩阵</h3>
            <table className="cheat-table">
              <thead>
                <tr>
                  <th>单位类型</th>
                  <th>推荐宿主</th>
                  <th>复制模式</th>
                  <th>关键注意事项</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>多人玩家英雄</strong>
                  </td>
                  <td>
                    <code>APlayerState</code>
                  </td>
                  <td>
                    <strong>Mixed</strong>
                  </td>
                  <td>
                    调高 <code>SetNetUpdateFrequency</code>（Lyra 示例 100）；Character 转发{' '}
                    <code>IAbilitySystemInterface</code>；重生时守卫防重复授予并解绑旧 Avatar
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>多人 AI 怪物/小兵</strong>
                  </td>
                  <td>
                    <code>ACharacter</code>
                  </td>
                  <td>
                    <strong>Minimal</strong>
                  </td>
                  <td>
                    误设 Mixed 时因无拥有连接，没有客户端会收到完整 ActiveGE；血量仍由 AttributeSet 正常同步
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>单机 / 特需全量检视</strong>
                  </td>
                  <td>Character / PS</td>
                  <td>
                    <strong>Full</strong>
                  </td>
                  <td>常规多人对局全场开启 Full 带宽开销大，且会向他人下发完整 Buff 明细</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card 3: Magnitude Calculators */}
          <div className="panel-card">
            <h3>3. 五种 GE 数值计算方案选型表</h3>
            <table className="cheat-table">
              <thead>
                <tr>
                  <th>方案</th>
                  <th>支持时效</th>
                  <th>客户端预测</th>
                  <th>典型最佳场景</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>ScalableFloat</code>
                  </td>
                  <td>全部</td>
                  <td>✅ 支持</td>
                  <td>固定数值或按技能等级查 CurveTable</td>
                </tr>
                <tr>
                  <td>
                    <code>AttributeBased</code>
                  </td>
                  <td>全部</td>
                  <td>✅ 支持</td>
                  <td>单属性线性换算（系数 + 偏移），免写 C++</td>
                </tr>
                <tr>
                  <td>
                    <code>SetByCaller</code>
                  </td>
                  <td>全部</td>
                  <td>✅ 支持</td>
                  <td>蓄力百分比、武器面板伤害、动态冷却秒数注入</td>
                </tr>
                <tr>
                  <td>
                    <code>MMC</code>
                  </td>
                  <td>全部 (可实时重算)</td>
                  <td>✅ 支持</td>
                  <td>多属性自定义公式的冷却时长、随法强变化的护盾量</td>
                </tr>
                <tr>
                  <td>
                    <code>ExecCalc</code>
                  </td>
                  <td>仅 Instant / 周期跳</td>
                  <td>❌ 仅 Server</td>
                  <td>捕获攻防双方十余项属性的暴击/破甲/抗性综合伤害结算</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card 4: Console Debug Commands */}
          <div className="panel-card">
            <h3>4. 联机排错必备控制台命令 (Console / CVar)</h3>
            <table className="cheat-table">
              <thead>
                <tr>
                  <th>命令 / 快捷键</th>
                  <th>实战调试用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>showdebug abilitysystem</code>
                  </td>
                  <td>在视口实时叠印当前目标的属性 Base/Current、活跃 GE 与技能状态</td>
                </tr>
                <tr>
                  <td>
                    <code>AbilitySystem.Debug.NextCategory</code>
                  </td>
                  <td>在 Attributes / GameplayEffects / Abilities 三页调试面板间切换</td>
                </tr>
                <tr>
                  <td>
                    <code>&apos;</code> 撇号键 (Gameplay Debugger)
                  </td>
                  <td>推荐！开启引擎可视化调试器，用小键盘数字键切换到 Abilities 分类对比双端标签与技能状态</td>
                </tr>
                <tr>
                  <td>
                    <code>AbilitySystem.Effect.ListActive -Server</code>
                  </td>
                  <td>在日志打印服务端真实活跃 GE 列表，排查客户端预测失步</td>
                </tr>
                <tr>
                  <td>
                    <code>Net PktLag=120</code> / <code>Log LogAbilitySystem Verbose</code>
                  </td>
                  <td>模拟 120ms 真实延迟并输出详尽预测密钥核销与拒绝回滚日志</td>
                </tr>
                <tr>
                  <td>
                    <code>AbilitySystem.IgnoreCooldowns</code> / <code>IgnoreCosts</code>
                  </td>
                  <td>
                    UE 5.8 编辑器 <strong>Gameplay Abilities Editor Settings</strong> 内置调试开关（另含{' '}
                    <code>GlobalAbilityScale</code>、<code>DebugDrawMaxDistance</code>）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card 5: Minimal end-to-end multiplayer project checklist */}
          <div className="panel-card" style={{ gridColumn: '1 / -1' }}>
            <h3>5. 最小联机火球术：端到端接线清单与双端验收用例</h3>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 0 }}>
              用课程中的火球案例从零串起一个可验证的最小工程。验收环境：2 个 Client + 1 个 Dedicated Server，建议配合{' '}
              <code>Net PktLag=120</code>。
            </p>
            <table className="cheat-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>接线步骤</th>
                  <th>关键产物 / 验证点</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>启用插件与模块</td>
                  <td>
                    <code>GameplayAbilities</code> 插件；Build.cs 加 Abilities / Tags / Tasks
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>ASC + AttributeSet 创建与初始化</td>
                  <td>
                    PlayerState 持有 ASC（Mixed、调高 NetUpdateFrequency）；初始属性用 Instant GE 或 InitStats
                    写入
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>双端 InitAbilityActorInfo</td>
                  <td>
                    Server: <code>PossessedBy</code>；Client: <code>OnRep_PlayerState</code>；Character 转发接口
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>服务端授予技能（防重复）</td>
                  <td>
                    仅 Authority 调 <code>GiveAbility</code>，<code>bStartupAbilitiesGiven</code> 守卫
                  </td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>输入路由</td>
                  <td>EnhancedInput → InputTag → 匹配 DynamicSpecSourceTags → TryActivateAbility</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Cost / Cooldown GE</td>
                  <td>Instant -30 Mana；Duration 5s + TargetTags 授予 Cooldown.Fireball</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>伤害 Spec</td>
                  <td>服务端投射物命中 → SetByCaller 伤害 → IncomingDamage → PostGEExecute 按 BaseValue 扣血</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>UI 监听</td>
                  <td>
                    <code>GetGameplayAttributeValueChangeDelegate</code> + Cooldown 标签事件（预测期显示本地时间，权威 GE
                    到达后对齐服务器剩余时间）
                  </td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>重生清理</td>
                  <td>移除死亡清除型 GE → 解绑旧 Avatar → 新 Pawn 重新 InitAbilityActorInfo</td>
                </tr>
              </tbody>
            </table>
            <table className="cheat-table" style={{ marginTop: 12 }}>
              <thead>
                <tr>
                  <th>验收用例</th>
                  <th>复现方法</th>
                  <th>期望结果</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>A. 预测被拒绝</strong>
                  </td>
                  <td>服务端对 Client1 施加眩晕的同时 Client1 本地按下火球</td>
                  <td>本地蒙太奇被打断、预测 Mana 与冷却回滚；服务端无投射物；无残留 Cue</td>
                </tr>
                <tr>
                  <td>
                    <strong>B. 旁观者中途进入相关范围</strong>
                  </td>
                  <td>Client2 在 NetCullDistance 外，Client1 挂上持续灼烧后 Client2 跑近</td>
                  <td>Client2 通过 WhileActive 看到持续火焰；状态标签动画正确</td>
                </tr>
                <tr>
                  <td>
                    <strong>C. 重生后重新绑定 ASC</strong>
                  </td>
                  <td>Client1 死亡重生 2 次后查看技能列表与冷却</td>
                  <td>技能不重复（showdebug abilitysystem 列表数量不变）、大招 CD 保留、新 Avatar 正常播放蒙太奇</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
