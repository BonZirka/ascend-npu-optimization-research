# Technical deck authoring

`technical-deck.mjs` builds the 23-slide technical revision with native PowerPoint text, shapes, connectors and tables through the Codex Artifact Tool. It retains speaker notes and source references. This is the source for `../ascend-optimization-technical.pptx`.

## Dependencies

Use Codex `load_workspace_dependencies` for the bundled Node executable, node_modules and Python executable. Set these paths as `RUNTIME_NODE`, `RUNTIME_NODE_MODULES` and `RUNTIME_PYTHON`. Set `PRESENTATIONS_SKILL_DIR` to the installed Presentations skill directory containing `container_tools/artifact_tool_utils.mjs` and its validators. The original build used Artifact Tool 2.8.146.

LibreOffice (`soffice`) exports the finalized PPTX to PDF. The design uses Arial and Courier New. The reviewed PDF embeds Liberation Sans/Mono substitutions supplied by the export environment.

## Build in a new temporary directory

Run from this authoring directory after setting the four dependency variables above:

```sh
export PITCH_BUILD_ROOT="$(mktemp -d)"
"$RUNTIME_NODE" technical-deck.mjs
soffice --headless --convert-to pdf --outdir "$PITCH_BUILD_ROOT/final" "$PITCH_BUILD_ROOT/final/ascend-optimization-technical.pptx"
```

`PITCH_OUTPUT` optionally selects a different absolute PPTX output path. The finalizer requires a new output/receipt path; use a fresh build directory for each revision.

The script writes a private draft, finalization receipt and `technical-outline.json` under the build directory. It validates slide count, geometry, fonts, editable table ownership and Artifact Tool re-import before writing the final PPTX. Render and inspect all PDF pages before replacing committed deliverables. The JSON contains titles, speaker notes and references, not a substitute for the curated Markdown outline.

When publishing a revision, copy the finalized PPTX and its PDF together, update the curated outline, and commit the iteration. Keep temporary previews, caches and validation receipts outside the vault.
