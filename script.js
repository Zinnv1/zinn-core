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


  /* BRAND */

  const reportBrandName =
    document.querySelector(
      "#reportBrandName"
    );

  if (reportBrandName) {

    reportBrandName.textContent =
      data.brand_name || "—";

  }


  /* CORE SCORE */

  const reportScore =
    document.querySelector(
      ".report-brand-bar .brand-core strong"
    );

  if (reportScore) {

    reportScore.textContent =
      `${data.score ?? 0} / 100`;

  }


  /* CLASSIFICATION */

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
     STRENGTHS
  ========================================= */

  const strengthCards =
    document.querySelectorAll(
      ".report-positive .report-card"
    );

  if (
    Array.isArray(data.strengths) &&
    data.strengths.length
  ) {

    strengthCards.forEach(
      (card, index) => {

        const strength =
          data.strengths[index];

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
            `${strength.score ?? 0} / 100`;

        }


        if (description) {

          description.textContent =
            strength.description ||
            strength.text ||
            "";

        }

      }
    );

  }


  /* =========================================
     ATTENTION POINTS
  ========================================= */

  const attentionItems =
    document.querySelectorAll(
      ".report-critical .finding"
    );

  if (
    Array.isArray(
      data.attention_points
    ) &&
    data.attention_points.length
  ) {

    attentionItems.forEach(
      (item, index) => {

        const attention =
          data.attention_points[index];


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

        const score =
          item.querySelector(
            ":scope > strong"
          );

        const description =
          item.querySelector(
            "p"
          );


        if (title) {

          title.textContent =
            attention.title ||
            "—";

        }


        if (score) {

          score.textContent =
            attention.score ?? 0;

        }


        if (description) {

          description.textContent =
            attention.description ||
            attention.text ||
            "";

        }

      }
    );

  }


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
        data.opportunity.title.trim();


      const words =
        opportunityText.split(" ");


      const firstWord =
        words.shift();


      opportunityTitle.innerHTML =
        `${firstWord} <span>${words.join(" ")}</span>`;

    }


    if (
      opportunityDescription &&
      data.opportunity.description
    ) {

      opportunityDescription.textContent =
        data.opportunity.description;

    }

  }


  /* =========================================
     ACTION PLAN
  ========================================= */

  const actionItems =
    document.querySelectorAll(
      ".report-action .action-item"
    );


  if (
    Array.isArray(
      data.action_plan
    ) &&
    data.action_plan.length
  ) {

    actionItems.forEach(
      (item, index) => {

        const action =
          data.action_plan[index];


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

  }


  /* =========================================
     REPORT ID
  ========================================= */

  const reportIdDisplay =
    document.querySelector(
      ".report-footer span:last-child"
    );


  if (reportIdDisplay) {

    reportIdDisplay.textContent =
      `REPORT ID / ${data.report_id}`;

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

}



    stageFour.animate(

      [

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

  /*
    Se a pessoa abriu um report
    compartilhado, removemos esse modo.
  */

  const scanSection =
    document.querySelector(
      ".core-scan-section"
    );


  if (scanSection) {

    scanSection.classList.remove(
      "shared-report-mode"
    );

  }


  /*
    Remove ?report=CORE-...
    da URL sem recarregar a página.
  */

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


  /*
    Remove os display:none
    aplicados pelo report compartilhado.
  */

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
          74,

        classification:
          "POTENCIAL ALTO",


        metrics: {

          digitalPresence:
            82,

          positioning:
            74,

          authority:
            71,

          conversion:
            54,

          digitalExperience:
            79

        },


        strengths: [

          {

            title:
              "PRESENÇA DIGITAL",

            score:
              82,

            description:
              "A marca apresenta sinais consistentes de presença digital e possui uma boa base para expansão."

          },

          {

            title:
              "EXPERIÊNCIA",

            score:
              79,

            description:
              "Os canais atuais conseguem transmitir informações importantes de maneira relativamente clara."

          },

          {

            title:
              "POSICIONAMENTO",

            score:
              74,

            description:
              "Existe uma identidade reconhecível que pode ser fortalecida para aumentar diferenciação e autoridade."

          }

        ],


        attention_points: [

          {

            title:
              "JORNADA DE CONVERSÃO",

            score:
              54,

            description:
              "A presença digital ainda pode ser melhor estruturada para conduzir visitantes até uma ação clara, como contato, orçamento, reserva ou compra."

          },

          {

            title:
              "AUTORIDADE DIGITAL",

            score:
              71,

            description:
              "Existem oportunidades para fortalecer credibilidade, percepção profissional e confiança na marca."

          }

        ],


        opportunity: {

          title:
            "TRANSFORMAR ATENÇÃO EM AÇÃO.",

          description:
            "O principal potencial está em criar uma jornada digital mais estruturada, conectando posicionamento, apresentação da marca e canais de conversão em uma experiência única."

        },


        action_plan: [

          "ESTRUTURAR A JORNADA DIGITAL",

          "CENTRALIZAR A PRESENÇA DA MARCA",

          "FORTALECER AUTORIDADE",

          "OTIMIZAR CONVERSÃO"

        ],


        roadmap: [

          "SEMANA 01 — CORRIGIR PONTOS CRÍTICOS",

          "SEMANA 02 — ESTRUTURAR PRESENÇA DIGITAL",

          "SEMANA 03 — FORTALECER AUTORIDADE",

          "SEMANA 04 — OTIMIZAR CONVERSÃO"

        ]

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
          `${window.location.origin}/?report=${encodeURIComponent(reportId)}`;


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
   CORE REPORT — PDF BUTTON
========================================= */

const downloadCorePdfButton =
  document.querySelector(
    "#downloadCorePdf"
  );


if (downloadCorePdfButton) {

  downloadCorePdfButton.addEventListener(
    "click",
    () => {

      generateCorePdf();

    }
  );

}


/* =========================================
   GENERATE CORE PDF
========================================= */

function generateCorePdf() {

  if (
    !window.jspdf ||
    !window.jspdf.jsPDF
  ) {

    console.error(
      "jsPDF não foi carregado."
    );


    showCoreActionFeedback(
      downloadCorePdfButton,
      "ERRO AO GERAR PDF"
    );


    return;

  }


  const {
    jsPDF
  } = window.jspdf;


  const pdf =
    new jsPDF({

      orientation:
        "portrait",

      unit:
        "mm",

      format:
        "a4"

    });


  /* =========================================
     REPORT DATA
  ========================================= */

  const brandName =
    currentBrandData.brandName ||
    "Marca analisada";


  const instagram =
    currentBrandData.instagram ||
    "Não informado";


  const website =
    currentBrandData.website ||
    "Não informado";


  const segment =
    currentBrandData.segment ||
    "Não informado";


  const city =
    currentBrandData.city ||
    "Não informado";


  const reportId =
    currentBrandData.reportId ||
    createCoreReportId(
      brandName
    );


  /*
    DEMO DATA

    Depois estes valores serão
    substituídos pela resposta da IA.
  */

  const coreScore =
    74;


  const classification =
    "POTENCIAL ALTO";


  const metrics = [

    {

      label:
        "PRESENÇA DIGITAL",

      value:
        82,

      type:
        "green"

    },

    {

      label:
        "POSICIONAMENTO",

      value:
        74,

      type:
        "blue"

    },

    {

      label:
        "AUTORIDADE",

      value:
        71,

      type:
        "purple"

    },

    {

      label:
        "CONVERSÃO",

      value:
        54,

      type:
        "red"

    },

    {

      label:
        "EXPERIÊNCIA DIGITAL",

      value:
        79,

      type:
        "green"

    }

  ];


  /* =========================================
     COLORS
  ========================================= */

  const colors = {

    black:
      [7, 9, 13],

    panel:
      [12, 16, 23],

    panelLight:
      [16, 21, 29],

    white:
      [245, 247, 251],

    gray:
      [158, 166, 180],

    muted:
      [91, 101, 116],

    blue:
      [47, 140, 255],

    green:
      [52, 226, 122],

    red:
      [255, 77, 103],

    purple:
      [155, 92, 255]

  };


  const pageWidth =
    pdf
      .internal
      .pageSize
      .getWidth();


  const pageHeight =
    pdf
      .internal
      .pageSize
      .getHeight();


  const margin =
    18;


  /* =========================================
     PDF HELPERS
  ========================================= */

  function getColor(
    name
  ) {

    return (
      colors[name] ||
      colors.blue
    );

  }


  function setBackground() {

    pdf.setFillColor(
      ...colors.black
    );


    pdf.rect(
      0,
      0,
      pageWidth,
      pageHeight,
      "F"
    );


    /*
      linha superior CORE
    */

    pdf.setDrawColor(
      ...colors.purple
    );


    pdf.setLineWidth(
      .35
    );


    pdf.line(
      0,
      4,
      pageWidth,
      4
    );

  }


  function addPage() {

    pdf.addPage();

    setBackground();

  }


  function addFooter(
    pageNumber
  ) {

    pdf.setDrawColor(
      35,
      42,
      52
    );


    pdf.setLineWidth(
      .2
    );


    pdf.line(
      margin,
      pageHeight - 15,
      pageWidth - margin,
      pageHeight - 15
    );


    pdf.setFont(
      "helvetica",
      "normal"
    );


    pdf.setFontSize(
      6.5
    );


    pdf.setTextColor(
      ...colors.muted
    );


    pdf.text(
      "ZINN CORE / DIGITAL INTELLIGENCE REPORT",
      margin,
      pageHeight - 9
    );


    pdf.text(
      `${reportId} / PAGE ${pageNumber}`,
      pageWidth - margin,
      pageHeight - 9,
      {

        align:
          "right"

      }
    );

  }


  function addSectionLabel(
    text,
    colorName =
      "blue"
  ) {

    pdf.setFont(
      "helvetica",
      "bold"
    );


    pdf.setFontSize(
      7
    );


    pdf.setTextColor(
      ...getColor(
        colorName
      )
    );


    pdf.text(
      text,
      margin,
      24
    );

  }


  function sectionTitle(
    lineOne,
    lineTwo,
    colorName =
      "blue"
  ) {

    pdf.setFont(
      "helvetica",
      "bold"
    );


    pdf.setFontSize(
      25
    );


    pdf.setTextColor(
      ...colors.white
    );


    pdf.text(
      lineOne,
      margin,
      43
    );


    pdf.setTextColor(
      ...getColor(
        colorName
      )
    );


    pdf.text(
      lineTwo,
      margin,
      55
    );

  }


  function paragraph(
    text,
    x,
    y,
    width,
    color =
      colors.gray,
    size =
      9
  ) {

    pdf.setFont(
      "helvetica",
      "normal"
    );


    pdf.setFontSize(
      size
    );


    pdf.setTextColor(
      ...color
    );


    const lines =
      pdf.splitTextToSize(
        text,
        width
      );


    pdf.text(
      lines,
      x,
      y,
      {

        lineHeightFactor:
          1.55

      }
    );


    return (
      y +
      lines.length *
      size *
      0.55
    );

  }


  function panelRect(
    x,
    y,
    width,
    height
  ) {

    pdf.setFillColor(
      ...colors.panel
    );


    pdf.setDrawColor(
      30,
      38,
      48
    );


    pdf.roundedRect(
      x,
      y,
      width,
      height,
      3,
      3,
      "FD"
    );

  }


  /* =========================================
     PAGE 01 — COVER
  ========================================= */

  setBackground();


  pdf.setDrawColor(
    ...colors.blue
  );


  pdf.setLineWidth(
    .5
  );


  pdf.line(
    margin,
    20,
    73,
    20
  );


  pdf.setFont(
    "helvetica",
    "bold"
  );


  pdf.setFontSize(
    7
  );


  pdf.setTextColor(
    ...colors.blue
  );


  pdf.text(
    "ZINN CORE / AI BRAND INTELLIGENCE",
    margin,
    29
  );


  pdf.setFontSize(
    34
  );


  pdf.setTextColor(
    ...colors.white
  );


  pdf.text(
    "DIGITAL",
    margin,
    61
  );


  pdf.setTextColor(
    ...colors.purple
  );


  pdf.text(
    "INTELLIGENCE",
    margin,
    76
  );


  pdf.setTextColor(
    ...colors.white
  );


  pdf.text(
    "REPORT.",
    margin,
    91
  );


  pdf.setFontSize(
    7
  );


  pdf.setTextColor(
    ...colors.muted
  );


  pdf.text(
    "DIAGNÓSTICO DIGITAL DESENVOLVIDO PARA",
    margin,
    113
  );


  pdf.setFontSize(
    19
  );


  pdf.setTextColor(
    ...colors.white
  );


  const brandLines =
    pdf.splitTextToSize(
      brandName.toUpperCase(),
      150
    );


  pdf.text(
    brandLines,
    margin,
    127
  );


  panelRect(
    margin,
    169,
    pageWidth -
    margin * 2,
    57
  );


  pdf.setFontSize(
    6.5
  );


  pdf.setTextColor(
    ...colors.muted
  );


  pdf.text(
    "CORE SCORE",
    margin + 9,
    182
  );


  pdf.setFontSize(
    28
  );


  pdf.setTextColor(
    ...colors.blue
  );


  pdf.text(
    String(coreScore),
    margin + 9,
    204
  );


  pdf.setFontSize(
    9
  );


  pdf.setTextColor(
    ...colors.gray
  );


  pdf.text(
    "/100",
    margin + 30,
    204
  );


  pdf.setFontSize(
    6.5
  );


  pdf.setTextColor(
    ...colors.muted
  );


  pdf.text(
    "CLASSIFICATION",
    87,
    182
  );


  pdf.setFontSize(
    11
  );


  pdf.setTextColor(
    ...colors.green
  );


  pdf.text(
    classification,
    87,
    200
  );


  pdf.setFontSize(
    6.5
  );


  pdf.setTextColor(
    ...colors.muted
  );


  pdf.text(
    "REPORT ID",
    144,
    182
  );


  pdf.setFontSize(
    8
  );


  pdf.setTextColor(
    ...colors.white
  );


  pdf.text(
    reportId,
    144,
    200
  );


  pdf.setFontSize(
    7
  );


  pdf.setTextColor(
    ...colors.muted
  );


  pdf.text(
    "POWERED BY ZINN CORE / ZINN STUDIO",
    margin,
    256
  );


  addFooter(
    1
  );


  /* =========================================
     PAGE 02 — OVERVIEW
  ========================================= */

  addPage();


  addSectionLabel(
    "CORE REPORT / 01",
    "blue"
  );


  sectionTitle(
    "VISÃO GERAL",
    "DA MARCA.",
    "blue"
  );


  let y =
    78;


  y =
    paragraph(

      "A marca demonstra uma presença digital relevante e apresenta uma base sólida para crescimento. A análise identificou boas condições de posicionamento e experiência, porém existem oportunidades importantes na jornada de conversão e na transformação da presença digital em novos contatos e clientes.",

      margin,

      y,

      165,

      colors.gray,

      9

    );


  y +=
    14;


  panelRect(
    margin,
    y,
    pageWidth -
    margin * 2,
    71
  );


  const brandInfo = [

    [
      "MARCA",
      brandName
    ],

    [
      "INSTAGRAM",
      instagram
    ],

    [
      "SITE",
      website
    ],

    [
      "SEGMENTO",
      segment
    ],

    [
      "CIDADE",
      city
    ]

  ];


  let infoY =
    y + 12;


  brandInfo.forEach(
    ([label, value]) => {

      pdf.setFontSize(
        6.5
      );


      pdf.setTextColor(
        ...colors.muted
      );


      pdf.text(
        label,
        margin + 8,
        infoY
      );


      pdf.setFontSize(
        8
      );


      pdf.setTextColor(
        ...colors.white
      );


      let safeValue =
        String(
          value
        );


      if (
        safeValue.length >
        62
      ) {

        safeValue =
          `${safeValue.slice(0, 59)}...`;

      }


      pdf.text(
        safeValue,
        margin + 48,
        infoY
      );


      infoY +=
        12;

    }
  );


  addFooter(
    2
  );


  /* =========================================
     PAGE 03 — CORE METRICS
  ========================================= */

  addPage();


  addSectionLabel(
    "CORE REPORT / 02",
    "green"
  );


  sectionTitle(
    "CORE",
    "METRICS.",
    "green"
  );


  y =
    79;


  metrics.forEach(
    (metric) => {

      const metricColor =
        getColor(
          metric.type
        );


      pdf.setFont(
        "helvetica",
        "bold"
      );


      pdf.setFontSize(
        8
      );


      pdf.setTextColor(
        ...colors.white
      );


      pdf.text(
        metric.label,
        margin,
        y
      );


      pdf.setTextColor(
        ...metricColor
      );


      pdf.text(
        `${metric.value}/100`,
        pageWidth - margin,
        y,
        {

          align:
            "right"

        }
      );


      pdf.setFillColor(
        27,
        32,
        41
      );


      pdf.roundedRect(
        margin,
        y + 7,
        174,
        3,
        1,
        1,
        "F"
      );


      pdf.setFillColor(
        ...metricColor
      );


      pdf.roundedRect(
        margin,
        y + 7,
        174 *
        (
          metric.value /
          100
        ),
        3,
        1,
        1,
        "F"
      );


      y +=
        31;

    }
  );


  panelRect(
    margin,
    231,
    174,
    30
  );


  pdf.setFontSize(
    6.5
  );


  pdf.setTextColor(
    ...colors.purple
  );


  pdf.text(
    "CORE INTERPRETATION",
    margin + 8,
    242
  );


  paragraph(

    "Os melhores sinais aparecem em presença e experiência digital. A principal oportunidade identificada está na conversão.",

    margin + 8,

    251,

    154,

    colors.gray,

    7.5

  );


  addFooter(
    3
  );
    /* =========================================
     PAGE 04 — STRONG POINTS
  ========================================= */

  addPage();


  addSectionLabel(
    "CORE REPORT / 03",
    "green"
  );


  sectionTitle(
    "PONTOS",
    "FORTES.",
    "green"
  );


  const strengths = [

    {

      title:
        "PRESENÇA DIGITAL",

      score:
        "82 / 100",

      text:
        "A marca apresenta sinais consistentes de presença digital e possui uma boa base para expansão."

    },

    {

      title:
        "EXPERIÊNCIA",

      score:
        "79 / 100",

      text:
        "Os canais atuais conseguem transmitir informações importantes de maneira relativamente clara."

    },

    {

      title:
        "POSICIONAMENTO",

      score:
        "74 / 100",

      text:
        "Existe uma identidade reconhecível que pode ser fortalecida para aumentar diferenciação e autoridade."

    }

  ];


  y =
    75;


  strengths.forEach(
    (item, index) => {

      pdf.setFillColor(
        10,
        20,
        16
      );


      pdf.setDrawColor(
        34,
        105,
        64
      );


      pdf.roundedRect(
        margin,
        y,
        174,
        46,
        3,
        3,
        "FD"
      );


      pdf.setFontSize(
        7
      );


      pdf.setTextColor(
        ...colors.green
      );


      pdf.text(
        `0${index + 1}`,
        margin + 8,
        y + 11
      );


      pdf.setFontSize(
        9
      );


      pdf.setTextColor(
        ...colors.white
      );


      pdf.text(
        item.title,
        margin + 22,
        y + 12
      );


      pdf.setTextColor(
        ...colors.green
      );


      pdf.text(
        item.score,
        pageWidth -
        margin -
        8,
        y + 12,
        {

          align:
            "right"

        }
      );


      paragraph(

        item.text,

        margin + 22,

        y + 25,

        140,

        colors.gray,

        7.5

      );


      y +=
        55;

    }
  );


  addFooter(
    4
  );


  /* =========================================
     PAGE 05 — ATTENTION POINTS
  ========================================= */

  addPage();


  addSectionLabel(
    "CORE REPORT / 04",
    "red"
  );


  sectionTitle(
    "PONTOS DE",
    "ATENÇÃO.",
    "red"
  );


  const criticalPoints = [

    {

      priority:
        "PRIORIDADE 01",

      title:
        "JORNADA DE CONVERSÃO",

      score:
        "54",

      text:
        "A presença digital ainda pode ser melhor estruturada para conduzir visitantes até uma ação clara, como contato, orçamento, reserva ou compra."

    },

    {

      priority:
        "PRIORIDADE 02",

      title:
        "AUTORIDADE DIGITAL",

      score:
        "71",

      text:
        "Existem oportunidades para fortalecer credibilidade, percepção profissional e confiança na marca."

    }

  ];


  y =
    79;


  criticalPoints.forEach(
    (item) => {

      pdf.setFillColor(
        22,
        12,
        16
      );


      pdf.setDrawColor(
        125,
        38,
        56
      );


      pdf.roundedRect(
        margin,
        y,
        174,
        62,
        3,
        3,
        "FD"
      );


      pdf.setFontSize(
        6.5
      );


      pdf.setTextColor(
        ...colors.red
      );


      pdf.text(
        item.priority,
        margin + 8,
        y + 11
      );


      pdf.setFontSize(
        10
      );


      pdf.setTextColor(
        ...colors.white
      );


      pdf.text(
        item.title,
        margin + 8,
        y + 26
      );


      pdf.setFontSize(
        19
      );


      pdf.setTextColor(
        ...colors.red
      );


      pdf.text(
        item.score,
        pageWidth -
        margin -
        8,
        y + 27,
        {

          align:
            "right"

        }
      );


      paragraph(

        item.text,

        margin + 8,

        y + 40,

        145,

        colors.gray,

        7.5

      );


      y +=
        75;

    }
  );


  addFooter(
    5
  );


  /* =========================================
     PAGE 06 — MAIN OPPORTUNITY
  ========================================= */

  addPage();


  addSectionLabel(
    "CORE REPORT / 05",
    "purple"
  );


  sectionTitle(
    "MAIOR",
    "OPORTUNIDADE.",
    "purple"
  );


  pdf.setFont(
    "helvetica",
    "bold"
  );


  pdf.setFontSize(
    24
  );


  pdf.setTextColor(
    ...colors.white
  );


  pdf.text(
    "TRANSFORMAR",
    margin,
    99
  );


  pdf.setTextColor(
    ...colors.purple
  );


  pdf.text(
    "ATENÇÃO EM AÇÃO.",
    margin,
    112
  );


  paragraph(

    "O principal potencial está em criar uma jornada digital mais estruturada, conectando posicionamento, apresentação da marca e canais de conversão em uma experiência única.",

    margin,

    136,

    165,

    colors.gray,

    9

  );


  pdf.setFillColor(
    19,
    13,
    28
  );


  pdf.setDrawColor(
    84,
    49,
    130
  );


  pdf.roundedRect(
    margin,
    185,
    174,
    51,
    3,
    3,
    "FD"
  );


  pdf.setFontSize(
    6.5
  );


  pdf.setTextColor(
    ...colors.purple
  );


  pdf.text(
    "CORE INSIGHT",
    margin + 10,
    198
  );


  paragraph(

    "A oportunidade não está apenas em gerar mais atenção, mas em transformar a atenção já conquistada em uma ação clara do potencial cliente.",

    margin + 10,

    211,

    151,

    colors.white,

    8

  );


  addFooter(
    6
  );
    /* =========================================
     PAGE 07 — ACTION PLAN
  ========================================= */

  addPage();


  addSectionLabel(
    "CORE REPORT / 06",
    "blue"
  );


  sectionTitle(
    "PLANO DE",
    "AÇÃO.",
    "blue"
  );


  const actionPlan = [

    {

      title:
        "ESTRUTURAR A JORNADA DIGITAL",

      text:
        "Definir caminhos claros para transformar visitantes em contatos e potenciais clientes.",

      impact:
        "ALTO IMPACTO"

    },

    {

      title:
        "CENTRALIZAR A PRESENÇA DA MARCA",

      text:
        "Criar um ambiente próprio para apresentar identidade, serviços, diferenciais, localização e canais de contato.",

      impact:
        "ALTO IMPACTO"

    },

    {

      title:
        "FORTALECER AUTORIDADE",

      text:
        "Usar conteúdo, prova social, apresentação profissional e informações estratégicas para aumentar confiança.",

      impact:
        "MÉDIO / ALTO"

    },

    {

      title:
        "OTIMIZAR CONVERSÃO",

      text:
        "Simplificar contato, orçamento, pedido ou reserva conforme o objetivo principal da empresa.",

      impact:
        "ALTO IMPACTO"

    }

  ];


  y =
    75;


  actionPlan.forEach(
    (item, index) => {

      panelRect(
        margin,
        y,
        174,
        42
      );


      pdf.setFontSize(
        14
      );


      pdf.setTextColor(
        ...colors.blue
      );


      pdf.text(
        `0${index + 1}`,
        margin + 8,
        y + 14
      );


      pdf.setFontSize(
        6
      );


      pdf.setTextColor(
        ...colors.blue
      );


      pdf.text(
        item.impact,
        pageWidth -
        margin -
        8,
        y + 10,
        {

          align:
            "right"

        }
      );


      pdf.setFontSize(
        8
      );


      pdf.setTextColor(
        ...colors.white
      );


      pdf.text(
        item.title,
        margin + 27,
        y + 13
      );


      paragraph(

        item.text,

        margin + 27,

        y + 24,

        135,

        colors.gray,

        7

      );


      y +=
        48;

    }
  );


  addFooter(
    7
  );


  /* =========================================
     PAGE 08 — NEXT 30 DAYS
  ========================================= */

  addPage();


  addSectionLabel(
    "CORE REPORT / 07",
    "purple"
  );


  sectionTitle(
    "PRÓXIMOS",
    "30 DIAS.",
    "purple"
  );


  const roadmap = [

    {

      week:
        "SEMANA 01",

      title:
        "CORRIGIR PONTOS CRÍTICOS",

      text:
        "Revisar a jornada de contato e identificar onde potenciais clientes podem estar abandonando o processo."

    },

    {

      week:
        "SEMANA 02",

      title:
        "ESTRUTURAR PRESENÇA DIGITAL",

      text:
        "Organizar canais, informações e apresentação da marca para criar uma experiência mais consistente."

    },

    {

      week:
        "SEMANA 03",

      title:
        "FORTALECER AUTORIDADE",

      text:
        "Adicionar prova social, diferenciais, conteúdo estratégico e elementos que aumentem confiança."

    },

    {

      week:
        "SEMANA 04",

      title:
        "OTIMIZAR CONVERSÃO",

      text:
        "Melhorar chamadas para ação e simplificar o caminho até orçamento, contato, pedido ou reserva."

    }

  ];


  y =
    76;


  roadmap.forEach(
    (item) => {

      pdf.setDrawColor(
        ...colors.purple
      );


      pdf.setLineWidth(
        .65
      );


      pdf.line(
        margin + 4,
        y,
        margin + 4,
        y + 38
      );


      pdf.setFontSize(
        6.5
      );


      pdf.setTextColor(
        ...colors.purple
      );


      pdf.text(
        item.week,
        margin + 13,
        y + 6
      );


      pdf.setFontSize(
        9
      );


      pdf.setTextColor(
        ...colors.white
      );


      pdf.text(
        item.title,
        margin + 13,
        y + 17
      );


      paragraph(

        item.text,

        margin + 13,

        y + 27,

        153,

        colors.gray,

        7.5

      );


      y +=
        48;

    }
  );


  addFooter(
    8
  );


  /* =========================================
     PAGE 09 — ZINN STUDIO
  ========================================= */

  addPage();


  addSectionLabel(
    "ZINN CORE / RECOMMENDED SOLUTION",
    "purple"
  );


  pdf.setFont(
    "helvetica",
    "bold"
  );


  pdf.setFontSize(
    31
  );


  pdf.setTextColor(
    ...colors.white
  );


  pdf.text(
    "SUA MARCA",
    margin,
    68
  );


  pdf.text(
    "PODE",
    margin,
    82
  );


  pdf.setTextColor(
    ...colors.purple
  );


  pdf.text(
    "IR ALÉM.",
    margin,
    96
  );


  paragraph(

    "A Zinn Studio pode transformar os pontos identificados pelo CORE em uma presença digital construída especificamente para os objetivos da sua marca.",

    margin,

    124,

    155,

    colors.gray,

    9

  );


  pdf.setFillColor(
    ...colors.blue
  );


  pdf.roundedRect(
    margin,
    170,
    174,
    43,
    3,
    3,
    "F"
  );


  pdf.setFontSize(
    6.5
  );


  pdf.setTextColor(
    225,
    237,
    255
  );


  pdf.text(
    "PRÓXIMA AÇÃO RECOMENDADA",
    margin + 10,
    183
  );


  pdf.setFontSize(
    12
  );


  pdf.setTextColor(
    ...colors.white
  );


  pdf.text(
    "TRANSFORMAR O DIAGNÓSTICO",
    margin + 10,
    198
  );


  pdf.text(
    "EM EXECUÇÃO.",
    margin + 10,
    205
  );


  pdf.setFontSize(
    7
  );


  pdf.setTextColor(
    ...colors.muted
  );


  pdf.text(
    "ZINN STUDIO / DIGITAL DEVELOPMENT",
    margin,
    247
  );


  addFooter(
    9
  );


  /* =========================================
     SAVE PDF
  ========================================= */

  const safeBrandName =
    brandName
      .toLowerCase()
      .normalize(
        "NFD"
      )
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-|-$/g,
        ""
      );


  pdf.save(
    `zinn-core-${safeBrandName || "report"}.pdf`
  );


  showCoreActionFeedback(
    downloadCorePdfButton,
    "PDF GERADO ✓"
  );

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