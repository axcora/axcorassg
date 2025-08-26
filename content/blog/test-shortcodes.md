---
title: "Testing Shortcodes"
date: 2025-01-15
category: tutorial
tags: [shortcodes, components]
---

# Testing Axcora Shortcodes in Markdown

This post demonstrates shortcodes in markdown content.

## Image Shortcode

{% axcora-image src="/img/logo.png" alt="Axcora Logo" class="rounded-lg shadow-xl" %}

## Button Shortcode

{% Button href="/about/" variant="primary" %}Learn More{% /Button %}

## Alert Shortcode  

{% Alert type="success" title="Great!" %}
Shortcodes are working in markdown files!
{% /Alert %}

## Regular Markdown

This is regular markdown content that works alongside shortcodes.

- List item 1
- List item 2
- List item 3

**Bold text** and *italic text* work normally.
