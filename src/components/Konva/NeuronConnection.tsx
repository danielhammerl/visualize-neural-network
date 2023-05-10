import React, { useState } from 'react';
import { Line, Rect, Text } from 'react-konva';
import { NeuronProps } from './Neuron';

export interface NeuronConnectionProps {
  node: NeuronProps;
  nodeInNextLayer: NeuronProps;
  weight: number;
  greatestWeightAbsolute: number;
  onClick: () => void;
}

const RECT_WIDTH = 20;
const RECT_HEIGHT = 30;

const strokeWidthMax = 15;
const strokeWidthMin = 1;

export function NeuronConnection({
  node,
  nodeInNextLayer,
  weight,
  greatestWeightAbsolute,
  onClick,
}: NeuronConnectionProps) {
  const [hover, setHover] = useState<boolean>(false);

  const isPositive = weight > 0;
  const isNegative = weight < 0;
  const isNull = weight === 0;

  console.log({ weight, greatestWeightAbsolute });
  const weightRatio = Math.abs(weight) / greatestWeightAbsolute;
  const strokeWidth = Math.max(isNull ? 1 : Math.abs(weightRatio) * strokeWidthMax, strokeWidthMin);
  const color = isPositive ? 'blue' : isNegative ? 'red' : 'black';

  return (
    <>
      <Line
        onClick={onClick}
        shadowColor={color}
        shadowBlur={10}
        shadowOpacity={hover ? 1 : 0}
        hitStrokeWidth={strokeWidthMax * 2}
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
        stroke={color}
        strokeWidth={strokeWidth}
        lineCap={'round'}
        lineJoin={'round'}
      />
      {hover && (
        <>
          <Rect
            x={(nodeInNextLayer.xPos - node.xPos) / 2 + node.xPos - 10}
            y={(nodeInNextLayer.yPos - node.yPos) / 2 + node.yPos}
            width={weight.toString().length * RECT_WIDTH + 10}
            height={RECT_HEIGHT}
            fill="black"
            alpha={0.75}
          />
          <Text
            x={(nodeInNextLayer.xPos - node.xPos) / 2 + node.xPos}
            y={(nodeInNextLayer.yPos - node.yPos) / 2 + node.yPos}
            text={weight.toString()}
            fontFamily="Calibri"
            fontSize={30}
            fill="white"
            alpha={1}
          />
        </>
      )}
    </>
  );
}
