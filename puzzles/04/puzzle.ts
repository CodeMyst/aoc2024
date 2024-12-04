import type { PuzzleSolver } from '../../core';

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 18, full: 2567 },

        solve: (input: string): number => {
            const map: string[][] = input.split('\n').map(l => l.split('')).filter(a => a.length > 1);

            let found = 0;

            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    const char = map[y][x];

                    if (char === 'X') {
                        // check left
                        if (map[y].slice(x-3, x+1).join('') === 'SAMX') found += 1;

                        // check right
                        if (map[y].slice(x, x+4).join('') === 'XMAS') found += 1;

                        // check up
                        if (map.slice(y-3, y+1).map(l => l[x]).join('') === 'SAMX') found += 1;

                        // check down
                        if (map.slice(y, y+4).map(l => l[x]).join('') === 'XMAS') found += 1;

                        // check up left
                        if (map.slice(y-3, y+1).map((l, i) => l[x-(3-i)]).join('') === 'SAMX') found += 1;

                        // check up right
                        if (map.slice(y-3, y+1).map((l, i) => l[x+(3-i)]).join('') === 'SAMX') found += 1;

                        // check down left
                        if (map.slice(y, y+4).map((l, i) => l[x-i]).join('') === 'XMAS') found += 1;

                        // check down right
                        if (map.slice(y, y+4).map((l, i) => l[x+i]).join('') === 'XMAS') found += 1;
                    }
                }
            }

            return found;
        }
    },

    part2: {
        expectedResult: { example: 9, full: 2029 },

        solve: (input: string): number => {
            const map: string[][] = input.split('\n').map(l => l.split('')).filter(a => a.length > 1);

            let found = 0;
            for (let y = 1; y < map.length-1; y++) {
                for (let x = 1; x < map[y].length-1; x++) {
                    const char = map[y][x];

                    if (char === 'A') {
                        const topLeft = map[y-1][x-1];
                        const topRight = map[y-1][x+1];
                        const bottomLeft = map[y+1][x-1];
                        const bottomRight = map[y+1][x+1];

                        if ([topLeft, bottomRight].sort().join('') === 'MS' && [topRight, bottomLeft].sort().join('') === 'MS') found += 1;
                    }
                }
            }

            return found;
        }
    }
};
