import type { PuzzleSolver } from '../../core';

const solveEquation = (m: number[][]): number[] => {
    const n = m.length;

    for (let i = 0; i < n; i++) {
        let max = Math.abs(m[i][i]);
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(m[k][i]) > max) {
                max = Math.abs(m[k][i]);
                maxRow = i;
            }
        }

        for (let k = i; k < n + 1; k++) {
            const tmp = m[maxRow][k];
            m[maxRow][k] = m[i][k];
            m[i][k] = tmp;
        }

        for (let k = i + 1; k < n; k++) {
            const c = -m[k][i]/m[i][i];
            for (let j = i; j < n + 1; j++) {
                if (i === j) {
                    m[k][j] = 0;
                } else {
                    m[k][j] += c * m[i][j];
                }
            }
        }
    }

    let x = Array.from({ length: n}, () => 0);
    for (let i = n - 1; i > -1; i--) {
        x[i] = m[i][n]/m[i][i];
        for (let k = i - 1; k > -1; k--) {
            m[k][n] -= m[k][i] * x[i];
        }
    }

    x = x.map(x => Math.round(x * Math.pow(10, 2)) / Math.pow(10, 2));

    return x;
};

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 480, full: 36_758 },

        solve: (input: string): number => {
            const problems = input.split('\n\n');

            let result = 0;
            for (const problem of problems) {
                const matches = problem.match(/\d+/g)!.map(Number);

                const m = [
                    [matches[0], matches[2], matches[4]],
                    [matches[1], matches[3], matches[5]]
                ];

                const [aCount, bCount] = solveEquation(m);

                if (aCount % 1 === 0 && bCount % 1 === 0) {
                    result += aCount * 3 + bCount;
                }
            }

            return result;
        }
    },

    part2: {
        expectedResult: { example: 875_318_608_908, full: 76_358_113_886_726 },

        solve: (input: string): number => {
            const problems = input.split('\n\n');

            let result = 0;
            for (const problem of problems) {
                const matches = problem.match(/\d+/g)!.map(Number);

                const m = [
                    [matches[0], matches[2], 10000000000000 + matches[4]],
                    [matches[1], matches[3], 10000000000000 + matches[5]]
                ];

                const [aCount, bCount] = solveEquation(m);

                if (aCount % 1 === 0 && bCount % 1 === 0) {
                    result += aCount * 3 + bCount;
                }
            }

            return result;
        }
    }
};
