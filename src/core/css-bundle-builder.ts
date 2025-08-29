// css-bundle-builder.ts
import fs from "fs/promises";
import path from "path";
import CleanCSS from "clean-css"; // npm install clean-css

export interface CssConfig {
  components?: string[];
  theme?: string;
  utilities?: string[];
}

/**
 * minify CSS per components per page / per content
 * @param cssConfig 
 * @param globalTheme 
 * @param bundleName
 * @returns
 */
export async function generatePerPageCSSBundle(
  cssConfig: CssConfig = {},
  globalTheme: string = '',
  bundleName: string = 'bundle.min.css'
): Promise<string> {
  const cssParts: string[] = [];

  // Base CSS
try {
  const basePath = path.join(process.cwd(), "static/css/axcora-base.css");
  cssParts.push(await fs.readFile(basePath, "utf-8"));
} catch {
  try {
    const nodeBasePath = path.join(process.cwd(), "node_modules", "axcora-css", "axcora-base.css");
    cssParts.push(await fs.readFile(nodeBasePath, "utf-8"));
  } catch {
//    console.warn(`⚠️ axcora-base.css nothing found static/css or node_modules/axcora-css`);
  }
}

  // Theme
const themeName = cssConfig.theme || globalTheme;
if (themeName && themeName !== "default") {
  let themePath = path.join(process.cwd(), "static/css/themes", themeName, "theme.css");
  try {
    cssParts.push(await fs.readFile(themePath, "utf-8"));
  } catch {
    try {
      themePath = path.join(process.cwd(), "node_modules", `axcora-theme-${themeName}`, "theme.css");
      cssParts.push(await fs.readFile(themePath, "utf-8"));
    } catch {
      try {
        themePath = path.join(process.cwd(), "node_modules", "axcora-themes", themeName, "theme.css");
        cssParts.push(await fs.readFile(themePath, "utf-8"));
      } catch {
    //    console.warn(`⚠️ Theme "${themeName}" tidak ditemukan di static/css/themes, axcora-theme-${themeName}, ataupun axcora-themes/${themeName}`);
      }
    }
  }
}


  // Komponen
  for (const comp of cssConfig.components || []) {
    try {
      const compPath = path.join(process.cwd(), "static/css/components", `${comp}.css`);
      cssParts.push(await fs.readFile(compPath, "utf-8"));
    } catch {}
  }

  // Utilities
  for (const util of cssConfig.utilities || []) {
    try {
      const utilPath = path.join(process.cwd(), "static/css", `${util}.css`);
      cssParts.push(await fs.readFile(utilPath, "utf-8"));
    } catch {}
  }

  // Minify dan save
  const combinedCSS = cssParts.join('\n');
  const minCSS = new CleanCSS({}).minify(combinedCSS).styles;
  const outPath = path.join(process.cwd(), "static/css/dist", bundleName);

  // PATCH: pastikan folder output ada!
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  // END PATCH

  await fs.writeFile(outPath, minCSS, "utf-8");
  return `/css/dist/${bundleName}`;
}
