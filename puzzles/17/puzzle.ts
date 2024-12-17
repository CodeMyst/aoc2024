import type { PuzzleSolver } from '../../core';

// NOTE: works only on my input (even the example doesn't work) :)

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: '5,0,4,5', full: '4,0,4,7,1,2,7,1,6' },

        solve: (input: string): string => {
            const registersInput = input.split('\n\n')
                                        .map(l => l.split('\n').filter(l => l.length > 1))[0];

            const registers = registersInput.map(r => Number(r.match(/(\d+)/)![0]));

            let a = registers[0];
            const res: number[] = [];
            while (a !== 0) {
                const b = (a & 7) ^ 1;
                res.push((b ^ 4 ^ (a >> b)) & 7);
                a = a >> 3;
            }

            return res.join(',');
        }
    },

    part2: {
        expectedResult: { example: undefined!, full: 202322348616234n },

        solve: (input: string): bigint => {
            const programInput = input.split('\n\n')
                                      .map(l => l.split('\n').filter(l => l.length > 1))[1];

            const program = programInput[0].slice(9).split(',').map(BigInt);

            let arr = [0n];
            for (let i = program.length - 1; i >= 0; i--) {
                const d = program[i];
                const newArr: bigint[] = [];

                for (const c of arr) {
                    for (let j = 0n; j < 8n; j++) {
                        const a = (c << 3n) | j;
                        const b = (a & 7n) ^ 1n;
                        const res = (b ^ 4n ^ (a >> b)) & 7n;

                        if (res === d) {
                            newArr.push(a);
                        }
                    }
                }

                arr = newArr;
            }

            let min = arr[0];
            for (const v of arr) {
                if (v < min) {
                    min = v;
                }
            }

            return min;
        }
    }
};
