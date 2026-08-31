/* =========================================
ZINN CORE
MAIN SCRIPT
========================================= */
/* =========================================
SUPABASE
========================================= */
const SUPABASE_URL =
"https://lzjdfqiglvrebybhjtrg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_y1yWrDAeT2g9jxVTJaSSPQ_-d5e5DrE";
const supabaseClient =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);
/* =========================================
HERO CORE MOVEMENT
========================================= */
const coreArea =
document.querySelector(".core-area");
const machine =
document.querySelector(".core-machine");
document.addEventListener(
"mousemove",
(event) => {
if (!coreArea || !machine) return;
const x =
(
event.clientX /
window.innerWidth -
0.5
) * 12;
const y =
(
event.clientY /
window.innerHeight -
0.5
) * 12;
machine.style.transform =
`translate(${x}px, ${y}px)`;
}
);
/* =========================================
HERO STATUS
========================================= */
const statusTexts = [
"ZINN CORE SYSTEM ONLINE",
"ANALYSIS ENGINE READY",
"DIGITAL SIGNAL ACTIVE",
"AI SYSTEM OPERATIONAL"
];
const heroStatus =
document.querySelector(
".hero-status"
);
let currentStatus = 0;
if (heroStatus) {
setInterval(() => {
currentStatus++;
if (
currentStatus >=
statusTexts.length
) {
currentStatus = 0;
}
heroStatus.innerHTML = `
<span class="status-dot"></span>
${statusTexts[currentStatus]}
`;
}, 3000);
}
/* =========================================
CORE SCAN ELEMENTS
========================================= */
const coreScanForm =
document.querySelector(
"#coreScanForm"
);
const stageOne =
document.querySelector(
".scan-stage-one"
);
const stageTwo =
document.querySelector(
".scan-stage-two"
);
const stageThree =
document.querySelector(
".scan-stage-three"
);
const stageFour =
document.querySelector(
".scan-stage-four"
);
const progressItems =
document.querySelectorAll(
".scan-progress-item"
);
/* =========================================
CURRENT BRAND DATA
========================================= */
let currentBrandData = {};
let currentAnalysis = null;
let coreAnalysisPromise = null;
/* =========================================
ZINN CORE — AI ANALYSIS
========================================= */
async function analyzeBrandWithAI() {
const response = await fetch(
"/api/analyze",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
brandName:
currentBrandData.brandName,
instagram:
currentBrandData.instagram,
website:
currentBrandData.website,
segment:
currentBrandData.segment,
city:
currentBrandData.city
})
}
);
const result =
await response.json();
if (!response.ok) {
throw new Error(
result.error ||
"Erro ao analisar a marca."
);
}
if (!result.analysis) {
throw new Error(
"A IA não retornou uma análise."
);
}
console.log(
"ZINN CORE AI RESULT:",
result.analysis
);
return result.analysis;
}
/* =========================================
RENDER CORE REPORT DATA
========================================= */
function renderCoreReport(data) {

if (!data) return;


/* =========================================
BRAND
========================================= */

const reportBrandName =
document.querySelector(
"#reportBrandName"
);

if (reportBrandName) {

reportBrandName.textContent =
data.brand_name || "—";

}


/* =========================================
CORE SCORE
========================================= */

const reportScore =
document.querySelector(
".report-brand-bar .brand-core strong"
);

if (reportScore) {

reportScore.textContent =
`${Number(data.score ?? 0)} / 100`;

}


/* =========================================
CLASSIFICATION
========================================= */

const reportClassification =
document.querySelector(
".report-brand-bar .brand-positive strong"
);

if (reportClassification) {

reportClassification.textContent =
data.classification ||
"NÃO CLASSIFICADO";

}


/* =========================================
CORE METRICS
========================================= */

const metrics =
data.metrics || {};

const metricValues = [

Number(
metrics.digitalPresence ?? 0
),

Number(
metrics.positioning ?? 0
),

Number(
metrics.authority ?? 0
),

Number(
metrics.conversion ?? 0
),

Number(
metrics.digitalExperience ?? 0
)

];

const metricElements =
document.querySelectorAll(
".score-data .metric"
);

metricElements.forEach(
(metric, index) => {

const value =
metricValues[index] ?? 0;

const number =
metric.querySelector(
".metric-header strong"
);

const fill =
metric.querySelector(
".metric-fill"
);

if (number) {

number.textContent =
value;

}

if (fill) {

fill.dataset.value =
value;

fill.style.width =
`${value}%`;

}

}
);


/* =========================================
STRENGTHS
========================================= */

const strengthCards =
document.querySelectorAll(
".report-positive .report-card"
);

const strengths =
Array.isArray(
data.strengths
)
? data.strengths
: [];

strengthCards.forEach(
(card, index) => {

const strength =
strengths[index];

if (!strength) {

card.style.display =
"none";

return;

}

card.style.display =
"";

const title =
card.querySelector(
"h4"
);

const score =
card.querySelector(
"strong"
);

const description =
card.querySelector(
"p"
);

if (title) {

title.textContent =
strength.title ||
"—";

}

if (score) {

score.textContent =
`${Number(
strength.score ?? 0
)} / 100`;

}

if (description) {

description.textContent =
strength.description ||
strength.text ||
"";

}

}
);


/* =========================================
ATTENTION POINTS
========================================= */

const attentionItems =
document.querySelectorAll(
".report-critical .finding"
);

const attentionPoints =
Array.isArray(
data.attention_points
)
? data.attention_points
: [];

attentionItems.forEach(
(item, index) => {

const attention =
attentionPoints[index];

if (!attention) {

item.style.display =
"none";

return;

}

item.style.display =
"";

const title =
item.querySelector(
"h4"
);

const description =
item.querySelector(
"p"
);

const score =
Array.from(
item.children
).find(
(element) =>
element.tagName ===
"STRONG"
);

if (title) {

title.textContent =
attention.title ||
"—";
}

if (description) {

description.textContent =
attention.description ||
attention.text ||
"";

}

if (score) {

score.textContent =
Number(
attention.score ?? 0
);

}

}
);


/* =========================================
OPPORTUNITY
========================================= */

if (
data.opportunity &&
typeof data.opportunity ===
"object"
) {

const opportunityTitle =
document.querySelector(
".opportunity-report .big-opportunity"
);

const opportunityDescription =
document.querySelector(
".opportunity-report .report-section-content > p:last-child"
);

if (
opportunityTitle &&
data.opportunity.title
) {

const opportunityText =
String(
data.opportunity.title
).trim();

const words =
opportunityText.split(
" "
);

const firstWord =
words.shift();

opportunityTitle.innerHTML =
`${firstWord} <span>${words.join(" ")}</span>`;

}

if (opportunityDescription) {

opportunityDescription.textContent =
data.opportunity.description ||
data.opportunity.text ||
"";

}

}


/* =========================================
ACTION PLAN
========================================= */

const actionItems =
document.querySelectorAll(
".report-action .action-item"
);

const actionPlan =
Array.isArray(
data.action_plan
)
? data.action_plan
: [];

actionItems.forEach(
(item, index) => {

const action =
actionPlan[index];

if (!action) {

item.style.display =
"none";

return;

}

item.style.display =
"";

const title =
item.querySelector(
"strong"
);

const description =
item.querySelector(
"p"
);

if (
typeof action ===
"string"
) {

if (title) {

title.textContent =
action;

}

if (description) {

description.textContent =
"";

}

} else {

if (title) {

title.textContent =
action.title ||
"—";

}

if (description) {

description.textContent =
action.description ||
action.text ||
"";

}

}

}
);


/* =========================================
REPORT ID
========================================= */

const reportIdDisplay =
document.querySelector(
".report-footer span:last-child"
);

if (reportIdDisplay) {

reportIdDisplay.textContent =
`REPORT ID / ${
data.report_id ||
currentBrandData.reportId ||
"—"
}`;

}

}


/* =========================================
LOAD SHARED CORE REPORT
========================================= */

async function loadSharedCoreReport() {

const params =
new URLSearchParams(
window.location.search
);

const reportId =
params.get(
"report"
);

if (!reportId) {

return;

}

console.log(
"LOADING CORE REPORT:",
reportId
);

try {

const {
data,
error
} =
await supabaseClient
.from(
"reports"
)
.select(
"*"
)
.eq(
"report_id",
reportId
)
.single();

if (error) {

throw error;

}

if (!data) {

throw new Error(
"Relatório não encontrado."
);

}

currentBrandData = {

brandName:
data.brand_name,

instagram:
data.instagram || "",

website:
data.website || "",

segment:
data.segment || "",

city:
data.city || "",

reportId:
data.report_id

};

openSharedCoreReport(
data
);
updateZinnStudioWhatsApp();

} catch (error) {

console.error(
"CORE REPORT LOAD ERROR:",
error
);

}

}


/* =========================================
OPEN SHARED CORE REPORT
========================================= */

function openSharedCoreReport(
data
) {

currentAnalysis = {

score:
data.score ?? 0,

classification:
data.classification ||
"NÃO CLASSIFICADO",

metrics:
data.metrics ||
{},

strengths:
data.strengths ||
[],

attention_points:
data.attention_points ||
[],

opportunity:
data.opportunity ||
{},

action_plan:
data.action_plan ||
[],

roadmap:
data.roadmap ||
[]

};

renderCoreReport(
data
);

if (stageOne) {

stageOne.hidden =
true;

stageOne.style.display =
"none";

}

if (stageTwo) {

stageTwo.hidden =
true;

stageTwo.style.display =
"none";

}

if (stageThree) {

stageThree.hidden =
true;

stageThree.style.display =
"none";

}

if (stageFour) {

stageFour.hidden =
false;

stageFour.style.display =
"";

}

progressItems.forEach(
(item) => {

item.classList.remove(
"active"
);

}
);

if (
progressItems[3]
) {

progressItems[3]
.classList
.add(
"active"
);

}

const scanSection =
document.querySelector(
".core-scan-section"
);

if (scanSection) {

scanSection.classList.add(
"shared-report-mode"
);

}

const analysisSection =
document.querySelector(
"#analysis"
);

if (analysisSection) {

setTimeout(
() => {

window.scrollTo({

top:
analysisSection
.offsetTop,

behavior:
"auto"

});

},
100
);

}

}


/* =========================================
CORE SCAN FORM
========================================= */

if (coreScanForm) {

coreScanForm.addEventListener(
"submit",
(event) => {

event.preventDefault();

const brandName =
document
.querySelector(
"#brandName"
)
.value
.trim();

const instagram =
document
.querySelector(
"#instagram"
)
.value
.trim();

const segment =
document
.querySelector(
"#segment"
)
.value;

const city =
document
.querySelector(
"#city"
)
.value
.trim();

const website =
document
.querySelector(
"#website"
)
.value
.trim();

if (
!brandName ||
!instagram ||
!segment ||
!city
) {

return;

}

currentBrandData = {

brandName,

instagram,

segment,

city,

website,

reportId:
createCoreReportId(
brandName
)

};

console.log(
"CORE BRAND DATA:",
currentBrandData
);

currentAnalysis = null;

coreAnalysisPromise =
analyzeBrandWithAI();

startCoreScan();

}
);

}


/* =========================================
START CORE SCAN
========================================= */

function startCoreScan() {

if (
!stageOne ||
!stageTwo
) {

return;

}

stageOne.style.transition =
"opacity .45s ease, transform .45s ease";

stageOne.style.opacity =
"0";

stageOne.style.transform =
"translateY(20px)";

setTimeout(() => {

stageOne.hidden =
true;

stageTwo.hidden =
false;

if (
progressItems[0]
) {

progressItems[0]
.classList
.remove(
"active"
);

}

if (
progressItems[1]
) {

progressItems[1]
.classList
.add(
"active"
);

}

stageTwo.animate(
[
{
opacity: 0,
transform:
"translateY(25px)"
},
{
opacity: 1,
transform:
"translateY(0)"
}
],
{
duration: 700,
easing:
"ease",
fill:
"forwards"
}
);

runScanAnimation();

}, 450);

}


/* =========================================
SCAN ANIMATION
========================================= */

function runScanAnimation() {

const percentage =
document.querySelector(
"#scanPercentage"
);

const progressFill =
document.querySelector(
"#scanProgressFill"
);

const checks =
document.querySelectorAll(
".scan-check"
);

let progress = 0;

if (percentage) {

percentage.textContent =
"0%";

}

if (progressFill) {

progressFill.style.width =
"0%";

}

checks.forEach(
(check, index) => {

check
.classList
.remove(
"active"
);

const icon =
check.querySelector(
"span"
);

if (icon) {

icon.textContent =
index === 0
? "✓"
: "○";

}

}
);

if (checks[0]) {

checks[0]
.classList
.add(
"active"
);

}

const interval =
setInterval(() => {

progress +=
Math.floor(
Math.random() * 4
) + 1;

if (
progress > 100
) {

progress = 100;

}

if (percentage) {

percentage.textContent =
`${progress}%`;

}

if (progressFill) {

progressFill.style.width =
`${progress}%`;

}

updateChecklist(
progress,
checks
);

if (
progress >= 100
) {

clearInterval(
interval
);

finishScan();

}

}, 120);

}


/* =========================================
CHECKLIST PROGRESS
========================================= */

function updateChecklist(
progress,
checks
) {

const steps = [
5,
25,
45,
68,
88
];

checks.forEach(
(check, index) => {

if (
progress >=
steps[index]
) {

check
.classList
.add(
"active"
);

const icon =
check.querySelector(
"span"
);

if (icon) {

icon.textContent =
"✓";

}

}

}
);

}


/* =========================================
SCAN COMPLETE
========================================= */

async function finishScan() {

const scannerStatus =
document.querySelector(
".scanner-status"
);

if (scannerStatus) {

scannerStatus.textContent =
"PROCESSANDO INTELIGÊNCIA...";

}

try {

currentAnalysis =
await coreAnalysisPromise;

if (!currentAnalysis) {

throw new Error(
"Análise não disponível."
);

}

currentBrandData.analysis =
currentAnalysis;

console.log(
"CORE ANALYSIS READY:",
currentAnalysis
);

if (scannerStatus) {

scannerStatus.textContent =
"CORE SCAN COMPLETE";

}

setTimeout(() => {

showCoreScore();

}, 900);

} catch (error) {

console.error(
"CORE AI ERROR:",
error
);

if (scannerStatus) {

scannerStatus.textContent =
"CORE ANALYSIS ERROR";

}

alert(
"Não foi possível concluir a análise. Verifique a API e tente novamente."
);

}

}


/* =========================================
SHOW CORE SCORE
========================================= */

function showCoreScore() {

if (
!stageTwo ||
!stageThree
) {

return;

}

stageTwo.animate(
[
{
opacity: 1,
transform:
"translateY(0)"
},
{
opacity: 0,
transform:
"translateY(-20px)"
}
],
{
duration: 500,
easing:
"ease",
fill:
"forwards"
}
);

setTimeout(() => {

stageTwo.hidden =
true;

stageThree.hidden =
false;

if (
progressItems[1]
) {

progressItems[1]
.classList
.remove(
"active"
);

}

if (
progressItems[2]
) {

progressItems[2]
.classList
.add(
"active"
);

}

const brandElement =
document.querySelector(
"#scoreBrandName"
);

if (
brandElement &&
currentBrandData.brandName
) {

brandElement.textContent =
currentBrandData.brandName;

}

stageThree.animate(
[
{
opacity: 0,
transform:
"translateY(25px)"
},
{
opacity: 1,
transform:
"translateY(0)"
}
],
{
duration: 700,
easing:
"ease",
fill:
"forwards"
}
);

animateCoreScore();

}, 500);

}


/* =========================================
ANIMATE CORE SCORE
========================================= */

function animateCoreScore() {

const scoreElement =
document.querySelector(
"#coreScoreNumber"
);

const metricFills =
document.querySelectorAll(
".metric-fill"
);

const finalScore =
Number(
currentAnalysis?.score ?? 0
);

let currentScore = 0;

if (scoreElement) {

scoreElement.textContent =
"0";

}

metricFills.forEach(
(metric) => {

metric.style.width =
"0%";

}
);

const metricValues = [

currentAnalysis?.metrics
?.digitalPresence ?? 0,

currentAnalysis?.metrics
?.positioning ?? 0,

currentAnalysis?.metrics
?.authority ?? 0,

currentAnalysis?.metrics
?.conversion ?? 0,

currentAnalysis?.metrics
?.digitalExperience ?? 0

];

metricFills.forEach(
(metric, index) => {

metric.dataset.value =
metricValues[index] ?? 0;

}
);

const scoreInterval =
setInterval(
() => {

currentScore++;

if (scoreElement) {

scoreElement.textContent =
currentScore;

}

if (
currentScore >=
finalScore
) {

clearInterval(
scoreInterval
);

}

},
22
);

setTimeout(
() => {

metricFills.forEach(
(metric, index) => {

const value =
metric.dataset.value;

setTimeout(
() => {

metric.style.width =
`${value}%`;

},
index * 160
);

}
);

},
500
);

}


/* =========================================
OPEN CORE REPORT
========================================= */

const openReportButton =
document.querySelector(
"#openCoreReport"
);

if (openReportButton) {

openReportButton.addEventListener(
"click",
() => {

showCoreReport();

}
);

}


/* =========================================
SHOW CORE REPORT
========================================= */

function showCoreReport() {

if (
!stageThree ||
!stageFour
) {

return;

}

stageThree.animate(
[
{
opacity: 1,
transform:
"translateY(0)"
},
{
opacity: 0,
transform:
"translateY(-25px)"
}
],
{
duration: 500,
easing:
"ease",
fill:
"forwards"
}
);

setTimeout(() => {

stageThree.hidden =
true;

stageFour.hidden =
false;

if (
progressItems[2]
) {

progressItems[2]
.classList
.remove(
"active"
);

}

if (
progressItems[3]
) {

progressItems[3]
.classList
.add(
"active"
);

}

const reportBrandName =
document.querySelector(
"#reportBrandName"
);

if (
reportBrandName &&
currentBrandData.brandName
) {

reportBrandName.textContent =
currentBrandData.brandName;

}

if (currentAnalysis) {

const dynamicReportData = {

report_id:
currentBrandData.reportId,

brand_name:
currentBrandData.brandName,

instagram:
currentBrandData.instagram ||
null,

website:
currentBrandData.website ||
null,

segment:
currentBrandData.segment ||
null,

city:
currentBrandData.city ||
null,

score:
currentAnalysis.score,

classification:
currentAnalysis.classification,

metrics:
currentAnalysis.metrics,

strengths:
currentAnalysis.strengths,

attention_points:
currentAnalysis.attention_points,

opportunity:
currentAnalysis.opportunity,

action_plan:
currentAnalysis.action_plan,

roadmap:
currentAnalysis.roadmap

};
renderCoreReport(
  dynamicReportData
);

updateZinnStudioWhatsApp();

}


}

stageFour.animate(

{
opacity: 0,
transform:
"translateY(30px)"
},
{
opacity: 1,
transform:
"translateY(0)"
}
],
{
duration: 800,
easing:
"ease",
fill:
"forwards"
}
);

const analysisSection =
document.querySelector(
"#analysis"
);

if (analysisSection) {

window.scrollTo({

top:
analysisSection.offsetTop,

behavior:
"smooth"

});

}

}, 500);

}


/* =========================================
RESTART CORE
========================================= */

const restartCoreButton =
document.querySelector(
"#restartCore"
);

if (restartCoreButton) {

restartCoreButton.addEventListener(
"click",
() => {

restartCore();

}
);

}


/* =========================================
RESTART FUNCTION
========================================= */

function restartCore() {

const scanSection =
document.querySelector(
".core-scan-section"
);

if (scanSection) {

scanSection.classList.remove(
"shared-report-mode"
);

}

if (
window.history &&
window.history.replaceState
) {

window.history.replaceState(
{},
"",
window.location.pathname
);

}

if (stageOne) {

stageOne.style.display =
"";

}

if (stageTwo) {

stageTwo.style.display =
"";

}

if (stageThree) {

stageThree.style.display =
"";

}

if (stageFour) {

stageFour.style.display =
"";

}

if (
!stageOne ||
!stageFour
) {

return;

}

if (coreScanForm) {

coreScanForm.reset();

}

currentBrandData = {};

currentAnalysis = null;

coreAnalysisPromise = null;

stageFour.hidden =
true;

if (stageTwo) {

stageTwo.hidden =
true;

}

if (stageThree) {

stageThree.hidden =
true;

}

stageOne.hidden =
false;

stageOne.style.opacity =
"1";

stageOne.style.transform =
"translateY(0)";

progressItems.forEach(
(item) => {

item
.classList
.remove(
"active"
);

}
);

if (
progressItems[0]
) {

progressItems[0]
.classList
.add(
"active"
);

}

const scoreElement =
document.querySelector(
"#coreScoreNumber"
);

if (scoreElement) {

scoreElement.textContent =
"0";

}

const metricFills =
document.querySelectorAll(
".metric-fill"
);

metricFills.forEach(
(metric) => {

metric.style.width =
"0%";

}
);

const scanPercentage =
document.querySelector(
"#scanPercentage"
);

const scanProgressFill =
document.querySelector(
"#scanProgressFill"
);

const scannerStatus =
document.querySelector(
".scanner-status"
);

if (scanPercentage) {

scanPercentage.textContent =
"0%";

}

if (scanProgressFill) {

scanProgressFill.style.width =
"0%";

}

if (scannerStatus) {

scannerStatus.textContent =
"CORE SCAN / 02";

}

const analysisSection =
document.querySelector(
"#analysis"
);

if (analysisSection) {

window.scrollTo({

top:
analysisSection.offsetTop,

behavior:
"smooth"

});

}

}


/* =========================================
CORE REPORT — SHARE
========================================= */

const shareCoreReportButton =
document.querySelector(
"#shareCoreReport"
);

if (shareCoreReportButton) {

shareCoreReportButton.addEventListener(
"click",
async () => {

if (
!currentBrandData.brandName
) {

showCoreActionFeedback(
shareCoreReportButton,
"REPORT INDISPONÍVEL"
);

return;

}

const reportId =
currentBrandData.reportId;

const reportData = {

report_id:
reportId,

brand_name:
currentBrandData.brandName,

instagram:
currentBrandData.instagram ||
null,

website:
currentBrandData.website ||
null,

segment:
currentBrandData.segment ||
null,

city:
currentBrandData.city ||
null,

score:
currentAnalysis?.score ?? 0,

classification:
currentAnalysis?.classification ||
"NÃO CLASSIFICADO",

metrics:
currentAnalysis?.metrics ||
{},

strengths:
currentAnalysis?.strengths ||
[],

attention_points:
currentAnalysis?.attention_points ||
[],

opportunity:
currentAnalysis?.opportunity ||
{},

action_plan:
currentAnalysis?.action_plan ||
[],

roadmap:
currentAnalysis?.roadmap ||
[]

};

try {

showCoreActionFeedback(
shareCoreReportButton,
"GERANDO LINK..."
);

const {
error
} =
await supabaseClient
.from(
"reports"
)
.upsert(
reportData,
{
onConflict:
"report_id"
}
);

if (error) {

throw error;

}

const reportUrl =
`${window.location.origin}/?report=${encodeURIComponent(reportId)}&v=${Date.now()}`;
/*
Compartilhamento nativo:
apenas em dispositivos móveis.
*/

const canUseNativeShare =
navigator.share &&
/Android|iPhone|iPad|iPod/i.test(
navigator.userAgent
);

if (
canUseNativeShare
) {

try {

await navigator.share({

title:
`ZINN CORE — ${currentBrandData.brandName}`,

text:
"Confira este diagnóstico digital gerado pelo ZINN CORE.",

url:
reportUrl

});

return;

} catch (
shareError
) {

console.log(
"CORE NATIVE SHARE CANCELLED:",
shareError
);

}

}


/*
No PC, copia o link.
*/

if (
navigator.clipboard &&
window.isSecureContext
) {

await navigator.clipboard
.writeText(
reportUrl
);

} else {

fallbackCopyText(
reportUrl
);

}

showCoreActionFeedback(
shareCoreReportButton,
"LINK COPIADO ✓"
);

} catch (error) {

console.error(
"CORE REPORT SAVE ERROR:",
error
);

showCoreActionFeedback(
shareCoreReportButton,
"ERRO AO GERAR LINK"
);

}

}
);

}


/* =========================================
FALLBACK COPY
========================================= */

function fallbackCopyText(
text
) {

const textarea =
document.createElement(
"textarea"
);

textarea.value =
text;

textarea.style.position =
"fixed";

textarea.style.opacity =
"0";

document.body.appendChild(
textarea
);

textarea.focus();

textarea.select();

try {

document.execCommand(
"copy"
);

} catch (error) {

console.log(
"CORE COPY ERROR:",
error
);

}

textarea.remove();

}


/* =========================================
CORE REPORT ID
========================================= */

function createCoreReportId(
brandName
) {

const brandCode =
String(
brandName ||
"BRAND"
)
.toUpperCase()
.normalize(
"NFD"
)
.replace(
/[\u0300-\u036f]/g,
""
)
.replace(
/[^A-Z0-9]/g,
""
)
.slice(
0,
6
);

const randomCode =
Math.random()
.toString(36)
.substring(
2,
6
)
.toUpperCase();

return (
`CORE-${brandCode || "BRAND"}-${randomCode}`
);

}


/* =========================================
BUTTON FEEDBACK
========================================= */

function showCoreActionFeedback(
button,
text
) {

if (!button) return;

const firstSpan =
button.querySelector(
"span:first-child"
);

if (!firstSpan) {

return;

}

const originalText =
firstSpan.textContent;

firstSpan.textContent =
text;

setTimeout(() => {

firstSpan.textContent =
originalText;

}, 2200);

}


/* =========================================
CHECK SHARED REPORT URL
========================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

loadSharedCoreReport();

}
);
/* =========================================
ZINN CORE — SMART WHATSAPP CTA
========================================= */

function updateZinnStudioWhatsApp() {

  const zinnStudioButton =
    document.querySelector(
      ".solution-primary"
    );

  if (!zinnStudioButton) return;

  const brandName =
    currentBrandData.brandName ||
    "minha marca";

  const message =
    `Olá! Fiz a análise da ${brandName} pelo ZINN CORE e gostaria de conversar sobre os pontos identificados no meu diagnóstico.`;

  const whatsappUrl =
    `https://wa.me/5531995931311?text=${encodeURIComponent(message)}`;

  zinnStudioButton.href =
    whatsappUrl;

  zinnStudioButton.target =
    "_blank";

  zinnStudioButton.rel =
    "noopener noreferrer";
}