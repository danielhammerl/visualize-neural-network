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
import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';

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

const calculateWeightExtremes = (
  connectionLines: ConnectionLineDefinitions,
): { greatestWeight: number; smallestWeight: number } => {
  const nodesFlattened = connectionLines.flat().flat().flat();
  const greatestWeight = _.maxBy(nodesFlattened, 'weight')?.weight ?? 1;
  const smallestWeight = _.minBy(nodesFlattened, 'weight')?.weight ?? 1;

  return { greatestWeight, smallestWeight };
};

const calculateConnectionLines = (
  allNodes: Array<Array<NeuronProps>>,
  onClickHandler: (id: string) => void,
): ConnectionLineDefinitions => {
  return allNodes.map((layer, layerIndex) =>
    layer
      .map((node, nodeIndex) => {
        if (layerIndex === allNodes.length - 1) {
          return;
        }
        return allNodes[layerIndex + 1].map((nodeInNextLayer, nodeInNextLayerIndex) => {
          return {
            weight: 1,
            node: node,
            nodeInNextLayer: nodeInNextLayer,
            onClick: () => {
              onClickHandler(`${layerIndex}-${nodeIndex}-${nodeInNextLayerIndex}`);
            },
            greatestWeight: 10,
            smallestWeight: -10,
          } as NeuronConnectionProps;
        });
      })
      .filter(nonNullable),
  );
};

const getPartsOfId = (id: string): number[] => {
  return id.split('-').map((item) => Number.parseInt(item));
};

const getDefaultValue = (connectionLineToEdit: string, connectionLines: ConnectionLineDefinitions): number => {
  const partsOfId = getPartsOfId(connectionLineToEdit);
  return connectionLines[partsOfId[0]][partsOfId[1]][partsOfId[2]].weight;
};

function KonvaStage({ boundaries }: { boundaries: DOMRect | undefined }) {
  const formData = useFormContext<Settings>().watch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const formDataAsJson = JSON.stringify(formData);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formDataAsJson],
  );

  const [connectionLineToEdit, setConnectionLineToEdit] = useState<string>('');
  const [connectionLines, setConnectionLines] = useState<ConnectionLineDefinitions>(
    calculateConnectionLines(allNodes, setConnectionLineToEdit),
  );
  useEffect(() => {
    setConnectionLines(calculateConnectionLines(allNodes, (id) => setConnectionLineToEdit(id)));
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
    <>
      {connectionLineToEdit && (
        <Dialog open={!!connectionLineToEdit} onClose={() => setConnectionLineToEdit('')}>
          <DialogContent>
            <TextField
              defaultValue={getDefaultValue(connectionLineToEdit, connectionLines)}
              InputProps={{ inputProps: { min: -100, max: 100, onWheel: (event) => event.currentTarget.blur() } }}
              variant="outlined"
              type="number"
              label="Weight of node"
              id="weight"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                const value = (document.querySelector('#weight') as HTMLInputElement).value;
                const lineToEdit = getPartsOfId(connectionLineToEdit);
                let newConnectionLines = _.cloneDeep(connectionLines);
                newConnectionLines[lineToEdit[0]][lineToEdit[1]][lineToEdit[2]].weight = Number.parseFloat(value);
                const { greatestWeight, smallestWeight } = calculateWeightExtremes(newConnectionLines);
                newConnectionLines = newConnectionLines.map((item) =>
                  item.map((item2) =>
                    item2.map((item3) => {
                      return {
                        ...item3,
                        greatestWeight: greatestWeight >= 10 ? greatestWeight : 10,
                        smallestWeight: smallestWeight <= -10 ? smallestWeight : -10,
                      };
                    }),
                  ),
                );
                setConnectionLines(newConnectionLines);
                setConnectionLineToEdit('');
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
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
    </>
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
