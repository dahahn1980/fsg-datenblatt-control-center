# Architektur – FSG Datenblatt Control Center V2

## Ziel

V2 trennt die bewährte PDF-Erzeugung von der neuen Prozesssteuerung. Die PDF-Engine bleibt unverändert. Das Control Center entscheidet nur, welche Produkte wann geprüft, gerendert, freigegeben und veröffentlicht werden.

## Module

### `control_center/dashboard`

Stellt die Produktliste bereit. Jede Zeile enthält Produktname, Produktgruppe, aktuellen Status, Fehler, letzte PDF-Version und eine Checkbox für Aktionen.

### `control_center/workflow`

Verwaltet den Zustandsautomaten:

`nicht_geprueft → geprueft → freigegeben → vorschau_erstellt → veroeffentlicht`

Fehlerzustände bleiben pro Produkt isoliert und stoppen nicht automatisch andere Produkte.

### `control_center/reports`

Erzeugt maschinenlesbare JSON-Berichte und eine menschenlesbare HTML-Ansicht.

### `control_center/wix`

Kapselt die Wix-Kommunikation. Lesende und schreibende Operationen werden getrennt. Produktinhalte stammen ausschließlich aus Wix CMS.

### `control_center/history`

Speichert Statuswechsel, Quellhash, Vorlagenversion, Erstellungsdatum und Veröffentlichungsresultat.

### `control_center/approvals`

Speichert Freigaben, Bearbeiter, Zeitpunkt und Begründung.

### `renderer/engine`

Unveränderlicher Snapshot der freigegebenen V1-PDF-Engine. Die Einbindung ist auf Commit `e572018baa039154b2eebaff21cd0f111a5fa93f` fixiert.

### `renderer/adapter`

Spätere stabile Schnittstelle zwischen Control Center und V1-Engine. V2 darf nicht direkt in die Engine eingreifen.

## Sicherheitsgrenzen

1. V1 und V2 besitzen getrennte Repositories.
2. V2 veröffentlicht zunächst nicht nach Wix.
3. Die PDF-Engine ist commitgenau fixiert.
4. Neue Prozesslogik verändert keine Vorlagen.
5. Jede Renderer-Aktualisierung muss bewusst über die Lockdatei erfolgen.
6. CSV- und XLSX-Dateien sind keine Laufzeitquelle.

## Nächste Ausbaustufe

Die erste Oberfläche zeigt alle Produkte einer Produktgruppe als Tabelle mit Checkboxen. Aktionen werden nur auf die sichtbare, markierte Auswahl angewendet.
