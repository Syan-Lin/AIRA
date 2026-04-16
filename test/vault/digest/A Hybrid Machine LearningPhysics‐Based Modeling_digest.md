---
type: paper
tags: [tropical-cyclone, machine-learning, numerical-weather-prediction, extended-forecast, Pangu-Weather, WRF]
created: 2026-04-16
source: JGR Machine Learning and Computation, 2024
confidence: 5
raw: '[[A Hybrid Machine LearningPhysics‐Based Modeling.md]]'
---

# A hybrid machine learning/physics-based modeling framework for 2-week extended prediction of tropical cyclones

该研究提出了一种混合机器学习/物理模型的热带气旋（TC）预报框架，将基于机器学习的盘古（Pangu）全球天气预测模型与高分辨率的物理区域模式 WRF 相结合，实现长达两周的 TC 延伸期预报。框架通过三项关键技术整合两者优势：以盘古预报驱动 WRF 动力降尺度、利用谱逼近（spectral nudging）调整 WRF 中的大尺度环流以匹配盘古预报、以及使用海洋混合层模型更新海表温度。对 2018–2023 年间五个长寿命热带气旋的验证表明，该混合框架在两周平均 TC 路径误差上较全球确定性数值预报模式降低 59%、强度误差降低 32%，展现出显著的延伸期预报潜力。

## Key Findings

1. **混合架构互补优势**：盘古模型擅长大尺度环流和 TC 路径预报，WRF 高分辨率模式能捕捉 TC 内核演变过程，两者结合显著提升两周预报技巧。
2. **三项核心组件**：动力降尺度、谱逼近约束大尺度引导气流、海洋混合层模型更新 SST，确保框架可用于实时预报。
3. **显著误差降低**：与全球 NWP 模式相比，两周平均路径和强度误差分别降低 59% 和 32%；与 ERA5 驱动的 WRF 相比，分别降低 32% 和 23%。
4. **跨洋盆适用性**：框架在 2018–2023 年五个长寿命 TC（Hector、Florence、Surigae、Sam、Freddy）上得到验证，覆盖东太平洋、北大西洋、西太平洋和南印度洋。

## Relevance

该混合框架为如何将数据驱动的机器学习全球预报与物理高分辨率区域模式相结合提供了范例，对提升 TC 延伸期预报具有重要应用价值，可用于防灾减灾和灾害预警。
