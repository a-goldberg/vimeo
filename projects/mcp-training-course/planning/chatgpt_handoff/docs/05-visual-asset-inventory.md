# 05. Visual Asset Inventory

This document records the known visual assets and visual concepts from the project conversations. It is not a guarantee that the actual binary files exist in the repository. A new contributor should inspect the repo's `/assets`, `/public`, `/img`, `/slides`, or equivalent folders and map real files to this inventory.

## General visual style

All images should align to **Severe Industrial Elegance**:

- dark charcoal environments;
- premium industrial materials;
- brushed steel;
- matte charcoal;
- copper and brass accents;
- restrained blue illumination;
- muted amber warning markers;
- crisp white technical typography;
- serious enterprise training deck tone;
- luxury automotive product photography;
- aerospace engineering briefing rooms;
- no cartoon, neon sci-fi, slapstick, or chaotic visual comedy.

## Logo assets

### Primary Vandermere logo

Needed/known:
- Wordmark: `VANDERMERE`
- Subtitle: `APPLIED DYNAMICS`
- Transparent PNG variant.
- Light variant for dark backgrounds.

Important warning:
- Do not use any generated version with the typo `APPLIEO DYNAMICS`.
- Do not use checkerboard-background exports as if they were transparent. A true alpha PNG is needed.

Suggested filenames:
- `vandermere-logo-primary-transparent.png`
- `vandermere-logo-light-transparent.png`
- `vandermere-logo-mark-transparent.png`

## Product hero assets

### STS-1000 portrait product photograph

Description:
- Tall rectangular enterprise machinery cabinet.
- Matte charcoal exterior.
- Brushed steel frame.
- Central transparent cylinder with slowly swirling blue liquid.
- Visible copper coils in upper chambers behind reinforced glass.
- Three large brass motorized dials and three smaller trim regulators.
- Lower titanium rotor assembly.
- Small crisp digital status display.
- Heavy latching doors.
- Precise warning labels.
- Clean aerospace engineering briefing room.
- Severe industrial elegance.
- Realistic lighting.

Suggested filename:
- `sts1000-product-hero-portrait.png`

### STS-1000 landscape product photograph

Description:
- Landscape orientation.
- Product toward the right side of the frame.
- Uncluttered negative space on the left for text or avatar speaker.
- Same product design and environment as portrait hero.

Suggested filename:
- `sts1000-product-hero-landscape-right.png`

### Empty corporate/aerospace background

Description:
- Same dark, moody, modern, vaguely advanced aerospace/corporate office space as the product hero.
- STS-1000 removed.
- Used as background for presentation slides, video segments, product interstitials, and avatar scenes.

Suggested filename:
- `vandermere-dark-office-background-no-product.png`

### STS-1000 front-panel macro

Description:
- Close-up realistic front panel.
- Brass throughput dials.
- Amber indicator lights.
- Brushed steel labels.
- Small digital readout.
- Subtle blue glow from central reservoir.
- Premium industrial macro photography.

Suggested filename:
- `sts1000-front-panel-macro.png`

## Interior and subsystem assets

### Exposed STS-1000 interior hero

Description:
- Front panel removed.
- Canonical product proportions preserved.
- Polished copper and stainless tubing.
- Thick-gauge harnesses.
- Carbon fiber fan shrouds.
- Sensors, capacitors, and energy modulation components.
- Blue glow and industrial lighting.

Suggested filename:
- `sts1000-exposed-interior-hero.png`

### Core Logic Reservoir macro

Description:
- Close-up of central transparent cylinder.
- Viscous blue liquid.
- Premium iron-free glass.
- Subtle swirl.
- Scientific, not fantasy slime.

Suggested filename:
- `sts1000-core-logic-reservoir-macro.png`

### Dual Thermal Reasoning Coils macro

Description:
- Copper coils behind reinforced glass or mesh.
- Warm copper glow.
- Blue accent lighting.
- Severe industrial macro photography.

Suggested filename:
- `sts1000-thermal-reasoning-coils-macro.png`

### Additional internal highlight crops

Known:
- Multiple 16:9 and 9:16 interior highlight crops were generated or discussed.
- These should be cataloged in the repo if available.

Suggested filenames:
- `sts1000-interior-highlight-01-16x9.png`
- `sts1000-interior-highlight-02-16x9.png`
- `sts1000-interior-highlight-01-9x16.png`

## Abstract course visuals

### Video 1 enterprise workflow background

Description:
- 16:9 dark charcoal background.
- Five unnamed nodes.
- Diagnostic blue line starts smooth, densifies near center, then smooths again.
- Generous negative space.
- No people.
- Compatible with dark training slide overlays.

Suggested filename:
- `module01-enterprise-workflow-background.png`

### Procedural Turbulence slide

Description:
- Title/subtitle style training slide.
- Symptoms include:
  - stalled approvals
  - handoff decay
  - meeting proliferation
  - unclear ownership
- Dark charcoal.
- White typography.
- Amber warnings.
- Blue workflow indicators.

Suggested filename:
- `procedural-turbulence-symptoms-slide.png`

### Safe Workflow Pressure diagram

Description:
- Three conceptual zones:
  - low pressure stagnation
  - safe operating band
  - high pressure turbulence
- Dark charcoal.
- White and amber labels.
- Blue flow line.

Suggested filename:
- `safe-workflow-pressure-diagram.png`

### Operational Drift and Workflow Cavitation diagram

Description:
- 16:9 transparent PNG intended for presentation overlays.
- Split into two connected sections:
  - left: Operational Drift
  - right: Workflow Cavitation
- Left section:
  - one strategic priority line begins as a single bright blue horizontal line;
  - branches into five department lanes:
    - Sales
    - Finance
    - Legal
    - Operations
    - Product;
  - amber variance markers show divergence.
- Right section:
  - Operations -> Finance -> Procurement -> Implementation;
  - flow thins, interrupts, or leaves empty accountability pockets.
- Brushed steel panels, restrained blue lines, amber warning markers, white technical type.
- Requires true alpha transparency; do not use checkerboard background.
- A bright green background version existed only as an intermediate mask/removal step, not final artwork.

Suggested filenames:
- `operational-drift-workflow-cavitation-transparent.png`
- `operational-drift-workflow-cavitation-green-bg-source.png` only if needed as a processing intermediate.

## Scene-specific visuals

### Workflow pressure scenario

Description:
- Sales -> Legal -> Finance -> Procurement -> Billing.
- Growing pressure indicators at handoffs.
- Controlled corporate diagram, not cartoonishly jammed.
- Clean lines begin stable, then slow, split, or show pressure near departmental transitions.

Suggested filename:
- `module04-workflow-pressure-sales-legal-finance-procurement-billing.png`

### Executive/finance meeting

Description:
- Realistic corporate boardroom/conference table.
- Glass walls.
- Background screen suggesting slowed/blocked deals.
- Optional subtle STS-1000 presence in background/lighting.

Suggested filename:
- `module04-executive-finance-meeting-blocked-deals.png`

### Remote CEO meeting variant

Description:
- Same general executive/finance meeting setup.
- Screen shows a 65-year-old elite technology CEO speaking remotely to management team about an important new business priority.
- Should feel like serious enterprise decision pressure, not parody.

Suggested filename:
- `module04-remote-ceo-priority-briefing.png`

### Causality Baffles concept

Status:
- Concept requested/discussed. Do not assume final asset exists unless found in repo.

Needed visual:
- Enterprise workflow stream entering a contained mechanical baffle chamber.
- A delayed approval, policy contradiction, incomplete handoff, or bad executive decision enters the stream.
- Angled titanium baffles isolate the downstream consequence pattern.
- Risk spread, compliance confusion, and cross-functional contamination are contained before they propagate to unrelated departments.
- Departments to imply:
  - compliance
  - finance
  - billing
  - pricing
  - customer-impacting operations
- Sales translation: one department's mistake should not become everyone's problem.

Suggested filename:
- `causality-baffles-consequence-containment-diagram.png`

## HTA-700 visual assets

Status:
- Defined conceptually; not confirmed produced.

Needed:
- Massive white aerospace-grade cylinder, 2-3 stories tall.
- Lower half buried in concrete stabilization cradle.
- Small adjacent Cryogenic Governance Annex.
- Corporate campus or enterprise facility context.
- Supports up to seven STS-1000 units.
- Should feel like capital infrastructure, not sci-fi rocket or joke prop.

Suggested filenames:
- `hta700-helium-thermal-abatement-stack-exterior.png`
- `hta700-cryogenic-governance-annex.png`
- `sts1000-hta700-deployment-architecture-diagram.png`

## Transparent PNG guidance

For assets that need layering:
- The background must be actual alpha transparency.
- Checkerboard patterns are not transparency.
- Green-screen exports are intermediates only.
- Preserve text, shadows, linework, glows, and graphical elements when removing background.
- Verify by placing the PNG over both dark and light test backgrounds.

## Recommended asset manifest format

If the repo does not already include one, create `assets/asset-manifest.json` with:

```json
{
  "id": "operational-drift-workflow-cavitation",
  "title": "Operational Drift and Workflow Cavitation",
  "status": "final",
  "type": "diagram",
  "format": "png",
  "transparent": true,
  "recommendedUse": ["module04", "slide-overlay", "video-cutaway"],
  "sourcePrompt": "See prompts/image_prompt_reference.md",
  "notes": "Verify true alpha transparency before use."
}
```
