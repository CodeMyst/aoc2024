import type { PuzzleSolver } from '../../core';

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 11, full: 2_378_066 },

        solve: (input: string): number => {
            const numbers = input.split('\n')
                                 .map(l => l.split('   ').map(n => parseInt(n)))
                                 .filter(n => !n.includes(NaN));

            const leftNumbers = numbers.map(n => n[0]).sort();
            const rightNumbers = numbers.map(n => n[1]).sort();

            const sortedNumbers = leftNumbers.map((n, i) => [n, rightNumbers[i]]);

            return sortedNumbers.map(n => Math.abs(n[0] - n[1])).reduce((a, n) => a + n, 0);
        }
    },

    part2: {
        expectedResult: { example: 31, full: 18_934_359 },

        solve: (input: string): number => {
            const numbers = input.split('\n')
                                 .map(l => l.split('   ').map(n => parseInt(n)))
                                 .filter(n => !n.includes(NaN));

            const leftNumbers = numbers.map(n => n[0]);
            const rightNumbers = numbers.map(n => n[1]);

            const cache = new Map<number, number>();

            return leftNumbers.map((left) => {
                if (cache.has(left)) return left * cache.get(left)!;

                const occurances = rightNumbers.filter(right => left === right).length;

                cache.set(left, occurances);

                return left * occurances;
            }).reduce((a, n) => a + n, 0);
        }
    }
};
