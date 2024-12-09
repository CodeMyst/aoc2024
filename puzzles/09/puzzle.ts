import type { PuzzleSolver } from '../../core';

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 1928, full: 6_461_289_671_426 },

        solve: (input: string): number => {
            const inputNumbers = input.trim().split('');
            const expanded: number[] = [];
            let id = 0;
            for (let i = 0; i < inputNumbers.length; i++) {
                if (i % 2 === 0) {
                    const blocks = Array.from({ length: Number(inputNumbers[i])}, () => id);
                    expanded.push(...blocks);
                    id++;
                } else {
                    const blocks = Array.from({ length: Number(inputNumbers[i])}, () => -1);
                    expanded.push(...blocks);
                }
            }

            for (let i = expanded.length - 1; i >= 0; i--) {
                if (expanded[i] !== -1) {
                    const firstFreeIndex = expanded.findIndex(b => b === -1);
                    if (firstFreeIndex === -1 || firstFreeIndex >= i) break;
                    expanded[firstFreeIndex] = expanded[i];
                    expanded[i] = -1;
                }
            }

            let totalId = 0;
            for (let i = 0; i < expanded.length; i++) {
                if (expanded[i] !== -1) {
                    totalId += i * expanded[i];
                }
            }

            return totalId;
        }
    },

    part2: {
        expectedResult: { example: 4, full: 6_488_291_456_470 },

        solve: (input: string): number => {
            const inputNumbers = input.trim().split('');
            const expanded: number[] = [];
            let id = 0;
            for (let i = 0; i < inputNumbers.length; i++) {
                if (i % 2 === 0) {
                    const blocks = Array.from({ length: Number(inputNumbers[i])}, () => id);
                    expanded.push(...blocks);
                    id++;
                } else {
                    const blocks = Array.from({ length: Number(inputNumbers[i])}, () => -1);
                    expanded.push(...blocks);
                }
            }

            let currentId = expanded.toSorted()[expanded.length - 1];
            while (currentId > 0) {
                const blockStartIndex = expanded.findIndex(b => b === currentId);
                const blockEndIndex = expanded.findLastIndex(b => b === currentId);
                const requiredSpace = blockEndIndex - blockStartIndex;

                let freeStartIndex = -1;
                let freeCount = 0;
                for (let i = 0; i < blockStartIndex; i++) {
                    if (expanded[i] === -1) {
                        if (freeStartIndex === -1) {
                            freeStartIndex = i;
                        }
                        freeCount++;

                        if (freeCount === requiredSpace + 1) {
                            break;
                        }
                    } else {
                        freeStartIndex = -1;
                        freeCount = 0;
                    }
                }

                if (freeStartIndex !== -1 && freeCount === requiredSpace + 1) {
                    for (let i = 0; i <= requiredSpace; i++) {
                        expanded[freeStartIndex + i] = expanded[blockStartIndex + i];
                        expanded[blockStartIndex + i] = -1;
                    }
                }

                currentId--;
            }

            let totalId = 0;
            for (let i = 0; i < expanded.length; i++) {
                if (expanded[i] !== -1) {
                    totalId += i * expanded[i];
                }
            }

            return totalId;
        }
    }
};
