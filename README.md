# UE5 GAS · 交互式架构学习工坊 (UE 5.8 & Lyra Standard)

仿照 [Designed to Scale](https://designed-to-scale.vercel.app/) 交互式工作台美学打造，专为 **Unreal Engine 5 (UE 5.8)** 游戏开发者设计的 **Gameplay Ability System (GAS)** 深度学习网站。

## ✨ 核心特性

1. **原汁原味的 3 栏等距交互工作台 (`课程图解`)**
   - 浅色触感暖纸 (`#f4ebe0`) 与深色浓缩咖啡 (`#211e1a`) 双主题无缝切换。
   - **8 大彩色文件夹模块 · 20 节核心课**：每节课拆解为多步引导叙事，实时驱动中央等距 3D 节点与动态网络数据包动画。
   - 支持画布拖拽平移、缩放、全屏、暂停 (`Space`)、重播 (`R`) 与方向键 (`←` / `→`) 切步。
2. **对标 UE 5.8 官方源码与 Lyra 规范校准**（基于本机 UE 5.8.1 源码静态审查，示例代码未逐一编译 / 联机运行）
   - **宿主与复制**：`APlayerState` vs `ACharacter` 选型、双端 `InitAbilityActorInfo` 与重生防重复授予、调高 `SetNetUpdateFrequency`（Lyra 示例 100）、`Full` / `Mixed` / `Minimal` 复制模式与 `Owner` 链约束。
   - **标签与属性**：`FGameplayTagCountContainer` 与 `EGameplayTagReplicationState` 统一标签复制（移除旧 `AddReplicatedLooseGameplayTag`）、`UGameplayAbilitiesDeveloperSettings` 全局配置、`REPNOTIFY_Always`、`PreAttributeBaseChange` + `PostAttributeChange` 约束与 `IncomingDamage` 元属性管线。
   - **UE 5.8 最新演进**：`UGameplayEffectComponent` 完整模块化体系（`UTargetTags`、`UAssetTags`、`UCancelAbilityTags`、`UGameplayEffectUIData`）、单通道五段乘区 (`MultiplyAdditive` vs `MultiplyCompound` vs `AddFinal`)、废弃 `NonInstanced`、`PlayAnimAndWait` 与 `AbilityAsync_*`、`UAnimNotify_GameplayCue`、GAS × Iris 序列化管线、`ShouldDoServerAbilityRPCBatch` + `FScopedServerAbilityRPCBatcher` 合批与 `ULyraAbilitySet` 凭证袋模式。
3. **线上 Bug 实战诊断 (`实战诊断`)**
   - 8 道源自真实多人联机项目的疑难排错案例，附完整 C++ 代码上下文与源码机理解析。
4. **运行时交互实验台 (`架构沙盒`)**
   - 实时拨动 UE 5.8 聚合器各乘区开关、亲手复现“负血量幽灵截断 Bug”、对比激活 RPC 与属性复制追赶两条预测时间线（数值为演示假设）。
5. **全局搜索 (`Ctrl + K`) 与架构师速查表 (`速查手册`)**，含最小联机工程接线清单与双客户端 + DS 验收用例。

## 🚀 本地运行与构建部署

```bash
# 安装依赖
npm install

# 启动本地开发预览 (http://127.0.0.1:5173)
npm run dev

# 构建静态生产包 (输出至 dist/，可直接一键部署至 Vercel / Cloudflare Pages)
npm run build
```
