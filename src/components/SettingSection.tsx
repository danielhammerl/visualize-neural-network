import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export function SettingSection() {
  const { register } = useFormContext();
  const { append, remove, fields } = useFieldArray({ name: 'hiddenLayers' });
  return (
    <div
      className="settings-section"
      style={{
        flexBasis: '33vw',
        display: 'flex',
        border: '1px solid black',
        padding: '1rem',
        margin: '1rem',
        height: 'calc(100vh - 2rem)',
        overflow: 'scroll',
      }}
    >
      <div className="form" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <TextField
          InputProps={{ inputProps: { min: 1, max: 100, onWheel: (event) => event.currentTarget.blur() } }}
          {...register('numberOfInputNodes', {})}
          variant="outlined"
          type="number"
          label="Number of input nodes"
        />
        <TextField
          InputProps={{ inputProps: { min: 1, max: 100, onWheel: (event) => event.currentTarget.blur() } }}
          {...register('numberOfOutputNodes', {})}
          variant="outlined"
          type="number"
          label="Number of output nodes"
        />
        <Button variant="outlined" endIcon={<AddIcon />} onClick={() => append({ numberOfNodes: 1 })}>
          Add hidden layer
        </Button>
        {fields.map((hiddenLayer, index) => {
          return (
            <div key={index} style={{ display: 'flex', width: '100%' }}>
              <TextField
                InputProps={{ inputProps: { min: 1, max: 100, onWheel: (event) => event.currentTarget.blur() } }}
                style={{ flex: '1' }}
                min={1}
                {...register(`hiddenLayers.${index}.numberOfNodes`, {})}
                variant="outlined"
                type="number"
                label="Number of hidden nodes"
              />
              <IconButton onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
