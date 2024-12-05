import type { PuzzleSolver } from '../../core';

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 3, full: 12 },

        solve: (input: string): number => {
            return input.trim().length;
        }
    },

    part2: {
        expectedResult: { example: 4, full: 13 },

        solve: (input: string): number => {
            return input.trim().length + 1;
        }
    }
};
