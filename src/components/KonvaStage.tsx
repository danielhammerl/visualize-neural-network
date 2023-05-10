import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { useFormContext } from 'react-hook-form';
import { Settings } from '../types/Settings';
import * as _ from 'lodash';
import useResizeObserver from '@react-hook/resize-observer';
import { Neuron, NeuronProps } from './Konva/Neuron';
import Konva from 'konva';
import {
  calculateXPosOfHiddenNeuron,
  calculateYPosOfHiddenNeuron,
  calculateYPosOfInputNeuron,
  calculateYPosOfOutputNeuron,
  nonNullable,
} from '../utils';
import { CANVAS_VIRTUAL_HEIGHT, CANVAS_VIRTUAL_WIDTH, INPUT_NODE_X_POS, OUTPUT_NODE_X_POS } from '../constants';
import { NeuronType } from '../types/Neuron';
import { NeuronConnection, NeuronConnectionProps } from './Konva/NeuronConnection';

const func = _.throttle((set, ref) => set(ref?.current?.getBoundingClientRect()), 500);
type ConnectionLineDefinitions = Array<Array<Array<NeuronConnectionProps>>>;
export function KonvaStageWrapper() {
  const ref = useRef<HTMLDivElement>(null);
  const [boundaries, setBoundaries] = useState<DOMRect | undefined>(undefined);

  useResizeObserver(ref, () => {
    func(setBoundaries, ref);
  });

  return (
    <div id="konva-container" ref={ref} style={{ width: '66vw', height: '100vh' }}>
      <KonvaStage boundaries={boundaries} />
    </div>
  );
}

const calculateConnectionLines = (allNodes: Array<Array<NeuronProps>>): ConnectionLineDefinitions => {
  return allNodes.map((layer, layerIndex) =>
    layer
      .map((node) => {
        if (layerIndex === allNodes.length - 1) {
          return;
        }
        return allNodes[layerIndex + 1].map((nodeInNextLayer) => {
          return {
            weight: 1,
            node: node,
            nodeInNextLayer: nodeInNextLayer,
            onClick: () => {},
            greatestWeight: 10,
            smallestWeight: 1,
          } as NeuronConnectionProps;
        });
      })
      .filter(nonNullable),
  );
};

function KonvaStage({ boundaries }: { boundaries: DOMRect | undefined }) {
  const formData = useFormContext<Settings>().watch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const allNodes: Array<Array<NeuronProps>> = useMemo(
    () => [
      _.times(formData.numberOfInputNodes, (index) => ({
        xPos: INPUT_NODE_X_POS,
        yPos: calculateYPosOfInputNeuron(index, formData.numberOfInputNodes),
        type: 'input',
      })),
      ...formData.hiddenLayers.map((layer, index, hiddenLayers) =>
        _.times(layer.numberOfNodes, (indexNode) => ({
          xPos: calculateXPosOfHiddenNeuron(index, hiddenLayers.length),
          yPos: calculateYPosOfHiddenNeuron(layer.numberOfNodes, indexNode),
          type: 'hidden' as NeuronType,
        })),
      ),
      _.times(formData.numberOfOutputNodes, (index) => ({
        type: 'output',
        xPos: OUTPUT_NODE_X_POS,
        yPos: calculateYPosOfOutputNeuron(index, formData.numberOfOutputNodes),
      })),
    ],
    [formData.hiddenLayers, formData.numberOfInputNodes, formData.numberOfOutputNodes],
  );

  const [connectionLines, setConnectionLines] = useState(calculateConnectionLines(allNodes));
  useEffect(() => {
    setConnectionLines(calculateConnectionLines(allNodes));
  }, [allNodes]);

  const scale = Math.min(
    (boundaries?.width ?? CANVAS_VIRTUAL_WIDTH) / CANVAS_VIRTUAL_WIDTH,
    (boundaries?.height ?? CANVAS_VIRTUAL_HEIGHT) / CANVAS_VIRTUAL_HEIGHT,
  );

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const stage = stageRef.current;
    if (!scrollContainer || !stage) {
      return;
    }
    /*
    const repositionStage = () => {
      var dx = scrollContainer.scrollLeft;
      var dy = scrollContainer.scrollTop;
      stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      stage.x(-dx);
      stage.y(-dy);
    };

    scrollContainer.addEventListener('scroll', repositionStage);

    return () => {
      scrollContainer.removeEventListener('scroll', repositionStage);
    };*/
  });

  return (
    <div id="scroll-container" ref={scrollContainerRef}>
      <Stage
        ref={stageRef}
        scale={{ x: scale, y: scale }}
        width={CANVAS_VIRTUAL_WIDTH * scale}
        height={CANVAS_VIRTUAL_HEIGHT * scale}
      >
        <Layer>
          <ConnectionLines connectionLines={connectionLines} />
          {allNodes.map((layer, layerIndex) =>
            layer.map((node, nodeIndex) => (
              <Neuron key={`${layerIndex}-${nodeIndex}`} xPos={node.xPos} yPos={node.yPos} type={node.type} />
            )),
          )}
        </Layer>
      </Stage>
    </div>
  );
}

function ConnectionLines({ connectionLines }: { connectionLines: ConnectionLineDefinitions }): React.JSX.Element {
  return (
    <>
      {connectionLines.map((layer, layerIndex) =>
        layer.map((node, nodeIndex) => {
          return node.map((connection, connectionIndex) => (
            <NeuronConnection
              onClick={connection.onClick}
              node={connection.node}
              nodeInNextLayer={connection.nodeInNextLayer}
              key={`${layerIndex}-${nodeIndex}-${connectionIndex}`}
              weight={connection.weight}
              greatestWeight={connection.greatestWeight}
              smallestWeight={connection.smallestWeight}
            />
          ));
        }),
      )}
    </>
  );
}
