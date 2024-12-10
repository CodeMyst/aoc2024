import type { PuzzleSolver } from '../../core';

type Coord = {
    x: number;
    y: number;
};

const parseMap = (input: string): { map: number[][], trailheadCoords: Coord[] } => {
    const map = input.split('\n').filter(l => l.length > 1).map(l => l.split('').map(Number));

    const trailheadCoords: Coord[] = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] === 0) trailheadCoords.push({ x, y });
        }
    }

    return { map, trailheadCoords };
}

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 36, full: 682 },

        solve: (input: string): number => {
            const { map, trailheadCoords } = parseMap(input);

            const visited = new Map<Coord, Coord[]>();

            const calculateTrailHeadScore = (trailhead: Coord, x: number, y: number): number => {
                const current = map[y][x];

                if (current === 9) {
                    const visitedPeaks = visited.get(trailhead)!;
                    if (visitedPeaks.filter(p => p.x === x && p.y === y).length > 0) {
                        return 0;
                    }

                    visitedPeaks.push({ x, y });
                    return 1;
                }

                let score = 0;

                if (y - 1 >= 0) {
                    const top = map[y-1][x];
                    if (top === current + 1) score += calculateTrailHeadScore(trailhead, x, y-1);
                }

                if (y + 1 < map.length) {
                    const bottom = map[y+1][x];
                    if (bottom === current + 1) score += calculateTrailHeadScore(trailhead, x, y+1);
                }

                if (x - 1 >= 0) {
                    const left = map[y][x-1];
                    if (left === current + 1) score += calculateTrailHeadScore(trailhead, x-1, y);
                }

                if (x + 1 < map[0].length) {
                    const right = map[y][x+1];
                    if (right === current + 1) score += calculateTrailHeadScore(trailhead, x+1, y);
                }

                return score;
            };

            let score = 0;
            for (const trailHead of trailheadCoords) {
                visited.set(trailHead, []);
                score += calculateTrailHeadScore(trailHead, trailHead.x, trailHead.y);
            }

            return score;
        }
    },

    part2: {
        expectedResult: { example: 81, full: 1511 },

        solve: (input: string): number => {
            const { map, trailheadCoords } = parseMap(input);

            const calculateTrailHeadScore = (x: number, y: number): number => {
                const current = map[y][x];

                if (current === 9) return 1;

                let score = 0;

                if (y - 1 >= 0) {
                    const top = map[y-1][x];
                    if (top === current + 1) score += calculateTrailHeadScore(x, y-1);
                }

                if (y + 1 < map.length) {
                    const bottom = map[y+1][x];
                    if (bottom === current + 1) score += calculateTrailHeadScore(x, y+1);
                }

                if (x - 1 >= 0) {
                    const left = map[y][x-1];
                    if (left === current + 1) score += calculateTrailHeadScore(x-1, y);
                }

                if (x + 1 < map[0].length) {
                    const right = map[y][x+1];
                    if (right === current + 1) score += calculateTrailHeadScore(x+1, y);
                }

                return score;
            };

            return trailheadCoords.map(t => calculateTrailHeadScore(t.x, t.y)).reduce((a, n) => a + n, 0);
        }
    }
};
