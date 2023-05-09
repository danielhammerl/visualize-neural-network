import React from 'react';
import { Circle } from 'react-konva';
import { NeuronType } from '../../types/Neuron';

interface NeuronProps {
  xPos: number;
  yPos: number;
  type: NeuronType;
  radius: number;
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

export function Neuron({ xPos, yPos, type, radius }: NeuronProps) {
  return <Circle x={xPos} y={yPos} radius={radius} fill={getColor(type)} />;
}
