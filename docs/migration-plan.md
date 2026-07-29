# Migrationsplan V1 → V2

## Phase 0 – abgeschlossen mit diesem Bootstrap

- V1-Produktionsstand dokumentiert und auf einen Commit fixiert.
- Neues Repository getrennt angelegt.
- Modulare V2-Verzeichnisstruktur definiert.
- V1-PDF-Engine unverändert als Submodule-Abhängigkeit vorgesehen.

## Phase 1 – Produktliste und Status

- Produktgruppen aus Wix lesen.
- Produkte tabellarisch darstellen.
- Checkbox pro Produkt.
- Filter für neu, geändert, fehlerhaft, aktuell und veröffentlicht.
- Keine Render- oder Schreibaktion ohne explizite Auswahl.

## Phase 2 – Prüfprozess

- Auswahl prüfen.
- Fehler je Produkt isolieren.
- Ergebnis als Status und Detailansicht darstellen.
- Wiederholung nur für fehlgeschlagene Produkte ermöglichen.

## Phase 3 – Vorschau

- Markierte, fehlerfreie Produkte an die unveränderte PDF-Engine übergeben.
- Vorschauen als Artefakte und in der Oberfläche verlinken.
- Noch keine Wix-Veröffentlichung.

## Phase 4 – Freigabe und Veröffentlichung

- Freigabe pro Produkt.
- Upload nur für markierte und freigegebene Produkte.
- Ergebnis nach Wix-Rücklesen verifizieren.
- Historie und Änderungsgrund protokollieren.

## Rückfallplan

V1 bleibt unangetastet. Falls V2 nicht produktionsreif ist, werden Datenblätter weiterhin über `dahahn1980/fsg-datenblatt-system` erzeugt. Die V2-Entwicklung erfordert deshalb keinen technischen Rollback in V1.
