import type { PuzzleSolver } from '../../core';

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 10_092, full: 1_475_249 },

        solve: (input: string): number => {
            type Tile = { type: 'wall' | 'box' | 'space' };
            type Direction = '^' | '>' | 'v' | '<';

            const [mapInput, directionsInput] = input.split('\n\n');

            const map: Tile[][] = [];
            let playerCoords: { x: number, y: number } = { x: 0, y: 0};
            const rows = mapInput.split('\n');
            for (let y = 0; y < rows.length; y++) {
                 map.push(rows[y].split('').map((t, i) => {
                     if (t === '@') playerCoords = { x: i, y };
                     return { type: t === '#' ? 'wall' : t === 'O' ? 'box' : 'space' };
                 }));               
            }

            const directions: Direction[] = directionsInput.split('\n').join().split('').map(d => d as Direction);

            for (const dir of directions) {
                if (dir === '<') {
                    const firstSpaceIndex = map[playerCoords.y].slice(0, playerCoords.x).findLastIndex(t => t.type === 'space');
                    const firstSpaceSlice = map[playerCoords.y].slice(firstSpaceIndex, playerCoords.x);

                    if (firstSpaceIndex === -1 || firstSpaceSlice.filter(t => t.type === 'wall').length > 0) {
                        continue;
                    }

                    playerCoords.x--;

                    if (firstSpaceSlice.length === 1) {
                        continue;
                    }

                    for (const tile of firstSpaceSlice.slice(0, -1)) {
                        tile.type = 'box';
                    }

                    firstSpaceSlice.slice(-1)[0].type = 'space';
                } else if (dir === 'v') {
                    const firstSpaceIndex = map.slice(playerCoords.y + 1, map.length).findIndex(r => r[playerCoords.x].type === 'space');
                    const firstSpaceSlice = map.slice(playerCoords.y + 1, playerCoords.y + 1 + firstSpaceIndex + 1);

                    if (firstSpaceIndex === -1 || firstSpaceSlice.filter(r => r[playerCoords.x].type === 'wall').length > 0) {
                        continue;
                    }

                    playerCoords.y++;

                    if (firstSpaceSlice.length === 1) {
                        continue;
                    }

                    for (const row of firstSpaceSlice.slice(1)) {
                        row[playerCoords.x].type = 'box';
                    }

                    firstSpaceSlice[0][playerCoords.x].type = 'space';
                } else if (dir === '>') {
                    const firstSpaceIndex = map[playerCoords.y].slice(playerCoords.x + 1, map[0].length).findIndex(t => t.type === 'space');
                    const firstSpaceSlice = map[playerCoords.y].slice(playerCoords.x + 1, playerCoords.x + 1 + firstSpaceIndex + 1);

                    if (firstSpaceIndex === -1 || firstSpaceSlice.filter(t => t.type === 'wall').length > 0) {
                        continue;
                    }

                    playerCoords.x++;

                    if (firstSpaceSlice.length === 1) {
                        continue;
                    }

                    for (const tile of firstSpaceSlice.slice(1)) {
                        tile.type = 'box';
                    }

                    firstSpaceSlice[0].type = 'space';
                } else if (dir === '^') {
                    const firstSpaceIndex = map.slice(0, playerCoords.y).findLastIndex(r => r[playerCoords.x].type === 'space');
                    const firstSpaceSlice = map.slice(firstSpaceIndex, playerCoords.y);

                    if (firstSpaceIndex === -1 || firstSpaceSlice.filter(r => r[playerCoords.x].type === 'wall').length > 0) {
                        continue;
                    }

                    playerCoords.y--;

                    if (firstSpaceSlice.length === 1) {
                        continue;
                    }

                    for (const row of firstSpaceSlice.slice(0, -1)) {
                        row[playerCoords.x].type = 'box';
                    }

                    firstSpaceSlice.slice(-1)[0][playerCoords.x].type = 'space';
                }
            }

            const calculateScore = () => {
                let score = 0;
                for (let y = 0; y < map.length; y++) {
                    for (let x = 0; x < map[0].length; x++) {
                        if (map[y][x].type === 'box') {
                            score += 100 * y + x;
                        }
                    }
                }

                return score;
            };

            return calculateScore();
        }
    },

    part2: {
        expectedResult: { example: 9_021, full: 1_509_724},

        solve: (input: string): number => {
            type Tile = { type: 'wall' | 'boxLeft' | 'boxRight' | 'space' };
            type Direction = '^' | '>' | 'v' | '<';

            const [mapInput, directionsInput] = input.split('\n\n');

            let playerCoords: { x: number, y: number } = { x: 0, y: 0 };

            const map: Tile[][] = [];
            const rows = mapInput.split('\n');
            for (let y = 0; y < rows.length; y++) {
                const tiles = rows[y].split('').map((t, i): Tile[] => {
                    if (t === '#') {
                        return [{type: 'wall'}, {type: 'wall'}];
                    } else if (t === 'O') {
                        return [{type: 'boxLeft'}, {type: 'boxRight'}];
                    } else if (t === '@') {
                        playerCoords.x = i * 2;
                        playerCoords.y = y;
                        return [{type: 'space'}, {type: 'space'}];
                    } else {
                        return [{type: 'space'}, {type: 'space'}];
                    }
                }).flat();

                map.push(tiles);
            }

            const directions: Direction[] = directionsInput.split('\n').join().split('').map(d => d as Direction);
            for (const dir of directions) {
                if (dir === '<') {
                    const firstSpaceIndex = map[playerCoords.y].slice(0, playerCoords.x).findLastIndex(t => t.type === 'space');
                    const firstSpaceSlice = map[playerCoords.y].slice(firstSpaceIndex, playerCoords.x);

                    if (firstSpaceIndex === -1 || firstSpaceSlice.filter(t => t.type === 'wall').length > 0) {
                        continue;
                    }

                    playerCoords.x--;

                    if (firstSpaceSlice.length === 1) {
                        continue;
                    }

                    for (const tile of firstSpaceSlice.slice(0, -1)) {
                        if (tile.type === 'space') tile.type = 'boxLeft';
                        else tile.type = tile.type === 'boxLeft' ? 'boxRight' : 'boxLeft';
                    }

                    firstSpaceSlice.slice(-1)[0].type = 'space';
                } else if (dir === '>') {
                    const firstSpaceIndex = map[playerCoords.y].slice(playerCoords.x + 1, map[0].length).findIndex(t => t.type === 'space');
                    const firstSpaceSlice = map[playerCoords.y].slice(playerCoords.x + 1, playerCoords.x + 1 + firstSpaceIndex + 1);

                    if (firstSpaceIndex === -1 || firstSpaceSlice.filter(t => t.type === 'wall').length > 0) {
                        continue;
                    }

                    playerCoords.x++;

                    if (firstSpaceSlice.length === 1) {
                        continue;
                    }

                    for (const tile of firstSpaceSlice.slice(1)) {
                        if (tile.type === 'space') tile.type = 'boxRight';
                        else tile.type = tile.type === 'boxLeft' ? 'boxRight' : 'boxLeft';
                    }

                    firstSpaceSlice[0].type = 'space';
                } else if (dir === '^') {
                    const boxesToMove: { x: number, y: number }[] = [];
                    const canMove = (x: number, y: number): boolean => {
                        if (map[y-1][x].type === 'boxLeft') {
                            boxesToMove.push({ x: x, y: y-1 });
                            boxesToMove.push({ x: x+1, y: y-1 });

                            if (!canMove(x, y-1)) return false;
                            if (!canMove(x+1, y-1)) return false;
                        } else if (map[y-1][x].type === 'boxRight') {
                            boxesToMove.push({ x: x, y: y-1 });
                            boxesToMove.push({ x: x-1, y: y-1 });

                            if (!canMove(x, y-1)) return false;
                            if (!canMove(x-1, y-1)) return false;
                        } else if (map[y-1][x].type === 'space') {
                            boxesToMove.push({ x: x, y: y-1 });

                            return true;
                        } else if (map[y-1][x].type === 'wall') {
                            return false;
                        }

                        return true;
                    };

                    if (canMove(playerCoords.x, playerCoords.y)) {
                        for (const box of boxesToMove.sort((a, b) => a.y - b.y)) {
                            if (boxesToMove.filter(b => b.x === box.x && b.y === box.y+1).length > 0) {
                                map[box.y][box.x].type = map[box.y+1][box.x].type;
                            } else {
                                map[box.y][box.x].type = 'space';
                            }
                        }
                        playerCoords.y--;
                    }
                } else if (dir === 'v') {
                    const boxesToMove: { x: number, y: number }[] = [];
                    const canMove = (x: number, y: number): boolean => {
                        if (map[y+1][x].type === 'boxLeft') {
                            boxesToMove.push({ x: x, y: y+1 });
                            boxesToMove.push({ x: x+1, y: y+1 });

                            if (!canMove(x, y+1)) return false;
                            if (!canMove(x+1, y+1)) return false;
                        } else if (map[y+1][x].type === 'boxRight') {
                            boxesToMove.push({ x: x, y: y+1 });
                            boxesToMove.push({ x: x-1, y: y+1 });

                            if (!canMove(x, y+1)) return false;
                            if (!canMove(x-1, y+1)) return false;
                        } else if (map[y+1][x].type === 'space') {
                            boxesToMove.push({ x: x, y: y+1 });

                            return true;
                        } else if (map[y+1][x].type === 'wall') {
                            return false;
                        }

                        return true;
                    };

                    if (canMove(playerCoords.x, playerCoords.y)) {
                        for (const box of boxesToMove.sort((a, b) => b.y - a.y)) {
                            if (boxesToMove.filter(b => b.x === box.x && b.y === box.y-1).length > 0) {
                                map[box.y][box.x].type = map[box.y-1][box.x].type;
                            } else {
                                map[box.y][box.x].type = 'space';
                            }
                        }
                        playerCoords.y++;
                    }
                }
            }

            const calculateScore = () => {
                let score = 0;
                for (let y = 0; y < map.length; y++) {
                    for (let x = 0; x < map[0].length; x++) {
                        if (map[y][x].type === 'boxLeft') {
                            score += 100 * y + x;
                        }
                    }
                }

                return score;
            };

            return calculateScore();
        }
    }
};
