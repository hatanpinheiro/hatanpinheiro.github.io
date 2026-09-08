/**
 * GEOPARQUE MUNDIAL DA UNESCO CAMINHOS DOS CÂNIOS DO SUL (GMUCCS)
 * Dataset oficial de geossítios e limites territoriais municipais
 */

const GMUCCS_INFO = {
  nome: "Geoparque Mundial da UNESCO Caminhos dos Cânions do Sul",
  sigla: "GMUCCS",
  ano_unesco: "2022",
  revalidacao: "2022-2026",
  area_km2: 2830,
  populacao_estimada: 74000,
  estados: ["Santa Catarina", "Rio Grande do Sul"],
  municipios: ["Praia Grande (SC)", "Jacinto Machado (SC)", "Timbé do Sul (SC)", "Morro Grande (SC)", "Cambará do Sul (RS)", "Mampituba (RS)", "Torres (RS)"],
  centro: [-29.05, -49.88],
  zoom_padrao: 10
};

const GEOSSITIOS = [
  {
    "id": 13,
    "nome": "Cachoeira Cortina",
    "municipio": "Timbé do Sul",
    "uf": "SC",
    "municipio_completo": "Timbé do Sul (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -28.829033356543366,
      -49.91562278377343
    ],
    "lon": -49.91562278377343,
    "lat": -28.829033356543366,
    "formacao": "Formação Serra Geral",
    "altitude": "510 m",
    "destaque": "Queda de 52 metros de altura em véu de noiva com grande caverna sob a rocha.",
    "descricao": "Monumento natural notável onde a água cai em queda livre criando uma cortina líquida à frente de uma reentrância rochosa profunda. Evidencia o fenômeno de subsidência basal e erosão diferencial de derrames vulcânicos."
  },
  {
    "id": 3,
    "nome": "Cachoeira Magia das Águas",
    "municipio": "Praia Grande",
    "uf": "SC",
    "municipio_completo": "Praia Grande (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -29.188214552343748,
      -49.98235716281107
    ],
    "lon": -49.98235716281107,
    "lat": -29.188214552343748,
    "formacao": "Formação Serra Geral",
    "altitude": "220 m",
    "destaque": "Queda d'água esculpida em degraus estruturais de basalto com poço cristalino.",
    "descricao": "Feição de knickpoint (ponto de inflexão fluvial) resultante do controle estrutural e de fraturas nos basaltos da Formação Serra Geral. A queda forma uma piscina natural límpida cercada por rica vegetação ripária e paredes rochosas escuras."
  },
  {
    "id": 6,
    "nome": "Cachoeira da Onça",
    "municipio": "Praia Grande",
    "uf": "SC",
    "municipio_completo": "Praia Grande (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -29.159210672843205,
      -49.9898303202413
    ],
    "lon": -49.9898303202413,
    "lat": -29.159210672843205,
    "formacao": "Formação Serra Geral",
    "altitude": "280 m",
    "destaque": "Queda d'água em ambiente intocado próximo ao Cânion Malacara.",
    "descricao": "Queda d'água de grande valor cênico e geomorfológico, entalhada nas rochas vulcânicas da Formação Serra Geral. Exemplifica o processo contínuo de incisão dos rios de encosta da escarpa dos Aparados da Serra."
  },
  {
    "id": 19,
    "nome": "Cachoeira do Bizungo",
    "municipio": "Morro Grande",
    "uf": "SC",
    "municipio_completo": "Morro Grande (SC)",
    "categoria": "Geomorfológico e Estratigráfico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -28.710010250486807,
      -49.77145132348179
    ],
    "lon": -49.77145132348179,
    "lat": -28.710010250486807,
    "formacao": "Formação Botucatu e Serra Geral",
    "altitude": "490 m",
    "destaque": "Queda com mais de 100 metros de altura em fenda cênica e contato estratigráfico visível.",
    "descricao": "Deslumbrante cascata que despenca em salto livre de mais de 115 metros dentro de um cannyon estreito e verdejante. O sítio expõe com grande nitidez a transição de contato entre os arenitos Botucatu e as lavas vulcânicas basais da Formação Serra Geral."
  },
  {
    "id": 23,
    "nome": "Cachoeira do Tatu",
    "municipio": "Morro Grande",
    "uf": "SC",
    "municipio_completo": "Morro Grande (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -28.68889395987074,
      -49.74714383233592
    ],
    "lon": -49.74714383233592,
    "lat": -28.68889395987074,
    "formacao": "Formação Serra Geral",
    "altitude": "460 m",
    "destaque": "Queda límpida encaixada em vale fechado de densa vegetação subtropical.",
    "descricao": "Feição de queda d'água e fraturamento tectônico em derrames basálticos maciços, cercada por floresta de encosta e matas de araucária nas cotas superiores, exibindo a hidrodinâmica típica dos vales de cabeceira da bacia do Rio Araranguá."
  },
  {
    "id": 10,
    "nome": "Cachoeira do Zelindo",
    "municipio": "Jacinto Machado",
    "uf": "SC",
    "municipio_completo": "Jacinto Machado (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -29.015275291215954,
      -49.91758488361886
    ],
    "lon": -49.91758488361886,
    "lat": -29.015275291215954,
    "formacao": "Formação Serra Geral",
    "altitude": "290 m",
    "destaque": "Impressionante queda límpida em anfiteatro basáltico exuberante.",
    "descricao": "Queda d'água esculpida no leito de afluente do Rio da Pedra, com grande valor geoturístico e geomorfológico. O contato da água com a rocha resfriada gerou poços e marmitas esculpidas por abrasão de seixos."
  },
  {
    "id": 26,
    "nome": "Cachoeira dos Borges",
    "municipio": "Mampituba",
    "uf": "RS",
    "municipio_completo": "Mampituba (RS)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -29.293715353496477,
      -49.98838747359864
    ],
    "lon": -49.98838747359864,
    "lat": -29.293715353496477,
    "formacao": "Formação Botucatu e Serra Geral",
    "altitude": "310 m",
    "destaque": "Cascata de 70m de queda livre em majestoso anfiteatro de arenito e basalto.",
    "descricao": "Localizada no município de Mampituba (RS), a cachoeira se precipita em meio a uma garganta rochosa exuberante. Exibe de forma emblemática o contato basal onde as lavas do derrame vulcânico da Serra Geral cobriram e fossilizaram as dunas de areia do deserto Botucatu."
  },
  {
    "id": 18,
    "nome": "Cachoeiras do Rio do Salto",
    "municipio": "Timbé do Sul",
    "uf": "SC",
    "municipio_completo": "Timbé do Sul (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -28.82927163018063,
      -49.75699640831359
    ],
    "lon": -49.75699640831359,
    "lat": -28.82927163018063,
    "formacao": "Formação Serra Geral",
    "altitude": "310 m",
    "destaque": "Sequência de corredeiras, saltos e piscinas naturais esculpidas em leito rochoso.",
    "descricao": "Complexo hidrológico e geomorfológico onde o Rio do Salto vence desníveis em rochas vulcânicas, formando marmitas de gigante e leitos esculpidos por turbulência hidráulica contínua ao longo de milênios."
  },
  {
    "id": 4,
    "nome": "Cachoeiras do Ventura",
    "municipio": "Praia Grande",
    "uf": "SC",
    "municipio_completo": "Praia Grande (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -29.21523874466488,
      -50.02277730532941
    ],
    "lon": -50.02277730532941,
    "lat": -29.21523874466488,
    "formacao": "Formação Serra Geral",
    "altitude": "260 m",
    "destaque": "Complexo de cascatas e piscinas em anfiteatro rochoso natural.",
    "descricao": "Conjunto de quedas d'água escalonadas controladas por juntas de resfriamento e falhas tectônicas associadas à abertura do Atlântico Sul. O sítio evidencia a intensa dinâmica fluvial e erosão regressiva dos afluentes do Rio Mampituba."
  },
  {
    "id": 15,
    "nome": "Cascata do Padre",
    "municipio": "Timbé do Sul",
    "uf": "SC",
    "municipio_completo": "Timbé do Sul (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -28.85603577159943,
      -49.907633380456225
    ],
    "lon": -49.907633380456225,
    "lat": -28.85603577159943,
    "formacao": "Formação Serra Geral",
    "altitude": "380 m",
    "destaque": "Queda d'água volumosa em patamar rochoso de basalto vesicular.",
    "descricao": "Queda de água em dois níveis esculpida em derrames com textura vesicular e amigdaloidal, demonstrando a presença de gases aprisionados durante o resfriamento rápido das lavas cretáceas do Gondwana."
  },
  {
    "id": 7,
    "nome": "Cânion Fortaleza",
    "municipio": "Jacinto Machado",
    "uf": "SC",
    "municipio_completo": "Jacinto Machado (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Internacional",
    "coords": [
      -29.049320162338642,
      -49.94969587731267
    ],
    "lon": -49.94969587731267,
    "lat": -29.049320162338642,
    "formacao": "Formação Serra Geral (Riodacitos e Basaltos)",
    "altitude": "1.157 m (Mirante) / 200 m (base)",
    "destaque": "Extensão colossal de mais de 7,5 km de fenda e paredões monumentais lembrando muralhas.",
    "descricao": "Um dos maiores e mais imponentes cânions da América do Sul, localizado no Parque Nacional da Serra Geral. Seus paredões atingem 900 m de desnível vertical com formato que lembra muralhas medievais (daí o nome Fortaleza), revelando o contato entre lavas ácidas de topo (riodacitos) e basaltos basais."
  },
  {
    "id": 12,
    "nome": "Cânion Fortaleza 2",
    "municipio": "Cambará do Sul",
    "uf": "RS",
    "municipio_completo": "Cambará do Sul (RS)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Internacional",
    "coords": [
      -29.068205742525247,
      -49.99184697367065
    ],
    "lon": -49.99184697367065,
    "lat": -29.068205742525247,
    "formacao": "Formação Serra Geral (Platô dos Aparados)",
    "altitude": "1.160 m",
    "destaque": "Vértice superior do Cânion Fortaleza com a Pedra do Segredo e Mirante do Tigre Preto.",
    "descricao": "Vértice superior do Cânion Fortaleza no território de Cambará do Sul. Contempla a espetacular Cachoeira do Tigre Preto, que despenca em quatro saltos sucessivos no abismo, e a curiosa feição da Pedra do Segredo (monólito equilibrado de basalto de 30 toneladas)."
  },
  {
    "id": 24,
    "nome": "Cânion Itaimbezinho",
    "municipio": "Cambará do Sul",
    "uf": "RS",
    "municipio_completo": "Cambará do Sul (RS)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Internacional",
    "coords": [
      -29.161407596774094,
      -50.08597678881666
    ],
    "lon": -50.08597678881666,
    "lat": -29.161407596774094,
    "formacao": "Formação Serra Geral (Derrames Basálticos Cretáceos)",
    "altitude": "940 m (Borda superior) / 220 m (Fundo do vale)",
    "destaque": "Ícone mundial dos Cânions do Sul com paredes verticais de até 720m ao longo de 5,8 km de fenda.",
    "descricao": "O mais célebre cânion do Brasil e epicentro do Parque Nacional de Aparados da Serra. Fenda monumental de quase 6 km de comprimento com paredes perfeitamente esculpidas em dezenas de derrames vulcânicos superpostos. Suas bordas abrigam a Cascata das Andorinhas e a Cascata Véu de Noiva, caindo vertiginosamente no abismo."
  },
  {
    "id": 5,
    "nome": "Cânion Malacara",
    "municipio": "Praia Grande",
    "uf": "SC",
    "municipio_completo": "Praia Grande (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Internacional",
    "coords": [
      -29.148262262385046,
      -49.9920861403025
    ],
    "lon": -49.9920861403025,
    "lat": -29.148262262385046,
    "formacao": "Formação Serra Geral (Vulcânica Básica)",
    "altitude": "210 m (base) a 980 m (borda)",
    "destaque": "Cânion selvagem e preservado com paredões verticais abruptos de quase 1.000m.",
    "descricao": "Um dos desfiladeiros mais intocados do Parque Nacional da Serra Geral. Seus paredões íngremes revelam dezenas de derrames vulcânicos sobrepostos da Formação Serra Geral, disjunções colunares e uma rica biodiversidade associada a microclimas de garganta."
  },
  {
    "id": 8,
    "nome": "Cânion da Pedra",
    "municipio": "Jacinto Machado",
    "uf": "SC",
    "municipio_completo": "Jacinto Machado (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -29.012865936130403,
      -49.94946934218775
    ],
    "lon": -49.94946934218775,
    "lat": -29.012865936130403,
    "formacao": "Formação Serra Geral",
    "altitude": "320 m",
    "destaque": "Desfiladeiro imponente no setor norte dos cânions em Jacinto Machado.",
    "descricao": "Cânion de relevo dramático caracterizado por fendas estreitas e gigantescos blocos coluvionares no fundo do vale. Demonstra os estágios de desmoronamento gravitacional que continuam alargando os cânions do geoparque."
  },
  {
    "id": 29,
    "nome": "Dunas de Itapeva",
    "municipio": "Torres",
    "uf": "RS",
    "municipio_completo": "Torres (RS)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Nacional",
    "coords": [
      -29.36317657352957,
      -49.75250932038109
    ],
    "lon": -49.75250932038109,
    "lat": -29.36317657352957,
    "formacao": "Depósitos Sedimentares Quaternários (Holoceno)",
    "altitude": "0 a 35 m",
    "destaque": "Campos de paleodunas e dunas móveis ativas preservadas no Parque Estadual de Itapeva.",
    "descricao": "Complexo de dunas parabólicas, barcanóides e cordões arenosos litorâneos que testemunham as variações do nível do mar e os ciclos climáticos dos últimos milhares de anos no litoral sul do Brasil, abrigando ecossistemas raros de restinga e lagoas interdunas."
  },
  {
    "id": 14,
    "nome": "Fenda da Raia",
    "municipio": "Timbé do Sul",
    "uf": "SC",
    "municipio_completo": "Timbé do Sul (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -28.82501064496295,
      -49.79146252851279
    ],
    "lon": -49.79146252851279,
    "lat": -28.82501064496295,
    "formacao": "Formação Serra Geral",
    "altitude": "480 m",
    "destaque": "Cânion extremamente estreito e profundo com feições de falhamento e diaclases tectônicas.",
    "descricao": "Garganta e fenda estreita entalhada em fratura tectônica orientada. A passagem estreita e úmida ilustra com grande perfeição como o fraturamento regional direciona o escoamento hidrológico e acelera a incisão fluvial nos basaltos."
  },
  {
    "id": 21,
    "nome": "Furnas Xokleng",
    "municipio": "Morro Grande",
    "uf": "SC",
    "municipio_completo": "Morro Grande (SC)",
    "categoria": "Paleontológico e Geomorfológico",
    "categoria_primaria": "Paleontológico",
    "grau": "Internacional",
    "coords": [
      -28.688770404636852,
      -49.78808589914087
    ],
    "lon": -49.78808589914087,
    "lat": -28.688770404636852,
    "formacao": "Formação Botucatu e Depósitos Coluviais",
    "altitude": "530 m",
    "destaque": "Complexo de paleotocas de relevância internacional com ocupação arqueológica e valor cosmológico indígena.",
    "descricao": "Geossítio de destaque internacional e profundo valor biocultural. Antigas paleotocas de megafauna que serviram de abrigo tradicional para os povos indígenas ancestrais Xokleng (Laklãnõ). Une geologia, paleontologia, arqueologia e memória cultural de povos originários."
  },
  {
    "id": 30,
    "nome": "Ilha dos Lobos",
    "municipio": "Torres",
    "uf": "RS",
    "municipio_completo": "Torres (RS)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Nacional",
    "coords": [
      -29.346951314227155,
      -49.704391535587405
    ],
    "lon": -49.704391535587405,
    "lat": -29.346951314227155,
    "formacao": "Formação Serra Geral (Submarina/Insular)",
    "altitude": "0 a 4 m",
    "destaque": "Única ilha oceânica do litoral do Rio Grande do Sul e refúgio de lobos e leões-marinhos.",
    "descricao": "Afloramento basáltico emerso a 1,8 km da costa de Torres, constituído por lajes de rocha vulcânica extremamente resistente ao embate das ondas oceânicas. É uma Unidade de Conservação Federal (Revis Ilha dos Lobos) vital para a migração sazonal de pinípedes (leões e lobos-marinhos)."
  },
  {
    "id": 22,
    "nome": "Mineração Angelgres",
    "municipio": "Morro Grande",
    "uf": "SC",
    "municipio_completo": "Morro Grande (SC)",
    "categoria": "Paleontológico e Estratigráfico",
    "categoria_primaria": "Paleontológico",
    "grau": "Nacional",
    "coords": [
      -28.77847815474066,
      -49.66888796687032
    ],
    "lon": -49.66888796687032,
    "lat": -28.77847815474066,
    "formacao": "Formação Rio do Rasto (Permiano Superior)",
    "altitude": "120 m",
    "destaque": "Jazida fossilífera do Permiano com bivalves, conchostráceos e icnofósseis continentais.",
    "descricao": "Corte de mineração industrial que expõe folhelhos, siltitos e arenitos lacustres e fluviais da Formação Rio do Rasto (com mais de 260 milhões de anos). Constitui um dos sítios de referência nacional para o estudo da paleobiota e dos ecossistemas continentais anteriores à extinção Permo-Triássica."
  },
  {
    "id": 9,
    "nome": "Morro Carasal",
    "municipio": "Jacinto Machado",
    "uf": "SC",
    "municipio_completo": "Jacinto Machado (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -29.067015192652242,
      -49.93100522263222
    ],
    "lon": -49.93100522263222,
    "lat": -29.067015192652242,
    "formacao": "Formação Botucatu / Serra Geral",
    "altitude": "450 m",
    "destaque": "Relevo de morro testemunho isolado da frente de recuo da escarpa.",
    "descricao": "Saliência geomorfológica que testemunha o avanço da erosão sobre o platô basáltico. Apresenta perfil estratigráfico didático que abrange as transições arenito-basalto do paleodeserto jurássico-cretáceo."
  },
  {
    "id": 11,
    "nome": "Morro Itambé",
    "municipio": "Jacinto Machado",
    "uf": "SC",
    "municipio_completo": "Jacinto Machado (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -29.023241037161377,
      -49.740161466978456
    ],
    "lon": -49.740161466978456,
    "lat": -29.023241037161377,
    "formacao": "Formação Serra Geral",
    "altitude": "620 m",
    "destaque": "Monólito rochoso isolado com vistas de 360° da planície até o oceano Atlântico.",
    "descricao": "Feição de crista rochosa e morro testemunho avançado em relação à linha de escarpa principal. Seu topo rochoso permite compreender a dinâmica do relevo em escala regional e a dissecação da Bacia do Paraná."
  },
  {
    "id": 2,
    "nome": "Morro dos Cabritos",
    "municipio": "Praia Grande",
    "uf": "SC",
    "municipio_completo": "Praia Grande (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -29.18577034432056,
      -50.015147906127595
    ],
    "lon": -50.015147906127595,
    "lat": -29.18577034432056,
    "formacao": "Formação Serra Geral / Formação Botucatu",
    "altitude": "340 m",
    "destaque": "Relevo residual e mirante panorâmico sobre o vale do Rio Mampituba.",
    "descricao": "Testemunho geomorfológico do recuo erosivo da escarpa da Serra Geral. Exibe o contraste estratigráfico entre os arenitos basais e as primeiras camadas de lavas basálticas, funcionando como marco cênico e mirante natural da planície litorânea e contrafortes da serra."
  },
  {
    "id": 20,
    "nome": "Paleotoca da Aparência",
    "municipio": "Morro Grande",
    "uf": "SC",
    "municipio_completo": "Morro Grande (SC)",
    "categoria": "Paleontológico e Geomorfológico",
    "categoria_primaria": "Paleontológico",
    "grau": "Regional",
    "coords": [
      -28.661084521859475,
      -49.75664295421022
    ],
    "lon": -49.75664295421022,
    "lat": -28.661084521859475,
    "formacao": "Formação Botucatu (Arenito)",
    "altitude": "390 m",
    "destaque": "Extensa estrutura de paleotoca com túneis preservados e marcas de garras de megafauna.",
    "descricao": "Uma das maiores e mais bem preservadas paleotocas do Brasil. O túnel fóssil atinge mais de 60 metros de extensão no arenito, abrigando marcas indeléveis das garras de preguiças-terrícolas gigantes (Glossotherium / Mylodontidae) de dezenas de milhares de anos atrás."
  },
  {
    "id": 25,
    "nome": "Paleotoca Índios Xokleng",
    "municipio": "Jacinto Machado",
    "uf": "SC",
    "municipio_completo": "Jacinto Machado (SC)",
    "categoria": "Paleontológico",
    "categoria_primaria": "Paleontológico",
    "grau": "Internacional",
    "coords": [
      -29.031711111554564,
      -49.87156111110696
    ],
    "lon": -49.87156111110696,
    "lat": -29.031711111554564,
    "formacao": "Formação Botucatu / Arenito Eólico",
    "altitude": "340 m",
    "destaque": "Paleotoca preservada no município de Jacinto Machado associada à herança indígena regional.",
    "descricao": "Monumento paleontológico e arqueológico esculpido nas formações areníticas por mamíferos da megafauna extinta. Abrigou no passado recente grupos de índios Xokleng, preservando camadas de solo de valor antropológico e marcas fósseis nas paredes da gruta."
  },
  {
    "id": 16,
    "nome": "Paredão da Areia Branca",
    "municipio": "Timbé do Sul",
    "uf": "SC",
    "municipio_completo": "Timbé do Sul (SC)",
    "categoria": "Geomorfológico e Estratigráfico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Regional",
    "coords": [
      -28.820578123310682,
      -49.796633796155525
    ],
    "lon": -49.796633796155525,
    "lat": -28.820578123310682,
    "formacao": "Formação Botucatu (Arenitos Eólicos)",
    "altitude": "420 m",
    "destaque": "Exposição monumental de arenitos com estratificação cruzada do antigo Deserto Botucatu.",
    "descricao": "Geossítio de altíssimo valor estratigráfico e geomorfológico. Expõe paredões de arenitos quartzosos avermelhados a esbranquiçados da Formação Botucatu, exibindo imensas estratificações cruzadas de dunas do gigantesco paleodeserto que cobriu o continente Gondwana."
  },
  {
    "id": 28,
    "nome": "Parque da Guarita e Morro do Farol",
    "municipio": "Torres",
    "uf": "RS",
    "municipio_completo": "Torres (RS)",
    "categoria": "Geológico e Geomorfológico",
    "categoria_primaria": "Geológico",
    "grau": "Internacional",
    "coords": [
      -29.357905259619656,
      -49.735473832092346
    ],
    "lon": -49.735473832092346,
    "lat": -29.357905259619656,
    "formacao": "Formação Botucatu e Formação Serra Geral (Contato Costeiro)",
    "altitude": "0 a 60 m",
    "destaque": "Único ponto do litoral brasileiro onde os basaltos da Serra Geral encontram diretamente o Oceano Atlântico.",
    "descricao": "Geossítio de relevância mundial absoluta (Global Geosite). É o único local em toda a costa do Atlântico Sul onde os derrames de basalto da Bacia do Paraná e os arenitos Botucatu emergem como falésias e promontórios costeiros batidos pelo mar. Destacam-se a Torre da Guarita, a Torre do Meio, a Torre do Sul e as Furnas marinhas esculpidas pela energia das ondas."
  },
  {
    "id": 1,
    "nome": "Rio do Boi",
    "municipio": "Praia Grande",
    "uf": "SC",
    "municipio_completo": "Praia Grande (SC)",
    "categoria": "Geomorfológico",
    "categoria_primaria": "Geomorfológico",
    "grau": "Nacional",
    "coords": [
      -29.19440503184236,
      -50.0795040751225
    ],
    "lon": -50.0795040751225,
    "lat": -29.19440503184236,
    "formacao": "Formação Serra Geral (Derrames Basálticos)",
    "altitude": "180 m",
    "destaque": "Trilha pela fenda interna do Cânion Itaimbezinho com paredões de até 720m de altura.",
    "descricao": "Trilha clássica no interior do Cânion Itaimbezinho ao longo do leito pedregoso do Rio do Boi. Permite a observação direta dos empilhamentos de derrames basálticos da Formação Serra Geral e das feições de disjunção colunar e prismática, além do contato com a exuberante Mata Atlântica de encosta."
  },
  {
    "id": 27,
    "nome": "Santuário Nossa Senhora Aparecida",
    "municipio": "Mampituba",
    "uf": "RS",
    "municipio_completo": "Mampituba (RS)",
    "categoria": "Geológico",
    "categoria_primaria": "Geológico",
    "grau": "Nacional",
    "coords": [
      -29.2146866459897,
      -49.969439220302846
    ],
    "lon": -49.969439220302846,
    "lat": -29.2146866459897,
    "formacao": "Formação Botucatu / Morros Testemunhos",
    "altitude": "280 m",
    "destaque": "Formação rochosa sagrada e mirante geomorfológico com cavernas e fendas areníticas.",
    "descricao": "Importante sítio de geodiversidade, fé e turismo cultural. As formações rochosas esculpidas pela erosão criaram grutas naturais na base dos arenitos Botucatu que se tornaram local de peregrinação religiosa e mirante para a foz do Rio Mampituba."
  },
  {
    "id": 17,
    "nome": "Toca do Tatu",
    "municipio": "Timbé do Sul",
    "uf": "SC",
    "municipio_completo": "Timbé do Sul (SC)",
    "categoria": "Paleontológico",
    "categoria_primaria": "Paleontológico",
    "grau": "Regional",
    "coords": [
      -28.7724043743343,
      -49.89620317652419
    ],
    "lon": -49.89620317652419,
    "lat": -28.7724043743343,
    "formacao": "Formação Botucatu / Cobertura Quaternária",
    "altitude": "360 m",
    "destaque": "Paleotoca escavada por preguiças-gigantes ou tatus-gigantes da megafauna do Pleistoceno.",
    "descricao": "Túnel subterrâneo fóssil (paleotoca) escavado em rocha arenítica por mamíferos gigantes extintos (megafauna pré-histórica pleistocênica). Apresenta marcas preservadas de garras (crotovinas/icnofósseis) nas paredes, constituindo raro patrimônio paleontológico mundial."
  }
];

const MUNICIPIOS_GEOJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -49.9509,
              -28.8935
            ],
            [
              -49.9655,
              -28.8965
            ],
            [
              -49.97,
              -28.9015
            ],
            [
              -49.9887,
              -28.8972
            ],
            [
              -49.9999,
              -28.8881
            ],
            [
              -50.0085,
              -28.8894
            ],
            [
              -50.0085,
              -28.8819
            ],
            [
              -50.0146,
              -28.8762
            ],
            [
              -50.0227,
              -28.8624
            ],
            [
              -50.0517,
              -28.8462
            ],
            [
              -50.071,
              -28.8378
            ],
            [
              -50.0736,
              -28.8425
            ],
            [
              -50.0845,
              -28.8446
            ],
            [
              -50.0863,
              -28.832
            ],
            [
              -50.0981,
              -28.8282
            ],
            [
              -50.1059,
              -28.8299
            ],
            [
              -50.1127,
              -28.8239
            ],
            [
              -50.1281,
              -28.8206
            ],
            [
              -50.1404,
              -28.8273
            ],
            [
              -50.1538,
              -28.8199
            ],
            [
              -50.1658,
              -28.8355
            ],
            [
              -50.1829,
              -28.831
            ],
            [
              -50.1812,
              -28.824
            ],
            [
              -50.1916,
              -28.8243
            ],
            [
              -50.1987,
              -28.8321
            ],
            [
              -50.1935,
              -28.8395
            ],
            [
              -50.1849,
              -28.8455
            ],
            [
              -50.1786,
              -28.8689
            ],
            [
              -50.1826,
              -28.8836
            ],
            [
              -50.176,
              -28.89
            ],
            [
              -50.1688,
              -28.8888
            ],
            [
              -50.1597,
              -28.894
            ],
            [
              -50.1594,
              -28.9065
            ],
            [
              -50.1673,
              -28.9132
            ],
            [
              -50.1812,
              -28.9195
            ],
            [
              -50.1907,
              -28.9297
            ],
            [
              -50.2082,
              -28.93
            ],
            [
              -50.2085,
              -28.9244
            ],
            [
              -50.2168,
              -28.9192
            ],
            [
              -50.2254,
              -28.9332
            ],
            [
              -50.245,
              -28.9338
            ],
            [
              -50.2531,
              -28.9285
            ],
            [
              -50.2614,
              -28.9394
            ],
            [
              -50.2541,
              -28.9421
            ],
            [
              -50.2452,
              -28.9584
            ],
            [
              -50.2548,
              -28.9774
            ],
            [
              -50.2506,
              -28.9832
            ],
            [
              -50.2549,
              -28.9942
            ],
            [
              -50.2607,
              -28.9909
            ],
            [
              -50.2695,
              -28.9959
            ],
            [
              -50.2702,
              -29.0144
            ],
            [
              -50.2585,
              -29.0175
            ],
            [
              -50.2486,
              -29.0243
            ],
            [
              -50.237,
              -29.0192
            ],
            [
              -50.2298,
              -29.021
            ],
            [
              -50.2262,
              -29.0426
            ],
            [
              -50.2185,
              -29.0496
            ],
            [
              -50.2105,
              -29.0503
            ],
            [
              -50.198,
              -29.0602
            ],
            [
              -50.1885,
              -29.0597
            ],
            [
              -50.1888,
              -29.0724
            ],
            [
              -50.1957,
              -29.0813
            ],
            [
              -50.1916,
              -29.0963
            ],
            [
              -50.2033,
              -29.1033
            ],
            [
              -50.2199,
              -29.096
            ],
            [
              -50.2224,
              -29.0998
            ],
            [
              -50.2406,
              -29.1023
            ],
            [
              -50.2514,
              -29.12
            ],
            [
              -50.2464,
              -29.1243
            ],
            [
              -50.2479,
              -29.1322
            ],
            [
              -50.2707,
              -29.1376
            ],
            [
              -50.2994,
              -29.1197
            ],
            [
              -50.3304,
              -29.114
            ],
            [
              -50.3369,
              -29.1097
            ],
            [
              -50.3515,
              -29.1199
            ],
            [
              -50.3575,
              -29.1171
            ],
            [
              -50.3563,
              -29.126
            ],
            [
              -50.3653,
              -29.1317
            ],
            [
              -50.362,
              -29.1382
            ],
            [
              -50.3524,
              -29.1366
            ],
            [
              -50.3559,
              -29.1567
            ],
            [
              -50.3598,
              -29.1631
            ],
            [
              -50.3569,
              -29.1905
            ],
            [
              -50.3456,
              -29.1978
            ],
            [
              -50.3428,
              -29.2043
            ],
            [
              -50.3301,
              -29.2187
            ],
            [
              -50.3244,
              -29.2219
            ],
            [
              -50.3326,
              -29.2395
            ],
            [
              -50.325,
              -29.2513
            ],
            [
              -50.327,
              -29.2575
            ],
            [
              -50.3156,
              -29.2592
            ],
            [
              -50.3143,
              -29.2691
            ],
            [
              -50.2974,
              -29.2782
            ],
            [
              -50.3032,
              -29.2834
            ],
            [
              -50.2956,
              -29.2916
            ],
            [
              -50.287,
              -29.2955
            ],
            [
              -50.2756,
              -29.2875
            ],
            [
              -50.2703,
              -29.2909
            ],
            [
              -50.2571,
              -29.2774
            ],
            [
              -50.2415,
              -29.2729
            ],
            [
              -50.1998,
              -29.257
            ],
            [
              -50.1831,
              -29.2646
            ],
            [
              -50.1446,
              -29.2702
            ],
            [
              -50.1455,
              -29.2574
            ],
            [
              -50.1519,
              -29.2432
            ],
            [
              -50.1411,
              -29.2383
            ],
            [
              -50.1407,
              -29.2284
            ],
            [
              -50.1512,
              -29.2302
            ],
            [
              -50.1489,
              -29.2211
            ],
            [
              -50.1399,
              -29.2155
            ],
            [
              -50.1397,
              -29.2073
            ],
            [
              -50.1456,
              -29.1978
            ],
            [
              -50.1269,
              -29.1979
            ],
            [
              -50.1244,
              -29.2016
            ],
            [
              -50.1078,
              -29.211
            ],
            [
              -50.084,
              -29.2138
            ],
            [
              -50.085,
              -29.205
            ],
            [
              -50.0904,
              -29.2013
            ],
            [
              -50.0854,
              -29.1936
            ],
            [
              -50.0893,
              -29.1754
            ],
            [
              -50.0753,
              -29.1884
            ],
            [
              -50.054,
              -29.1831
            ],
            [
              -50.0434,
              -29.1837
            ],
            [
              -50.0386,
              -29.1774
            ],
            [
              -50.018,
              -29.1628
            ],
            [
              -50.0049,
              -29.1406
            ],
            [
              -50.0071,
              -29.1344
            ],
            [
              -49.9984,
              -29.1309
            ],
            [
              -49.9843,
              -29.1367
            ],
            [
              -49.9918,
              -29.1173
            ],
            [
              -49.9689,
              -29.116
            ],
            [
              -49.9705,
              -29.1013
            ],
            [
              -49.9652,
              -29.082
            ],
            [
              -49.9562,
              -29.0849
            ],
            [
              -49.9545,
              -29.0775
            ],
            [
              -49.9576,
              -29.0682
            ],
            [
              -49.9625,
              -29.0653
            ],
            [
              -49.994,
              -29.0696
            ],
            [
              -49.9898,
              -29.063
            ],
            [
              -49.9772,
              -29.0588
            ],
            [
              -49.961,
              -29.0508
            ],
            [
              -49.9612,
              -29.0438
            ],
            [
              -49.9563,
              -29.0352
            ],
            [
              -49.9461,
              -29.0308
            ],
            [
              -49.9414,
              -29.0213
            ],
            [
              -49.966,
              -29.0217
            ],
            [
              -49.9574,
              -29.0121
            ],
            [
              -49.9463,
              -28.9951
            ],
            [
              -49.9425,
              -28.9822
            ],
            [
              -49.9309,
              -28.9759
            ],
            [
              -49.9337,
              -28.9658
            ],
            [
              -49.9542,
              -28.9618
            ],
            [
              -49.9557,
              -28.9489
            ],
            [
              -49.9598,
              -28.9356
            ],
            [
              -49.9564,
              -28.929
            ],
            [
              -49.9651,
              -28.9255
            ],
            [
              -49.9583,
              -28.9024
            ],
            [
              -49.9515,
              -28.9005
            ],
            [
              -49.9509,
              -28.8935
            ]
          ]
        ]
      },
      "properties": {
        "codarea": "4303608",
        "nome": "Cambará do Sul",
        "ibge_code": "4303608",
        "uf": "RS"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -49.9016,
              -29.2153
            ],
            [
              -49.9033,
              -29.2147
            ],
            [
              -49.906,
              -29.2116
            ],
            [
              -49.9098,
              -29.2102
            ],
            [
              -49.9107,
              -29.209
            ],
            [
              -49.9129,
              -29.2079
            ],
            [
              -49.9153,
              -29.2077
            ],
            [
              -49.9173,
              -29.2083
            ],
            [
              -49.92,
              -29.2065
            ],
            [
              -49.925,
              -29.2062
            ],
            [
              -49.9266,
              -29.2065
            ],
            [
              -49.9287,
              -29.2079
            ],
            [
              -49.9313,
              -29.2074
            ],
            [
              -49.9332,
              -29.2084
            ],
            [
              -49.9354,
              -29.2083
            ],
            [
              -49.938,
              -29.2076
            ],
            [
              -49.9381,
              -29.2068
            ],
            [
              -49.9426,
              -29.2057
            ],
            [
              -49.9433,
              -29.205
            ],
            [
              -49.9434,
              -29.2032
            ],
            [
              -49.9453,
              -29.2015
            ],
            [
              -49.948,
              -29.2022
            ],
            [
              -49.9498,
              -29.2007
            ],
            [
              -49.9539,
              -29.2011
            ],
            [
              -49.9576,
              -29.1995
            ],
            [
              -49.9598,
              -29.1998
            ],
            [
              -49.9627,
              -29.1989
            ],
            [
              -49.965,
              -29.1994
            ],
            [
              -49.9655,
              -29.2016
            ],
            [
              -49.9678,
              -29.2033
            ],
            [
              -49.9704,
              -29.2029
            ],
            [
              -49.9711,
              -29.2048
            ],
            [
              -49.9704,
              -29.2067
            ],
            [
              -49.97,
              -29.2095
            ],
            [
              -49.969,
              -29.2115
            ],
            [
              -49.9727,
              -29.2141
            ],
            [
              -49.9744,
              -29.2147
            ],
            [
              -49.9765,
              -29.2148
            ],
            [
              -49.9778,
              -29.2159
            ],
            [
              -49.9792,
              -29.2188
            ],
            [
              -49.9801,
              -29.2194
            ],
            [
              -49.9842,
              -29.2209
            ],
            [
              -49.9877,
              -29.2237
            ],
            [
              -49.994,
              -29.2268
            ],
            [
              -49.995,
              -29.2269
            ],
            [
              -49.9968,
              -29.2283
            ],
            [
              -49.9976,
              -29.2263
            ],
            [
              -49.9996,
              -29.2265
            ],
            [
              -50.0008,
              -29.2275
            ],
            [
              -50.0039,
              -29.2269
            ],
            [
              -50.0042,
              -29.2258
            ],
            [
              -50.0066,
              -29.2259
            ],
            [
              -50.0099,
              -29.2254
            ],
            [
              -50.0114,
              -29.2267
            ],
            [
              -50.0136,
              -29.2267
            ],
            [
              -50.0148,
              -29.2277
            ],
            [
              -50.017,
              -29.2282
            ],
            [
              -50.0209,
              -29.2285
            ],
            [
              -50.0226,
              -29.2291
            ],
            [
              -50.0264,
              -29.2312
            ],
            [
              -50.0293,
              -29.2321
            ],
            [
              -50.0322,
              -29.2321
            ],
            [
              -50.0348,
              -29.2328
            ],
            [
              -50.0357,
              -29.2361
            ],
            [
              -50.0365,
              -29.2378
            ],
            [
              -50.0386,
              -29.2384
            ],
            [
              -50.0399,
              -29.2382
            ],
            [
              -50.0414,
              -29.2401
            ],
            [
              -50.0434,
              -29.2402
            ],
            [
              -50.045,
              -29.2392
            ],
            [
              -50.0468,
              -29.2394
            ],
            [
              -50.0501,
              -29.2418
            ],
            [
              -50.0516,
              -29.2422
            ],
            [
              -50.0528,
              -29.2413
            ],
            [
              -50.0555,
              -29.2406
            ],
            [
              -50.0609,
              -29.2413
            ],
            [
              -50.0634,
              -29.2425
            ],
            [
              -50.0648,
              -29.244
            ],
            [
              -50.0633,
              -29.2454
            ],
            [
              -50.0631,
              -29.247
            ],
            [
              -50.0651,
              -29.2495
            ],
            [
              -50.0672,
              -29.2493
            ],
            [
              -50.0672,
              -29.248
            ],
            [
              -50.0681,
              -29.2457
            ],
            [
              -50.0687,
              -29.2456
            ],
            [
              -50.0706,
              -29.2482
            ],
            [
              -50.0735,
              -29.2495
            ],
            [
              -50.0763,
              -29.2501
            ],
            [
              -50.0792,
              -29.2514
            ],
            [
              -50.0816,
              -29.25
            ],
            [
              -50.0834,
              -29.2502
            ],
            [
              -50.0856,
              -29.2517
            ],
            [
              -50.0861,
              -29.2532
            ],
            [
              -50.0893,
              -29.2543
            ],
            [
              -50.0922,
              -29.2532
            ],
            [
              -50.0939,
              -29.2529
            ],
            [
              -50.0953,
              -29.2516
            ],
            [
              -50.0995,
              -29.2543
            ],
            [
              -50.1014,
              -29.2559
            ],
            [
              -50.1032,
              -29.2547
            ],
            [
              -50.1047,
              -29.2546
            ],
            [
              -50.1076,
              -29.2535
            ],
            [
              -50.108,
              -29.2549
            ],
            [
              -50.1062,
              -29.2565
            ],
            [
              -50.1089,
              -29.2581
            ],
            [
              -50.1108,
              -29.2585
            ],
            [
              -50.1133,
              -29.2574
            ],
            [
              -50.1143,
              -29.2576
            ],
            [
              -50.1147,
              -29.2594
            ],
            [
              -50.1156,
              -29.2608
            ],
            [
              -50.1155,
              -29.2623
            ],
            [
              -50.1125,
              -29.2674
            ],
            [
              -50.1137,
              -29.2686
            ],
            [
              -50.1123,
              -29.2699
            ],
            [
              -50.1102,
              -29.2729
            ],
            [
              -50.1094,
              -29.2752
            ],
            [
              -50.1084,
              -29.2765
            ],
            [
              -50.1084,
              -29.2782
            ],
            [
              -50.1093,
              -29.2793
            ],
            [
              -50.1085,
              -29.2801
            ],
            [
              -50.1052,
              -29.2811
            ],
            [
              -50.104,
              -29.2829
            ],
            [
              -50.1008,
              -29.2839
            ],
            [
              -50.101,
              -29.2857
            ],
            [
              -50.0996,
              -29.2884
            ],
            [
              -50.0945,
              -29.2921
            ],
            [
              -50.0941,
              -29.2934
            ],
            [
              -50.092,
              -29.2939
            ],
            [
              -50.093,
              -29.2964
            ],
            [
              -50.0915,
              -29.298
            ],
            [
              -50.0894,
              -29.2978
            ],
            [
              -50.0877,
              -29.2987
            ],
            [
              -50.0854,
              -29.302
            ],
            [
              -50.0827,
              -29.3023
            ],
            [
              -50.0819,
              -29.3033
            ],
            [
              -50.0788,
              -29.3049
            ],
            [
              -50.0765,
              -29.3078
            ],
            [
              -50.0739,
              -29.3081
            ],
            [
              -50.072,
              -29.3103
            ],
            [
              -50.0689,
              -29.3117
            ],
            [
              -50.0651,
              -29.3105
            ],
            [
              -50.0641,
              -29.3108
            ],
            [
              -50.0623,
              -29.3127
            ],
            [
              -50.0625,
              -29.3146
            ],
            [
              -50.0618,
              -29.3152
            ],
            [
              -50.0592,
              -29.3158
            ],
            [
              -50.0562,
              -29.319
            ],
            [
              -50.0553,
              -29.3193
            ],
            [
              -50.0541,
              -29.3211
            ],
            [
              -50.0527,
              -29.3222
            ],
            [
              -50.0512,
              -29.3241
            ],
            [
              -50.0514,
              -29.326
            ],
            [
              -50.0508,
              -29.3265
            ],
            [
              -50.0511,
              -29.3293
            ],
            [
              -50.0501,
              -29.3319
            ],
            [
              -50.0489,
              -29.3331
            ],
            [
              -50.0449,
              -29.3352
            ],
            [
              -50.044,
              -29.3374
            ],
            [
              -50.043,
              -29.3386
            ],
            [
              -50.0425,
              -29.3404
            ],
            [
              -50.0401,
              -29.3434
            ],
            [
              -50.038,
              -29.3449
            ],
            [
              -50.035,
              -29.3477
            ],
            [
              -50.0353,
              -29.3491
            ],
            [
              -50.034,
              -29.3496
            ],
            [
              -50.0329,
              -29.35
            ],
            [
              -50.0311,
              -29.3479
            ],
            [
              -50.0323,
              -29.347
            ],
            [
              -50.0325,
              -29.3449
            ],
            [
              -50.0301,
              -29.3425
            ],
            [
              -50.0306,
              -29.3408
            ],
            [
              -50.0302,
              -29.3387
            ],
            [
              -50.0294,
              -29.3371
            ],
            [
              -50.0294,
              -29.3333
            ],
            [
              -50.0302,
              -29.3317
            ],
            [
              -50.0322,
              -29.3297
            ],
            [
              -50.0346,
              -29.3253
            ],
            [
              -50.0339,
              -29.3235
            ],
            [
              -50.0321,
              -29.3219
            ],
            [
              -50.0267,
              -29.3161
            ],
            [
              -50.0248,
              -29.3145
            ],
            [
              -50.0224,
              -29.3119
            ],
            [
              -50.016,
              -29.3076
            ],
            [
              -50.0063,
              -29.3025
            ],
            [
              -50.0019,
              -29.3023
            ],
            [
              -49.999,
              -29.3039
            ],
            [
              -49.9976,
              -29.3036
            ],
            [
              -49.996,
              -29.3023
            ],
            [
              -49.9934,
              -29.301
            ],
            [
              -49.9898,
              -29.3006
            ],
            [
              -49.9881,
              -29.3011
            ],
            [
              -49.9828,
              -29.2974
            ],
            [
              -49.9719,
              -29.2929
            ],
            [
              -49.9641,
              -29.287
            ],
            [
              -49.9626,
              -29.2865
            ],
            [
              -49.9584,
              -29.2866
            ],
            [
              -49.9545,
              -29.2854
            ],
            [
              -49.9529,
              -29.2827
            ],
            [
              -49.9509,
              -29.2787
            ],
            [
              -49.9483,
              -29.2757
            ],
            [
              -49.945,
              -29.2737
            ],
            [
              -49.9434,
              -29.2731
            ],
            [
              -49.9419,
              -29.271
            ],
            [
              -49.9419,
              -29.2678
            ],
            [
              -49.9413,
              -29.265
            ],
            [
              -49.9404,
              -29.2632
            ],
            [
              -49.9369,
              -29.2599
            ],
            [
              -49.9327,
              -29.2577
            ],
            [
              -49.9298,
              -29.2526
            ],
            [
              -49.9089,
              -29.2535
            ],
            [
              -49.9037,
              -29.2536
            ],
            [
              -49.8867,
              -29.2584
            ],
            [
              -49.8891,
              -29.2436
            ],
            [
              -49.8889,
              -29.2418
            ],
            [
              -49.8923,
              -29.2366
            ],
            [
              -49.8938,
              -29.2335
            ],
            [
              -49.8936,
              -29.2316
            ],
            [
              -49.896,
              -29.2302
            ],
            [
              -49.8961,
              -29.2258
            ],
            [
              -49.898,
              -29.2236
            ],
            [
              -49.9,
              -29.2224
            ],
            [
              -49.8986,
              -29.2197
            ],
            [
              -49.8989,
              -29.2177
            ],
            [
              -49.9003,
              -29.2171
            ],
            [
              -49.9016,
              -29.2153
            ]
          ]
        ]
      },
      "properties": {
        "codarea": "4311734",
        "nome": "Mampituba",
        "ibge_code": "4311734",
        "uf": "RS"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -49.8035,
              -29.4436
            ],
            [
              -49.7679,
              -29.3985
            ],
            [
              -49.738,
              -29.3615
            ],
            [
              -49.732,
              -29.3582
            ],
            [
              -49.7304,
              -29.3502
            ],
            [
              -49.7158,
              -29.3324
            ],
            [
              -49.7129,
              -29.3256
            ],
            [
              -49.7308,
              -29.3291
            ],
            [
              -49.7466,
              -29.3238
            ],
            [
              -49.7394,
              -29.3148
            ],
            [
              -49.7421,
              -29.2988
            ],
            [
              -49.7494,
              -29.2974
            ],
            [
              -49.7623,
              -29.3003
            ],
            [
              -49.7769,
              -29.2965
            ],
            [
              -49.7801,
              -29.2907
            ],
            [
              -49.7918,
              -29.2856
            ],
            [
              -49.7994,
              -29.2875
            ],
            [
              -49.8157,
              -29.2859
            ],
            [
              -49.8297,
              -29.276
            ],
            [
              -49.8436,
              -29.2776
            ],
            [
              -49.8435,
              -29.2593
            ],
            [
              -49.8547,
              -29.2573
            ],
            [
              -49.8526,
              -29.2444
            ],
            [
              -49.8586,
              -29.2416
            ],
            [
              -49.8571,
              -29.2331
            ],
            [
              -49.8695,
              -29.2244
            ],
            [
              -49.9016,
              -29.2153
            ],
            [
              -49.8889,
              -29.2418
            ],
            [
              -49.8867,
              -29.2584
            ],
            [
              -49.8852,
              -29.2609
            ],
            [
              -49.8971,
              -29.2818
            ],
            [
              -49.8886,
              -29.3124
            ],
            [
              -49.8585,
              -29.3128
            ],
            [
              -49.8306,
              -29.3236
            ],
            [
              -49.815,
              -29.339
            ],
            [
              -49.8289,
              -29.3569
            ],
            [
              -49.8188,
              -29.3798
            ],
            [
              -49.8026,
              -29.3919
            ],
            [
              -49.8212,
              -29.4114
            ],
            [
              -49.8355,
              -29.4242
            ],
            [
              -49.8035,
              -29.4436
            ]
          ]
        ]
      },
      "properties": {
        "codarea": "4321501",
        "nome": "Torres",
        "ibge_code": "4321501",
        "uf": "RS"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -49.9576,
              -29.1995
            ],
            [
              -49.9468,
              -29.1995
            ],
            [
              -49.9126,
              -29.1956
            ],
            [
              -49.9039,
              -29.1909
            ],
            [
              -49.8914,
              -29.1751
            ],
            [
              -49.8778,
              -29.1695
            ],
            [
              -49.8611,
              -29.1695
            ],
            [
              -49.8308,
              -29.1564
            ],
            [
              -49.8254,
              -29.1493
            ],
            [
              -49.8289,
              -29.1283
            ],
            [
              -49.832,
              -29.1218
            ],
            [
              -49.8437,
              -29.1086
            ],
            [
              -49.8515,
              -29.1028
            ],
            [
              -49.8654,
              -29.1013
            ],
            [
              -49.877,
              -29.0947
            ],
            [
              -49.8929,
              -29.101
            ],
            [
              -49.9042,
              -29.103
            ],
            [
              -49.9174,
              -29.1002
            ],
            [
              -49.9321,
              -29.0848
            ],
            [
              -49.9377,
              -29.0835
            ],
            [
              -49.9576,
              -29.0682
            ],
            [
              -49.9545,
              -29.0775
            ],
            [
              -49.9562,
              -29.0849
            ],
            [
              -49.9652,
              -29.082
            ],
            [
              -49.9705,
              -29.1013
            ],
            [
              -49.9689,
              -29.116
            ],
            [
              -49.9918,
              -29.1173
            ],
            [
              -49.9843,
              -29.1367
            ],
            [
              -49.9984,
              -29.1309
            ],
            [
              -50.0071,
              -29.1344
            ],
            [
              -50.0049,
              -29.1406
            ],
            [
              -50.018,
              -29.1628
            ],
            [
              -50.0386,
              -29.1774
            ],
            [
              -50.0434,
              -29.1837
            ],
            [
              -50.054,
              -29.1831
            ],
            [
              -50.0753,
              -29.1884
            ],
            [
              -50.0893,
              -29.1754
            ],
            [
              -50.0854,
              -29.1936
            ],
            [
              -50.0904,
              -29.2013
            ],
            [
              -50.085,
              -29.205
            ],
            [
              -50.084,
              -29.2138
            ],
            [
              -50.1078,
              -29.211
            ],
            [
              -50.1244,
              -29.2016
            ],
            [
              -50.1269,
              -29.1979
            ],
            [
              -50.1456,
              -29.1978
            ],
            [
              -50.1397,
              -29.2073
            ],
            [
              -50.1399,
              -29.2155
            ],
            [
              -50.1489,
              -29.2211
            ],
            [
              -50.1512,
              -29.2302
            ],
            [
              -50.1407,
              -29.2284
            ],
            [
              -50.1411,
              -29.2383
            ],
            [
              -50.1519,
              -29.2432
            ],
            [
              -50.1455,
              -29.2574
            ],
            [
              -50.1446,
              -29.2702
            ],
            [
              -50.1489,
              -29.282
            ],
            [
              -50.1408,
              -29.2865
            ],
            [
              -50.1329,
              -29.3003
            ],
            [
              -50.1283,
              -29.2979
            ],
            [
              -50.1304,
              -29.287
            ],
            [
              -50.1171,
              -29.2918
            ],
            [
              -50.1125,
              -29.304
            ],
            [
              -50.0992,
              -29.3114
            ],
            [
              -50.0915,
              -29.3108
            ],
            [
              -50.0858,
              -29.318
            ],
            [
              -50.0723,
              -29.3247
            ],
            [
              -50.071,
              -29.3295
            ],
            [
              -50.0558,
              -29.3414
            ],
            [
              -50.0468,
              -29.3404
            ],
            [
              -50.0385,
              -29.3472
            ],
            [
              -50.041,
              -29.3551
            ],
            [
              -50.034,
              -29.3496
            ],
            [
              -50.0511,
              -29.3293
            ],
            [
              -50.0512,
              -29.3241
            ],
            [
              -50.0651,
              -29.3105
            ],
            [
              -50.0765,
              -29.3078
            ],
            [
              -50.1085,
              -29.2801
            ],
            [
              -50.1155,
              -29.2623
            ],
            [
              -50.0953,
              -29.2516
            ],
            [
              -50.0893,
              -29.2543
            ],
            [
              -50.0706,
              -29.2482
            ],
            [
              -50.0609,
              -29.2413
            ],
            [
              -50.0501,
              -29.2418
            ],
            [
              -50.0365,
              -29.2378
            ],
            [
              -50.0348,
              -29.2328
            ],
            [
              -50.0099,
              -29.2254
            ],
            [
              -49.9968,
              -29.2283
            ],
            [
              -49.969,
              -29.2115
            ],
            [
              -49.9711,
              -29.2048
            ],
            [
              -49.9576,
              -29.1995
            ]
          ]
        ]
      },
      "properties": {
        "codarea": "4213807",
        "nome": "Praia Grande",
        "ibge_code": "4213807",
        "uf": "SC"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -49.7432,
              -29.0393
            ],
            [
              -49.6989,
              -29.0205
            ],
            [
              -49.7178,
              -29.0056
            ],
            [
              -49.7257,
              -29.0032
            ],
            [
              -49.7064,
              -28.9669
            ],
            [
              -49.7173,
              -28.9678
            ],
            [
              -49.7193,
              -28.9626
            ],
            [
              -49.7329,
              -28.9627
            ],
            [
              -49.7463,
              -28.952
            ],
            [
              -49.7581,
              -28.9481
            ],
            [
              -49.7713,
              -28.9389
            ],
            [
              -49.7686,
              -28.9263
            ],
            [
              -49.762,
              -28.9171
            ],
            [
              -49.7739,
              -28.9119
            ],
            [
              -49.7826,
              -28.904
            ],
            [
              -49.8085,
              -28.8949
            ],
            [
              -49.8141,
              -28.8862
            ],
            [
              -49.8286,
              -28.8916
            ],
            [
              -49.8412,
              -28.8817
            ],
            [
              -49.8498,
              -28.8828
            ],
            [
              -49.8678,
              -28.88
            ],
            [
              -49.8795,
              -28.8824
            ],
            [
              -49.8876,
              -28.8886
            ],
            [
              -49.8963,
              -28.89
            ],
            [
              -49.9067,
              -28.9009
            ],
            [
              -49.9212,
              -28.9097
            ],
            [
              -49.9305,
              -28.9211
            ],
            [
              -49.939,
              -28.9201
            ],
            [
              -49.9492,
              -28.9246
            ],
            [
              -49.9472,
              -28.9361
            ],
            [
              -49.9562,
              -28.9408
            ],
            [
              -49.9557,
              -28.9489
            ],
            [
              -49.9542,
              -28.9618
            ],
            [
              -49.9337,
              -28.9658
            ],
            [
              -49.9309,
              -28.9759
            ],
            [
              -49.9425,
              -28.9822
            ],
            [
              -49.9463,
              -28.9951
            ],
            [
              -49.9574,
              -29.0121
            ],
            [
              -49.966,
              -29.0217
            ],
            [
              -49.9414,
              -29.0213
            ],
            [
              -49.9461,
              -29.0308
            ],
            [
              -49.9563,
              -29.0352
            ],
            [
              -49.9612,
              -29.0438
            ],
            [
              -49.961,
              -29.0508
            ],
            [
              -49.9772,
              -29.0588
            ],
            [
              -49.9898,
              -29.063
            ],
            [
              -49.994,
              -29.0696
            ],
            [
              -49.9625,
              -29.0653
            ],
            [
              -49.9576,
              -29.0682
            ],
            [
              -49.9377,
              -29.0835
            ],
            [
              -49.9321,
              -29.0848
            ],
            [
              -49.9174,
              -29.1002
            ],
            [
              -49.9042,
              -29.103
            ],
            [
              -49.8929,
              -29.101
            ],
            [
              -49.877,
              -29.0947
            ],
            [
              -49.8654,
              -29.1013
            ],
            [
              -49.8515,
              -29.1028
            ],
            [
              -49.8437,
              -29.1086
            ],
            [
              -49.832,
              -29.1218
            ],
            [
              -49.8347,
              -29.1074
            ],
            [
              -49.8341,
              -29.0952
            ],
            [
              -49.8248,
              -29.0887
            ],
            [
              -49.8217,
              -29.0801
            ],
            [
              -49.8051,
              -29.084
            ],
            [
              -49.7978,
              -29.0734
            ],
            [
              -49.7986,
              -29.0682
            ],
            [
              -49.7432,
              -29.0393
            ]
          ]
        ]
      },
      "properties": {
        "codarea": "4208708",
        "nome": "Jacinto Machado",
        "ibge_code": "4208708",
        "uf": "SC"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -49.7327,
              -28.8041
            ],
            [
              -49.7447,
              -28.7974
            ],
            [
              -49.7677,
              -28.7803
            ],
            [
              -49.7775,
              -28.7596
            ],
            [
              -49.7989,
              -28.7517
            ],
            [
              -49.797,
              -28.7366
            ],
            [
              -49.7982,
              -28.7147
            ],
            [
              -49.8236,
              -28.7203
            ],
            [
              -49.8263,
              -28.716
            ],
            [
              -49.8402,
              -28.7131
            ],
            [
              -49.8499,
              -28.7056
            ],
            [
              -49.8694,
              -28.701
            ],
            [
              -49.8727,
              -28.7154
            ],
            [
              -49.868,
              -28.722
            ],
            [
              -49.8833,
              -28.7377
            ],
            [
              -49.8918,
              -28.7392
            ],
            [
              -49.8811,
              -28.7223
            ],
            [
              -49.8933,
              -28.7229
            ],
            [
              -49.9049,
              -28.7185
            ],
            [
              -49.9079,
              -28.7138
            ],
            [
              -49.926,
              -28.7183
            ],
            [
              -49.9347,
              -28.7257
            ],
            [
              -49.9314,
              -28.7379
            ],
            [
              -49.9217,
              -28.7455
            ],
            [
              -49.9276,
              -28.7538
            ],
            [
              -49.937,
              -28.7567
            ],
            [
              -49.9457,
              -28.7519
            ],
            [
              -49.9534,
              -28.758
            ],
            [
              -49.9508,
              -28.7633
            ],
            [
              -49.9613,
              -28.7722
            ],
            [
              -49.9622,
              -28.7776
            ],
            [
              -49.9575,
              -28.7988
            ],
            [
              -49.9661,
              -28.8198
            ],
            [
              -49.9647,
              -28.8284
            ],
            [
              -49.9578,
              -28.8291
            ],
            [
              -49.9621,
              -28.8535
            ],
            [
              -49.9571,
              -28.8618
            ],
            [
              -49.9687,
              -28.8697
            ],
            [
              -49.9671,
              -28.8767
            ],
            [
              -49.9568,
              -28.8704
            ],
            [
              -49.9495,
              -28.8757
            ],
            [
              -49.9509,
              -28.8935
            ],
            [
              -49.9515,
              -28.9005
            ],
            [
              -49.9583,
              -28.9024
            ],
            [
              -49.9651,
              -28.9255
            ],
            [
              -49.9564,
              -28.929
            ],
            [
              -49.9598,
              -28.9356
            ],
            [
              -49.9557,
              -28.9489
            ],
            [
              -49.9562,
              -28.9408
            ],
            [
              -49.9472,
              -28.9361
            ],
            [
              -49.9492,
              -28.9246
            ],
            [
              -49.939,
              -28.9201
            ],
            [
              -49.9305,
              -28.9211
            ],
            [
              -49.9212,
              -28.9097
            ],
            [
              -49.9067,
              -28.9009
            ],
            [
              -49.8963,
              -28.89
            ],
            [
              -49.8876,
              -28.8886
            ],
            [
              -49.8795,
              -28.8824
            ],
            [
              -49.8678,
              -28.88
            ],
            [
              -49.7923,
              -28.8538
            ],
            [
              -49.7492,
              -28.8314
            ],
            [
              -49.7449,
              -28.8256
            ],
            [
              -49.7462,
              -28.8175
            ],
            [
              -49.7327,
              -28.8041
            ]
          ]
        ]
      },
      "properties": {
        "codarea": "4218103",
        "nome": "Timbé do Sul",
        "ibge_code": "4218103",
        "uf": "SC"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -49.8402,
              -28.7131
            ],
            [
              -49.8263,
              -28.716
            ],
            [
              -49.8236,
              -28.7203
            ],
            [
              -49.7982,
              -28.7147
            ],
            [
              -49.797,
              -28.7366
            ],
            [
              -49.7989,
              -28.7517
            ],
            [
              -49.7775,
              -28.7596
            ],
            [
              -49.7677,
              -28.7803
            ],
            [
              -49.7447,
              -28.7974
            ],
            [
              -49.7327,
              -28.8041
            ],
            [
              -49.7231,
              -28.8072
            ],
            [
              -49.7029,
              -28.844
            ],
            [
              -49.6973,
              -28.8445
            ],
            [
              -49.6927,
              -28.8523
            ],
            [
              -49.6767,
              -28.8682
            ],
            [
              -49.6713,
              -28.8259
            ],
            [
              -49.6573,
              -28.8265
            ],
            [
              -49.6502,
              -28.8199
            ],
            [
              -49.6626,
              -28.8077
            ],
            [
              -49.6634,
              -28.7942
            ],
            [
              -49.6692,
              -28.7897
            ],
            [
              -49.6641,
              -28.7763
            ],
            [
              -49.6636,
              -28.7684
            ],
            [
              -49.67,
              -28.7539
            ],
            [
              -49.6738,
              -28.7439
            ],
            [
              -49.6814,
              -28.7355
            ],
            [
              -49.6735,
              -28.7289
            ],
            [
              -49.6749,
              -28.7189
            ],
            [
              -49.6737,
              -28.703
            ],
            [
              -49.676,
              -28.6969
            ],
            [
              -49.6869,
              -28.6868
            ],
            [
              -49.6971,
              -28.6838
            ],
            [
              -49.7119,
              -28.6655
            ],
            [
              -49.7076,
              -28.6485
            ],
            [
              -49.7101,
              -28.6403
            ],
            [
              -49.7041,
              -28.63
            ],
            [
              -49.7159,
              -28.6238
            ],
            [
              -49.7443,
              -28.6243
            ],
            [
              -49.757,
              -28.6273
            ],
            [
              -49.7566,
              -28.616
            ],
            [
              -49.7789,
              -28.6295
            ],
            [
              -49.7843,
              -28.6244
            ],
            [
              -49.7826,
              -28.6098
            ],
            [
              -49.7981,
              -28.6177
            ],
            [
              -49.7982,
              -28.624
            ],
            [
              -49.8075,
              -28.6284
            ],
            [
              -49.8088,
              -28.6353
            ],
            [
              -49.8166,
              -28.6381
            ],
            [
              -49.8153,
              -28.6485
            ],
            [
              -49.8108,
              -28.6519
            ],
            [
              -49.8246,
              -28.6657
            ],
            [
              -49.8392,
              -28.6665
            ],
            [
              -49.8404,
              -28.6761
            ],
            [
              -49.8369,
              -28.6809
            ],
            [
              -49.838,
              -28.69
            ],
            [
              -49.8341,
              -28.6933
            ],
            [
              -49.8425,
              -28.7063
            ],
            [
              -49.8402,
              -28.7131
            ]
          ]
        ]
      },
      "properties": {
        "codarea": "4211256",
        "nome": "Morro Grande",
        "ibge_code": "4211256",
        "uf": "SC"
      }
    }
  ]
};
