#!/usr/bin/env node
import { Command } from "commander";
import * as dotenv from "dotenv";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import ora from "ora";
import chalk from "chalk";
import { chromium, Browser, Page } from "playwright";

dotenv.config();

const program = new Command();

program
  .name("uxcheck")
  .description("Run AI-powered UX feedback on your web app")
  .argument("<url>", "URL of the app to scan")
  .option("--goal <goal>", "User goal to simulate", "Look through the about page and see if its easy to understand what the website or application does")
  .option("--persona <persona>", "Persona description", "a new user with no prior knowledge")
  .option("--json", "Output JSON report in addition to markdown")
  .option("--manual", "Output prompt for manual copy-paste instead of calling API")
  .option("--apiKey <apiKey>", "OpenRouter API key")
  .option("--model <model>", "Model to use", "openrouter/quasar-alpha")
  .parse(process.argv);

const options = program.opts();
const targetUrl = program.args[0];

const apiKey = options.apiKey || process.env.OPENROUTER_API_KEY || "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";
const model = options.model;

async function run() {
  const spinner = ora("Launching browser...").start();
  let browser: Browser | null = null;
  try {
    browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }, // iPhone SE size
      colorScheme: "dark", // emulate dark mode
    });
    const page = await context.newPage();
    await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
    // Wait extra time to allow animations, gradients, fonts, etc. to fully load
    await page.waitForTimeout(2000);
    spinner.text = "Capturing screenshot and DOM...";

    const timestamp = Date.now();

    function slugify(text: string) {
      return text.toLowerCase()
        .replace(/https?:\/\//, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 30);
    }

    const urlSlug = slugify(targetUrl);
    const goalSlug = slugify(options.goal || "");
    const personaSlug = slugify(options.persona || "");

    const baseName = `reflex-${timestamp}-${urlSlug}-${goalSlug}-${personaSlug}`;

    fs.mkdirSync("reports", { recursive: true });

    const screenshotBuffer = await page.screenshot({ fullPage: false });
    const screenshotPath = path.join("reports", `${baseName}.png`);
    fs.writeFileSync(screenshotPath, screenshotBuffer);

    const domSummary = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll("h1,h2,h3,p,button,a,input,label"));
      return elements.map((el) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          text: (el as HTMLElement).innerText.trim(),
          id: el.id || null,
          class: el.className || null,
          fontSize: style.fontSize,
          color: style.color,
          backgroundColor: style.backgroundColor,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
        };
      });
    });

    spinner.text = "Building prompt...";

    const prompt = `
You are a senior UX designer reviewing a mobile screen for a web application.

Persona: ${options.persona}
Goal: ${options.goal}

Focus on:
- Visual hierarchy
- Text clarity
- Layout problems
- Accessibility

Be detailed in your feedback.

Here is the DOM summary:
${JSON.stringify(domSummary, null, 2)}
`;

    const reportDir = "reports";

    if (options.manual) {
      const promptPath = path.join(reportDir, `${baseName}-prompt.txt`);
      fs.writeFileSync(promptPath, prompt);
      spinner.succeed(`Prompt saved for manual use: ${promptPath}`);
      return;
    }

    spinner.text = "Sending prompt to OpenRouter...";

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [
          { role: "system", content: "You are a helpful UX expert." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const feedback = response.data.choices[0].message.content as string;

    const mdPath = path.join(reportDir, `${baseName}.md`);
    fs.writeFileSync(mdPath, feedback);

    if (options.json) {
      const jsonPath = path.join(reportDir, `${baseName}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify({ feedback }, null, 2));
    }

    spinner.succeed(`UX feedback saved to ${mdPath}`);
  } catch (error: any) {
    spinner.fail("Error during UX check");
    console.error(error.message || error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

run();
