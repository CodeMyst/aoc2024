import type { PuzzleSolver } from '../../core';

const getStoneCount = (input: string, iterations: number): number => {
    const stonesInput = input.trim().split(' ');
    const stones = new Map<string, number>();
    for (const s of stonesInput) {
         stones.set(s, (stones.get(s) ?? 0) + 1);
    }

    for (let i = 0; i < iterations; i++) {
        const newMap = new Map(stones);
        for (const [stone, count] of newMap) {
            if (count === 0) continue;

            const stoneCount = stones.get(stone) ?? 0;

            if (stone === '0') {
                stones.set(stone, stoneCount - count);
                stones.set('1', (stones.get('1') ?? 0) + count);
            } else if (stone.length % 2 === 0) {
                stones.set(stone, stoneCount - count);
                const left = Number(stone.slice(0, stone.length / 2)).toString();
                const right = Number(stone.slice(stone.length / 2, stone.length)).toString();
                stones.set(left, (stones.get(left) ?? 0) + count);
                stones.set(right, (stones.get(right) ?? 0) + count);
            } else {
                stones.set(stone, stoneCount - count);
                const s = (Number(stone) * 2024).toString();
                stones.set(s, (stones.get(s) ?? 0) + count);
            }
        }
    }

    return stones.values().reduce((a, n) => a + n, 0);
};

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 55_312, full: 203_457 },

        solve: (input: string): number => getStoneCount(input, 25)
    },

    part2: {
        expectedResult: { example: 65_601_038_650_482, full: 241_394_363_462_435 },

        solve: (input: string): number => getStoneCount(input, 75)
    }
};
