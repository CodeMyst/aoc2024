import type { PuzzleSolver } from '../../core';

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 21, full: 230_686_500 },

        solve: (input: string): number => {
            const width = 101;
            const height = 103;

            const lines = input.split('\n').filter(l => l.length > 1);

            let quadrants: number[] = [0, 0, 0, 0];

            for (const line of lines) {
                const match = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)!.map(Number);
                const x = match[1];
                const y = match[2];
                const xVel = match[3];
                const yVel = match[4];

                const finalX = (((x + (100 * xVel)) % width) + width) % width;
                const finalY = (((y + (100 * yVel)) % height) + height) % height;

                if (finalX < width / 2 - 1 && finalY < height / 2 - 1) {
                    quadrants[0]++;
                } else if (finalX > width / 2 && finalY < height / 2 - 1) {
                    quadrants[1]++;
                } else if (finalX < width / 2 - 1 && finalY > height / 2) {
                    quadrants[2]++;
                } else if (finalX > width / 2 && finalY > height / 2) {
                    quadrants[3]++;
                }
            }

            return quadrants[0] * quadrants[1] * quadrants[2] * quadrants[3];
        }
    },

    part2: {
        expectedResult: { example: -1, full: 7_672 },

        solve: (input: string): number => {
            const width = 101;
            const height = 103;

            const lines = input.split('\n').filter(l => l.length > 1);

            type Robot = {
                x: number;
                y: number;
                xVel: number;
                yVel: number;
            };

            const robots: Robot[] = [];

            for (const line of lines) {
                const match = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)!.map(Number);
                const x = match[1];
                const y = match[2];
                const xVel = match[3];
                const yVel = match[4];

                robots.push({x, y, xVel, yVel});
            }

            let second = 0;
            while(second < 10000) {
                for (const robot of robots) {
                    robot.x = (((robot.x + robot.xVel) % width) + width) % width;
                    robot.y = (((robot.y + robot.yVel) % height) + height) % height;
                }

                for (let y = 0; y < height; y++) {
                    const rowRobots = robots.filter(r => r.y === y);

                    if (rowRobots.length < 30) continue;

                    let windowStart = 0;
                    while (windowStart + 30 < width) {
                        let good = true;
                        for (let i = 0; i < 30; i++) {
                            if (rowRobots.filter(r => r.x === windowStart + i).length === 0) {
                                good = false;
                            }
                        }

                        if (good) return second + 1;

                        windowStart++;
                    }
                }

                second++;
            }

            return -1;
        }
    }
};
