export const services = [
  { id: 'CIVIL', type: 'CIVIL', title: 'Civil Engineering', desc: 'From site analysis to structural completion, our civil engineering division ensures your project adheres to the highest standards of safety, compliance, and efficiency, minimizing risk for developers and architects.' },
  { id: 'EXCAV', type: 'EXCAV', title: 'Deep Excavation', desc: 'Leveraging our fleet of EX-380 heavy machinery, we execute large-scale site preparation, trenching, and mass earthworks with speed and precision, ensuring your project timeline is met.' },
  { id: 'FNDTN', type: 'FNDTN', title: 'Foundation Work', desc: 'Our core specialty. We provide expert piling, anchoring, and shotcreting services that guarantee long-term structural integrity for the most ambitious architectural designs.' },
  { id: 'ROAD', type: 'ROAD', title: 'Road Construction', desc: 'Grading, surface preparation, and asphalt laying for industrial logistics.' },
] as const;

export const stats = [
  { label: 'Years Experience', value: 20, suffix: '+' },
  { label: 'Expert Team', value: 185, suffix: '+' },
  { label: 'Client Satisfaction', value: 100, suffix: '%' },
];

export const aboutFeatures: { icon: 'engineer' | 'building' | 'blueprint'; text: string }[] = [
  { icon: 'engineer', text: 'Expert<br/>Engineers' },
  { icon: 'building', text: 'Quality<br/>Construction' },
  { icon: 'blueprint', text: 'Detailed<br/>Plans' },
];
