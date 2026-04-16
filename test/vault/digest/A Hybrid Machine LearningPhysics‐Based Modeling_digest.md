---
type: paper
tags: [TropicalCyclone, MachineLearning, PhysicsBasedModeling, PanguWeather, WRF, SubseasonalForecast]
created: 2026-04-16
source: Journal of Geophysical Research: Machine Learning and Computation
confidence: 5
raw: '[[A Hybrid Machine LearningPhysics‐Based Modeling.md]]'
---

# A Hybrid Machine Learning/Physics‐Based Modeling Framework for 2‐Week Extended Prediction of Tropical Cyclones

本文提出了一种机器学习与物理模型混合的框架，将基于机器学习的全球天气预测模型 Pangu-Weather 与高分辨率的物理区域模型 WRF 相结合，以实现热带气旋（TC）的两周延伸预测。该框架包含三个核心组件：利用 WRF 对 Pangu 进行动力降尺度、通过谱逼近调整大尺度环流以保留 Pangu 预测的环境引导气流，以及利用海洋混合层（OML）模型更新海表温度（SST）。该混合框架在 2018–2023 年五个长寿命热带气旋上的验证表明，其两周平均 TC 路径误差较全球数值天气预报（NWP）模型降低 59%，强度误差降低 32%，显著优于单独的 Pangu 或 WRF 模型，且具备实时预报的可行性。

## Key Findings

1. **混合框架设计**：将 Pangu 的大尺度环流与 TC 路径预测优势，与 WRF 的高分辨率内核结构和强度模拟能力相结合。
2. **谱逼近（Spectral Nudging）**：利用 Pangu 预报驱动 WRF 的大尺度谱逼近，使区域模型的大尺度环流与全球模型保持一致，从而改善 TC 路径预测。
3. **海洋混合层耦合**：通过 OML 模型更新 SST，反映海气相互作用对 TC 发展的影响。
4. **显著的性能提升**：相比全球 NWP 模型，两周平均路径误差降低 59%，强度误差降低 32%；相比 ERA5 驱动的 WRF 模型，路径误差降低 32%，强度误差降低 23%。
5. **实时应用潜力**：该框架仅需单个时刻的全球分析或再分析数据即可启动，计算效率适合业务化预报。

## Relevance

该研究为延伸期（sub-seasonal）热带气旋预报提供了一条新路径，展示了机器学习全球模型与高分辨率物理区域模型协同工作的巨大潜力，对防灾减灾具有重要意义。
