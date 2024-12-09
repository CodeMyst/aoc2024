import type { PuzzleSolver } from '../../core';

type Block = {
    index: number;
    id: number;
    length: number;
};

const parseBlocks = (input: string): Block[] => {
    const inputNumbers = input.trim().split('');
    const blocks: Block[] = [];
    let id = 0;
    for (let i = 0; i < inputNumbers.length; i++) {
        if (i % 2 === 0) {
            blocks.push({ id, length: Number(inputNumbers[i]), index: i });
            id++;
        } else {
            blocks.push({ id: -1, length: Number(inputNumbers[i]), index: i });
        }
    }

    return blocks;
};

const calculateChecksum = (blocks: Block[]): number => {
    let result = 0;
    let currentId = 0;
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].id !== -1) {
            for (let s = 0; s < blocks[i].length; s++) result += (currentId + s) * blocks[i].id;
        }

        currentId += blocks[i].length;
    }

    return result;
};

export const solve: PuzzleSolver = {
    part1: {
        expectedResult: { example: 1928, full: 6_461_289_671_426 },

        solve: (input: string): number => {
            const blocks = parseBlocks(input);

            for (let i = blocks.length - 1; i >= 0; i--) {
                if (blocks[i].id === -1) continue;

                const firstFreeBlockIndex = blocks.slice(0, i).findIndex(b => b.id === -1);

                if (firstFreeBlockIndex === -1) break;

                const firstFreeBlock = blocks[firstFreeBlockIndex];

                if (firstFreeBlock.length === blocks[i].length) {
                    firstFreeBlock.id = blocks[i].id;
                    blocks[i].id = -1;
                } else if (firstFreeBlock.length > blocks[i].length) {
                    firstFreeBlock.id = blocks[i].id;
                    const remainingFree = firstFreeBlock.length - blocks[i].length;
                    firstFreeBlock.length = blocks[i].length;

                    blocks[i].id = -1;

                    const newFreeBlock: Block = { id: -1, length: remainingFree, index: firstFreeBlock.index };
                    blocks.splice(firstFreeBlockIndex + 1, 0, newFreeBlock);
                } else {
                    firstFreeBlock.id = blocks[i].id;
                    const remainingFilled = blocks[i].length - firstFreeBlock.length;
                    blocks[i].length = remainingFilled;

                    const newFreeBlock: Block = { id: -1, length: firstFreeBlock.length, index: blocks[i].index };
                    blocks.splice(i + 1, 0, newFreeBlock);

                    i++;
                }
            }

            return calculateChecksum(blocks);
        }
    },

    part2: {
        expectedResult: { example: 4, full: 6_488_291_456_470 },

        solve: (input: string): number => {
            const blocks = parseBlocks(input);

            let currentId = blocks.toSorted((a, b) => a.id - b.id)[blocks.length - 1].id;
            while (currentId >= 0) {
                const block = blocks.find(b => b.id === currentId);
                currentId--;
                if (!block) continue;

                const firstFreeBlockIndex = blocks.findIndex(b => b.id === -1 && b.index < block.index && b.length >= block.length);

                if (firstFreeBlockIndex === -1) continue;

                const firstFreeBlock = blocks[firstFreeBlockIndex];

                if (firstFreeBlock.length === block.length) {
                    firstFreeBlock.id = block.id;
                    block.id = -1;
                } else if (firstFreeBlock.length > block.length) {
                    firstFreeBlock.id = block.id;
                    const remainingFree = firstFreeBlock.length - block.length;
                    firstFreeBlock.length = block.length;

                    block.id = -1;

                    const newFreeBlock: Block = { id: -1, length: remainingFree, index: firstFreeBlock.index };
                    blocks.splice(firstFreeBlockIndex + 1, 0, newFreeBlock);
                }
            }

            return calculateChecksum(blocks);
        }
    }
};
