import type { PuzzleSolver } from '../../core';

enum TileType {
    free,
    obstacle
};

type Tile = {
    type: TileType,
    visited: boolean
};

type TileWithDirection = {
    type: TileType,
    visited: boolean,
    visitedFromDirection: Coord
};

type Coord = {
    x: number;
    y: number;
};

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 41, full: 5461 },

        solve: (input: string): number => {
            let guardCoords: Coord = { x: 0, y: 0 };

            const map: Tile[][] = [];

            const lines = input.trim().split('\n');
            for (let y = 0; y < lines.length; y++) {
                const yLine = lines[y].split('');
                const xLine: Tile[] = yLine.map(t => { return { type: t === '#' ? TileType.obstacle : TileType.free, visited: false }});

                map.push(xLine);

                const guardX = yLine.findIndex(t => t === '^');
                if (guardX !== -1) guardCoords = { x: guardX, y: y };
            }

            const dir: Coord = { x: 0, y: -1 };

            while (true) {
                map[guardCoords.y][guardCoords.x].visited = true;

                const nextTile = { x: guardCoords.x + dir.x, y: guardCoords.y + dir.y };

                if (nextTile.x < 0 || nextTile.x >= lines[0].length || nextTile.y < 0 || nextTile.y >= lines.length) {
                    break;
                }

                if (map[nextTile.y][nextTile.x].type === TileType.obstacle) {
                    const prevDir = { x: dir.x, y: dir.y };
                    dir.x = prevDir.x === 0 ? (prevDir.y * -1) : 0;
                    dir.y = prevDir.y === 0 ? (prevDir.x) : 0;
                } else {
                    guardCoords.x += dir.x;
                    guardCoords.y += dir.y;
                }
            }

            return map.flat().filter(t => t.visited).length;
        }
    },

    part2: {
        expectedResult: { example: 6, full: 1836 },

        solve: (input: string): number => {
            let initialGuardCoords = { x: 0, y: 0 };
            let guardCoords = { x: 0, y: 0 };

            const map: TileWithDirection[][] = [];

            const lines = input.trim().split('\n');
            for (let y = 0; y < lines.length; y++) {
                const yLine = lines[y].split('');
                const xLine: TileWithDirection[] = yLine.map(t => {
                    return {
                        type: t === '#' ? TileType.obstacle : TileType.free,
                        visited: false,
                        visitedFromDirection: { x: 0, y: 0}
                    };
                });

                map.push(xLine);

                const guardX = yLine.findIndex(t => t === '^');
                if (guardX !== -1) {
                    guardCoords = { x: guardX, y: y };
                    initialGuardCoords = { x: guardX, y: y };
                }
            }

            const resetMap = () => {
                for (let y = 0; y < map.length; y++) {
                    for (let x = 0; x < map[0].length; x++) {
                        map[y][x].visited = false;
                        map[y][x].visitedFromDirection.x = 0;
                        map[y][x].visitedFromDirection.y = 0;
                    }
                }
                guardCoords = { ...initialGuardCoords };

                // NOTE: this is slower :)
                // map.flat().forEach(t => {
                //     t.visited = false;
                //     t.visitedFromDirection = { x: 0, y: 0};
                // });
            };

            const mapHasLoop = (): boolean => {
                const dir = { x: 0, y: -1 };

                while (true) {
                    const tile = map[guardCoords.y][guardCoords.x];

                    if (tile.visited && tile.visitedFromDirection.x === dir.x && tile.visitedFromDirection.y === dir.y) {
                        return true;
                    } else if (!tile.visited) {
                        tile.visited = true;
                        tile.visitedFromDirection = {...dir};
                    }

                    const nextTileCoords = { x: guardCoords.x + dir.x, y: guardCoords.y + dir.y };

                    if (nextTileCoords.x < 0 || nextTileCoords.x >= lines[0].length || nextTileCoords.y < 0 || nextTileCoords.y >= lines.length) {
                        return false;
                    }

                    const nextTile = map[nextTileCoords.y][nextTileCoords.x];

                    if (nextTile.type === TileType.obstacle) {
                        const prevDir = { x: dir.x, y: dir.y };
                        dir.x = prevDir.x === 0 ? (prevDir.y * -1) : 0;
                        dir.y = prevDir.y === 0 ? (prevDir.x) : 0;
                    } else {
                        guardCoords.x += dir.x;
                        guardCoords.y += dir.y;
                    }
                }
            };

            mapHasLoop();
            const possibleCoordinates: { x: number, y: number }[] = [];
            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[0].length; x++) {
                    if (map[y][x].visited && !(initialGuardCoords.y === y && initialGuardCoords.x === x)) possibleCoordinates.push({ x, y });
                }
            }

            let obstructionCounter = 0;

            for (const coord of possibleCoordinates) {
                resetMap();

                map[coord.y][coord.x].type = TileType.obstacle;

                if (mapHasLoop()) obstructionCounter++;

                map[coord.y][coord.x].type = TileType.free;
            }

            return obstructionCounter;
        }
    }
};
