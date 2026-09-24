import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSnapshot, GROUPS} from '../scripts/update-snapshot.mjs';

const reports=()=>Object.fromEntries(GROUPS.map((group,index)=>[
  group,[{productKey:`p-${index}`,title:`Produkt ${index}`,productGroup:group,templateVersion:`version-${index}`}]
]));

test('Gesamtprüfstand enthält alle Gruppen und Herkunft',()=>{
  const snapshot=buildSnapshot(reports(),'2026-09-24T13:00:00Z','36004010134');
  assert.equal(snapshot.products.length,5);
  assert.deepEqual(new Set(snapshot.products.map(p=>p.productGroup)),new Set(GROUPS));
  assert.equal(snapshot.sourceRun,'36004010134');
  assert.equal(snapshot.products[0].selected,false);
});

test('Fehlende Gruppen und doppelte Keys werden abgewiesen',()=>{
  const missing=reports();
  delete missing.drehgeber;
  assert.throws(()=>buildSnapshot(missing,'now','run'),/Leerer oder fehlender Bericht/);
  const duplicate=reports();
  duplicate.drehgeber.push({...duplicate.drehgeber[0]});
  assert.throws(()=>buildSnapshot(duplicate,'now','run'),/Doppelte Product Keys/);
});
