import { CANVAS_VIRTUAL_HEIGHT, INPUT_NODE_X_POS, OUTPUT_NODE_X_POS } from './constants';

export const calculateYPosOfInputNeuron = (index: number, numberOfInputNodes: number) => {
  return (CANVAS_VIRTUAL_HEIGHT / numberOfInputNodes) * index + CANVAS_VIRTUAL_HEIGHT / numberOfInputNodes / 2;
};

export const calculateYPosOfOutputNeuron = (index: number, numberOfOutputNodes: number) => {
  return (CANVAS_VIRTUAL_HEIGHT / numberOfOutputNodes) * index + CANVAS_VIRTUAL_HEIGHT / numberOfOutputNodes / 2;
};

export const calculateXPosOfHiddenNeuron = (index: number, numberOfHiddenLayers: number) => {
  return (
    ((OUTPUT_NODE_X_POS - 20) / numberOfHiddenLayers) * index +
    (OUTPUT_NODE_X_POS - 20) / numberOfHiddenLayers / 2 +
    INPUT_NODE_X_POS +
    20
  );
};

export const calculateYPosOfHiddenNeuron = (numberOfNodesinLayer: number, indexNode: number) => {
  return (CANVAS_VIRTUAL_HEIGHT / numberOfNodesinLayer) * indexNode + CANVAS_VIRTUAL_HEIGHT / numberOfNodesinLayer / 2;
};

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
