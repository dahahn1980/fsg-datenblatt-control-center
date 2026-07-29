# FSG Datenblatt Control Center

Version 2 der FSG-Datenblattplattform für transparente Prüfung, Auswahl, Vorschau, Freigabe und Veröffentlichung von Produktdatenblättern.

## Sicherheitsmodell

- **V1 bleibt Produktionssystem:** `dahahn1980/fsg-datenblatt-system`
- **V2 ist die Weiterentwicklung:** dieses Repository
- Die vier freigegebenen Vorlagen werden nicht im V2-Projekt verändert.
- Die PDF-Engine ist als commitgenau fixiertes Git-Submodule eingebunden.
- Produktinhalte stammen weiterhin ausschließlich aus Wix CMS.
- Die aktuelle Oberfläche erzeugt ausschließlich Vorschau-Aufträge; `publish` ist technisch auf `false` festgelegt.

## Freigegebene V1-Referenzen

| Produktgruppe | Vorlagenversion |
|---|---|
| Neigungssensoren | `inclination-v1.7` |
| Fußpedale | `foot-pedal-v1.6` |
| Potentiometer | `potentiometer-v1.1` |
| Seilzugsensoren | `cable-extension-v1.11` |

## Control Center starten

Die Oberfläche liegt vollständig statisch unter `web/`:

```bash
python -m http.server 8000 --directory web
```

Danach `http://localhost:8000` öffnen. Ein aktueller Dry-Run-Report kann über **Report laden** direkt im Browser eingelesen werden. Die Datei wird nur lokal verarbeitet und nicht hochgeladen.

## Bedienablauf

1. Report laden oder vorhandene Startdaten verwenden.
2. Nach Produktgruppe, Status, Änderung oder Produktname filtern.
3. Gewünschte Produkte per Checkbox auswählen.
4. Fehlerhafte Produkte werden automatisch von Sammelauswahlen ausgeschlossen.
5. **Render-Auftrag erzeugen** öffnet eine vollständige Vorschau des Auftrags.
6. Auftrag als JSON herunterladen und anschließend kontrolliert an den GitHub-Workflow übergeben.

Der erzeugte Auftrag enthält Produktnamen, Product Keys, Vorlagenversionen und Source Hashes. Die Batchgröße ist auf maximal 20 Produkte begrenzt.

## Architektur

```text
web/                    browserbasierte Produktzentrale
control_center/
  workflow/             Prozesszustände
  reports/              Prüfberichte
  wix/                  Wix-Schnittstelle
  history/              Änderungsverlauf
  approvals/            Freigaben
renderer/
  engine/                unveränderte V1-PDF-Engine
config/                  Freeze- und Engine-Lockdateien
tests/                   Sicherheits- und Architekturtests
```

## Aktueller Stand

- V1-Produktionsstand abgesichert
- V2 vollständig getrennt
- PDF-Engine unverändert übernommen
- Produktliste mit Checkboxen und Statusanzeige umgesetzt
- Suche, Filter und Detailansicht umgesetzt
- Import vorhandener Dry-Run-Reports umgesetzt
- kontrollierter Render-Plan als JSON umgesetzt
- fehlerhafte Produkte und leere Auswahlen technisch blockiert
- direkte Wix-Veröffentlichung weiterhin deaktiviert
