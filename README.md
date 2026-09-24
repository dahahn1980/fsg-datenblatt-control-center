# FSG Datenblatt Control Center

Version 2 der FSG-Datenblattplattform für transparente Prüfung, Auswahl, Vorschau, Freigabe und Veröffentlichung von Produktdatenblättern.

## Sicherheitsmodell

- **V1 bleibt Produktionssystem:** `dahahn1980/fsg-datenblatt-system`
- **V2 ist die Weiterentwicklung:** dieses Repository
- Die fünf produktiven Vorlagen werden im Control Center nicht verändert.
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
| Drehgeber | `rotary-encoder-v1.0` |

## Control Center starten

Die Oberfläche liegt vollständig statisch unter `web/`:

```bash
python -m http.server 8000 --directory web
```

Danach `http://localhost:8000` öffnen. Die GitHub-Pages-Seite liegt unter
`https://dahahn1980.github.io/fsg-datenblatt-control-center/`.

Die Seite lädt bei jedem Öffnen den eingecheckten Gesamtprüfstand aus
`web/data/snapshot.json`. Er enthält fünf Produktgruppen mit Zeitstempel und
stammt aus einem reinen Wix-Prüflauf. Eine neue GitHub-Prüfung aktualisiert die
Pages-Seite erst, nachdem ihr Ergebnis ins Control-Center-Repository übernommen
und bereitgestellt wurde. Lokale Berichte bleiben möglich und gelten nur dann
zusätzlich, wenn sie neuer als der zentrale Prüfstand sind.

## Bedienablauf

1. Im Repository `fsg-datenblatt-system` unter **Actions → FSG Datenblatt-Zentrale**
   die gewünschte Produktgruppe, den Umfang `alle` und die Aktion `pruefen`
   starten. Dazu ist kein Product Key erforderlich.
2. Im Lauf unter **Artifacts** das Ergebnis herunterladen und daraus
   `reports/dry-run.json` (bzw. nach einer Veröffentlichung `reports/publish.json`)
   entpacken.
3. In der Kontrollzentrale **Berichte hinzufügen** wählen. Die importierten
   Produkte ergänzen den zentralen Prüfstand; ein Bericht für denselben
   Product Key ersetzt dessen älteren Stand.
4. Ein eigener Import bleibt nur im jeweiligen Browser gespeichert. Erscheint
   ein neuerer zentraler Prüfstand, wird dieser beim nächsten Öffnen bevorzugt.
   **Importe löschen** stellt den aktuellen zentralen Prüfstand wieder her.
5. Nach Produktgruppe, Status, Änderung oder Produktname filtern und bis zu 20
   Produkte **einer** Produktgruppe per Checkbox auswählen. Fehlerhafte
   Produkte können nicht ausgewählt werden.
6. Aktion auswählen, **Product Keys kopieren**, den dann verlinkten Workflow
   **FSG Datenblatt-Auswahl** öffnen,
   gleiche Aktion und Produktgruppe einstellen und die Keys in `product_keys`
   einfügen. Die Kontrollzentrale startet keinen Wix-Upload selbst.

Der zentrale Prüfstand dokumentiert den Zeitpunkt der letzten Prüfung.
Ein neues PDF oder ein Wix-Upload erscheinen erst in der Übersicht, wenn ein
entsprechender Bericht hinzugefügt oder ein neuer zentraler Prüfstand erzeugt
wurde. Das reine Anzeigen der Seite liest Wix nicht direkt.

## Zentralen Prüfstand erneuern

Im Produktionsrepository `fsg-datenblatt-system` den Workflow
**Control Center – aktueller Gesamtbericht** ausführen. Er liest alle fünf
Gruppen und lädt ein Artefakt mit fünf JSON-Berichten hoch. Das Archiv entpacken
und im Control-Center-Repository den Prüfstand generieren:

```bash
node scripts/update-snapshot.mjs /pfad/zu/den/entpackten/berichten <GitHub-Laufnummer>
node --test tests/*.test.mjs
```

`web/data/snapshot.json` über einen Branch/PR übernehmen. GitHub Pages stellt
die Änderung nach dem Merge bereit. Das Skript verlangt je Gruppe einen
nichtleeren Bericht und prüft Produktgruppe und eindeutige Product Keys.
Es speichert nur die für die Übersicht nötigen Werte (keine Wix-Zugangsdaten
oder kompletten Rohberichte).

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
- Übergabe der kopierten Product Keys an den bestehenden Auswahlworkflow umgesetzt
- mehrere Berichte, einschließlich Drehgeber, lokal zusammenführbar
- fehlerhafte Produkte und leere Auswahlen technisch blockiert
- direkte Wix-Veröffentlichung weiterhin deaktiviert
