import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import { BS_MONTHS_EN } from "../src/core/calendar-data";

function createPrompt() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: Boolean(process.stdin.isTTY),
  });
  const queue: string[] = [];
  let pending: ((line: string | null) => void) | null = null;
  let closed = false;

  rl.on("line", (line) => {
    if (pending) {
      const resolveNext = pending;
      pending = null;
      resolveNext(line);
    } else {
      queue.push(line);
    }
  });

  rl.on("close", () => {
    closed = true;
    if (pending) {
      const resolveNext = pending;
      pending = null;
      resolveNext(null);
    }
  });

  return {
    ask(question: string): Promise<string | null> {
      process.stdout.write(question);
      if (queue.length > 0) {
        return Promise.resolve(queue.shift()!);
      }
      if (closed) {
        return Promise.resolve(null);
      }
      return new Promise((res) => {
        pending = res;
      });
    },
    close() {
      rl.close();
    },
  };
}

const CALENDAR_FILE = resolve(
  import.meta.dirname,
  "../src/core/calendar-data.ts",
);

const LINE_WIDTH = 72; // 12 years × 6 hex chars per line

function encodeMonths(months: number[]): string {
  let bits = 0;
  for (const d of months) {
    if (!Number.isInteger(d) || d < 29 || d > 32) {
      throw new Error(`Invalid month day count "${d}" (expected integer 29-32)`);
    }
    bits = (bits << 2) | (d - 29);
  }
  return bits.toString(16).padStart(6, "0");
}

function decodeMonths(hex: string): number[] {
  const bits = parseInt(hex, 16);
  const months: number[] = [];
  for (let m = 0; m < 12; m++) {
    months.push(29 + ((bits >> ((11 - m) * 2)) & 3));
  }
  return months;
}

function formatPackedLines(packed: string): string {
  const chunks: string[] = [];
  for (let i = 0; i < packed.length; i += LINE_WIDTH) {
    chunks.push(`  "${packed.slice(i, i + LINE_WIDTH)}"`);
  }
  return chunks.join(" +\n");
}

function readCalendarFile() {
  const source = readFileSync(CALENDAR_FILE, "utf8");

  const minMatch = source.match(/export const MIN_BS_YEAR = (\d+);/);
  const maxMatch = source.match(/export const MAX_BS_YEAR = (\d+);/);
  const packedMatch = source.match(
    /const PACKED_BS_CALENDAR =\n([\s\S]*?);/,
  );

  if (!minMatch || !maxMatch || !packedMatch) {
    throw new Error("Could not parse calendar constants in calendar-data.ts");
  }

  const minYear = parseInt(minMatch[1], 10);
  const maxYear = parseInt(maxMatch[1], 10);
  const packed = packedMatch[1].replace(/[^0-9a-f]/gi, "");
  const expectedLength = (maxYear - minYear + 1) * 6;

  if (packed.length !== expectedLength) {
    throw new Error(
      `Packed data length mismatch: got ${packed.length} chars, expected ${expectedLength} for ${minYear}-${maxYear}`,
    );
  }

  return { source, minYear, maxYear, packed };
}

function writeCalendarFile(
  source: string,
  minYear: number,
  newMaxYear: number,
  newPacked: string,
) {
  let updated = source.replace(
    /export const MAX_BS_YEAR = \d+;/,
    `export const MAX_BS_YEAR = ${newMaxYear};`,
  );
  updated = updated.replace(
    new RegExp(`${minYear}–\\d+ BS`),
    `${minYear}–${newMaxYear} BS`,
  );
  updated = updated.replace(
    /const PACKED_BS_CALENDAR =\n[\s\S]*?;/,
    `const PACKED_BS_CALENDAR =\n${formatPackedLines(newPacked)};`,
  );
  writeFileSync(CALENDAR_FILE, updated, "utf8");
}

async function promptMonthsInteractively(nextYear: number): Promise<number[]> {
  const prompt = createPrompt();
  const months: number[] = [];

  try {
    console.log(`\nAdding calendar data for ${nextYear} BS`);
    console.log("Enter the number of days (29–32) for each month:\n");

    for (let i = 0; i < 12; i++) {
      const label = `${BS_MONTHS_EN[i].padEnd(9)} (${String(i + 1).padStart(2)}/12): `;
      while (true) {
        const answer = await prompt.ask(label);
        if (answer === null) {
          console.log("\nCancelled.");
          process.exit(0);
        }
        const days = Number(answer.trim());
        if (Number.isInteger(days) && days >= 29 && days <= 32) {
          months.push(days);
          break;
        }
        console.log("  Please enter an integer between 29 and 32.");
      }
    }

    const totalDays = months.reduce((a, b) => a + b, 0);
    console.log(`\nSummary for ${nextYear} BS:`);
    console.log(`  Months: [${months.join(", ")}]`);
    console.log(`  Total:  ${totalDays} days`);
    if (totalDays < 365 || totalDays > 366) {
      console.log("  Warning: A BS year normally has 365 or 366 days.");
    }

    const confirm = ((await prompt.ask("\nSave this year? (y/N): ")) ?? "")
      .trim()
      .toLowerCase();
    if (confirm !== "y" && confirm !== "yes") {
      console.log("Cancelled.");
      process.exit(0);
    }
  } finally {
    prompt.close();
  }

  return months;
}

async function handleAdd() {
  const { source, minYear, maxYear, packed } = readCalendarFile();
  const nextYear = maxYear + 1;
  const months = await promptMonthsInteractively(nextYear);

  const hex = encodeMonths(months);
  const totalDays = months.reduce((a, b) => a + b, 0);
  writeCalendarFile(source, minYear, nextYear, packed + hex);

  console.log(
    `\nAdded ${nextYear} BS: [${months.join(", ")}] (${totalDays} days, hex: ${hex})`,
  );
  console.log(`Supported range is now ${minYear}–${nextYear} BS.`);
}

async function handleRemove() {
  const { source, minYear, maxYear, packed } = readCalendarFile();

  if (maxYear <= minYear) {
    console.error(`Cannot remove the only remaining year (${minYear} BS).`);
    process.exit(1);
  }

  const removedHex = packed.slice(-6);
  const removedMonths = decodeMonths(removedHex);

  const prompt = createPrompt();
  try {
    console.log(
      `\nLast year in calendar: ${maxYear} BS [${removedMonths.join(", ")}]`,
    );
    const confirm = (
      (await prompt.ask(`Remove ${maxYear} BS? (y/N): `)) ?? ""
    )
      .trim()
      .toLowerCase();
    if (confirm !== "y" && confirm !== "yes") {
      console.log("Cancelled.");
      process.exit(0);
    }
  } finally {
    prompt.close();
  }

  const newMaxYear = maxYear - 1;
  writeCalendarFile(source, minYear, newMaxYear, packed.slice(0, -6));

  console.log(
    `Removed ${maxYear} BS: [${removedMonths.join(", ")}] (hex: ${removedHex})`,
  );
  console.log(`Supported range is now ${minYear}–${newMaxYear} BS.`);
}

const [command] = process.argv.slice(2);

if (command === "add") {
  await handleAdd();
} else if (command === "remove") {
  await handleRemove();
} else {
  console.error(
    "Usage:\n" +
      "  bun run add-year\n" +
      "  bun run remove-year",
  );
  process.exit(1);
}
