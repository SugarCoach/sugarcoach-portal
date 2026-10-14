export default function Treatment() {
  const sections = [
    {
      title: 'Insulina Basal',
      items: [
        { label: 'Tipo', value: 'Glargina U300' },
        { label: 'Dosis', value: '24 unidades' },
        { label: 'Horario', value: '22:00 hrs' },
      ],
    },
    {
      title: 'Insulina de Corrección',
      items: [
        { label: 'Tipo', value: 'Aspart' },
        { label: 'Ratio', value: '1:10 (1 U por 10g CHO)' },
        { label: 'Factor corrección', value: '1 U por 50 mg/dL' },
      ],
    },
    {
      title: 'Umbrales Glucémicos',
      items: [
        { label: 'Hipoglucemia', value: '< 70 mg/dL' },
        { label: 'Objetivo', value: '100 - 180 mg/dL' },
        { label: 'Hiperglucemia', value: '> 250 mg/dL' },
      ],
    },
    {
      title: 'Objetivos de Control',
      items: [
        { label: 'HbA1c meta', value: '< 7%' },
        { label: 'Tiempo en rango', value: '> 70%' },
        { label: 'Variabilidad', value: '< 35%' },
      ],
    },
    {
      title: 'Notas Médicas',
      items: [
        { label: 'Última actualización', value: '15 de septiembre 2024' },
        { label: 'Doctor', value: 'Dra. Ana García' },
        { label: 'Próxima revisión', value: '15 de noviembre 2024' },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-6">
      {sections.map((section, idx) => (
        <div key={idx} className="bg-sc-surface rounded-sc-lg shadow-sc-subtle p-6">
          <h3 className="text-sm font-semibold text-sc-text-primary mb-4 pb-3 border-b border-sc-border">
            {section.title}
          </h3>
          <div className="space-y-4">
            {section.items.map((item, itemIdx) => (
              <div key={itemIdx}>
                <div className="text-xs text-sc-text-secondary font-semibold uppercase tracking-wide mb-1">
                  {item.label}
                </div>
                <div className="text-sm text-sc-text-primary">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
