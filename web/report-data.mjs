const GROUPS = [
  ['rotary', 'drehgeber'],
  ['cable', 'seilzugsensoren'],
  ['inclination', 'neigungssensoren'],
  ['foot', 'fusspedale'],
  ['potentiometer', 'potentiometer'],
];

export function inferGroup(item) {
  const explicit = item.productGroup || item.groupKey || item.group;
  if (explicit) return String(explicit);
  const version = String(item.templateVersion || item.template?.version || item.template?.key || '').toLowerCase();
  return GROUPS.find(([needle]) => version.includes(needle))?.[1] || 'unbekannt';
}

export function normalizeReport(data) {
  if (!Array.isArray(data)) throw new Error('Der Bericht muss eine Liste von Produkten sein.');
  return data.map((item, index) => {
    if (!item || !String(item.productKey || '').trim()) {
      throw new Error(`Bei Produkt ${index + 1} fehlt der Product Key.`);
    }
    const errors = Array.isArray(item.errors) ? item.errors : [];
    return {
      productKey: String(item.productKey).trim(),
      title: item.title || item.productKey,
      productGroup: inferGroup(item),
      status: errors.length ? 'fehler'
        : item.published && item.verified ? 'veroeffentlicht'
        : item.previewCreated || item.pdf ? 'vorschau_erstellt'
        : item.criticalApprovalRequired ? 'pruefung_erforderlich'
        : item.changed ? 'freigegeben' : 'geprueft',
      selected: false,
      changed: Boolean(item.changed),
      errors,
      pdf: item.pdf || null,
      sourceHash: item.sourceHash || null,
      templateVersion: item.templateVersion || null,
    };
  });
}

export function mergeProducts(existing, incoming) {
  const key = row => `${row.productGroup.toLowerCase()}:${row.productKey.toLowerCase()}`;
  const merged = new Map(existing.map(row => [key(row), {...row, selected: false}]));
  for (const row of incoming) merged.set(key(row), {...row, selected: false});
  return [...merged.values()];
}
