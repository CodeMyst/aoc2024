import type { PuzzleSolver } from '../../core';

type Coord = { x: number; y: number };

const pairs = <T>(arr: T[]) => arr.map((v, i) => arr.slice(i + 1).map(w => [v, w])).flat();

const parseAntennas = (input: string): { antennas: Map<string, Coord[]>, mapWidth: number, mapHeight: number } => {
    const lines = input.split('\n').filter(l => l.length > 1);
    const antennas: Map<string, Coord[]> = new Map();
    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[0].length; x++) {
            if (lines[y][x] !== '.') {
                if (!antennas.has(lines[y][x])) {
                    antennas.set(lines[y][x], []);
                }

                antennas.get(lines[y][x])?.push({ x, y });
            }
        }
    }

    return { antennas, mapWidth: lines[0].length, mapHeight: lines.length };
};

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 14, full: 351 },

        solve: (input: string): number => {
            const { antennas, mapWidth, mapHeight } = parseAntennas(input);

            const antinodes: { x: number, y: number }[] = [];

            const coordInsideMap = (coord: Coord): boolean => {
                return coord.x >= 0 && coord.x < mapWidth && coord.y >= 0 && coord.y < mapHeight
            };

            const antinodeUnique = (coord: Coord): boolean => {
                return antinodes.findIndex(a => a.x === coord.x && a.y === coord.y) === -1;
            };

            for (const freq of antennas.keys()) {
                const antennaPairs = pairs(antennas.get(freq)!);

                for (const pair of antennaPairs) {
                    const xDist = Math.abs(pair[0].x - pair[1].x);
                    const yDist = Math.abs(pair[0].y - pair[1].y);

                    const antinode1 = { x: 0, y: 0 };
                    const antinode2 = { x: 0, y: 0 };

                    antinode1.x = pair[0].x >= pair[1].x ? pair[0].x + xDist : pair[0].x - xDist;
                    antinode1.y = pair[0].y >= pair[1].y ? pair[0].y + yDist : pair[0].y - yDist;

                    antinode2.x = pair[1].x >= pair[0].x ? pair[1].x + xDist : pair[1].x - xDist;
                    antinode2.y = pair[1].y >= pair[0].y ? pair[1].y + yDist : pair[1].y - yDist;

                    if (coordInsideMap(antinode1) && antinodeUnique(antinode1)) antinodes.push(antinode1);
                    if (coordInsideMap(antinode2) && antinodeUnique(antinode2)) antinodes.push(antinode2);
                }
            }

            return antinodes.length;
        }
    },

    part2: {
        expectedResult: { example: 34, full: 1259 },

        solve: (input: string): number => {
            const { antennas, mapWidth, mapHeight } = parseAntennas(input);

            const antinodes: { x: number, y: number }[] = [];

            const coordInsideMap = (coord: Coord): boolean => {
                return coord.x >= 0 && coord.x < mapWidth && coord.y >= 0 && coord.y < mapHeight
            };

            const antinodeUnique = (coord: Coord): boolean => {
                return antinodes.findIndex(a => a.x === coord.x && a.y === coord.y) === -1;
            };

            for (const freq of antennas.keys()) {
                const antennaPairs = pairs(antennas.get(freq)!);

                for (const pair of antennaPairs) {
                    const xDist = Math.abs(pair[0].x - pair[1].x);
                    const yDist = Math.abs(pair[0].y - pair[1].y);

                    let currentXDist = xDist;
                    let currentYDist = yDist;

                    if (antinodeUnique(pair[0])) antinodes.push(pair[0]);
                    if (antinodeUnique(pair[1])) antinodes.push(pair[1]);

                    while (true) {
                        const antinode1 = { x: 0, y: 0 };
                        const antinode2 = { x: 0, y: 0 };

                        antinode1.x = pair[0].x >= pair[1].x ? pair[0].x + currentXDist : pair[0].x - currentXDist;
                        antinode1.y = pair[0].y >= pair[1].y ? pair[0].y + currentYDist : pair[0].y - currentYDist;

                        antinode2.x = pair[1].x >= pair[0].x ? pair[1].x + currentXDist : pair[1].x - currentXDist;
                        antinode2.y = pair[1].y >= pair[0].y ? pair[1].y + currentYDist : pair[1].y - currentYDist;

                        const antinode1InsideMap = coordInsideMap(antinode1);
                        const antinode2InsideMap = coordInsideMap(antinode2);

                        if (antinode1InsideMap && antinodeUnique(antinode1)) antinodes.push(antinode1);
                        if (antinode2InsideMap && antinodeUnique(antinode2)) antinodes.push(antinode2);

                        currentXDist += xDist;
                        currentYDist += yDist;

                        if (!antinode1InsideMap && !antinode2InsideMap) break;
                    }
                }
            }

            return antinodes.length;
        }
    }
};
