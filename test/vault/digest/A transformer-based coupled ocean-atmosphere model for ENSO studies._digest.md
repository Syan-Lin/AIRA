---
type: paper
tags: [ENSO, transformer, deep-learning, ocean-atmosphere-coupling, climate-prediction, 3D-Geoformer, El-Nino]
created: 2026-04-16
source: Science Bulletin, 2024
confidence: 5
raw: '[[A transformer-based coupled ocean-atmosphere model for ENSO studies..md]]'
---

# A transformer-based coupled ocean-atmosphere model for ENSO studies

该研究提出了一种名为 3D-Geoformer 的基于 Transformer 的海气耦合模型，用于 ENSO 研究与预测。不同于传统的端到端深度学习模型，3D-Geoformer 在架构上显式表征了热带太平洋地区的海气耦合过程：以上层海洋三维温度场和海表风应力作为输入和输出，通过时-空自注意力机制捕捉多变量之间的非局地相互作用，并以滚动预测的方式逐月更新海洋和大气状态。回顾性后报实验表明，该模型在 Niño3.4 指数预测技巧上显著优于现有的动力模式（CPC/IRI 和 NMME），并且能够有效刻画 2015–2016 年强厄尔尼诺事件期间海温异常的发展和传播过程。

## Key Findings

1. **显式海气耦合表征**：3D-Geoformer 以 9 个变量（上层 150m 海洋温度、纬向和经向风应力）作为输入输出，在逐月滚动预测中实现海洋与大气异常的双向交换。
2. **超越动力模式**：在 1983–2021 年测试期内，3D-Geoformer 对 Niño3.4 指数的全年相关系数技巧优于 CPC/IRI 动力模式和 NMME 多模式集合。
3. **最优时间窗口（TI）**：敏感性实验表明，当输入预测因子的时间窗口为 18 个月时，ENSO 预测技巧达到饱和，有效预测提前期可延长至约 16 个月。
4. **适用于可预报性研究**：由于基于统计关系构建，3D-Geoformer 可方便地对初始条件进行扰动实验，以识别影响 ENSO 预测技巧的关键变量和敏感区域，而不引入动力模式中的不平衡问题。

## Relevance

3D-Geoformer 为深度学习模型在气候预测中的应用提供了一种新范式，强调通过模型架构设计显式表征物理耦合过程，从而提升预测技巧和可解释性，对 ENSO 延伸期预报及气候可预报性研究具有重要参考价值。
