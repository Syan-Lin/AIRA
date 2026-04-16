---
type: paper
tags:
  [
    ENSO,
    Transformer,
    DeepLearning,
    OceanAtmosphereCoupling,
    3DGeoformer,
    ClimatePrediction,
  ]
created: 2026-04-16
source: Science Bulletin
confidence: 5
raw: '[[A transformer-based coupled ocean-atmosphere model for ENSO studies..md]]'
---

# A Transformer-Based Coupled Ocean-Atmosphere Model for ENSO Studies

本文提出了 3D-Geoformer，一种基于 Transformer 架构的纯数据驱动海气耦合模型，用于 ENSO 相关的多变量预测。该模型显式地表示了热带太平洋上层海洋三维温度场与海表风场之间的月际耦合过程，突破了现有深度学习模型仅从单点时间序列预测 ENSO 指数的局限。3D-Geoformer 以 12 个月的历史场作为输入，通过滚动预测方式输出未来 20 个月的多变量场。后报试验表明，该模型在预测 Niño3.4 指数方面的相关技巧显著优于 CPC/IRI 动力模型预测和北美多模式集合（NMME）。敏感性实验进一步揭示，当输入预测因子的时间间隔（TI）取 18 个月时，模型预测技巧达到饱和，有效预报时效可达约 16 个月，接近 ENSO 可预报性的上限。

## Key Findings

1. **显式海气耦合表示**：3D-Geoformer 在输入和输出中同时包含 9 个海洋和大气变量（上层 150 m 海洋温度及经向/纬向海表风应力），在滚动预测中实现月际海气异常交换。
2. **三维场预测能力**：模型能够生成热带太平洋上层海洋的三维温度异常场及其与海表风场的协同演变，突破了传统深度学习模型仅从单点时间序列预测 ENSO 指数的限制。
3. **超越动力模型的预测技巧**：在 1983–2021 年后报试验中，3D-Geoformer（TI=18）预测 Niño3.4 指数的全季节相关技巧优于 CPC/IRI 动力模型和 NMME 各成员模型。
4. **最优时间间隔（TI）**：敏感性实验表明，随着输入时间间隔 TI 的增加，预测技巧提升并在 TI=18 个月时达到饱和，此时有效预报时效约为 16 个月。
5. **可解释性优势**：通过改变输入预测因子的权重进行扰动实验，可以方便地识别影响 ENSO 预测技巧的关键变量和敏感区域，而不会像动力模型那样引入动力不平衡。

## Relevance

3D-Geoformer 为 ENSO 预测提供了一种新的纯数据驱动工具，其在显式表示海气耦合和预测三维海洋温度场方面的能力，为理解 ENSO 可预报性及改进气候预测提供了新思路。
