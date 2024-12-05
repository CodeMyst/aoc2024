import type { PuzzleSolver } from '../../core';

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 143, full: 5064 },

        solve: (input: string): number => {
            const [rulesInput, pagesInput] = input.split('\n\n');
            const rules = rulesInput.split('\n').map(r => r.split('|').map(Number));
            const pageList = pagesInput.split('\n').map(p => p.split(',').map(Number));

            const validPages = (pages: number[]): boolean => {
                for (const [index, page] of pages.entries()) {
                    const relevantRules = rules.filter(([l, r]) => r === page && pages.includes(l));

                    for (const rule of relevantRules) {
                        if (!pages.slice(0, index).includes(rule[0])) {
                            return false;
                        }
                    }
                }

                return true;
            };

            const getMiddlePage = (pages: number[]): number => pages[Math.floor(pages.length / 2)];

            return pageList.filter(validPages).map(getMiddlePage).reduce((a, n) => a + n, 0);
        }
    },

    part2: {
        expectedResult: { example: 123, full: 5152 },

        solve: (input: string): number => {
            const [rulesInput, pagesInput] = input.split('\n\n');
            const rules = rulesInput.split('\n').map(r => r.split('|').map(Number));
            const pageList = pagesInput.split('\n').map(p => p.split(',').map(Number));

            const fixPages = (pages: number[]): boolean => {
                let needsFixing = false;

                for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
                    const page = pages[pageIndex];
                    const relevantRules = rules.filter(([l, r]) => l === page && pages.includes(r));

                    for (const rule of relevantRules) {
                        const after = pages.slice(pageIndex, pages.length);
                        if (!after.includes(rule[1])) {
                            const before = pages.slice(0, pageIndex);
                            const badIndex = before.findIndex(p => p === rule[1]);

                            [pages[pageIndex], pages[badIndex]] = [pages[badIndex], pages[pageIndex]];

                            pageIndex = 0;

                            needsFixing = true;

                            break;
                        }
                    }
                }

                return needsFixing;
            };

            const getMiddlePage = (pages: number[]): number => pages[Math.floor(pages.length / 2)];

            return pageList.filter(fixPages).map(getMiddlePage).reduce((a, n) => a + n, 0);
        }
    }
};
