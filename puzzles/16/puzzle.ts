import type { PuzzleSolver } from '../../core';

type Point = { x: number; y: number };

type Node = {
    point: Point;
    cost: number;
};

const directions = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
];

const parseMap = (input: string): { map: string[][], start: Point, end: Point } => {
    const map: string[][] = [];
    const rows = input.split('\n').filter(l => l.length > 1);
    let start: Point = { x: 0, y: 0 };
    let end: Point = { x: 0, y: 0 };
    for (const [y, row] of rows.entries()) {
        const tiles = row.split('');
        const startIndex = tiles.findIndex(t => t === 'S');
        const endIndex = tiles.findIndex(t => t === 'E');

        if (startIndex !== -1) {
            start = { x: startIndex, y };
        }

        if (endIndex !== -1) {
            end = { x: endIndex, y };
        }

        map.push(tiles.map(t => t === 'S' || t === 'E' ? '.' : t));
    }

    return { map, start, end };
};

const getLowestScore = (map: string[][], start: Point, end: Point): number | null => {
    const rows = map.length;
    const cols = map[0].length;

    const distance: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const previous: (Point | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));

    distance[start.y][start.x] = 0;

    const queue: Node[] = [{ point: start, cost: 0 }];

    while (queue.length > 0) {
        queue.sort((a, b) => a.cost - b.cost);
        const { point, cost } = queue.shift()!;

        if (point.x === end.x && point.y === end.y) return cost;

        for (const [i, dir] of directions.entries()) {
            const nx = point.x + dir.x;
            const ny = point.y + dir.y;

            if (map[ny][nx] === '.') {
                const previousPoint = previous[point.y][point.x] || { x: start.x - 1, y: start.y };
                let turnCost = 0;
                if (previousPoint) {
                    const previousDirection = { x: point.x - previousPoint.x, y: point.y - previousPoint.y };
                    const previousDirectionIndex = directions.findIndex(d => d.x === previousDirection.x && d.y === previousDirection.y);

                    if (previousDirectionIndex !== i) {
                        turnCost = 1000;
                    }
                }
                const newCost = cost + 1 + turnCost;
                if (newCost <= distance[ny][nx]) {
                    distance[ny][nx] = newCost;
                    previous[ny][nx] = point;
                    queue.push({ point: { x: nx, y: ny }, cost: newCost })
                }
            }
        }
    }

    return null;
};

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 7_036, full: 94_444 },

        solve: (input: string): number => {
            const { map, start, end } = parseMap(input);


            return getLowestScore(map, start, end)!;
        }
    },

    part2: {
        expectedResult: { example: 45, full: 502 },

        solve: (input: string): number => {
            const { map, start, end } = parseMap(input);

            const lowestScore = getLowestScore(map, start, end)!;

            const getAllBestPaths = (): Point[][] => {
                const queue: { x: number, y: number, dir: number, score: number, points: Point[] }[] = [
                    { x: start.x, y: start.y, dir: 1, score: 0, points: [start] }
                ];

                const visited = new Map<string, number>();
                const paths: Point[][] = [];

                while (queue.length > 0) {
                    const { x, y, dir, score, points } = queue.shift()!;

                    if (score > lowestScore) continue;

                    const key = `${x},${y},${dir}`;
                    if (visited.has(key) && visited.get(key)! < score) continue;
                    visited.set(key, score);

                    if (x === end.x && y === end.y && score === lowestScore) {
                        paths.push(points);
                        continue;
                    }

                    const nx = x + directions[dir].x;
                    const ny = y + directions[dir].y;
                    if (map[ny][nx] === '.') {
                        queue.push({ x: nx, y: ny, dir, score: score + 1, points: [...points, { x: nx, y: ny }] })
                    }

                    queue.push({ x, y, dir: dir === 0 || dir === 2 ? 1 : 0, score: score + 1000, points: [...points] });
                    queue.push({ x, y, dir: dir === 1 || dir === 3 ? 2 : 3, score: score + 1000, points: [...points] });

                }

                return paths;
            };

            const paths = getAllBestPaths().flat();
            const uniquePaths = paths.filter((v, i, arr) => arr.findIndex(a => a.x === v.x && a.y === v.y) === i).length;

            return uniquePaths;
        }
    }
};
