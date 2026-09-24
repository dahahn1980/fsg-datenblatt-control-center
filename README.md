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

Danach `http://localhost:8000` öffnen. Die GitHub-Pages-Seite liegt unter
`https://dahahn1980.github.io/fsg-datenblatt-control-center/`.

Die Seite hat **keinen automatischen Wix-Abgleich**. Ohne eigene Importe zeigt sie
lediglich die eingecheckten Beispielprodukte in `web/data/products.json` (derzeit
Neigungssensoren). Ein neuer GitHub-Actions-Lauf aktualisiert diese Datei nicht.

## Bedienablauf

1. Im Repository `fsg-datenblatt-system` unter **Actions → FSG Datenblatt-Zentrale**
   die gewünschte Produktgruppe, den Umfang `alle` und die Aktion `pruefen`
   starten. Dazu ist kein Product Key erforderlich.
2. Im Lauf unter **Artifacts** das Ergebnis herunterladen und daraus
   `reports/dry-run.json` (bzw. nach einer Veröffentlichung `reports/publish.json`)
   entpacken.
3. In der Kontrollzentrale **Berichte hinzufügen** wählen; mehrere JSON-Dateien
   dürfen zugleich ausgewählt werden. Der erste Import entfernt die alten
   Beispielprodukte, weitere Importe ergänzen andere Produktgruppen. Ein neuer
   Bericht für denselben Product Key ersetzt dessen älteren Stand.
4. Der zusammengeführte Stand bleibt **nur in diesem Browser auf diesem Gerät**
   gespeichert. Für aktuelle Wix-Daten muss ein neuer Actions-Bericht geladen
   werden; **Importe löschen** stellt den Beispielstand wieder her.
5. Nach Produktgruppe, Status, Änderung oder Produktname filtern und bis zu 20
   Produkte **einer** Produktgruppe per Checkbox auswählen. Fehlerhafte
   Produkte können nicht ausgewählt werden.
6. Aktion auswählen, **Product Keys kopieren**, den dann verlinkten Workflow
   **FSG Datenblatt-Auswahl** öffnen,
   gleiche Aktion und Produktgruppe einstellen und die Keys in `product_keys`
   einfügen. Die Kontrollzentrale startet keinen Wix-Upload selbst.

Die Startliste ist eine Demonstration, kein aktueller Produktionsstatus. Ein
hochgeladener Bericht verlässt den Browser nicht und aktualisiert auch nicht die
GitHub-Pages-Seite für andere Personen oder Geräte.

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
