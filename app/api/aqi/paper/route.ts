export const dynamic = "force-dynamic";

const escapePdf = (value: string) => value.replace(/[^\x20-\x7E]/g, "-").replace(/([\\()])/g, "\\$1");
const timesWidths: Record<string, number> = { " ":250,A:722,B:667,C:667,D:722,E:611,F:556,G:722,H:722,I:333,J:389,K:722,L:611,M:889,N:722,O:722,P:556,Q:722,R:667,S:556,T:611,U:722,V:722,W:944,X:722,Y:722,Z:611,a:444,b:500,c:444,d:500,e:444,f:333,g:500,h:500,i:278,j:278,k:500,l:278,m:778,n:500,o:500,p:500,q:500,r:333,s:389,t:278,u:500,v:500,w:722,x:500,y:500,z:444,"0":500,"1":500,"2":500,"3":500,"4":500,"5":500,"6":500,"7":500,"8":500,"9":500,".":250,",":250,":":278,";":278,"-":333,"(":333,")":333,"/":278,"'":180,"=":564,"[":333,"]":333,"&":778 };
const estimatedTimesWidth = (text: string, fontSize: number) => [...text].reduce((total, character) => total + (timesWidths[character] ?? 500) * fontSize / 1000, 0);
const wrapTimes = (text: string, fontSize: number, maxWidth: number) => {
  const words = text.replace(/\s+/g, " ").trim().split(" "), lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && estimatedTimesWidth(candidate, fontSize) > maxWidth) { lines.push(line); line = word; }
    else line = candidate;
  }
  if (line) lines.push(line);
  return lines;
};

const chemicalFormula = /PM2\.5|PM10|NO2|SO2|CO2|O3/g;
const formulaParts: Record<string, [string, string]> = {
  "PM2.5": ["PM", "2.5"],
  PM10: ["PM", "10"],
  NO2: ["NO", "2"],
  SO2: ["SO", "2"],
  CO2: ["CO", "2"],
  O3: ["O", "3"],
};

function pdfTextOperators(text: string, size: number, bold = false) {
  const operators: string[] = [];
  let cursor = 0;
  for (const match of text.matchAll(chemicalFormula)) {
    if (match.index > cursor) operators.push(`(${escapePdf(text.slice(cursor, match.index))}) Tj`);
    const [base, subscript] = formulaParts[match[0]];
    operators.push(`(${base}) Tj`, `/${bold ? "F2" : "F1"} ${(size * 0.68).toFixed(2)} Tf`, `${(-size * 0.24).toFixed(2)} Ts`, `(${subscript}) Tj`, "0 Ts", `/${bold ? "F2" : "F1"} ${size} Tf`);
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) operators.push(`(${escapePdf(text.slice(cursor))}) Tj`);
  return operators;
}

function textLine(text: string, x: number, y: number, size = 10, bold = false) {
  return ["BT", `/${bold ? "F2" : "F1"} ${size} Tf`, `${x.toFixed(1)} ${y.toFixed(1)} Td`, ...pdfTextOperators(text, size, bold), "ET"];
}

function justifiedParagraph(text: string, y: number, options: { size?: number; leading?: number; width?: number; x?: number } = {}) {
  const { size = 10, leading = 15, width = 491, x = 52 } = options;
  const lines = wrapTimes(text, size, width), commands: string[] = [];
  lines.forEach((line, index) => {
    const spaces = (line.match(/ /g) ?? []).length;
    const wordSpacing = index < lines.length - 1 && spaces ? Math.max(0, (width - estimatedTimesWidth(line, size)) / spaces) : 0;
    commands.push("BT", `/F1 ${size} Tf`, `${wordSpacing.toFixed(2)} Tw`, `${x} ${(y - index * leading).toFixed(1)} Td`, ...pdfTextOperators(line, size), "0 Tw", "ET");
  });
  return { commands, nextY: y - lines.length * leading };
}

function frontPageStream() {
  const title = "Air Quality Trends, Hotspots, and Pollution Regimes Across Bangladesh";
  const abstract = "Air pollution is a persistent concern in Bangladesh, but its estimated burden varies across the country and throughout the year. This study analysed 87,744 district-day records for all 64 districts over 1,371 represented dates between 1 January 2023 and 17 October 2026; 1-15 October 2026 were unavailable for every district and were excluded. Hourly US Air Quality Index (AQI), PM2.5, PM10, nitrogen dioxide, sulfur dioxide, carbon monoxide, and ozone estimates were retrieved at one representative coordinate per district from the Open-Meteo Air Quality API with the CAMS global atmospheric-composition forecast domain. Daily records are arithmetic means of available hourly estimates. The analysis combined seasonal summaries with exploratory Mann-Kendall trends, Sen's slopes, correlation, standardized principal component analysis, K-means clustering, and spatial autocorrelation. Mean AQI was 112.83, while mean PM2.5 and PM10 were 43.83 and 56.40 micrograms per cubic metre. Mean winter AQI reached 156.48 versus 74.60 during the monsoon. AQI correlated strongly with PM2.5 and PM10, as expected partly because the consolidated AQI is derived from pollutant sub-indices. District mean AQI was spatially clustered under four-nearest-neighbour weights (Moran's I=0.819; 999-permutation p=0.001). The first principal component explained 67.24% of standardized pollutant-profile variability, and silhouette comparison supported three descriptive clusters. These are centroid-based model estimates from an approximately 45-km product, not district-wide measurements or 64 independent stations. Results are therefore screening-level evidence requiring ground validation and sensitivity analysis before exposure, source, or causal interpretation.";
  const commands = textLine(title, (595 - estimatedTimesWidth(title, 13)) / 2, 785, 13, true);
  commands.push(...textLine("Abstract", 52, 746, 12, true));
  const paragraph = justifiedParagraph(abstract, 722, { leading: 17 });
  commands.push(...paragraph.commands);
  const keywordLabel = "Keywords:", keywords = "Air quality index; PM2.5; seasonal variation; spatial autocorrelation; pollution regimes; Bangladesh";
  const keywordStart = 52 + estimatedTimesWidth(keywordLabel, 10) + 7;
  commands.push(...textLine(keywordLabel, 52, paragraph.nextY - 12, 10, true), ...textLine(keywords, keywordStart, paragraph.nextY - 12, 10), ...textLine("1", 294, 25, 8));
  return commands.join("\n");
}

function manuscriptPage(paragraphs: string[], pageNumber: number, heading?: string) {
  const commands = heading ? [...textLine(heading, 52, 785, 13, true)] : [];
  let y = heading ? 754 : 785;
  for (const paragraphText of paragraphs) {
    const paragraph = justifiedParagraph(paragraphText, y, { size: 10, leading: 14 });
    commands.push(...paragraph.commands);
    y = paragraph.nextY - 9;
  }
  commands.push(...textLine(String(pageNumber), 294, 25, 8));
  return commands.join("\n");
}

function introductionStreams() {
  const sections = [
    [
      "Ambient air pollution is among the leading environmental threats to human health and sustainable development. Fine particulate matter with an aerodynamic diameter of 2.5 micrometres or less (PM2.5) is of particular concern because it penetrates deeply into the respiratory tract and can enter the bloodstream, contributing to cardiovascular disease, respiratory illness, lung cancer, and premature mortality. Coarse particulate matter (PM10), ozone (O3), nitrogen dioxide (NO2), sulfur dioxide (SO2), and carbon monoxide (CO) impose additional and sometimes interacting risks. The World Health Organization (WHO) consequently reduced its annual PM2.5 guideline to 5 micrograms per cubic metre and stressed that harmful effects occur even at relatively low concentrations [1]. Air pollution is therefore not simply an urban visibility problem; it is a persistent exposure, health-equity, and governance challenge.",
      "The problem is especially acute in South Asia, where dense populations coexist with rapid urbanization, industrial expansion, fossil-fuel and biomass combustion, construction dust, and growing transport demand [2-4]. Regional atmospheric circulation can carry pollution over long distances across the Indo-Gangetic Plain, so measured concentrations often represent a mixture of local emissions and transported aerosols [7,9]. These characteristics complicate control strategies: interventions limited to a single source, city, or administrative boundary may fail to address the full pollution burden. They also make spatially complete evidence essential for identifying populations and places that are repeatedly exposed to high concentrations [10,11].",
      "Bangladesh lies at the eastern edge of this regional pollution system and experiences severe ambient particulate pollution. The country's high population density, continuing urban growth, congested road networks, industrial clusters, construction activity, open burning, and seasonal brick production create multiple overlapping sources. Early receptor-model studies in Dhaka identified motor vehicles and brick kilns as major dry-season contributors and emphasized the additional role of regional transport [2]. Measurements from several Bangladeshi cities further attributed more than half of fine-particle mass to anthropogenic activities including brick production, biomass burning, and traffic, while noting that weak winter dispersion amplifies local emissions [3]. These findings established that Bangladesh's air-quality problem is multisource and cannot be represented by traffic emissions alone.",
      "More recent chemical evidence reinforces this interpretation. Year-long sampling in Dhaka found pronounced seasonal variation in PM2.5, black carbon, and trace elements, with winter concentrations exceeding those in the monsoon; source-apportionment results implicated soil dust, motor-vehicle exhaust, industrial activity, sea salt, and paint or battery-related emissions [4]. Direct measurements of brick-kiln plumes have also documented substantial black-carbon and gaseous emissions [5]. A field study exploiting wind direction and production timing found markedly higher PM2.5 downwind of operating kilns and reported elevated respiratory symptoms among nearby residents [6]. Together, these studies demonstrate that source mixtures vary across space and season and that emission-intensive activities can generate measurable community-level consequences.",
      "Seasonality is one of the most consistent features of air pollution in Bangladesh. Analysis of hourly observations in Dhaka during 2016-2021 reported winter mean PM2.5 near 165-175 micrograms per cubic metre, compared with approximately 30-35 during the monsoon, as well as multiweek episodes above the national daily standard [7]. Meteorological studies show that rainfall, wind, humidity, temperature, and boundary-layer dynamics influence both pollutant removal and near-surface accumulation [8]. During the dry winter, limited wet deposition, shallow mixing, stagnant conditions, northwesterly flow, and the seasonal operation of brick kilns can coincide. During the monsoon, rainfall scavenging and stronger ventilation generally reduce particulate concentrations. Consequently, annual means alone obscure the magnitude, duration, and geography of high-exposure periods.",
      "Air-mass transport adds another layer of complexity. Chemical transport modelling estimated a substantial transboundary contribution to Dhaka's PM2.5 burden [7], while a recent sensor network spanning urban and rural locations found that local sources remained important but Indo-Gangetic Plain transport enhanced concentrations across all monitored sites [9]. The same study recorded high concentrations outside Dhaka, challenging the assumption that severe pollution is exclusively metropolitan. This distinction has policy significance: local emission controls are indispensable, but coordinated regional management and an understanding of seasonal circulation are also required."
    ],
    [
      "Despite a substantial literature, much of the empirical evidence remains concentrated in Dhaka or a small number of monitoring sites [2,4,7,8]. Campaign-based filter sampling provides valuable chemical specificity but is commonly limited in duration and geographic extent [3-5]. Regulatory stations offer continuous observations but do not cover every district, particularly rural and semi-urban areas [9,10]. City-centred evidence therefore risks overlooking secondary industrial corridors, agricultural regions, coastal settings, and districts affected by transported pollution. It also limits direct comparison of district trajectories under a common measurement framework.",
      "Recent spatial studies have begun to address this limitation. A national PM2.5 analysis identified positive spatial autocorrelation and seasonal and divisional contrasts [10], while disease-burden research using gridded exposure data found strong winter maxima [11]. Acharjee et al. subsequently analysed Sentinel-5P observations for five gaseous pollutants across all 64 districts, applied Mann-Kendall tests, and classified multi-annual district profiles using K-means [21]. Nationwide multipollutant assessment and district clustering are therefore not themselves novel. The present contribution is differentiated by integrating particulate matter with gaseous pollutants and consolidated US AQI, quantifying AQI-category and seasonal burden, and examining trends, standardized pollutant profiles, and spatial dependence within one model-based surface-concentration framework.",
      "Atmospheric composition forecasts provide one route to spatially consistent national screening. Open-Meteo identifies its cams_global domain as the CAMS Global Atmospheric Composition Forecast, available from August 2022 at approximately 0.4 degree or 45-km spatial resolution and three-hourly native temporal resolution [22]. This operational forecast archive is not the CAMS reanalysis described by Inness et al. [12]; that reference is retained only as background on CAMS modelling. Model fields can support harmonized comparison where station density is low, but validation research has documented regional and temporal biases [13]. They must therefore be interpreted as coarse gridded estimates rather than regulatory measurements, district-wide averages, or personal exposure data.",
      "A robust national assessment must also move beyond descriptive averages. Monotonic trend tests can distinguish systematic change from short-term variability without requiring normally distributed observations [14,15]; Sen's slope provides an interpretable estimate of the magnitude of change [16]. Correlation analysis and principal component analysis can reveal shared pollutant behaviour and dominant dimensions of variability [17], while clustering can identify districts with similar multipollutant profiles [18]. Global and local spatial-autocorrelation statistics can determine whether high or low burdens are geographically concentrated [19,20]. Used together, these methods connect temporal evolution, pollutant mixtures, and spatial organization, providing more policy-relevant evidence than any single summary statistic.",
      "Opportunities nevertheless remain to integrate particulate and gaseous surface concentrations with AQI-derived burden, seasonal behaviour, district-specific trends, and spatial dependence within a consistent analytical framework. This combination complements satellite column analyses and PM2.5-focused studies rather than claiming the first nationwide assessment. It can identify descriptive pollutant-profile clusters and recurring geographic contrasts that generate testable hypotheses for monitoring and management; it cannot establish pollution sources from statistical similarity alone.",
      "Accordingly, this study analyses model-derived US AQI, PM2.5, PM10, NO2, SO2, CO, and O3 estimates for all 64 districts over represented dates from 1 January 2023 to 17 October 2026. Its objectives are to: (i) characterize national and district-level temporal and seasonal variation; (ii) estimate exploratory monotonic trends; (iii) evaluate interpollutant relationships and standardized dominant variability; (iv) classify districts into descriptive multipollutant profiles; and (v) assess global and local spatial autocorrelation. Because the observations are centroid-sampled model estimates and the record is short and incomplete in October 2026, the study does not claim causal source attribution, district-wide exposure, or station-equivalent measurement."
    ]
  ];
  return sections.map((paragraphs, index) => manuscriptPage(paragraphs, index + 2, index === 0 ? "1. Introduction" : undefined));
}

function methodsStreams() {
  const sections = [
    [
      "2.1 Data source and spatial sampling",
      "Hourly fields were requested from the Open-Meteo Air Quality API endpoint /v1/air-quality using domains=cams_global and timezone=Asia/Dhaka [22]. Variables were us_aqi, pm2_5, pm10, nitrogen_dioxide, sulphur_dioxide, carbon_monoxide, and ozone. Open-Meteo documents cams_global as the operational CAMS Global Atmospheric Composition Forecast, with approximately 0.4 degree (45 km) spatial resolution, three-hourly native resolution, availability from August 2022, and twice-daily updates. The retrieved archive should not be described as CAMS reanalysis.",
      "One WGS84 latitude-longitude coordinate representing an approximate district centroid was supplied for each of Bangladesh's 64 districts. No polygon average, area weighting, population weighting, or extraction of every grid cell intersecting a district was performed. A reproducibility audit on 18 October 2026 returned 64 distinct API location coordinates for the 64 requests. This does not establish 64 spatially independent source cells: interpolation or API grid selection can return distinct coordinates from the same coarse underlying field, and neighbouring district estimates may remain strongly dependent. Maps assign each point estimate to its district polygon for visualization only.",
      "2.2 Temporal aggregation and completeness",
      "Open-Meteo's consolidated hourly US AQI is the maximum of pollutant-specific sub-indices. Its particulate indices use preceding 24-hour rolling concentrations, CO uses 8 hours, ozone uses hourly and 8-hour values, SO2 uses hourly and 24-hour values, and NO2 uses hourly values [22]. For each district and local calendar date, this study stored the arithmetic mean, minimum, and maximum of available hourly API values for each variable. Analyses labelled daily AQI use the arithmetic mean of hourly consolidated AQI values; this is a study aggregation and should not be interpreted as an independently calculated regulatory daily AQI.",
      "The nominal study window, 1 January 2023 through 17 October 2026, contains 1,386 calendar dates. Database auditing identified 1,371 dates represented for all 64 districts, yielding 87,744 district-day records. The 15 dates from 1 through 15 October 2026 were absent for every district and were excluded without imputation. No date had partial district coverage among the 1,371 retained dates. The 2026 series is incomplete and results involving trends or annual comparisons are therefore provisional."
    ],
    [
      "2.3 Statistical analysis",
      "National, seasonal, annual, and district summaries were calculated from daily means. Seasons were defined as winter (December-February), pre-monsoon (March-May), monsoon (June-August), and post-monsoon (September-November). Pearson correlations used district-day means. Because consolidated AQI is mathematically derived as the maximum pollutant sub-index, its correlations with PM2.5, PM10, and other inputs are partly structural and are not treated as independent evidence of physical coupling.",
      "Exploratory Mann-Kendall tests and Sen's slopes were applied to monthly district means. The current analysis does not apply seasonal Mann-Kendall adjustment, trend-free prewhitening for serial correlation, or correction for multiple testing across districts and pollutants. Together with incomplete 2026 coverage, these choices limit confirmatory interpretation; p-values and slopes are retained as screening statistics pending seasonal and autocorrelation-sensitive analysis.",
      "Principal component analysis used six variables (PM2.5, PM10, NO2, SO2, CO, and O3) summarized as long-term district means. Each variable was standardized to zero mean and unit sample standard deviation before eigendecomposition of the correlation matrix. AQI was excluded to avoid duplicating information embedded in pollutant sub-indices. PC1 explained 67.24% of standardized variability. K-means used the same standardized district profiles. Candidate k values from 2 through 6 were compared by mean silhouette width; k=3 had the highest observed score (0.445, versus 0.433 for k=2). Clusters are descriptive pollutant profiles, not causal source categories. Initialization sensitivity and bootstrap stability have not yet been evaluated.",
      "Global Moran's I was calculated for long-term district mean AQI using row-standardized four-nearest-neighbour weights defined from the 64 district centroid coordinates. Significance used 999 seeded random permutations and a two-sided absolute-I comparison, producing I=0.819 and pseudo-p=0.001. Local quadrants were used descriptively. The centroid representation, coarse CAMS field, and model smoothing may inflate apparent spatial autocorrelation; alternative neighbour definitions and polygon- or grid-based extraction should be tested before strong hotspot claims.",
      "2.4 Reproducibility and limitations",
      "The extraction code records API variables, requested coordinates, Asia/Dhaka daily boundaries, and database keys; analysis scripts reproduce coverage, summaries, trends, PCA, clustering, and Moran's I. The principal limitations are model rather than monitor observations, approximately 45-km source resolution, one point per district, missing October 2026 dates, a short and incomplete trend period, no ground-monitor validation in the present analysis, and untested cluster stability. Findings support screening and monitoring prioritization, not individual exposure assessment, source attribution, regulatory compliance determination, or causal inference."
    ]
  ];
  return sections.map((paragraphs, index) => manuscriptPage(paragraphs, index + 4, index === 0 ? "2. Materials and Methods" : "2. Materials and Methods (continued)"));
}

function referenceStreams() {
  const references = [
    "[1] World Health Organization. WHO global air quality guidelines: particulate matter (PM2.5 and PM10), ozone, nitrogen dioxide, sulfur dioxide and carbon monoxide. Geneva: WHO; 2021. ISBN 978-92-4-003422-8.",
    "[2] Begum BA, Biswas SK, Hopke PK. Key issues in controlling air pollutants in Dhaka, Bangladesh. Atmospheric Environment. 2011;45:7705-7713. doi:10.1016/j.atmosenv.2010.10.022.",
    "[3] Begum BA, Nasiruddin M, Randal S, Sivertsen B, Hopke PK. Identification and apportionment of sources from air particulate matter at urban environments in Bangladesh. Current Journal of Applied Science and Technology. 2014;4:3930-3955. doi:10.9734/BJAST/2014/11247.",
    "[4] Rahman MS, Bhuiyan SS, Ahmed Z, Saha N, Begum BA. Characterization and source apportionment of elemental species in PM2.5 with especial emphasis on seasonal variation in the capital city Dhaka, Bangladesh. Urban Climate. 2021;36:100804. doi:10.1016/j.uclim.2021.100804.",
    "[5] Haque MI, Nahar K, Kabir MH, Salam A. Particulate black carbon and gaseous emission from brick kilns in Greater Dhaka region, Bangladesh. Air Quality, Atmosphere and Health. 2018;11:925-935. doi:10.1007/s11869-018-0596-y.",
    "[6] Brooks N, Biswas D, Hossin R, Yu A, Saha S, Saha S, Saha SK, Luby SP. Health consequences of small-scale industrial pollution: evidence from the brick sector in Bangladesh. World Development. 2023;170:106318. doi:10.1016/j.worlddev.2023.106318.",
    "[7] Sarwar G, Hogrefe C, Henderson BH, Foley K, Mathur R, Murphy B, Ahmed S. Characterizing variations in ambient PM2.5 concentrations at the U.S. Embassy in Dhaka, Bangladesh using observations and the CMAQ modeling system. Atmospheric Environment. 2023;296:119587. doi:10.1016/j.atmosenv.2023.119587.",
    "[8] Afrin S, Islam MM, Ahmed T. A meteorology based particulate matter prediction model for megacity Dhaka. Aerosol and Air Quality Research. 2021;21:200371. doi:10.4209/aaqr.2020.07.0371.",
    "[9] Zaman SU, Roy S, de Foy B, et al. Comparison of PM2.5 trends and source factors in urban and rural locations in Bangladesh. Atmospheric Pollution Research. 2026;17:102744. doi:10.1016/j.apr.2025.102744.",
    "[10] Mitra JR, Czajkowski K. Spatiotemporal patterns and hot spots of PM2.5 in Bangladesh. Atmospheric Research. 2025;315:107898. doi:10.1016/j.atmosres.2024.107898.",
    "[11] Dewan A, Shahid S, Asaduzzaman M, Faruque F. An exploratory study to examine abundance of PM2.5 and associated disease burden in Bangladesh. ISPRS Annals. 2022;V-3-2022:627-633. doi:10.5194/isprs-annals-V-3-2022-627-2022.",
    "[12] Inness A, Ades M, Agusti-Panareda A, et al. The CAMS reanalysis of atmospheric composition. Atmospheric Chemistry and Physics. 2019;19:3515-3556. doi:10.5194/acp-19-3515-2019.",
    "[13] Jin C, Wang Y, Li T, Yuan Q. Global validation and hybrid calibration of CAMS and MERRA-2 PM2.5 reanalysis products based on OpenAQ platform. Atmospheric Environment. 2022;274:118972. doi:10.1016/j.atmosenv.2022.118972.",
    "[14] Mann HB. Nonparametric tests against trend. Econometrica. 1945;13:245-259. doi:10.2307/1907187.",
    "[15] Kendall MG. Rank Correlation Methods. 4th ed. London: Charles Griffin; 1975.",
    "[16] Sen PK. Estimates of the regression coefficient based on Kendall's tau. Journal of the American Statistical Association. 1968;63:1379-1389. doi:10.1080/01621459.1968.10480934.",
    "[17] Jolliffe IT. Principal Component Analysis. 2nd ed. New York: Springer; 2002. doi:10.1007/b98835.",
    "[18] MacQueen J. Some methods for classification and analysis of multivariate observations. Proceedings of the Fifth Berkeley Symposium on Mathematical Statistics and Probability. 1967;1:281-297.",
    "[19] Moran PAP. Notes on continuous stochastic phenomena. Biometrika. 1950;37:17-23. doi:10.1093/biomet/37.1-2.17.",
    "[20] Anselin L. Local indicators of spatial association-LISA. Geographical Analysis. 1995;27:93-115. doi:10.1111/j.1538-4632.1995.tb00338.x.",
    "[21] Acharjee B, Abdullah M, Hasan M, Roy H, Fahim TT, Rahman MM. Spatiotemporal analysis and machine learning-based profiling of atmospheric pollutants using Sentinel-5P TROPOMI satellite data at tier-two administrative units in Bangladesh. Jahangirnagar University Journal of Science. 2026. Available from: http://journals.juniv.edu/index.php/jos/article/view/425.",
    "[22] Open-Meteo. Air Quality API documentation: CAMS Global Atmospheric Composition Forecasts, API parameters, US AQI calculation, and data sources. Available from: https://open-meteo.com/en/docs/air-quality-api. Accessed 18 October 2026."
  ];
  return [references.slice(0, 11), references.slice(11)].map((pageReferences, pageIndex) => {
    const commands = [...textLine(pageIndex === 0 ? "References" : "References (continued)", 52, 785, 13, true)];
    let y = 750;
    for (const reference of pageReferences) {
      const paragraph = justifiedParagraph(reference, y, { size: 9, leading: 11.5 });
      commands.push(...paragraph.commands);
      y = paragraph.nextY - 7;
    }
    if (pageIndex === 1) {
      commands.push(...textLine("Data and code note", 52, y - 3, 9, true));
      const note = justifiedParagraph("The analysis uses Open-Meteo CAMS global forecast fields sampled at one representative coordinate per district. The reproducibility scripts audit database coverage, API-resolved locations, descriptive statistics, trends, standardized PCA, silhouette-based K-means selection, and Moran's I. The 15 nationally absent dates (1-15 October 2026) are excluded without imputation.", y - 19, { size: 9, leading: 11.5 });
      commands.push(...note.commands);
    }
    commands.push(...textLine(String(pageIndex + 6), 294, 25, 8));
    return commands.join("\n");
  });
}

function buildPdf() {
  const streams = [frontPageStream(), ...introductionStreams(), ...methodsStreams(), ...referenceStreams()];
  const regularFontId = 3 + streams.length * 2, boldFontId = regularFontId + 1;
  const pageResources = `/Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >>`;
  const kids = streams.map((_, index) => `${3 + index * 2} 0 R`).join(" ");
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", `<< /Type /Pages /Kids [${kids}] /Count ${streams.length} >>`];
  streams.forEach((stream, index) => {
    const pageId = 3 + index * 2, contentId = pageId + 1;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] ${pageResources} /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}\nendstream`);
  });
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>");
  let pdf = "%PDF-1.4\n"; const offsets = [0];
  objects.forEach((object, index) => { offsets.push(new TextEncoder().encode(pdf).length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index <= objects.length; index++) pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

export async function GET(request: Request) {
  const download = new URL(request.url).searchParams.get("download") === "1";
  return new Response(buildPdf(), { headers: { "Content-Type":"application/pdf", "Content-Disposition":`${download ? "attachment" : "inline"}; filename="bangladesh-aqi-manuscript.pdf"`, "Cache-Control":"no-store" } });
}
