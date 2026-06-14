export const categories = [
  { id: 'Telas', name: 'Telas' },
  { id: 'Cuerinas', name: 'Cuerinas' },
  { id: 'Insumos', name: 'Insumos' },
  { id: 'Espumas', name: 'Espumas' }
];

export const applications = [
  { id: 'Living', name: 'Living & Decoración' },
  { id: 'Automotriz', name: 'Automotriz' },
  { id: 'Náutica', name: 'Náutica & Exterior' }
];

export const products = [
  {
    id: 'telas-velvet-premium',
    name: 'Velvet Premium París',
    code: 'TEL-VEL-001',
    category: 'Telas',
    applications: ['Living'],
    description: 'Pana premium con proceso antimanchas de textura ultra suave y brillo elegante. Ideal para sofás, sillones de alta gama, cabeceros de cama y almohadones de living.',
    price: 'Consultar',
    specs: [
      { label: 'Ancho', value: '1.45 mts' },
      { label: 'Composición', value: '100% Poliéster con respaldo reforzado' },
      { label: 'Resistencia', value: '50.000 ciclos Martindale' },
      { label: 'Tratamiento', value: 'Repelente a líquidos (Antimanchas)' }
    ],
    variants: [
      { name: 'Azul Real', hex: '#002060' },
      { name: 'Gris Plata', hex: '#BEBEBE' },
      { name: 'Esmeralda', hex: '#0B4D3A' },
      { name: 'Beige Arena', hex: '#E1D3BE' },
      { name: 'Bordeaux', hex: '#630B1C' },
      { name: 'Toscana (Siena)', hex: '#D27D2D' }
    ]
  },
  {
    id: 'telas-chenille-rustico',
    name: 'Chenille Rústico Premium',
    code: 'TEL-CHE-002',
    category: 'Telas',
    applications: ['Living'],
    description: 'Chenille de trama cerrada súper resistente y gruesa, con tacto agradable y excelente cuerpo. Apto para el uso diario intensivo en salas de estar familiares.',
    price: 'Consultar',
    specs: [
      { label: 'Ancho', value: '1.40 mts' },
      { label: 'Composición', value: '80% Algodón, 20% Poliéster' },
      { label: 'Resistencia', value: '35.000 ciclos Martindale' }
    ],
    variants: [
      { name: 'Gris Oscuro', hex: '#4A4A4A' },
      { name: 'Crudo Natur', hex: '#F5F2EB' },
      { name: 'Tostado', hex: '#B89B72' },
      { name: 'Grafito', hex: '#2E3033' }
    ]
  },
  {
    id: 'cuerinas-nautica-marine',
    name: 'Cuerina Náutica Marine Pro',
    code: 'CUE-NAU-001',
    category: 'Cuerinas',
    applications: ['Náutica', 'Automotriz'],
    description: 'Cuerina náutica de máxima calidad con tratamiento UV, antihongos y antibacteriano. Resistente a la salinidad, cloro y al desgaste intemperie severo. Perfecta para lanchas, yates y mobiliario exterior expuesto.',
    price: 'Consultar',
    specs: [
      { label: 'Ancho', value: '1.40 mts' },
      { label: 'Protección', value: 'Filtro UV grado 7 (ISO 105-B02)' },
      { label: 'Propiedades', value: 'Antihongos, Impermeable, Ignífugo' },
      { label: 'Respaldo', value: 'Soporte de jersey de poliéster de alta resistencia' }
    ],
    variants: [
      { name: 'Blanco Nieve', hex: '#FFFFFF' },
      { name: 'Azul Marino', hex: '#0A1B3A' },
      { name: 'Gris Titanium', hex: '#7D8491' },
      { name: 'Beige Sahara', hex: '#E6DEC9' },
      { name: 'Negro Profundo', hex: '#111111' }
    ]
  },
  {
    id: 'cuerinas-automotriz-carbon',
    name: 'Cuerina Automotriz Carbon Fiber Tech',
    code: 'CUE-AUT-002',
    category: 'Cuerinas',
    applications: ['Automotriz'],
    description: 'Cuerina de altísima resistencia diseñada específicamente para tapicería de autos, motos y volantes. Textura grabada estilo fibra de carbono tridimensional que brinda un aspecto deportivo y sofisticado.',
    price: 'Consultar',
    specs: [
      { label: 'Ancho', value: '1.40 mts' },
      { label: 'Textura', value: 'Simil Fibra de Carbono 3D' },
      { label: 'Resistencia', value: '100.000 ciclos (Martindale)' },
      { label: 'Elasticidad', value: 'Bidireccional para fácil moldeo' }
    ],
    variants: [
      { name: 'Negro Carbono', hex: '#1C1C1E' },
      { name: 'Grafito Oscuro', hex: '#3A3A3C' },
      { name: 'Rojo Sport', hex: '#C0392B' },
      { name: 'Gris Metal', hex: '#8E8E93' }
    ]
  },
  {
    id: 'cuerina-talampaya-premium',
    name: 'Cuerina Talampaya Original',
    code: 'CUE-TAL-003',
    category: 'Cuerinas',
    applications: ['Living', 'Automotriz'],
    description: 'La cuerina clásica de referencia en el mercado. Excelente brillo, flexibilidad y resistencia para tapicería general de sillas, banquetas, butacas de oficinas e interiores automotores.',
    price: 'Consultar',
    specs: [
      { label: 'Ancho', value: '1.40 mts' },
      { label: 'Soporte', value: 'Jersey de algodón afelpado' },
      { label: 'Espesor', value: '0.90 mm' }
    ],
    variants: [
      { name: 'Marrón Chocolate', hex: '#3E2723' },
      { name: 'Negro Satinado', hex: '#121212' },
      { name: 'Tiza / Hueso', hex: '#F5F5F0' },
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Suela', hex: '#A0522D' },
      { name: 'Rojo Borgoña', hex: '#800020' }
    ]
  },
  {
    id: 'espuma-alta-densidad-30',
    name: 'Espuma Poliuretano Alta Densidad 30 kg/m³',
    code: 'ESP-AD-030',
    category: 'Espumas',
    applications: ['Living', 'Automotriz', 'Náutica'],
    description: 'Placas de espuma de poliuretano de primera calidad con densidad real de 30 kg/m³. Diseñada para soportar alto tránsito sin perder su forma original. Apta para asientos de sofás, butacas y colchonetas de barcos.',
    price: 'Consultar',
    specs: [
      { label: 'Densidad', value: '30 kg/m³ real' },
      { label: 'Medidas habituales', value: '1.90 x 1.40 mts / Cortes a medida' },
      { label: 'Durabilidad', value: 'Excelente recuperación (Indefectible)' }
    ],
    variants: [
      { name: 'Placa Estándar', hex: '#E3F2FD' }
    ]
  },
  {
    id: 'espuma-soft-premium',
    name: 'Espuma Soft Especial Confort 24 kg/m³',
    code: 'ESP-SOF-024',
    category: 'Espumas',
    applications: ['Living'],
    description: 'Espuma con estructura celular abierta de tacto ultra soft. Brinda un efecto rebote increíble y adaptabilidad ergonómica. Utilizada principalmente en respaldos de sillones y capas superiores de cojines de asientos.',
    price: 'Consultar',
    specs: [
      { label: 'Densidad', value: '24 kg/m³ Soft' },
      { label: 'Sensación', value: 'Hipoalergénica y ergonómica' }
    ],
    variants: [
      { name: 'Placa Soft Celeste', hex: '#E0F7FA' }
    ]
  },
  {
    id: 'insumos-hilo-nautico',
    name: 'Hilo de Nylon Alta Resistencia N° 20/40',
    code: 'INS-HIL-001',
    category: 'Insumos',
    applications: ['Náutica', 'Automotriz'],
    description: 'Hilo de nylon bondeado de alta tenacidad con protección lubricada para costuras que soportan tracción severa, agentes climáticos y agua de mar. Perfecto para lonas, carpas y tapicería exterior.',
    price: 'Consultar',
    specs: [
      { label: 'Presentación', value: 'Bobinas de 250g / 500g' },
      { label: 'Tratamiento', value: 'Termofijado antideshilachado' }
    ],
    variants: [
      { name: 'Negro', hex: '#000000' },
      { name: 'Blanco', hex: '#FFFFFF' },
      { name: 'Beige', hex: '#D2B48C' },
      { name: 'Gris Oscuro', hex: '#555555' }
    ]
  },
  {
    id: 'insumos-pegamento-contacto',
    name: 'Adhesivo de Contacto Premium Fortex',
    code: 'INS-PEG-002',
    category: 'Insumos',
    applications: ['Living', 'Automotriz', 'Náutica'],
    description: 'Pegamento de contacto de alto rendimiento para pegar espumas, cueros, maderas, alfombras y telas. Rápido agarre inicial, excelente flexibilidad de pegado y resistencia a altas temperaturas.',
    price: 'Consultar',
    specs: [
      { label: 'Presentación', value: 'Lata 1L / 4L / 18L' },
      { label: 'Resistencia Térmica', value: 'Hasta 90°C' }
    ],
    variants: [
      { name: 'Estándar Ámbar', hex: '#FFD54F' }
    ]
  },
  {
    id: 'insumos-tachas-oxido',
    name: 'Tachas Metálicas Decorativas Capitoné',
    code: 'INS-TAC-003',
    category: 'Insumos',
    applications: ['Living'],
    description: 'Tachas metálicas premium para terminaciones de sillones y sillas. Terminaciones pulidas y cabezas reforzadas para colocación uniforme sin doblarse.',
    price: 'Consultar',
    specs: [
      { label: 'Diámetro', value: '9 mm / 11 mm' },
      { label: 'Presentación', value: 'Cajas de 1000 unidades' }
    ],
    variants: [
      { name: 'Oro Viejo / Bronce', hex: '#CD7F32' },
      { name: 'Plata Brillante', hex: '#C0C0C0' },
      { name: 'Óxido Rústico', hex: '#8B4513' }
    ]
  }
];
