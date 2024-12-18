import type { PuzzleSolver } from '../../core';

const getPathLength = (walls: Set<string>): number | null => {
    const start: [number, number] = [0, 0];
    const end: [number, number] = [70, 70];

    const rows = 71;
    const cols = 71;

    const distances: number[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(Infinity)
    );

    const visited: boolean[][] = Array.from({ length: rows }, () =>
        Array(cols).fill(false)
    );

    distances[start[0]][start[1]]  = 0;

    const directions = [
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: -1, y: 0 },
    ];

    const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < rows;

    const queue: [number, [number, number]][] = [[0, start]];

    distances[start[0]][start[1]] = 0;

    while (queue.length > 0) {
        queue.sort(([a], [b]) => a - b);
        const [ currentDistance, current ] = queue.shift()!;

        if (visited[current[0]][current[1]]) continue;
        visited[current[0]][current[1]] = true;

        if (current[0] === end[0] && current[1] === end[1]) return currentDistance;

        for (const dir of directions) {
            const nx = current[0] + dir.x;
            const ny = current[1] + dir.y;

            if (!inBounds(nx, ny) || visited[nx][ny]) continue;
            if (walls.has(`${nx},${ny}`)) continue;

            const newDistance = currentDistance + 1;
            if (newDistance <= distances[nx][ny]) {
                distances[nx][ny] = newDistance;
                queue.push([newDistance, [nx, ny]]);
            }
        }
    }

    return null;
};

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 146, full: 360 },

        solve: (input: string): number => {
            const walls = input.split('\n').filter(l => l.length > 1).slice(0, 1024);

            return getPathLength(new Set(walls))!;
        }
    },

    part2: {
        expectedResult: { example: '2,0', full: '58,62' },

        solve: (input: string): string => {
            const mapInput = input.split('\n').filter(l => l.length > 1);

            let low = 0;
            let high = mapInput.length - 1;
            let result: number | null = null;
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);

                if (getPathLength(new Set(mapInput.slice(0, mid)))) {
                    result = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }

            return mapInput[result!];
        }
    }
};
