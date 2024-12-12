import type { PuzzleSolver } from '../../core';

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 1930, full: 1_421_958 },

        solve: (input: string): number => {
            type Tile = {
                type: string;
                visited: boolean;
            };

            const map = input.split('\n').filter(l => l.length > 1).map(l => l.split('').map(t => ({ type: t, visited: false } as Tile)));

            const getFirstNonVisitedTile = (): { x: number, y: number } | null => {
                for (let y = 0; y < map.length; y++) {
                    for (let x = 0; x < map[0].length; x++) {
                        if (!map[y][x].visited) return { x, y };
                    }
                }

                return null;
            };

            const getRegionAreaAndPerimeter = (x: number, y: number, currentArea: number, currentPerimeter: number): [ area: number, perimeter: number ] => {
                const current = map[y][x];
                if (current.visited) return [ currentArea, currentPerimeter ];
                
                current.visited = true;

                currentArea += 1;

                if (x > 0) {
                    const left = map[y][x-1];
                    if (left.type === current.type) {
                        const [ area, perimeter ] = getRegionAreaAndPerimeter(x-1, y, 0, 0);
                        currentArea += area;
                        currentPerimeter += perimeter;
                    } else {
                        currentPerimeter += 1;
                    }
                } else {
                    currentPerimeter += 1;
                }

                if (x < map[y].length - 1) {
                    const right = map[y][x+1];
                    if (right.type === current.type) {
                        const [ area, perimeter ] = getRegionAreaAndPerimeter(x+1, y, 0, 0);
                        currentArea += area;
                        currentPerimeter += perimeter;
                    } else {
                        currentPerimeter += 1;
                    }
                } else {
                    currentPerimeter += 1;
                }

                if (y > 0) {
                    const top = map[y-1][x];
                    if (top.type === current.type) {
                        const [ area, perimeter ] = getRegionAreaAndPerimeter(x, y-1, 0, 0);
                        currentArea += area;
                        currentPerimeter += perimeter;
                    } else {
                        currentPerimeter += 1;
                    }
                } else {
                    currentPerimeter += 1;
                }

                if (y < map.length - 1) {
                    const bottom = map[y+1][x];
                    if (bottom.type === current.type) {
                        const [ area, perimeter ] = getRegionAreaAndPerimeter(x, y+1, 0, 0);
                        currentArea += area;
                        currentPerimeter += perimeter;
                    } else {
                        currentPerimeter += 1;
                    }
                } else {
                    currentPerimeter += 1;
                }

                return [currentArea, currentPerimeter];
            };

            let result = 0;

            let firstNonVisitedTile = getFirstNonVisitedTile();
            while (firstNonVisitedTile) {
                const [ area, perimeter ] = getRegionAreaAndPerimeter(firstNonVisitedTile.x, firstNonVisitedTile.y, 0, 0);

                result += area * perimeter;
                
                firstNonVisitedTile = getFirstNonVisitedTile();
            }

            return result;
        }
    },

    part2: {
        expectedResult: { example: 4, full: 13 },

        solve: (input: string): number => {
            type Tile = {
                type: string;
                visited: boolean;
            };

            const map = input.split('\n').filter(l => l.length > 1).map(l => l.split('').map(t => ({ type: t, visited: false } as Tile)));

            const getFirstNonVisitedTile = (): { x: number, y: number } | null => {
                for (let y = 0; y < map.length; y++) {
                    for (let x = 0; x < map[0].length; x++) {
                        if (!map[y][x].visited) return { x, y };
                    }
                }

                return null;
            };

            const getRegionAreaAndPerimeter = (x: number, y: number, currentArea: number, currentPerimeter: number): [ area: number, perimeter: number ] => {
                const current = map[y][x];
                if (current.visited) return [ currentArea, currentPerimeter ];
                
                current.visited = true;

                currentArea += 1;

                let sides = 0;

                let left: Tile | null = null;
                if (x > 0) {
                    left = map[y][x-1];
                    if (left.type === current.type) {
                        const [ area, perimeter ] = getRegionAreaAndPerimeter(x-1, y, 0, 0);
                        currentArea += area;
                        currentPerimeter += perimeter;
                        sides++;
                    } else {
                        // currentPerimeter += 1;
                    }
                } else {
                    // currentPerimeter += 1;
                }

                let right: Tile | null = null
                if (x < map[y].length - 1) {
                    right = map[y][x+1];
                    if (right.type === current.type) {
                        const [ area, perimeter ] = getRegionAreaAndPerimeter(x+1, y, 0, 0);
                        currentArea += area;
                        currentPerimeter += perimeter;
                        sides++;
                    } else {
                        // currentPerimeter += 1;
                    }
                } else {
                    // currentPerimeter += 1;
                }

                let top: Tile | null = null
                if (y > 0) {
                    top = map[y-1][x];
                    if (top.type === current.type) {
                        const [ area, perimeter ] = getRegionAreaAndPerimeter(x, y-1, 0, 0);
                        currentArea += area;
                        currentPerimeter += perimeter;
                        sides++;
                    } else {
                        // currentPerimeter += 1;
                    }
                } else {
                    // currentPerimeter += 1;
                }

                let bottom: Tile | null = null
                if (y < map.length - 1) {
                    bottom = map[y+1][x];
                    if (bottom.type === current.type) {
                        const [ area, perimeter ] = getRegionAreaAndPerimeter(x, y+1, 0, 0);
                        currentArea += area;
                        currentPerimeter += perimeter;
                        sides++;
                    } else {
                        // currentPerimeter += 1;
                    }
                } else {
                    // currentPerimeter += 1;
                }

                const hasTop = top && top.type !== current.type;
                const hasBottom = bottom && bottom.type !== current.type;
                const hasLeft = left && left.type !== current.type;
                const hasRight = right && right.type !== current.type;

                if (sides === 0) {
                    currentPerimeter += 4;
                } else if (hasTop && hasRight && !hasLeft && !hasBottom) {
                    currentPerimeter += 2;
                } else if (hasTop && hasLeft && !hasBottom && !hasRight) {
                    currentPerimeter += 2;
                } else if (hasLeft && hasBottom && !hasTop && !hasRight) {
                    currentPerimeter += 2;
                } else if (hasBottom && hasRight && !hasLeft && !hasTop) {
                    currentPerimeter += 2;
                }

                return [currentArea, currentPerimeter];
            };

            let result = 0;

            let firstNonVisitedTile = getFirstNonVisitedTile();
            while (firstNonVisitedTile) {
                const [ area, perimeter ] = getRegionAreaAndPerimeter(firstNonVisitedTile.x, firstNonVisitedTile.y, 0, 0);

                result += area * perimeter;
                
                firstNonVisitedTile = getFirstNonVisitedTile();
            }

            return result;
        }
    }
};
