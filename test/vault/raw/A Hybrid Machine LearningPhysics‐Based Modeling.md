---
type: paper
source: /home/linsiyuan/AIRA-SKILL/Papers4TC/ML-physiCS/A Hybrid Machine LearningPhysics‐Based Modeling.pdf
created: 2026-04-16
---

RESEARCH ARTICLE 10.1029/2024JH000207

## Key Points:

• A tropical cyclone (TC) forecasting framework is designed to integrate a machine learning‐based model (Pangu) with a physics‐based model

• The framework improves the 2‐week extended prediction of TCs compared to the standalone global deterministic NWP models and the Pangu model

• For 2‐week TC forecasts, TC track accuracy is crucial as it is fundamental to accurate predictions of intensity and structure

## Supporting Information:

Supporting Information may be found in the online version of this article.

Correspondence to: Z.‐M. Tan, zmtan@nju.edu.cn

## Citation:

Liu, H.‐Y., Tan, Z.‐M., Wang, Y., Tang, J., Satoh, M., Lei, L., et al. (2024). A hybrid machine learning/physics‐based modeling framework for 2‐week extended prediction of tropical cyclones. Journal of Geophysical Research: Machine Learning and Computation, 1, e2024JH000207. https://doi.org/10.1029/2024JH000207

Received 20 MAR 2024  
Accepted 8 JUL 2024

<!-- image-->

# A Hybrid Machine Learning/Physics‐Based Modeling Framework for 2‐Week Extended Prediction of Tropical Cyclones

Hao‐Yan Liu1,2 , Zhe‐Min Tan3 , Yuqing Wang4 , Jianping Tang3 , Masaki Satoh5 , Lili Lei3 , Jian‐Feng Gu3 , Yi Zhang3 , Gao‐Zhen Nie6 , and Qi‐Zhi Chen7

1 Key Laboratory of Marine Hazards Forecasting, Ministry of Natural Resources, Hohai University, Nanjing, China, 2 State Key Laboratory of Severe Weather, Chinese Academy of Meteorological Sciences, Beijing, China, 3 Key Laboratory of Mesoscale Severe Weather, Ministry of Education, and School of Atmospheric Sciences, Nanjing University, Nanjing, China, 4 International Pacific Research Center and Department of Atmospheric Sciences, School of Ocean and Earth Science and Technology, University of Hawaii at Manoa, Honolulu, HI, USA, 5 Atmosphere and Ocean Research Institute, The University of Tokyo, Kashiwa, Japan, 6 National Meteorological Center, China Meteorological Administration, Beijing, China, 7 Nanjing Pulan Atmospheric Environment Research Institute, Nanjing, China

Abstract Prediction of tropical cyclones (TCs) beyond a week is challenging but of great importance for disaster prevention and mitigation. We propose a hybrid machine learning (ML)/physics‐based modeling framework to extend TC forecasts to 2 weeks. This framework integrates a recently launched ML‐based global weather prediction model (Pangu) and the high‐resolution physics‐based regional weather research and forecasting (WRF) model. The Pangu model shows promise in enhancing the accuracy of predictions for large‐ scale circulation and TC tracks, while the high‐resolution WRF model is capable of capturing the core processes underlying TC evolution. To capitalize on the complementary strengths of both the Pangu and WRF models in predicting TCs, the framework comprises three key components: downscaling the Pangu model using the WRF model, adjusting large‐scale circulation through spectral nudging driven by the Pangu model forecasts, and updating sea surface temperature using an ocean mixed‐layer model. These components also ensure the framework's feasibility for real‐time TC forecasting. The prediction skill of the framework has been demonstrated for five long‐lived TCs across various basins from 2018 to 2023. Results indicate that the hybrid ML/physics‐based modeling framework decreased the 2‐week mean TC track and intensity errors by 59% and 32% compared to the global numerical weather prediction models, by 2% and 59% compared to the ERA5‐ driven Pangu model, and by 32% and 23% compared to the ERA5‐driven WRF model, respectively. This implies that the framework has great potential to be used for 2‐week extended prediction of TCs.

Plain Language Summary To extend tropical cyclone (TC) forecasts to 2 weeks, a hybrid modeling framework that combines machine learning (ML) with physics‐based models is proposed. This framework leverages the complementary strengths of the two models: the ML‐based Pangu model's exceptional capacity for predicting large‐scale circulation and TC tracks and the high‐resolution physics‐based regional weather research and forecasting (WRF) model's expertise in capturing the core processes underlying TC evolution. Importantly, this framework is well‐suited for real‐time TC forecasts, as it can operate effectively using global analysis or reanalysis data provided at just a single time point. This framework demonstrated superior performance in forecasting the track, intensity, and inner‐core size of five long‐lived TCs across various ocean basins from 2018 to 2023. Its potential to extend current operational TC forecasts, traditionally limited to 5 days of lead time, offers a substantial breakthrough by significantly prolonging forecast durations. This extension carries profound implications for disaster preparedness, resource allocation, and proactive measures in regions susceptible to TC impact. Furthermore, the 2‐week TC forecasts play a crucial role in understanding the correlations, interactions, and error propagations among TC track, intensity, and structure.

## 1. Introduction

Forecasts for tropical cyclones (TCs) and other hydrometeorological hazards up to 2 weeks in advance are crucial for safeguarding lives and property (Webster, 2013). Nevertheless, most operational forecast agencies typically predict individual TCs within a lead time of less than 5 days after their formation, rarely extending beyond this period (Cangialosi, 2023). Although some studies have achieved success in forecasting TCs for about a week, focusing primarily on TC tracks (Cheung et al., 2021, 2022), the extension of forecasting capabilities beyond this timeframe remains a significant challenge fraught with uncertainties.

Subseasonal predictions, which extend beyond 2 weeks, primarily focus on TC activity rather than detailed track, intensity, and structure forecasts for individual TCs (Camargo et al., 2019; Schreck et al., 2023). Meanwhile, although recent studies have yielded improved numerical simulations for individual TCs (Liu et al., 2023; Xiang et al., 2015; Yamada et al., 2023), the complex multi‐scale interactions constrained the predictability of TC track and intensity for periods exceeding a week (Liu et al., 2023). This limitation could be contributed by different growth rates of errors at different scales, especially with integrated initial condition errors and model errors (Wang et al., 2024). Recent studies projected that the track errors for 7‐ to 8‐day TC forecasts would decrease to the current level of operational 5‐day forecast errors over the next 1 to 2 decades, indicating the potential for an improvement for additional 2 to 3‐day lead times in TC track forecast (Yu et al., 2022; Zhou & Toth, 2020). Therefore, a central question is whether we can expedite this effort and extend TC forecasts beyond a week (Tan et al., 2022).

Over the past few decades, significant reductions in TC track errors within 5 day lead times have been achieved by global numerical weather prediction (NWP) models (Yamaguchi et al., 2017). This improvement can be attributed to the advancements in several areas, including observations (Aberson & Franklin, 1999; Chou et al., 2011), data assimilation techniques (Zhang & Weng, 2015), higher‐resolution NWP models (Nakano et al., 2017; Yamada et al., 2016, 2023), TC NWP initialization (Cha & Wang, 2013; Liu & Tan, 2016; Liu et al., 2018), ensemble forecasting (Lei et al., 2020), and a better understanding of TC‐motion physics (Chan, 2005; Ito et al., 2020). However, there have been challenges in improving intensity forecasts of TCs (DeMaria et al., 2014; Yamaguchi et al., 2017) primarily due to the complex internal and external processes involved in TC intensity change (Wang & Wu, 2004; X. Chen, Rozoff, et al., 2023). Specifically, changes in the intensity of TCs can be influenced by factors such as the environmental forcing (Frank & Ritchie, 2001; Gu et al., 2015), the underlying surface (Li & Tan, 2023), TC structure (Guo & Tan, 2022; Li et al., 2022), and interactions with other weather systems or TCs (Liu et al., 2021). Additionally, resolutions of global NWP models are often inadequate to represent the inner core structure of TCs accurately, leading to an underestimation of TC intensity (Yamaguchi et al., 2017) but increasing the resolution of global models imposes substantial computational burdens.

To achieve high model resolution while limiting computational resources, regional models have been used to improve TC intensity forecasts (Doyle et al., 2014; Gall et al., 2013). The high‐resolution regional NWP models utilize the output from global NWP model predictions as initial and lateral boundary conditions. This is commonly known as dynamical downscaling and is frequently employed in the study of TC climatology and TC forecasts (Emanuel, 2010; Emanuel et al., 2008). The accuracy of TC forecasts by a regional model depends strongly on the quality of the driving global model in predicting large‐scale circulation (Lei et al., 2022). Furthermore, to alleviate the deviation of large‐scale flow in the regional model domain from the global model forecasts, a technique called large‐scale spectral nudging (SN) is used (Kida et al., 1991; Sasaki et al., 1995; von Storch et al., 2000). This has been shown to effectively improve TC track forecasts by keeping the large‐scale steering flows consistent with the driving fields (Cha et al., 2011; Wang et al., 2013). Given the crucial role of an accurate track forecast in improving the reliability and precision of TC intensity forecasts, a recent study (Liu et al., 2023) demonstrated that when global analysis data was used as driving fields of the large‐scale SN, the simulated track and intensity of TC Freddy in 2023 closely matched observations even beyond 2 weeks. This gives the hope to extend TC forecasts from the current one to 2 weeks if the large‐scale driving fields can be reliably predicted.

Recently, several machine learning (ML)‐based global weather prediction models, such as Pangu‐Weather (hereafter referred to as Pangu, Bi et al., 2023), Fuxi (L. Chen, Zhong, et al., 2023), GraphCast (Lam et al., 2023), and FourCastNet (Pathak et al., 2022), have demonstrated enhanced accuracy and efficiency in medium‐range global weather forecasting. The Pangu model (Bi et al., 2023) demonstrated superior performance in forecasting TC tracks for 88 TCs in 2018 compared to the operational integrated forecasting system of the European Center for medium‐range weather forecasts (ECMWF). Nevertheless, the 25‐km horizontal resolution of the Pangu model has its limitations in precisely representing small‐scale variability (Selz & Craig, 2023) and the inner‐core structure of TCs, thereby impacting its accuracy in forecasting TC intensity and structure. However, if the Pangu forecasts outperform global NWP forecasts in the 2‐week prediction of large‐scale circulation and TC track, we can retain these advantages and further utilize the high‐resolution physics‐based regional weather and research forecasting (WRF) model (Skamarock et al., 2019) to enhance the intensity and structure forecasts of TCs, which we call the hybrid ML/physics‐based modeling framework. This study aims to introduce the method and demonstrate its effectiveness and superior performance of extended forecasts for up to 2 weeks for five long‐lived TCs across different ocean basins from 2018 to 2023. The framework can be used for all ocean basins and potentially can be extended to include multiple TCs occurring simultaneously.

(a)

<!-- image-->

Figure 1. Flowchart of the hybrid ML/physics‐based modeling framework for TC forecasts. (a) The Pangu model forecasting. (b) The WRF's lateral boundary condition and SN driving field interpolated from (a). (c) The WRF model forecasting and (d) the OML model coupled with (c). All fields were derived from the 2‐week forecast for severe TC Freddy in 2023. Shading in global forecast and (a–c) denotes geopotential height at 850 hPa. Vectors in (b) denote horizontal winds with wavenumbers exceeding 1,000 km at 850 hPa. The black boxes in (c) represent the inner meshes of the WRF model tracking Freddy's movement. The left and right panels of (d) show the changes in OML depth and SST during the last 3 days of Freddy's forecast period. The red curves in (a, c, d) depict the forecasted track of Freddy.

## 2. Hybrid ML/Physics‐Based Modeling Framework

In this study, we propose a hybrid ML/physics‐based modeling framework for 2‐week extended prediction of TCs (Figure 1). The framework operates by dynamically downscaling the ML‐based Pangu model using the high‐ resolution physics‐based regional WRF model (Figures 1a–1c), adjusting large‐scale circulation through the large‐scale SN driven by the Pangu model forecasts (Figures 1b and 1c) and updating sea surface temperature (SST) with an ocean mixed layer (OML) model (Figures 1c and 1d). Specifically, adjusting large‐scale circulation helps preserve the environmental steering flows captured by the Pangu model for TC motion. Meanwhile, downscaling the Pangu model with the high‐resolution WRF model and updating SST using the OML model are designed to resolve critical dynamic processes for TC development and to ensure the framework's feasibility for real‐time TC forecasting. Therefore, the framework can operate effectively with global analysis or reanalysis data provided at just a single time point.

The execution is computationally efficient, requiring less than 2 hr for a Pangu model forecast (Figure 1a) with 10 CPU cores (Intel Xeon Gold 6126) and about 15 hr for a WRF forecast (Figure 1c) with 192 CPU cores (Intel Xeon Gold 6226R) for a 2‐week forecast period. If implemented by forecast agencies, these elapsed times could be significantly reduced due to their substantially greater computing capabilities.

## 2.1. Downscaling the Pangu Model

First, global data (Global Forecast System [GFS] and ERA5 data sets, refer to Section 3.1) are used as the initial conditions for 2‐week forecasts with the Pangu model (Figure 1a). The outputs from the Pangu model subsequently serve as lateral boundary conditions for the WRF model (Figure 1b). Following this, a 2‐week high‐ resolution simulation of the WRF model is conducted (Figure 1c), using initial conditions interpolated from the global data and lateral boundary conditions derived from the Pangu forecasts (Figure 1b). This process is considered as the dynamical downscaling of the Pangu model forecasts.

## 2.2. Adjusting Large‐Scale Circulation

To preserve the characteristics of the TC motions captured by the Pangu model, it is crucial that the large‐scale circulations simulated by the WRF model closely resemble those forecasted by the Pangu model, as large‐scale steering flow significantly influence TC movement (Chan, 2010). This objective can be met through the use of the large‐scale SN, which helps minimize deviations in large‐scale flow between the regional and global model forecasts (Kida et al., 1991; Sasaki et al., 1995; von Storch et al., 2000). The large‐scale SN employs driving fields from the global model forecasts to adjust the atmospheric state within the regional model domain by adding nudging terms in the spectral domain. This technique is most effective at large scales and has minimal impact on smaller scales, such as TCs in this study. Consequently, we implement the large‐scale SN with the Pangu model forecasts as the driving fields (Figures 1a and 1b) during the WRF model simulation to leverage the Pangu model's strengths in forecasting large‐scale circulation and TC tracks.

In this study, the large‐scale SN was applied continuously throughout the WRF model simulation, with the driving fields updated every 6 hr. Only horizontal winds with wavelengths exceeding 1,000 km above the planetary boundary layer from the Pangu model forecasts were used to constrain the large‐scale circulations. The nudging coefficient was set at 0.0003, aligning with the previous studies (Cha & Wang, 2013; Liu et al., 2023; Wang et al., 2013).

## 2.3. Updating SST

To reflect the SST change induced by the air‐sea interaction, we use an OML model (Pollard et al., 1973) to update SST (Figure 1d), which is integrated with the WRF model (Davis et al., 2008). In this study, the initial OML depth was set to 50 m, and the lapse rate of water temperature is configured at − 0.14 K m− 1 , parameters being adopted from a previous study on TC simulations (Yesubabu et al., 2019). Although the OML model is relatively simplified, it has been demonstrated to enhance TC track and intensity simulations due to its realistic representation of the OML (Yesubabu et al., 2019).

## 3. Data, TCs, Model, and Experiments

## 3.1. Data

The observed (best‐track) data of TCs are taken from IBTrACS‐WMO v4 data set (Knapp et al., 2010). This data set includes information such as the latitude and longitude of the TC center, maximum sustained near‐surface wind speed, central pressure, and radius of maximum wind (RMW) at 6‐hr intervals.

To evaluate the performance of the framework in comparison with operational TC forecasts, we selected four global NWP models from the observing system research and predictability experiment (THORPEX) interactive grand global ensemble (TIGGE) project (Bougeault et al., 2010). These models are affiliated with the China Meteorological Administration (CMA), Canadian Meteorological Center (CMC), National Centers for Environmental Prediction (NCEP), and the ECMWF. All forecasts from these models have a horizontal resolution of $0 . 5 ^ { \circ }$ , which is the highest resolution available from the TIGGE data set. The vertical levels of these model forecasts include 1,000, 925, 850, 700, 500, 300, 250, and 200 hPa.

The global data required to drive the Pangu and WRF models within our framework are obtained from the NCEP operational GFS analysis and the fifth generation ECMWF (ERA5) reanalysis both with a horizontal resolution of 0.25°. To enable a more comprehensive comparison of the forecasted TC rainfalls by the framework, we obtaine visible satellite imageries from the U.S. Naval Research Laboratory‘s TC webpage. This resource, originally developed, produced, and distributed by the NRL Marine Meteorology Division, offers extensive collections of current and archived satellite imagery, satellite data products, and other displays, providing comprehensive global coverage for TC monitoring and analysis.

## 3.2. Long‐Lived TCs

It is important to note that the Pangu model integrated into our framework was trained using hourly ERA5 data from 1979 to 2017 (Bi et al., 2023). To more accurately assess the framework's capability for 2‐week TC predictions, we selected long‐lived TCs that persisted for over 2 weeks from 2018 to 2023 across all ocean basins. Specifically, the selected TCs needed to consistently reach tropical storm level, maintaining maximum sustained near‐surface wind speeds exceeding 17 $\mathrm { ~ m ~ s ~ } ^ { - 1 }$ over a 2‐week period. We use this criterion to identify six TCs globally. Five TCs were selected in this study, including Hector (2018) over the eastern Pacific, Florence (2018) and Sam (2021) over the north Atlantic, Surigae (2021) over the western Pacific, and Freddy (2023) over the south Indian Ocean (Figure S1a in Supporting Information S1). The remaining one, Hurricane Dorian in 2019 over the North Atlantic, posed significant challenges of prediction for both global NWP models and the WRF model. Specifically, the TC system was not consistently present throughout the forecast period in any of the four global NWP models. Therefore, we excluded Dorian from this study to ensure a fair comparison.

## 3.3. The Pangu Model

The currently released Pangu model (Bi et al., 2023) can provide output data for geopotential, specific humidity, temperature, u‐ and v‐component winds at 13 levels (1,000, 925, 850, 700, 600, 500, 400, 300, 250, 200, 150, 100, and 50 hPa) as well as temperature at 2 m, u‐ and v‐component winds at 10 m and mean surface level pressure. All variables have a horizontal spacing of $0 . 2 5 ^ { \circ }$ consistent with the ERA5 data.

To obtain the forecast results from the Pangu model at 6‐hr intervals, we used its two pretrained networks, namely the 6‐hr lead time network (NW6) and the 24‐hr lead time network (NW24). Both networks were trained using hourly ERA5 data from 1979 to 2017. The NW6 is designed to forecast the first 6, 12, and 18 hrs within each 24‐hr cycle. In each 6‐hr forecast, the NW6 is employed along with the current result to generate the subsequent 6‐hr forecast. On the other hand, the NW24 is used for forecasting every 24 hr, allowing the current result to directly transition to the next 24‐hr prediction.

For example, consider the initialization of Pangu at 0000 UTC. It provides outputs at 0600, 1200, and 1800 UTC each day by applying the NW6 to the outputs at 0000, 0600, and 1200 UTC of the same day. Additionally, the model generates outputs at 0000 UTC on the following day using the NW24 based on the outputs at 0000 UTC of the current day. Especially, the outputs at 0600 UTC on the first day (the first 6‐hr forecast) and at 0000 UTC on the second day (the first 24‐hr forecast) are obtained using the initial condition with the NW6 and NW24, respectively. The above process minimizes the usage of the networks and reduces forecast errors in line with the principles outlined by Bi et al. (2023).

## 3.4. The WRF Model

The WRF model, version 4.2 (Skamarock et al., 2019), was set up with three nested interactive meshes. The grid spacings of the three meshes were 18, 6, and 2 km, respectively. The outermost mesh (D01) covered the large‐ scale environmental circulations of each TC with varying grid points (Table 1). The inner two meshes had the same dimensions of 271 × 271 grid points and encompassed the primary circulation (D02) and inner core (D03) of a TC, respectively. Both meshes moved in accordance with the TC movement. The model had 60 vertical levels topped at 50 hPa. The locations of the three meshes for Freddy are shown in Figure 1c and Figure S1b in Supporting Information S1.

Table 1 Grid Spacings and Initial Time for Each TC in the WRF Model

<table><tr><td> TC/Basin</td><td>Grid spacing of D01</td><td>Initial time of forecast</td></tr><tr><td>Hector/Eastern Pacific</td><td> $6 9 1 \times 3 3 1$ </td><td>1200 UTC 31 July 2018</td></tr><tr><td>Florence/North Atlantic</td><td> $6 6 1 \times 4 8 1$ </td><td>0000 UTC 1 September 2018</td></tr><tr><td>Surigae/Western Pacific</td><td> $5 3 1 \times 4 5 1$ </td><td>0000 UTC 14 April 2021</td></tr><tr><td>Sam/North Atlantic</td><td> $5 3 1 \times 5 3 1$ </td><td>0000 UTC 23 September 2021</td></tr><tr><td>Freddy/South Indian Ocean</td><td> $7 3 1 \times 3 0 1$ </td><td>0000 UTC7 February 2023</td></tr></table>

The model physics, which were the same as those used in Liu et al. (2023), included the WRF single‐moment 6‐ class microphysics scheme (Hong et al., 2004), the rapid radiative transfer model for general circulation models (RRTMG) shortwave and longwave radiation schemes (Iacono et al., 2008), Yonsei University (YSU) planetary boundary layer scheme (Hong et al., 2006), and the Noah land surface model (Chen & Dudhia, 2001). These schemes were applied to all meshes. The Kain‐Fritsch cumulus parameterization scheme (Kain & Fritsch, 1990) was applied only to D01. The parameterizations of surface momentum and heat fluxes over the ocean as well as dissipative heating applicable to strong winds (Davis et al., 2008) were employed with the momentum roughness length from Donelan et al. (2004) and the heat and moisture roughness lengths from Garratt (1992).

## 3.5. Experimental Design

For each TC, we conducted six experiments over 2 weeks. Two of these experiments utilized the ERA5 and GFS data as global initial conditions to drive the Pangu model, named Pangu and Pangu\*, respectively. These two forecast experiments are specifically designed to assess the sensitivity of the Pangu model to different initial conditions.

The remaining four experiments were all conducted using the WRF model (Table 2), with the ERA5 data as their initial conditions consistent with the Pangu run. The WRF‐ERA5 run utilized ERA5 reanalysis data for lateral boundary and SST conditions, updated every 6 hr, to drive the WRF model. The WRF‐ERA5‐OML run was identical to the WRF‐ERA5 run but employed the OML model for updating SST, aiming to evaluate the effectiveness of the OML in TC simulation. It is important to note that neither run is suitable for real‐time forecasting, as the time‐dependent ERA5 data used for their lateral boundary or SST conditions are not available during the forecast period.

The WRF‐Pangu‐OML run was based on directly downscaling the Pangu model, using forecast results from the Pangu run for its lateral boundary conditions and the OML model to update SST. The WRF‐Pangu‐OML‐SN run represents the core concept of the hybrid ML/physics‐based modeling framework for TC forecasts proposed in this study (Figure 1). The sole difference between the WRF‐Pangu‐OML and WRF‐Pangu‐OML‐SN runs is that the latter used the large‐scale SN driven by the forecast results of the Pangu run to adjust the large‐scale circulations. The SN driving fields were updated every 6 hr. Both the WRF‐Pangu‐OML and WRF‐Pangu‐OML‐SN runs are suitable for real‐time forecasting, as the time‐dependent conditions required by the WRF model are derived from the forecast results. We chose to use the Pangu run results instead of those from the Pangu\* run to conduct both experiments due to the slightly inferior results from the latter (discussed below).

Table 2  
Description of the WRF Model Experiments

<table><tr><td>Experiment</td><td>Lateral boundary condition</td><td>SST</td><td>SN</td></tr><tr><td>WRF-ERA5</td><td>6-hr ERA5</td><td>6-hr ERA5</td><td>No</td></tr><tr><td>WRF-ERA5-OML</td><td>6-hr ERA5</td><td>OML</td><td>No</td></tr><tr><td>WRF-Pangu-OML</td><td> 6-hr Pangu results</td><td>OML</td><td>No</td></tr><tr><td>WRF-Pangu-OML-SN</td><td>6-hr Pangu results</td><td>OML</td><td>6-hr Pangu results</td></tr></table>

Note. The term “6‐hr” indicates that the fields are updated every 6 hr. The term “Pangu results” refers to the forecast results of the Pangu model driven by the ERA5 data (the Pangu experiment).

The initial times for all experiments conducted in this study were set to the first instance of 0000 or 1200 UTC following each TC reaching tropical storm level (Table 1) except for Freddy. This timing aligns with the initial times of global NWP models in the TIGGE data set. Freddy first met this criterion at 1200 UTC on 6th February 2023. However, we began our forecasts at 0000 UTC on 7th February 2023 to maintain comparability with the simulations given by Liu et al. (2023).

## 4. Verification of TC Forecasts

## 4.1. Evaluation of the Pangu Model

Before systematically evaluating the hybrid ML/physics‐based modeling framework, it is essential to first assess the performance of the Pangu model in 2‐week extended predictions of TCs in comparison with global NWP models.

## 4.1.1. Prediction of TC Steering Flows

As TC motion is predominantly influenced by environmental steering flow (Chan, 2010), we first compared the performance of the Pangu model in predicting TC steering flows with that of the four global NWP models. The steering flows were computed between 250 and 850 hPa within a 3° latitude radius (333 km) from the TC center, following the method outlined by Torn et al. (2018). Considering that each TC predicted by different models may be located differently at the same forecast time, one TC may interact with varying environmental systems. Additionally, some models predicted premature TC dissipation, which can lead to incomplete results. Therefore, we calculated the steering flows following the TC center from the best‐track data to ensure a fair comparison. Although this approach means that the calculated flows may not consistently align with the TCs in the forecast results, they still reflect the large‐scale conditions over the specified area. We calculated the bias and root mean square error (RMSE) for the five TCs across all global forecasts relative to the ERA5 data (forecast results minus ERA5), as illustrated in Figure 2. The bias and RMSE include the speed and u‐ and v‐components of the steering flows. Forecasts from the Pangu model initialized with the ERA5 data (the Pangu run) demonstrated the minimal bias and RMSE in steering flow speeds as well as the u‐ and v‐component steering flows (Figure 2). However, when driven by the GFS data (Pangu\*), the Pangu model exhibited larger errors in forecasting the steering flows. The Pangu\*, CMA, and CMC forecasts showed a positive bias and larger RMSE in the u‐component of the steering flows with the CMA forecasts showing smaller biases during the second week (Figures 2c and 2d). Conversely, the ECMWF and NCEP forecasts exhibited a positive bias and larger RMSE, but the NCEP forecasts performed relatively better during the last 5 days. Apart from the Pangu forecasts, the v‐component steering flows in other forecasts were generally smaller than those of the ERA5 with a larger RMSE (Figures 2e and 2f). The ECMWF forecasts performed similarly to the Pangu forecasts, with the bias nearing zero during the final day. We also calculated the steering flows within additional radii from the best‐track TC centers (e.g., 5° and 7° latitudes, results not shown), which consistently demonstrated minimal steering flow errors in the Pangu forecasts. Consequently, the Pangu model, utilizing ERA5 data as its initial condition, showcases superior large‐scale steering flow predictions for TCs compared to global NWP models, thereby offering the potential to enhance TC track predictions.

## 4.1.2. TC Forecasts in Global Models

The mean track errors of the four global NWP model forecasts increased with the forecasting lead time (Figure 3a). However, an exception occurred on the final day of forecasts likely attributable to the premature dissipation of TCs within a smaller sample size. Both the Pangu and Pangu\* forecasts exhibited superior performance in predicting TC tracks compared to the global NWP models, with additional improvements by the Pangu run except for the last 2‐day forecasts. These results indicate that the Pangu model excels in forecasting TC tracks over periods exceeding a week, and that the ERA5 data is more suitable for driving the Pangu model, which related the training data of the Pangu model. This has led us to integrate it into our hybrid ML/physics‐based modeling framework.

<!-- image-->

<!-- image-->

<!-- image-->

<!-- image-->

<!-- image-->

<!-- image-->

Figure 2. Bias and root mean square error (RMSE) (m s − 1 ) of (a, b) the speed and (c, d) u‐ and (e, f) v‐components of the steering flows for the five TCs from the Pangu (black curve), Pangu\* (red curve), CMA (blue curve), CMC (green curve), ECMWF (orange curve), and NCEP (purple curve) forecast results. The left panels display the bias and the right panels show the RMSE, each in comparison with the ERA5 data.

All global forecasts underestimated TC intensities with much larger intensity errors (Figure 3c) than the mean intensity errors at a 5‐day lead time from current operational forecasting agencies (e.g., Cangialosi, 2023). Due to the coarse resolutions of these global models, they cannot accurately represent the inner‐core dynamics of TCs, which is crucial for predicting TC intensity changes. In contrast to the track errors, the intensity errors of the Pangu model forecast are comparable to those of global NWP models, suggesting that the Pangu model is not superior to global NWP models in predicting TC intensity. Beyond errors in TC position and maximum wind speed, we also calculated the errors in TC translational speed and central pressure for reference, as shown in Figure S2 in Supporting Information S1.

In addition, all global forecasts exhibited significant errors in predicting RMW with errors often exceeding 100 km (Figure 3e). This discrepancy was larger than the actual RMWs of TCs. The difference in RMW errors between global NWP models and the Pangu model forecasts is minimal in the first 9 days of forecasts. However, beyond 11‐day forecasts, the Pangu forecast displayed smaller RMW errors than other global forecasts, which are consistent with its reduced track and intensity errors. Given that RMWs typically span less than five grid spacings in models with 0.25° horizontal resolution, their accurate representation remains challenging. These challenges have motivated us to conduct high‐resolution downscaling experiments.

(a)

<!-- image-->

(b)

<!-- image-->

（c）

<!-- image-->

(d)

<!-- image-->

(e)

<!-- image-->

()

<!-- image-->

Figure 3. Errors in the track (a, b), intensity (c, d), and the radius of maximum wind (e, f) for the five TCs in the global NWP models, and the experiments of Pangu, Pangu\*, WRF‐ERA5, WRF‐ERA5‐OML, WRF‐Pangu‐OML, and WRF‐Pangu‐OML‐SN. In (a, b) and (c, d), the dashed lines represent reference values set at 335 km and 10.9 m s − 1 , respectively, as benchmarks of track (Zhou & Toth, 2020) and intensity errors (Cangialosi, 2023) at a 5‐day lead time. The value below each bar indicates the amount of forecast results at the corresponding time point.

## 4.2. Evaluation of the Framework

In the WRF‐ERA5 and WRF‐ERA5‐OML runs, although the ERA5 data provided more accurate lateral boundary conditions, the track errors were only slightly reduced compared to those of the global NWP models and were even larger than those produced by the Pangu model forecasts (Figures 3a and 3b). Conversely, the errors in TC intensity and RMW in both runs were significantly lower than those of the global NWP and Pangu models (Figures 3c and 3f). Similar results were observed in the WRF‐Pangu‐OML forecast run. This indicates that directly downscaling the Pangu model can enhance forecasts of TC intensity and structure but has limited impact on improving TC track predictions.

As our framework is designed to leverage the strengths of both the Pangu and WRF models, its implementation in the WRF‐Pangu‐OML‐SN run resulted in the joint minimal errors in track, intensity, and RMW among all 2‐week TC forecasts (Figures 3a–3f and Table S1 in Supporting Information S1). The framework decreased the 2‐week mean TC track and intensity errors by 59% and 32% compared to the global NWP forecasts, by 2% and 59% compared to the Pangu run, and by 32% and 23% compared to the WRF‐ERA5 run, respectively. Notably, our framework was uniquely capable of consistently predicting TCs throughout the entire 2‐week period.

Additionally, the mean of the track errors at a 7‐day lead time was a bit smaller than the 335‐km goal suggested by Zhou and Toth (2020) to achieve in the next 15 years (Figure 3b). These results strongly suggest that our framework can significantly enhance TC forecasts and extend forecast lead times. Moreover, the improved track forecasts in the WRF‐Pangu‐OML‐SN run are crucial to the improved TC intensity and inner‐core size forecasting.

To further illustrate the contributions of the framework's three key components on TC prediction, systematic comparisons among all the WRF model experiments in this study are discussed as follows.

## 4.2.1. The Role of Downscaling the Pangu Model

The WRF‐Pangu‐OML run represents the direct downscaling of the Pangu model. Therefore, to assess the effectiveness of downscaling the Pangu model within our framework for TC forecasting, we can compare it with the WRF‐ERA5‐OML run. The only difference between these two runs is the source of the WRF model's lateral boundary conditions, with the former using forecast results from the Pangu run and the latter utilizing ERA5 data. The errors in TC track, intensity, and RMW were similar in both runs except for larger track errors observed in the WRF‐Pangu‐OML run on the 13th forecast day (Figures 3b, 3d, and 3f). This indicates that downscaling the Pangu model forecasts is comparably effective in using the ERA5 data as the WRF model's lateral boundary conditions in TC simulation.

## 4.2.2. The Role of Updating SST

In the WRF‐ERA5 and WRF‐ERA5‐OML runs, SST was updated every 6 hr using ERA5 data and through air‐sea interactions within the OML model, respectively. The errors in TC track, intensity, and RMW were comparable in both runs (Figures 3b, 3d, and 3f). Additionally, the WRF‐ERA5‐OML run exhibited smaller forecast errors throughout the forecast period. This indicates that the OML model has potential for use in 2‐week TC forecasts and can be effectively integrated into our framework.

## 4.2.3. The Role of Adjusting Large‐Scale Circulation

The impact of adjusting large‐scale circulation through the large‐scale SN is evident from the comparisons between the WRF‐Pangu‐OML and WRF‐Pangu‐OML‐SN runs. Note that the WRF‐Pangu‐OML‐SN run represents the forecast experiment of our framework. With the Pangu forecast results driving it, the track errors in the WRF‐Pangu‐OML‐SN run were significantly smaller than those in the WRF‐Pangu‐OML run (Figure 3b). Additionally, using the large‐scale SN helped align the track errors in the Pangu and WRF‐Pangu‐OML‐SN runs (Figures 3a and 3b) by minimizing deviations in TC steering flows between the two runs. This confirms that our framework can retain the strengths of the Pangu model in predicting TC tracks, which aligns with our objectives and validates the rationale for including adjustments of large‐scale circulation in our framework.

The effectiveness of the large‐scale SN is heavily dependent on the accuracy of the SN driving fields rather than the method itself. When using the ERA5 reanalysis or GFS analysis data as the SN driving fields, the simulated TC tracks closely matched the observations (Figures S3 and S4 in Supporting Information S1). This is because the ERA5 reanalysis or GFS analysis data provides the most accurate representation of large‐scale circulation. Previous studies have also demonstrated that using reanalysis or analysis data as SN driving fields can significantly enhance TC track simulations (Cha et al., 2011; Liu et al., 2023; Wang et al., 2013). Despite being the best possible option, it is important to note that using time‐dependent reanalysis or analysis data to drive large‐scale SN is not suitable for real‐time TC forecasts, as they are not available during the forecast period. However, using the GFS forecast fields to drive large‐scale SN would introduce inaccuracies in the representation of large‐scale circulation, thereby increasing the track errors (Figure S4 in Supporting Information S1). In contrast, the Pangu model can provide forecast fields that have the potential to surpass the global NWP model in forecasting large‐ scale circulation for 2 weeks, as shown in this study. Therefore, the Pangu model forecasts can be a good choice for driving the large‐scale SN in our framework without expecting them to surpass the analysis/reanalysis.

(a) Global NWP models

<!-- image-->

(c) Pangu model

<!-- image-->

<!-- image-->

<!-- image-->

(e) WRF model

<!-- image-->

<!-- image-->

Figure 4. Track and intensity of Freddy in the best‐track data (black), (a, b) the global numerical weather prediction model forecasts, (c, d) the Pangu model forecasts, and (e, f) the Weather Research and Forecasting model forecasts.

## 5. The Case of Severe TC Freddy (2023)

## 5.1. Track and Intensity

We chose Severe TC Freddy as a case study to demonstrate how the hybrid ML/physics‐based modeling framework improves forecasts of TC track, intensity, and inner‐core structure. Freddy over the south Indian Ocean in 2023 holds the record as the most long‐lived TC and presents forecasting challenges due to its complex interactions with the Mascarene High, TC Dingani, and its vortex size (Liu et al., 2023).

All forecast results for Freddy are presented in Figure 4. The forecast results for other four TC are displayed in Figures S5 to S8 in Supporting Information S1. The forecasted tracks of Freddy in the four global NWP models varied widely (Figure 4a), highlighting the challenges of predicting Freddy's track over 2 weeks. This aligns with findings in Liu et al. (2023). In contrast, the Pangu model significantly enhanced the accuracy of Freddy's track prediction. The noticeable differences between the track forecasts in Pangu and Pangu\* indicate that the Pangu model's forecasts are highly sensitive to the initial conditions (Figure 4c). In the Pangu forecast, the 14‐day forecasted track of Freddy closely aligned with the best‐track data, with the track errors on the 7th and 14th days being 193 and 607 km, respectively. In comparison, the corresponding mean track errors in the four global deterministic NWP models were 665 and 6837 km. Both the global NWP models and Pangu consistently underestimated the intensity of Freddy (Figures 4b and 4d). The forecasted intensity of the Pangu model remained at around 20 m s − 1 throughout the forecast period regardless of how intense the initial vortex was. The underestimation of TC intensity can be attributed to the coarse resolutions of the global NWP and Pangu models.

<!-- image-->

<!-- image-->

Figure 5. Geopotential height (m) at 850 hPa at 0000 UTC on 16 February 2023 from (a) ERA5 reanalysis, (b) ECMWF, (c) NCEP, (d) CMA, (e) CMC, (f) Pangu, (g) Pangu\*, (h) WRF‐ERA5, (i) WRF‐ERA5‐OML, (j) WRF‐Pangu‐OML, and (k) WRF‐Pangu‐OML‐SN. The black curves denote the tracks of Freddy from (a) the best‐track data and (b–k) forecast results. The symbols of F and D denote Freddy and Dingani, respectively.

In the WRF‐ERA5, WRF‐ERA5‐OML, and WRF‐Pangu‐OML runs, Freddy consistently exhibited significant southward movement and earlier weakening (Figure 4e). The intensity forecasts from these runs were markedly improved in the first week (Figure 4f), but the forecast errors increased in tandem with the substantial track errors after 7‐day forecasts. This is mainly because the large track forecast errors exposed Freddy in regions with strong environmental vertical wind shear and cold SST (Liu et al., 2023). By implementing our framework, the WRF‐ Pangu‐OML‐SN run greatly improved the accuracy of Freddy's track forecast, closely aligning with the observed track throughout the 2 weeks. Subsequently, the forecasted intensity of Freddy also closely followed the best‐ track data. This demonstrates that the accurate track forecast can further enhance the prediction of TC intensity.

## 5.2. Environmental Circulation

To better understand the differences among the various experiments, we examined 850‐hPa geopotential height after 9‐day forecasts, as shown in Figure 5. We selected this time because Freddy was largely influenced by TC Dingani and the Mascarene High during which the forecasted track errors significantly increased in global NWP, WRF‐ERA5, WRF‐ERA5‐OML and WRF‐Pangu‐OML runs. In the ERA5 data (Figure 5a), Freddy was positioned over the central Indian Ocean. Dingani was located over 2,000 km to the southwest of Freddy. To the south, the Mascarene High provided easterly steering flow to Freddy. In the four global NWP forecasts (Figures 5b and 5e), the distribution and strength of the Mascarene High as well as the position and intensity of Dingani differed significantly from that in ERA5. In contrast, these disparities were significantly mitigated in the Pangu and

Pangu\* runs with the former closer to those in the ERA5 data (Figures 5f and 5g). However, the forecasted intensity of Dingani was considerably weaker in both the Pangu forecasts. Given that environmental steering flows predominantly influence TC motion (Chan, 2010), these results suggest that the Pangu model has the ability to accurately forecast the large‐scale steering flows for Freddy over a week.

In the WRF‐ERA5, WRF‐ERA5‐OML, and WRF‐Pangu‐OML runs (Figures 5h–5j), several notable differences were observed. First, the Mascarene High was stronger to the east of Freddy than that in the ERA5 data, contributing to inaccurate large‐scale steering flow affecting Freddy. Additionally, Dingani was located farther north than that observed and closer to Freddy. Furthermore, the unexpected emergences of TCs in these experiments did not correspond with the ERA5 data and the best‐track data, further contributing to the inaccurate movement of Dingani. As a result, the fictitious interaction between Freddy and Dingani significantly affected their simulated tracks and intensities. The above discrepancies all occurred beyond 1 week of simulations during which the atmosphere was about to lose its memory of initial conditions (Vitart, 2014). Consequently, these collectively resulted in the slow translational speed and southward movement of Freddy.

In the WRF‐Pangu‐OML‐SN run, the patterns of environmental flows closely mirrored those in the Pangu (Figures 5f and 5k), as our framework's component of adjusting large‐scale circulation effectively minimized deviations in large‐scale flow between the two runs. As a result, the track forecasts for both Freddy and Dingani in the WRF‐Pangu‐OML‐SN run aligned closely with those from the Pangu run.

## 5.3. Vortex Structure

The axisymmetric radial and tangential winds of Freddy at the same time as in Figure 5 are shown in Figure 6. In ERA5 (Figure 6a), Freddy displayed a typical profile of tangential winds with the RMW of about 60 km and was characterized by boundary layer inflow and upper layer outflow. The tangential wind profiles of Freddy in the ECMWF forecast were similar to those in ERA5 (Figure 6b). However, in other three global NWP and two Pangu forecasts (Figures 6c–6g), both the tangential and radial winds were notably weaker and exhibited a loosely organized inner‐core structure, suggesting that the coarse resolution global NWP models and Pangu could not resolve the TC structure well.

In all WRF experiments (Figures 6h–6k), the tangential winds strengthened, and the RMWs were approximately 40 km closer to that of 10 km in the best‐track data. The boundary layer inflow and upper‐layer outflow were also intensified with the outward tilted eyewall structure. By implementing our hybrid ML/physics‐based modeling framework, the WRF‐Pangu‐OML‐SN run depicted the most well‐constructed TC vortex (Figure 6k) when Freddy approached Category 5 hurricane status. This accuracy stemmed from our framework's enhancement of Freddy's track forecast, ensuring it developed within the correct environmental flows. Additionally, the framework's effectiveness in capturing the core processes underlying TC evolution also contributed to this result.

We also compared the simulated blackbody brightness temperature of Freddy in the WRF model experiments with the visible satellite imagery in Figure 7. This comparison was made at a 6‐hr lag from the time depicted in Figures 5 and 6 since the visible satellite imagery was not accessible at that time. Additionally, the global NWP and Pangu forecasts did not provide similar variables and were therefore not discussed. In the observation, the cloud feature of Freddy had a diameter of approximately 600 km (Figure 7a). In the WRF‐ERA5 run (Figure 7b), the size of the cloud feature was much smaller than in observation, while in the WRF‐ERA5‐OML and WRF‐ Pangu‐OML runs (Figures 7c and 7d), there were distinct differences in the cloud distribution. The discrepancies can be attributed to the inaccurate track and intensity forecast of Freddy in the two runs. In contrast, by implementing our framework in the WRF‐Pangu‐OML‐SN run (Figure 7e), both the size and pattern of cloud distribution were comparable with those in observation. Results from other time points also corroborated this finding (not shown). This strongly suggests that our framework can improve forecasts for TC rainfall distribution. Results at other times also supported this phenomenon.

The findings regarding 2‐week TC forecasts, in conjunction with a recent study (Liu et al., 2023), lend support to and can be elucidated by a novel paradigm concerning the triangular relationship between TC track, intensity, and structure (Tan et al., 2022). In the case of Freddy, its track determined its environmental conditions (e.g., vertical wind shear and SST), which subsequently influenced its intensity and structure changes through interactions and energy exchanges with multi‐scale systems and the underlying surface. Additionally, Freddy's intensity and structure could impact its movement, altering the timing of its shifts and dissipation. Furthermore, the intensity of

<!-- image-->

Figure 6. Radial‐height distribution of the azimuthal mean radial $\mathrm { ( m ~ s ^ { - 1 } }$ , shading) and tangential $\mathrm { ( m ~ s ^ { - 1 } }$ , contours) winds of Freddy at 0000 UTC on 16 February 2023 from the (a) ERA5 reanalysis, (b) ECMWF, (c) NCEP, (d) CMA, (e) CMC, (f) Pangu, (g) Pangu\*, (h) WRF‐ERA5, (i) WRF‐ERA5‐OML, (j) WRF‐Pangu‐OML, and (k) WRF‐Pangu‐OML‐SN. The solid and dashed contours denote the cyclonic and anticyclonic tangential winds, respectively. The available vertical levels for the four global forecasts in (b–e) extended up to 200 hPa.

Freddy could shape the pattern of its circulation, while its structure could, in turn, affect its rate of intensity change.

## 6. Conclusion

In this study, we assessed the 2‐week extended prediction capability of the hybrid ML/physics‐based modeling framework for five long‐lived TCs across various ocean basins from 2018 to 2023. The framework operates by running the high‐resolution regional WRF model to downscale the Pangu model forecasts, adjusting large‐scale circulation with the large‐scale SN and updating SST using an OML model. Consequently, TC forecasts can be conducted relying solely on a global analysis as initial conditions. This hybrid ML/physics‐based modeling framework requires only moderate computational resources, taking about 16 hr to complete a 2‐week TC forecast using 192 CPU cores on the high‐performance computing system.

<!-- image-->

(b) WRF-ERA5

<!-- image-->

<!-- image-->

(d) WRF-Pangu-OML

<!-- image-->

(e) WRF-Pangu-OML-SN

<!-- image-->

Figure 7. (a) Visible satellite imagery and simulated blackbody brightness temperature (k) from (b) WRF‐ERA5, (c) WRF‐ERA5‐OML, (d) WRF‐Pangu‐OML, and (e) WRF‐Pangu‐OML‐SN at 0600 UTC on 16th February 2023. The visible satellite imagery is downloaded at https://www.nrlmry.navy.mil/tcdat/tc2023/SH/ SH112023/png/Visible/. The authorization to use and distribute this data set can be found at https://www.nrlmry.navy.mil/tcdat/license.txt.

The forecasting experiment results demonstrate that the proposed hybrid ML/physics‐based modeling framework significantly improves TC track and intensity forecasts compared with the global deterministic NWP models and standalone executions of Pangu and the WRF model. Notably, the 7‐day forecasted track errors from the new framework are comparable to those of the current 5‐day operational forecasts, reaching the goal for the next 15 years suggested by Zhou and Toth (2020). This implies that the hybrid ML/physics‐based modeling framework can be potentially used for extended TC forecasts. Moreover, this framework also improves the representation of TC structure and cloud distribution.

The apparent superiority of the framework proposed in this study stems from the application of the Pangu and WRFmodels and associated supporting technologies, such as OML and large‐scale SN. Especially for 2‐week extended predication of TC, track accuracy is paramount, largely depending on the accurate presentation of large‐scale circulation. This crucial aspect can be addressed by the Pangu model, and the large‐scale SN can leverage the advantages of the Pangu model into high‐resolution regional WRF simulations. Consequently, this basis allows for further improvements in TC intensity and structure accuracy. Importantly, the results in this study underscores the critical role of the triangular relationship between TC track, intensity, and structure in enhancing the accuracy of TC predictions (Tan et al., 2022). This insight is instrumental in understanding the correlations, interactions, and error propagations among TC track, intensity, and structure.

One limitation of this study is the relatively small number of TC cases simulated. Future research could address this by forecasting a larger number of TCs at various initial times without being strictly limited to 2‐week predictions. Moreover, it is worth noting that the Pangu model forecasts are sensitive to initial conditions. Therefore, further improvements in the Pangu forecasts and the hybrid ML/physics‐based modeling framework can be achieved by improving the initial conditions, including TC dynamical initialization schemes. Additionally, conducting ensemble forecasts with the Pangu model is a viable way to improve the predictability of TC forecasts. Note that the performance of the hybrid ML/physics‐based modeling framework can be continuously improved as longer and more data are available for further training the Pangu forecasts. Furthermore, enhanced TC prediction relies on accurately representing multi‐scale processes, indicating that the hybrid ML/physics‐based modeling framework holds promise for predicting various other severe weather events and hydrometeorological hazards. Finally, beyond the Pangu and WRF models used in our proposed hybrid ML/physics‐based modeling framework, the integration of diverse ML‐based models (e.g., Pathak et al., 2022; L. Chen, Zhong, et al., 2023; Lam et al., 2023) and physics‐based models (e.g., Biswas et al., 2018) can also be employed for TC forecasts.

## Data Availability Statement

The IBTrACS‐WMO v4 data set is available at https://www.ncei.noaa.gov/data/international‐best‐track‐archive‐ for‐climate‐stewardship‐ibtracs/v04r00/access/. The TIGGE data set is available at https://apps.ecmwf.int/ datasets/data/tigge/levtype=sfc/type=cf/. NCEP GFS 0.25 Degree Global Forecast Grids Historical Archive is obtained at National Centers for Environmental Prediction/National Weather Service/NOAA/U.S. Department of Commerce (2015). The ERA5 hourly analysis is available at Hersbach et al. (2023). Visible satellite imageries of Freddy are provided by the U.S. Naval Research Laboratory at https://www.nrlmry.navy.mil/tcdat/tc2023/SH/ SH112023/png/Visible/. Software Availability Statement: The Pangu model is available at https://github.com/ 198808xc/Pangu‐Weather. The WRF model is available at https://www2.mmm.ucar.edu/wrf/users/download/ get_source.html.

## Acknowledgments

The authors are grateful to three anonymous reviewers for their constructive review comments. This study was supported by the National Natural Science Foundation of China under Grant 42192555, the Fundamental Research Funds for the Central Universities under Grant B230201018, the Open Research Program of the State Key Laboratory of Severe Weather under Grant 2023LASW‐ B17, and the Moonshot R&D Grant JPMJMS2282 (TBC) from the Japan Science and Technology Agency. The visible satellite imageries were from the U. S. Naval Research Laboratory. Partial numerical computations were performed on Hefei advanced computing center.

## References

Aberson, S. D., & Franklin, J. L. (1999). Impact on hurricane track and intensity forecasts of GPS dropwindsonde observations from the first‐ season flights of the NOAA Gulfstream‐IV jet aircraft. Bulletin of the American Meteorological Society, 80(3), 421–427. https://doi.org/10. 1175/1520‐0477(1999)080<0421:IOHTAI>2.0.CO;2

Bi, K., Xie, L., Zhang, H., Chen, X., Gu, X., & Tian, Q. (2023). Accurate medium‐range global weather forecasting with 3D neural networks. Nature, 619(7970), 533–538. https://doi.org/10.1038/s41586‐023‐06185‐3

Biswas, M. K., Bernardet, L., Abarca, S., Ginis, I., Grell, E., Kalina, E., & Zhang, Z. (2018). Hurricane Weather Research and Forecasting (HWRF) model: 2017 scientific documentation. (No. NCAR/TN‐544+STR) (pp. 1–111). https://doi.org/10.5065/D6MK6BPR

Bougeault, P., Toth, Z., Bishop, C., Brown, B., Burridge, D., Chen, D. H., et al. (2010). The THORPEX interactive Grand global ensemble. Bulletin of the American Meteorological Society, 91(8), 1059–1072. https://doi.org/10.1175/2010BAMS2853.1

Camargo, S. J., Camp, J., Elsberry, R. L., Gregory, P. A., Klotzbach, P. J., Schreck III, C. J., et al. (2019). Tropical cyclone prediction on subseasonal time‐scales. Tropical Cyclone Research and Review, 8(3), 150–165. https://doi.org/10.6057/2019TCRR03.04

Cangialosi, J. P. (2023). National hurricane center forecast verification report: 2022 Hurricane season. NOAA. 75. Retrieved from https://www. nhc.noaa.gov/verification/pdfs/Verification_2022.pdf

Cha, D. H., Jin, C. S., Lee, D. K., & Kuo, Y. H. (2011). Impact of intermittent spectral nudging on regional climate simulation using Weather Research and Forecasting model. Journal of Geophysical Research, 116(D10), D10103. https://doi.org/10.1029/2010jd015069

Cha, D.‐H., & Wang, Y. (2013). A dynamical initialization scheme for real‐time forecasts of tropical cyclones using the WRF Model. Monthly Weather Review, 141(3), 964–986. https://doi.org/10.1175/MWR‐D‐12‐00077.1

Chan, J. C. L. (2005). The physics of tropical cyclone motion. Annual Review of Fluid Mechanics, 37(1), 99–128. https://doi.org/10.1146/annurev. fluid.37.061903.175702

Chan, J. C. L. (2010). Movement of tropical cyclones. In Global Perspectives on tropical cyclones: From science to mitigation (Vol. 4, pp. 133– 148). World Scientific. https://doi.org/10.1142/7597

Chen, F., & Dudhia, J. (2001). Coupling an advanced land surface‐hydrology model with the Penn State–NCAR MM5 modeling system, Part I: Model implementation and sensitivity. Monthly Weather Review, 129(4), 569–585. https://doi.org/10.1175/1520‐0493(2001)129<0569: CAALSH>2.0.CO;2

Chen, L., Zhong, X., Zhang, F., Cheng, Y., Xu, Y., Qi, Y., & Li, H. (2023). FuXi: A cascade machine learning forecasting system for 15‐day global weather forecast. npj climate and atmospheric science, 6(1), 190. https://doi.org/10.1038/s41612‐023‐00512‐1

Chen, X., Rozoff, C. M., Rogers, R. F., Corbosiero, K. L., Tao, D., Gu, J. F., et al. (2023). Research advances on internal processes affecting tropical cyclone intensity change from 2018–2022. Tropical Cyclone Research and Review, 12(1), 10–29. https://doi.org/10.1016/j.tcrr.2023. 05.001

Cheung, H. M., Ho, C.‐H., Chang, M., & Kim, D. (2022). Hybrid neural network models for postprocessing medium‐range forecasts of tropical cyclone tracks over the Western North Pacific. Artificial Intelligence for the Earth Systems, 1(4), 1–17. https://doi.org/10.1175/AIES‐D‐21‐ 0003.1

Cheung, H. M., Ho, C.‐H., Chang, M., Kim, D., Kim, J., & Choi, W. (2021). Development of a track‐pattern‐based medium‐range tropical cyclone forecasting system for the Western North Pacific. Weather and Forecasting, 36, 1505–1518. https://doi.org/10.1175/WAF‐D‐20‐0102.1

Chou, K., Wu, C.‐C., Lin, P.‐H., Aberson, S. D., Weissmann, M., Harnisch, F., & Nakazawa, T. (2011). The impact of Dropwindsonde Observations on typhoon track forecasts in DOTSTAR and T‐PARC. Monthly Weather Review, 139(6), 1728–1743. https://doi.org/10.1175/ 2010MWR3582.1

Davis, C. A., Wang, W., Chen, S. S., Chen, Y., Corbosiero, K., DeMaria, M., et al. (2008). Prediction of landfalling hurricanes with the advanced hurricane WRF model. Monthly Weather Review, 136(6), 1990–2005. https://doi.org/10.1175/2007MWR2085.1

DeMaria, M., Sampson, C. R., Knaff, J. A., & Musgrave, K. D. (2014). Is tropical cyclone intensity guidance improving? Bulletin of the American Meteorological Society, 95(3), 387–398. https://doi.org/10.1175/bams‐d‐12‐00240.1

Donelan, M. A., Haus, B. K., Reul, N., Plant, W. J., Stiassnie, M., Graber, H. C., et al. (2004). On the limiting aerodynamic roughness of the ocean in very strong winds. Geophysical Research Letters, 31(18), L18306. https://doi.org/10.1029/2004GL019460

Doyle, J., Hodur, R., Chen, S., Jin, Y., Msokaitis, J., Wang, S., et al. (2014). Tropical cyclone prediction using COAMPS‐TC. Oceanography, 27(3), 104–115. https://doi.org/10.5670/oceanog.2014.72

Emanuel, K., Sundararajan, R., & Williams, J. (2008). Hurricanes and global warming: Results from downscaling IPCC AR4 simulations. Bulletin of the American Meteorological Society, 89(3), 347–368. https://doi.org/10.1175/BAMS‐89‐3‐347

Emanuel, K. A. (2010). Tropical cyclone activity downscaled from NOAA‐CIRES reanalysis, 1908–1958. Journal of Advances in Modeling Earth Systems, 2, 1. https://doi.org/10.3894/JAMES.2010.2.1

Frank, W. M., & Ritchie, E. A. (2001). Effects of vertical wind shear on the intensity and structure of numerically simulated hurricanes. Monthly Weather Review, 129(9), 2249–2269. https://doi.org/10.1175/1520‐0493(2001)129<2249:EOVWSO>2.0.CO;2

Gall, R., Franklin, J., Marks, F., Rappaport, E. N., & Toepfer, F. (2013). The hurricane forecast improvement project. Bulletin of the American Meteorological Society, 94(3), 329–343. https://doi.org/10.1175/BAMS‐D‐12‐00071.1

Garratt, J. R. (1992). The atmospheric boundary layer. Cambridge University Press. 316.

Gu, J.‐F., Tan, Z.‐M., & Qiu, X. (2015). Effects of vertical wind shear on inner‐core thermodynamics of an idealized simulated tropical cyclone. Journal of the Atmospheric Sciences, 72(2), 511–530. https://doi.org/10.1175/JAS‐D‐14‐0050.1

Guo, X., & Tan, Z.‐M. (2022). Tropical cyclone intensification and fullness: The role of storm size configuration. Geophysical Research Letters, 49(16), e2022GL098449. https://doi.org/10.1029/2022GL098449

Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J., et al. (2023). ERA5 hourly data on pressure levels from 1940 to present [Dataset]. Copernicus Climate Change Service (C3S) Climate Data Store (CDS). https://doi.org/10.24381/cds.bd0915c6

Hong, S. Y., Dudhia, J., & Chen, S. H. (2004). A revised approach to ice microphysical processes for the bulk parameterization of clouds and precipitation. Monthly Weather Review, 132(1), 103–120. https://doi.org/10.1175/1520‐0493(2004)132<0103:ARATIM>2.0.CO;2

Hong, S. Y., Noh, Y., & Dudhia, J. (2006). A new vertical diffusion package with an explicit treatment of entrainment processes. Monthly Weather Review, 134(9), 2318–2341. https://doi.org/10.1175/MWR3199.1

Iacono, M. J., Delamere, J. S., Mlawer, E. J., Shephard, M. W., Clough, S. A., & Collins, W. D. (2008). Radiative forcing by longlived greenhouse gases: Calculations with the AER radiative transfer models. Journal of Geophysical Research, 113(D13), 1984–2012. https://doi.org/10.1029/ 2008JD009944

Ito, K., Wu, C.‐C., Chan, K. T. F., Toumi, R., & Davis, C. (2020). Recent progress in the fundamental understanding of tropical cyclone motion. Journal of the Meteorological Society of Japan, 98(1), 5–17. https://doi.org/10.2151/jmsj.2020‐001

Kain, J. S., & Fritsch, J. M. (1990). A one‐dimensional entraining/detraining plume model and its application in convective parameterization. Journal of the Atmospheric Sciences, 47(23), 2784–2802. https://doi.org/10.1175/1520‐0469(1990)047<2784:AODEPM>2.0.CO;2

Kida, H., Koide, T., Sasaki, H., & Chiba, M. (1991). A new approach for coupling a limited area model to a GCM for regional climate simulations. Journal of the Meteorological Society of Japan, 69(6), 723–728. https://doi.org/10.2151/jmsj1965.69.6723

Knapp, K. R., Kruk, M. C., Levinson, D. H., Diamond, H. J., & Neumann, C. J. (2010). The International Best Track Archive for Climate Stewardship (IBTrACS). Bulletin of the American Meteorological Society, 91(3), 363–376. https://doi.org/10.1175/2009BAMS2755.1

Lam, R., Sanchez‐Gonzalez, A., Willson, M., Wirnsberger, P., Fortunato, M., Alet, F., et al. (2023). Learning skillful medium‐range global weather forecasting. Science, 382(6677), 1416–1421. https://doi.org/10.1126/science.adi2336

Lei, L., Ge, Y., Tan, Z., & Bao, X. (2020). An evaluation and improvement of tropical cyclone prediction in the Western North Pacific basin from global ensemble forecasts. Science China Earth Sciences, 63(1), 12–26. https://doi.org/10.1007/s11430‐019‐9480‐8

Lei, L., Ge, Y., Tan, Z. M., Zhang, Y., Chu, K., Qiu, X., & Qian, Q. (2022). Evaluation of a regional ensemble data assimilation system for typhoon prediction. Advances in Atmospheric Sciences, 39(11), 1816–1832. https://doi.org/10.1007/s00376‐022‐1444‐4

Li, D.‐Y., & Tan, Z.‐M. (2023). The role of ocean‐atmosphere interactions in tropical cyclone intensity predictability. Journal of the Atmospheric Sciences, 80(5), 1213–1226. https://doi.org/10.1175/jas‐d‐22‐0152.1

Li, Y., Wang, Y., & Tan, Z.‐M. (2022). Why does the initial wind profile inside the radius of maximum wind matter to tropical cyclone development? Journal of Geophysical Research: Atmospheres, 127(16), e2022JD037039. https://doi.org/10.1029/2022JD037039

Liu, H.‐Y., Satoh, M., Gu, J., Lei, L., Tang, J., Tan, Z., et al. (2023). Predictability of the most long‐lived tropical cyclone Freddy (2023) during its westward journey through the southern tropical Indian Ocean. Geophysical Research Letters, 50(20), e2023GL105729. https://doi.org/10. 1029/2023GL105729

Liu, H.‐Y., & Tan, Z.‐M. (2016). A dynamical initialization scheme for binary tropical cyclones. Monthly Weather Review, 144(12), 4787–4803. https://doi.org/10.1175/MWR‐D‐16‐0176.1

Liu, H.‐Y., Wang, Y., & Gu, J.‐F. (2021). Intensity change of binary tropical cyclones (TCs) in idealized numerical simulations: Two initially identical mature TCs. Journal of the Atmospheric Sciences, 78(4), 1001–1020. https://doi.org/10.1175/JAS‐D‐20‐0116.1

Liu, H.‐Y., Wang, Y., Xu, J., & Duan, Y. (2018). A dynamical initialization scheme for tropical cyclones under the influence of terrain. Weather and Forecasting, 33(3), 641–659. https://doi.org/10.1175/WAF‐D‐17‐0139.1

Nakano, M., Wada, A., Sawada, M., Yoshimura, H., Onishi, R., Kawahara, S., et al. (2017). Global 7‐km mesh nonhydrostatic model intercomparison project for improving typhoon forecast (TYMIP‐G7): Experimental design and preliminary results. Geoscientific Model Development, 10(3), 1363–1381. https://doi.org/10.5194/gmd‐10‐1363‐2017

National Centers for Environmental Prediction/National Weather Service/NOAA/U.S. Department of Commerce. (2015). NCEP GFS 0.25 degree global forecast grids historical archive [Dataset]. Research Data Archive at the National Center for Atmospheric Research, Computational and Information Systems Laboratory. https://doi.org/10.5065/D65D8PWK

Pathak, J., Subramanian, S., Harrington, P., Raja, S., Chattopadhyay, A., Mardani, M., et al. (2022). FourCastNet: A global data‐driven high‐ resolution weather model using adaptive Fourier Neural operators. Preprint at. https://doi.org/10.48550/arXiv.2202.11214

Pollard, R. T., Rhines, P. B., & Thompson, R. O. R. Y. (1973). The deepening of the wind‐mixed layer. Geophysical Fluid Dynamics, 3(4), 381– 404. https://doi.org/10.1080/03091927208236105

Sasaki, H., Kida, H., Koide, T., & Chiba, M. (1995). The performance of long‐term integrations of a limited area model with the spectral boundary coupling method. Journal of the Meteorological Society of Japan, 73(2), 165–181. https://doi.org/10.2151/jmsj1965.73.2165

Schreck III, C. J., Vitart, F., Camargo, S. J., Camp, J., Darlow, J., Elsberry, R., et al. (2023). Advances in tropical cyclone prediction on subseasonal time scales during 2019–2022. Tropical Cyclone Research and Review, 12(2), 136–150. https://doi.org/10.1016/j.tcrr.2023.06.004

Selz, T., & Craig, G. C. (2023). Can artificial intelligence‐based weather prediction models simulate the butterfly effect? Geophysical Research Letters, 50(20), e2023GL105747. https://doi.org/10.1029/2023GL105747

Skamarock, W. C., Klemp, J. B., Dudhia, J., Gill, D. O., Liu, Z., Berner, J., et al. (2019). A description of the advanced research WRF version 4. In NCAR technical notes (No. NCAR/TN‐556+STR) (pp. 1–148). https://doi.org/10.5065/1dfh‐6p97

Tan, Z.‐M., Lei, L., Wang, Y., Xu, Y., & Zhang, Y. (2022). Typhoon track, intensity, and structure: From theory to prediction. Advances in Atmospheric Sciences, 39(11), 1789–1799. https://doi.org/10.1007/s00376‐022‐2212‐1

Torn, R. D., Elless, T. J., Papin, P. P., & Davis, C. A. (2018). Tropical cyclone track sensitivity in deformation steering flow. Monthly Weather Review, 146(10), 3183–3201. https://doi.org/10.1175/mwr‐d‐18‐0153.1

Vitart, F. (2014). Evolution of ECMWF sub‐seasonal forecast skill scores. Quarterly Journal of the Royal Meteorological Society, 140(683), 1889–1899. https://doi.org/10.1002/qj.2256

von Storch, H., Langenberg, H., & Feser, F. (2000). A spectral nudging technique for dynamical downscaling purposes. Monthly Weather Review, 128(10), 3664–3673. https://doi.org/10.1175/1520‐0493(2000)128<3664:ASNTFD>2.0.CO;2

Wang, H., Wang, Y., & Xu, H. M. (2013). Improving simulation of a tropical cyclone using dynamical initialization and largescale spectral nudging: A case study of typhoon Megi (2010). Acta Meteorologica Sinica, 27(4), 455–475. https://doi.org/10.1007/s13351‐013‐0418‐y

Wang, Y., & Wu, C.‐C. (2004). Current understanding of tropical cyclone structure and intensity changes—A review. Meteorology and Atmospheric Physics, 87(4), 257–278. https://doi.org/10.1007/s00703‐003‐0055‐6

Wang, Z., Sun, H., Lei, L., Tan, Z.‐M., & Zhang, Y. (2024). The importance of data assimilation components for initial conditions and subsequent error growth. Science China Earth Sciences, 67(1), 105–116. https://doi.org/10.1007/s11430‐023‐1229‐7

Webster, P. J. (2013). Improve weather forecasts for the developing world. Nature, 493(7430), 17–19. https://doi.org/10.1038/493017a

Xiang, B., Lin, S.‐J., Zhao, M., Zhang, S., Vecchi, G., Li, T., et al. (2015). Beyond weather time‐scale prediction for Hurricane Sandy and Super Typhoon Haiyan in a global climate model. Monthly Weather Review, 143(2), 524–535. https://doi.org/10.1175/MWR‐D‐14‐00227.1

Yamada, H., Nasuno, T., Yanase, W., & Satoh, M. (2016). Role of the vertical structure of a simulated tropical cyclone in its motion: A case study of typhoon Fengshen (2008). Scientific Online Letters on the Atmosphere, 12(0), 203–208. https://doi.org/10.2151/SOLA.2016‐041

Yamada, Y., Miyakawa, T., Nakano, M., Kodama, C., Wada, A., Nasuno, T., et al. (2023). Large ensemble simulation for investigating predictability of precursor vortices of Typhoon Faxai in 2019 with a 14‐km mesh global nonhydrostatic atmospheric model. Geophysical Research Letters, 50(3), e2022GL100565. https://doi.org/10.1029/2022GL100565

Yamaguchi, M., Ishida, J., Sato, H., & Nakagawa, M. (2017). WGNE intercomparison of tropical cyclone forecasts by operational NWP models: A quarter century and beyond. Bulletin of the American Meteorological Society, 98(11), 2337–2349. https://doi.org/10.1175/BAMS‐D‐16‐ 0133.1

Yesubabu, V., Kattamanchi, V. K., Vissa, N. K., Dasari, H. P., & Sarangam, V. B. R. (2019). Impact of ocean mixed‐layer depth initialization on the simulation of tropical cyclones over the Bay of Bengal using the WRF‐ARW model. Meteorological Applications, 27(1), e1862. https://doi. org/10.1002/met.1862

Yu, H., Chen, G., Zhou, C., Wong, W. K., Yang, M., Xu, Y., et al. (2022). Are we reaching the limit of tropical cyclone track predictability in the Western North Pacific? Bulletin of the American Meteorological Society, 103(2), E410–E428. https://doi.org/10.1175/BAMS‐D‐20‐0308.1

Zhang, F., & Weng, Y. (2015). Predicting hurricane intensity and associated hazards: A five‐year real‐time forecast experiment with assimilation of airborne Doppler radar observations. Bulletin of the American Meteorological Society, 96(1), 25–33. https://doi.org/10.1175/BAMS‐D‐13‐ 00231.1

Zhou, F., & Toth, Z. (2020). On the prospects for improved tropical cyclone track forecasts. Bulletin of the American Meteorological Society, 101(12), E2058–E2077. https://doi.org/10.1175/BAMS‐D‐19‐0166.1
