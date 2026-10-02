/**
 * GARAGEM DOS REPASSES - ESTOQUE INICIAL DE VEÍCULOS (REPASSES SELECIONADOS)
 * Cerquilho - SP | WhatsApp: (15) 99668-8987
 */

const VEHICLES_DATA = [
  {
    id: "repasse-clio-2012",
    title: "Renault Clio 1.0",
    category: "hatch",
    statusBadge: "Disponível",
    statusType: "hot", // hot, gold, savings
    year: "2012/2012",
    km: "158.000 km",
    transmission: "Manual",
    fuel: "Não informado",
    color: "Preto",
    fipePrice: null,
    repassePrice: 15900,
    savings: null,
    image: "assets/carros-optimized/clio/88d0664a-0736-4eae-97fd-acd570bf9aca.jpg",
    gallery: [
      "assets/carros-optimized/clio/88d0664a-0736-4eae-97fd-acd570bf9aca.jpg",
      "assets/carros-optimized/clio/c463c1d9-3257-4f3a-9315-715d3efaee99.jpg"
    ],
    description: "Clio 1.0 preto, com direção hidráulica, vidro elétrico e documentação em ordem. Recibo em branco.",
    features: [
      "Direção hidráulica",
      "Vidro elétrico",
      "Documento OK",
      "Recibo em branco",
      "Aceita troca mediante avaliação",
      "Financiamento sujeito à aprovação"
    ]
  },
  {
    id: "repasse-focus-2005",
    title: "Ford Focus 1.6",
    category: "hatch",
    statusBadge: "Disponível",
    statusType: "gold",
    year: "2005/2005",
    km: "134.000 km",
    transmission: "Manual",
    fuel: "Não informado",
    color: "Prata",
    fipePrice: null,
    repassePrice: 15900,
    savings: null,
    image: "assets/carros-optimized/focus/817be9c6-8c5f-46a2-b05b-c68d9c34cb6a.jpg",
    gallery: [
      "assets/carros-optimized/focus/817be9c6-8c5f-46a2-b05b-c68d9c34cb6a.jpg",
      "assets/carros-optimized/focus/95fcc3e0-7815-4b3f-b143-f491fc7d18b6.jpg",
      "assets/carros-optimized/focus/40faefe1-37ae-4d2c-954a-9843c1757514.jpg"
    ],
    description: "Ford Focus 1.6 prata com direção, travas e vidros elétricos, ar-condicionado e documentação em ordem.",
    features: [
      "Direção hidráulica",
      "Trava elétrica",
      "Vidro elétrico",
      "Ar-condicionado",
      "Documento OK",
      "Recibo em branco"
    ]
  },
  {
    id: "repasse-renegade-2017",
    title: "Jeep Renegade 1.8 Flex",
    category: "suv",
    statusBadge: "Disponível",
    statusType: "savings",
    year: "2017/2017",
    km: "113.000 km",
    transmission: "Automático",
    fuel: "Flex",
    color: "Vermelho",
    fipePrice: null,
    repassePrice: 69900,
    savings: null,
    image: "assets/carros-optimized/jeep/e0b83f8b-ea4d-4d84-a68b-9a9d40c01707.jpg",
    gallery: [
      "assets/carros-optimized/jeep/e0b83f8b-ea4d-4d84-a68b-9a9d40c01707.jpg",
      "assets/carros-optimized/jeep/406fc6a9-76a4-4ebc-92ac-363e0c99d241.jpg",
      "assets/carros-optimized/jeep/132c0763-fdaf-41f1-9e7e-feb8db08512e.jpg"
    ],
    description: "Jeep Renegade 1.8 Flex vermelho, automático, com ar-condicionado, rodas de liga e quatro pneus novos.",
    features: [
      "Direção elétrica",
      "Trava elétrica",
      "Vidro elétrico",
      "Rodas de liga leve",
      "Ar-condicionado",
      "Start & Stop",
      "4 pneus novos",
      "Documento OK | Recibo em branco"
    ]
  }
];

// Depoimentos Reais do PROMPT.md (Avaliação 5.0 estrelas Google - 26 avaliações)
const REVIEWS_DATA = [
  {
    id: 1,
    author: "Rafael Silveira",
    role: "Cliente Vendedor",
    text: "Ótimo vendedor, vendeu meu carro rápido e com eficiência, super recomendo.",
    rating: 5,
    date: "Avaliação Google Verificada"
  },
  {
    id: 2,
    author: "Carlos Mendes",
    role: "Cliente de Repasse",
    text: "Deixei um carro com ele para venda, e saiu no mesmo dia!",
    rating: 5,
    date: "Avaliação Google Verificada"
  },
  {
    id: 3,
    author: "Marcos Antônio Ramos",
    role: "Comprador Frequente",
    text: "Super confiável, somos bem atendidos, recomendo muito, carros de qualidade.",
    rating: 5,
    date: "Avaliação Google Verificada"
  }
];
