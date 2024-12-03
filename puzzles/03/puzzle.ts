import type { PuzzleSolver } from '../../core';

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 161, full: 182_619_815 },

        solve: (input: string): number => {
            return input.matchAll(/mul\((\d+),(\d+)\)/g)
                        .map(m => Number(m[1]) * Number(m[2]))
                        .reduce((a, n) => a + n, 0);
        }
    },

    part2: {
        expectedResult: { example: 48, full: 80_747_545 },

        solve: (input: string): number => {
            const matches = input.matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g);

            let sum = 0;
            let doMul = true;
            for (const match of matches) {
                if (match[0] === `don't()`) doMul = false;
                else if (match[0] === 'do()') doMul = true;
                else if (doMul) sum += Number(match[1]) * Number(match[2]);
            }

            return sum;
        }
    }
};
