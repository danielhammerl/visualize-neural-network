import React from 'react';
import { Circle } from 'react-konva';
import { NeuronType } from '../../types/Neuron';

export interface NeuronProps {
  xPos: number;
  yPos: number;
  type: NeuronType;
}

const getColor = (type: NeuronType): string => {
  const colorMap: Record<NeuronType, string> = {
    input: 'blue',
    output: 'red',
    hidden: 'gray',
  };
  return colorMap[type];
};

const maxNeuronRadius = 20;
const minNeuronRadius = 5;
export const getNeuronRadius = (numberOfMaxNodes: number): number => {
  const calculatedRadius = 20 * (20 / numberOfMaxNodes);
  if (calculatedRadius > maxNeuronRadius) {
    return maxNeuronRadius;
  }
  if (calculatedRadius < minNeuronRadius) {
    return minNeuronRadius;
  }
  return calculatedRadius;
};

export function Neuron({ xPos, yPos, type }: NeuronProps) {
  return <Circle stroke={'black'} strokeWidth={1} x={xPos} y={yPos} radius={19} fill={getColor(type)} />;
}
