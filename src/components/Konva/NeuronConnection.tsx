import React, { useState } from 'react';
import { Line } from 'react-konva';
import { NeuronProps } from './Neuron';

export interface NeuronConnectionProps {
  node: NeuronProps;
  nodeInNextLayer: NeuronProps;
  weight: number;
  greatestWeight: number;
  smallestWeight: number;
  onClick: () => void;
}

export function NeuronConnection({
  node,
  nodeInNextLayer,
  weight,
  greatestWeight,
  onClick,
  smallestWeight,
}: NeuronConnectionProps) {
  const [hover, setHover] = useState<boolean>(false);

  const strokeWidthMax = 10;
  const strokeWidthMin = 1;
  const isPositive = weight > 0;
  const isNegative = weight < 0;
  const isNull = weight === 0;

  const weightRatio = isPositive ? weight / greatestWeight : weight / smallestWeight;
  let strokeWidth = isNull ? 1 : Math.abs(weightRatio) * strokeWidthMax;
  strokeWidth = strokeWidth < strokeWidthMin ? strokeWidthMin : strokeWidth;
  if (hover) {
    strokeWidth = strokeWidthMax * 1.5;
  }

  return (
    <Line
      onClick={onClick}
      hitStrokeWidth={strokeWidthMax}
      onMouseOver={(e) => {
        const container = e.target?.getStage()?.container();
        if (container) {
          container.style.cursor = 'pointer';
        }
        setHover(true);
      }}
      onMouseLeave={(e) => {
        const container = e.target?.getStage()?.container();
        if (container) {
          container.style.cursor = 'default';
        }
        setHover(false);
      }}
      points={[node.xPos, node.yPos, nodeInNextLayer.xPos, nodeInNextLayer.yPos]}
      stroke={isPositive ? 'blue' : isNegative ? 'red' : 'black'}
      strokeWidth={strokeWidth}
      lineCap={'round'}
      lineJoin={'round'}
    />
  );
}
