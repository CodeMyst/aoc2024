import chalk from 'chalk';
import { readFile } from 'fs/promises';
import { readdir } from 'fs/promises';
import { exit } from 'process';
import { parseArgs } from 'util';
import type { PuzzlePart, PuzzleSolver } from './core';
import { existsSync } from 'fs';

const { values } = parseArgs({
    args: Bun.argv,
    options: {
	example: {
	    type: 'boolean',
	    short: 'e',
	    default: false,
	},

	day: {
	    type: 'string',
	    short: 'd',
	},

	part: {
	    type: 'string',
	    short: 'p',
	    default: '0'
	},
    },
    strict: true,
    allowPositionals: true
});

const getAllDays = async (): Promise<string[]> => {
    return await readdir('puzzles/');
};

const getPuzzleInput = async (day: number, example: boolean): Promise<string> => {
    const formattedDayNumber = day.toLocaleString('en-US', { minimumIntegerDigits: 2 });

    const inputFileName = example ? 'input_example.txt' : 'input_full.txt';

    return await readFile(`puzzles/${formattedDayNumber}/${inputFileName}`, { encoding: 'utf8' });
};

const getPuzzle = async (day: number): Promise<PuzzleSolver> => {
    const formattedDayNumber = day.toLocaleString('en-US', { minimumIntegerDigits: 2 });

    const puzzle = await import(`./puzzles/${formattedDayNumber}/puzzle.ts`);

    return puzzle.solve!;
};

const runPuzzlePartAndMeasureTime = (puzzlePart: PuzzlePart, input: string): { output: number, elapsed: number } => {
    const start = performance.now();

    let output = puzzlePart.solve(input);

    const elapsed = performance.now() - start;

    return { output, elapsed };
};

const runPuzzlePartAndPrintOutput = (puzzle: PuzzleSolver, part: number, input: string, example: boolean): number => {
    const puzzlePart = part === 1 ? puzzle.part1 : puzzle.part2;

    const { output, elapsed } = runPuzzlePartAndMeasureTime(puzzlePart, input);

    const elapsedFormatted = elapsed.toLocaleString('en-US', { maximumFractionDigits: 2 });

    const expected = example ? puzzlePart.expectedResult.example : puzzlePart.expectedResult.full;
    const success = output === expected;

    const fgColor = success ? chalk.greenBright : chalk.redBright;
    const bgColor = success ? chalk.bgGreenBright : chalk.bgRedBright;

    console.log(fgColor(` • Part ${part} ✓ `) + bgColor(chalk.black(` ${output} `)) + chalk.gray(` ${elapsedFormatted}ms`));

    return elapsed
};

console.log(chalk.green('\n🎄 Advent of Code 2024 🎄\n'));

const daysToRun = values.day ? [values.day] : await getAllDays();

let totalTime = 0;

for (const day of daysToRun) {
    const dayNumber = parseInt(day);
    const formattedDayNumber = dayNumber.toLocaleString('en-US', { minimumIntegerDigits: 2 });

    if (values.day && (isNaN(parseInt(values.day)) || !existsSync(`puzzles/${formattedDayNumber}`))) {
	console.log(chalk.red('The provided day is not valid!\n'));
	exit(1);
    }

    const input = await getPuzzleInput(dayNumber, values.example || false);
    const puzzle = await getPuzzle(dayNumber);

    const part = values.part || '0';

    console.log(chalk.blue(`• Day ${dayNumber}`))

    if (part === '0' || part === '1') {
	totalTime += runPuzzlePartAndPrintOutput(puzzle, 1, input, values.example || false);
    }

    if (part === '0' || part === '2') {
	totalTime += runPuzzlePartAndPrintOutput(puzzle, 2, input, values.example || false);
    }

    console.log();
}

const totalTimeFormatted = totalTime.toLocaleString('en-US', { maximumFractionDigits: 2 })

console.log(chalk.gray(`Total time: ${totalTimeFormatted}ms\n`));

