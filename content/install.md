---
layout: install
title: Installation
description: About installation
---
## **Axcora SSG + CSS Framework — CLI Quickstart Guide**

Axcora is a modern, open source Static Site Generator & CSS framework.  
This guide walks you through installation, setup, and daily use—making your experience as smooth as Next.js or Astro.

---

## **Getting Started**

### 1. **Install Dependencies**

Clone the repository and install dependencies:

```bash
git clone https://github.com/mesinkasir/axcora-starter.git
cd axcora-starter
npm install
```

---

### 2. **Compile & Install the CLI Globally**

Before using the CLI everywhere, compile and link it globally:

```bash
npm install axcora
```

This step will:
- Build the project (TypeScript compile & executable creation)
- Link the CLI globally so you can use the `axcora` command anywhere

_Note: You only need to do this once. On updates, repeat to refresh the global CLI._

---

### 3. **Use Axcora CLI for All Main Commands**

After the CLI is linked, you **no longer need to use npm scripts** for core workflow.  
Just use the CLI directly!

```bash
axcora dev        			# Launch native development server (hot reload, recommended for normal development)
axcora build      			# Build your static site for production
axcora serve      			# Serve the built site (public folder) locally
axcora init myu project		# build a new axcora project
axcora new "Post Title"  	# Create a new blog post
axcora help       			# Shows CLI help and command list
```

You can run these commands from any terminal, in your project directory.

---

## **Typical Workflow Example**

```bash
npm install        # Install dependencies (once)
npm run axcora     # Build & link CLI globally (once or on updates)

axcora dev         # Develop your static site
axcora build       # Build for production
axcora serve       # Preview build output locally
axcora new "Title" # Create new blog post/page
```

---

## **Command Reference**

| Command            | Description                                              |
|--------------------|---------------------------------------------------------|
| `axcora dev`       | Start development server (native hot reload)            |
| `axcora build`     | Build the static site for production                    |
| `axcora serve`     | Serve the public folder locally for preview             |
| `axcora new`       | Create new blog post                                    |
| `axcora init`      | Create new axcora  project                              |
| `axcora help`      | Show CLI help and available commands                    |

---

## **Notes**

- If you update the CLI source code, always run `npm run axcora` again to rebuild and update the global CLI.
- For custom/advanced tasks, you may still use `npm run ...` scripts defined in `package.json`.
- CLI usage makes your workflow faster, easier to document, and friendly for contributors worldwide.

---

## **Troubleshooting**

- If `axcora` command is not found, make sure you’ve run `npm run axcora` or `npm run install-global`.
- For permissions issues, ensure NodeJS and npm are correctly installed, and the global bin path is in your terminal’s PATH.

---

Enjoy building with **Axcora SSG + CSS Framework!**  
Contributions, feedback, and collaborations are welcome — see the repo for details.

---
