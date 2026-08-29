import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const {
      brandName,
      instagram,
      website,
      segment,
      city
    } = req.body;

    if (!brandName) {
      return res.status(400).json({
        error: "Brand name is required"
      });
    }

    const prompt = `
Você é o motor de inteligência do ZINN CORE.

Analise a presença digital da empresa abaixo.

DADOS DA MARCA

Nome:
${brandName}

Instagram:
${instagram || "Não informado"}

Website:
${website || "Não informado"}

Segmento:
${segment || "Não informado"}

Cidade:
${city || "Não informada"}

Sua função é produzir um diagnóstico estratégico da presença digital da marca.

IMPORTANTE:

- Não invente seguidores.
- Não invente avaliações.
- Não invente tráfego.
- Não invente faturamento.
- Não invente taxas de conversão.
- Não diga que visitou Instagram ou site se essas informações não foram realmente fornecidas ao sistema.
- Baseie a avaliação apenas nos dados disponíveis.
- Quando houver poucos dados, deixe isso claro no diagnóstico.
- Os scores devem refletir a quantidade e qualidade das informações disponíveis.

Retorne APENAS JSON válido neste formato:

{
  "score": 74,
  "classification": "POTENCIAL ALTO",

  "metrics": {
    "digitalPresence": 82,
    "positioning": 74,
    "authority": 71,
    "conversion": 54,
    "digitalExperience": 79
  },

  "strengths": [
    {
      "title": "PRESENÇA DIGITAL",
      "score": 82,
      "description": "Descrição estratégica."
    },
    {
      "title": "EXPERIÊNCIA",
      "score": 79,
      "description": "Descrição estratégica."
    },
    {
      "title": "POSICIONAMENTO",
      "score": 74,
      "description": "Descrição estratégica."
    }
  ],

  "attention_points": [
    {
      "title": "JORNADA DE CONVERSÃO",
      "score": 54,
      "description": "Descrição estratégica."
    },
    {
      "title": "AUTORIDADE DIGITAL",
      "score": 71,
      "description": "Descrição estratégica."
    }
  ],

  "opportunity": {
    "title": "TRANSFORMAR ATENÇÃO EM AÇÃO.",
    "description": "Descrição da principal oportunidade."
  },

  "action_plan": [
    {
      "title": "AÇÃO 01",
      "description": "Descrição da ação."
    },
    {
      "title": "AÇÃO 02",
      "description": "Descrição da ação."
    },
    {
      "title": "AÇÃO 03",
      "description": "Descrição da ação."
    },
    {
      "title": "AÇÃO 04",
      "description": "Descrição da ação."
    }
  ],

  "roadmap": [
    {
      "week": "SEMANA 01",
      "title": "AÇÃO",
      "description": "Descrição."
    },
    {
      "week": "SEMANA 02",
      "title": "AÇÃO",
      "description": "Descrição."
    },
    {
      "week": "SEMANA 03",
      "title": "AÇÃO",
      "description": "Descrição."
    },
    {
      "week": "SEMANA 04",
      "title": "AÇÃO",
      "description": "Descrição."
    }
  ]
}
`;

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: prompt
    });

    const rawText = response.output_text;

    let analysis;

    try {
      analysis = JSON.parse(rawText);
    } catch (parseError) {
      console.error("CORE JSON PARSE ERROR:", rawText);

      return res.status(500).json({
        error: "Invalid AI response"
      });
    }

    return res.status(200).json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error("ZINN CORE API ERROR:", error);

    return res.status(500).json({
      error: "Analysis failed"
    });
  }
}