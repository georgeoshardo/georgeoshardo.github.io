---
title: "GEFF: Graph Exchange File Format"
collection: publications
category: manuscripts
permalink: /publication/2026-04-13-geff-graph-exchange-file-format
excerpt: 'GEFF defines a strict exchange format for graph-based tracking data, improving interoperability across life-science tools and programming languages.'
date: 2026-04-13
venue: 'Journal of Open Source Software'
paperurl: 'https://doi.org/10.21105/joss.10143'
citation: 'Schwartz, M., Malin-Mayor, C., Lambert, T. et al. (2026). &quot;GEFF: Graph Exchange File Format.&quot; <i>Journal of Open Source Software</i> 11(120), 10143.'
---

## Abstract

GEFF is a graph exchange format designed to move tracking data cleanly between analysis and visualization tools. The format is aimed at animal, cell, and organelle tracking workflows in the life sciences, where many tools currently use incompatible graph representations and bespoke file formats.

The reference implementation provides a strict specification together with Python read/write support for multiple in-memory graph backends. By separating exchange from application-specific optimization, GEFF makes it easier for different tools and languages to interoperate without forcing them to share the same internal data model.
