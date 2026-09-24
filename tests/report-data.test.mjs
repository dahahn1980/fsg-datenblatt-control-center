import test from 'node:test';
import assert from 'node:assert/strict';
import {inferGroup, mergeProducts, normalizeReport} from '../web/report-data.mjs';

test('Auswahlberichte aus verschiedenen Produktgruppen bleiben gemeinsam sichtbar', () => {
  const inclination = normalizeReport([{productKey:'pe-mems-x-can-gs70', title:'PE-MEMS-X-CAN-GS70', templateVersion:'inclination-v1.7'}]);
  const rotary = normalizeReport([{productKey:'mh613-mu-u', title:'MH613-MU-u', templateVersion:'rotary-encoder-preview-v0.1', previewCreated:true}]);
  const both = mergeProducts(inclination, rotary);
  assert.deepEqual(both.map(row => row.productGroup), ['neigungssensoren', 'drehgeber']);
  assert.equal(both[1].status, 'vorschau_erstellt');
  assert.equal(inferGroup({template:{key:'rotary-encoder'}}), 'drehgeber');
});

test('Neuerer Bericht ersetzt genau dasselbe Produkt, auch mit anderer Schreibweise', () => {
  const old = normalizeReport([{productKey:'MH613-MU-u', templateVersion:'rotary-encoder-preview-v0.1', errors:['Zeichnung fehlt']}]);
  const current = normalizeReport([{productKey:'mh613-mu-u', templateVersion:'rotary-encoder-preview-v0.1', changed:true}]);
  const merged = mergeProducts(old, current);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].errors.length, 0);
  assert.equal(merged[0].status, 'freigegeben');
});

test('Fehlerhafter Bericht wird vor dem Zusammenführen abgewiesen', () => {
  assert.throws(() => normalizeReport({products:[]}), /Liste/);
  assert.throws(() => normalizeReport([{title:'Ohne Product Key'}]), /Product Key/);
});
