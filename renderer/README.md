# Renderer

`renderer/engine` ist ein Git-Submodule auf den freigegebenen V1-Commit `e572018baa039154b2eebaff21cd0f111a5fa93f`.

Die Engine wird in dieser Ausbaustufe nicht verändert. Eine spätere V2-Integration erfolgt ausschließlich über einen Adapter außerhalb des Submodules. Zum vollständigen Checkout:

```bash
git clone --recurse-submodules https://github.com/dahahn1980/fsg-datenblatt-control-center.git
```

Nachträglich:

```bash
git submodule update --init --recursive
```

Ein Wechsel des Engine-Commits erfordert eine bewusste Änderung von `config/renderer-engine.lock.json`, Regressionstests aller vier Referenzprodukte und eine neue Freigabe.
