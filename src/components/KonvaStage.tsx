import React, { createRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Layer, Stage, Circle, Line } from 'react-konva';
import { useFormContext } from 'react-hook-form';
import { Settings } from '../types/Settings';
import * as _ from 'lodash';
import useResizeObserver from '@react-hook/resize-observer';
import { getNeuronRadius, Neuron } from './Konva/Neuron';
import Konva from 'konva';

const func = _.throttle((set, ref) => set(ref?.current?.getBoundingClientRect()), 500);
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

function KonvaStage({ boundaries }: { boundaries: DOMRect | undefined }) {
  const formData = useFormContext<Settings>().watch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const CANVAS_VIRTUAL_WIDTH = 1000;
  const CANVAS_VIRTUAL_HEIGHT = 1000;

  const INPUT_NODE_X_POS = 20;
  const OUTPUT_NODE_X_POS = 980;

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
          {_.times(formData.numberOfInputNodes, (index) => {
            return (
              <Neuron
                key={index}
                type="input"
                xPos={INPUT_NODE_X_POS}
                radius={20}
                yPos={
                  (CANVAS_VIRTUAL_HEIGHT / formData.numberOfInputNodes) * index +
                  CANVAS_VIRTUAL_HEIGHT / formData.numberOfInputNodes / 2
                }
              />
            );
          })}
          {formData.hiddenLayers.map((layer, index, hiddenLayers) => {
            return _.times(layer.numberOfNodes, (indexNode) => {
              return (
                <Neuron
                  key={indexNode}
                  xPos={
                    ((OUTPUT_NODE_X_POS - 20) / hiddenLayers.length) * index +
                    (OUTPUT_NODE_X_POS - 20) / hiddenLayers.length / 2 +
                    INPUT_NODE_X_POS +
                    20
                  }
                  yPos={
                    (CANVAS_VIRTUAL_HEIGHT / layer.numberOfNodes) * indexNode +
                    CANVAS_VIRTUAL_HEIGHT / layer.numberOfNodes / 2
                  }
                  type={'hidden'}
                  radius={20}
                />
              );
            });
          })}
          {_.times(formData.numberOfOutputNodes, (index) => {
            return (
              <Neuron
                key={index}
                type="output"
                xPos={OUTPUT_NODE_X_POS}
                radius={20}
                yPos={
                  (CANVAS_VIRTUAL_HEIGHT / formData.numberOfOutputNodes) * index +
                  CANVAS_VIRTUAL_HEIGHT / formData.numberOfOutputNodes / 2
                }
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
