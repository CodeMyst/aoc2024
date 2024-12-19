import type { PuzzleSolver } from '../../core';

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 6, full: 336 },

        solve: (input: string): number => {
            const [patternInput, designInput] = input.split('\n\n');

            const patterns = patternInput.split(', ');
            const designs = designInput.split('\n').filter(l => l.length > 1);

            const cache = new Map<string, boolean>();

            const designPossible = (design: string): boolean => {
                if (design.length === 0) return true;

                if (cache.has(design)) return cache.get(design)!;

                const possiblePatterns = patterns.filter(p => p.startsWith(design[0]));

                for (const pattern of possiblePatterns) {
                    if (design.startsWith(pattern) && designPossible(design.slice(pattern.length))) {
                        cache.set(design, true);
                        return true;
                    }
                }

                cache.set(design, false);

                return false;
            };

            return designs.filter(designPossible).length;
        }
    },

    part2: {
        expectedResult: { example: 16, full: 758_890_600_222_015 },

        solve: (input: string): number => {
            const [patternInput, designInput] = input.split('\n\n');

            const patterns = patternInput.split(', ');
            const designs = designInput.split('\n').filter(l => l.length > 1);

            const cache = new Map<string, number>();

            const designsPossible = (design: string, currentCount: number): number => {
                if (design.length === 0) return currentCount + 1;

                if (cache.has(design)) return currentCount + cache.get(design)!;

                const possiblePatterns = patterns.filter(p => p.startsWith(design[0]));

                let count = currentCount;
                for (const pattern of possiblePatterns) {
                    if (design.startsWith(pattern)) {
                        const newCount = designsPossible(design.slice(pattern.length), currentCount);
                        count += newCount;
                        cache.set(design, newCount);
                    }
                }

                cache.set(design, count);

                return count;
            };

            return designs.map(d => designsPossible(d, 0)).reduce((a, n) => a + n, 0);
        }
    }
};
