#!/usr/bin/env node
import {readFile, writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {mergeProducts, normalizeReport} from '../web/report-data.mjs';

export const GROUPS=['neigungssensoren','fusspedale','potentiometer','seilzugsensoren','drehgeber'];

export function buildSnapshot(reports, generatedAt, sourceRun) {
  let products=[];
  for (const group of GROUPS) {
    const report=reports[group];
    if(!Array.isArray(report)||!report.length)throw new Error(`Leerer oder fehlender Bericht: ${group}`);
    const rows=normalizeReport(report);
    if(rows.some(row=>row.productGroup!==group))
      throw new Error(`Produktgruppe in Bericht ${group} stimmt nicht mit der Vorlage überein.`);
    products=mergeProducts(products,rows);
  }
  if(products.length!==Object.values(reports).reduce((sum,rows)=>sum+rows.length,0))
    throw new Error('Doppelte Product Keys im Gesamtbericht.');
  return {generatedAt,sourceRun,products};
}

async function main() {
  const [folder,run]=process.argv.slice(2);
  if(!folder||!run)throw new Error('Aufruf: node scripts/update-snapshot.mjs <Berichtsordner> <GitHub-Laufnummer>');
  const entries=await Promise.all(GROUPS.map(async group=>[group,JSON.parse(await readFile(`${folder}/${group}.json`,'utf8'))]));
  const snapshot=buildSnapshot(Object.fromEntries(entries),new Date().toISOString(),run);
  await writeFile('web/data/snapshot.json',JSON.stringify(snapshot,null,2)+'\n');
  console.log(`Prüfstand: ${snapshot.products.length} Produkte, ${GROUPS.length} Produktgruppen.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)
  main().catch(error=>{console.error(error);process.exitCode=1;});
