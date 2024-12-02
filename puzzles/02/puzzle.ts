import type { PuzzleSolver } from '../../core';

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 2, full: 472 },

        solve: (input: string): number => {
            return input.split('\n')
                         .map(l => l.split(' ').map(Number))
                         .filter(l => l.length !== 1)
                         .filter(l => checkIncreasing(l) || checkDecreasing(l))
                         .length;
        }
    },

    part2: {
        expectedResult: { example: 4, full: 520 },

        solve: (input: string): number => {
            const levels = input.split('\n')
                                 .map(l => l.split(' ').map(Number))
                                 .filter(l => l.length !== 1);

            let safeLevels = 0;
            for (const level of levels) {
                if (!checkIncreasing(level) && !checkDecreasing(level)) {
                    for (let i = 0; i < level.length; i++) {
                        if (checkIncreasing(level.toSpliced(i, 1)) || checkDecreasing(level.toSpliced(i, 1))) {
                            safeLevels += 1;
                            break;
                        }
                    }
                } else {
                    safeLevels += 1;
                }
            }

            return safeLevels;
        }
    }
};

const checkIncreasing = (level: number[]): boolean => {
    for (let i = 1; i < level.length; i++) {
        if (level[i] - level[i-1] < 1 || level[i] - level[i-1] > 3) {
            return false;
        }
    }

    return true;
};

const checkDecreasing = (level: number[]): boolean => {
    for (let i = 1; i < level.length; i++) {
        if (level[i-1] - level[i] < 1 || level[i-1] - level[i] > 3) {
            return false;
        }
    }

    return true;
};
