# FSG Datenblatt Control Center

Version 2 der FSG-Datenblattplattform für transparente Prüfung, Auswahl, Vorschau, Freigabe und Veröffentlichung von Produktdatenblättern.

## Sicherheitsmodell

- **V1 bleibt Produktionssystem:** `dahahn1980/fsg-datenblatt-system`
- **V2 ist die Weiterentwicklung:** dieses Repository
- Die vier freigegebenen Vorlagen werden nicht im V2-Projekt verändert.
- Die PDF-Engine wird als unveränderlicher, auf einen Commit fixierter Git-Submodule-Snapshot eingebunden.
- Produktinhalte stammen weiterhin ausschließlich aus Wix CMS.

## Freigegebene V1-Referenzen

| Produktgruppe | Vorlagenversion |
|---|---|
| Neigungssensoren | `inclination-v1.7` |
| Fußpedale | `foot-pedal-v1.6` |
| Potentiometer | `potentiometer-v1.1` |
| Seilzugsensoren | `cable-extension-v1.11` |

## Zielarchitektur

```text
control_center/
  dashboard/      Produktliste, Checkboxen und Filter
  workflow/       Prozesszustände und Batch-Steuerung
  reports/        Prüf- und Ergebnisberichte
  wix/            lesende und schreibende Wix-Schnittstelle
  history/        Versionen und Änderungsverlauf
  approvals/      Freigaben und Begründungen
renderer/
  engine/         unveränderliche V1-PDF-Engine als Git-Submodule
  adapter/        spätere V2-Schnittstelle zur Engine
docs/             Architektur, Migration und Wiederherstellung
config/           Freeze- und Engine-Lockdateien
```

## Stand dieser Ausbaustufe

Die vereinbarten Punkte 1–4 sind vorbereitet:

1. V1-Produktionsstand ist eingefroren und dokumentiert.
2. V2-Repository ist getrennt angelegt.
3. Modulare Control-Center-Architektur ist eingerichtet.
4. PDF-Engine wird unverändert und commitgenau übernommen.

Die nächste Ausbaustufe ist die Produktliste mit Status, Checkboxen und kontrollierten Aktionen.
