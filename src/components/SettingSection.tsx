import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';

export function SettingSection() {
  const { formState, register } = useFormContext();
  return (
    <div
      className="settings-section"
      style={{ flexBasis: '33vw', display: 'flex', border: '1px solid black', padding: '1rem', margin: '1rem' }}
    >
      <div className="form" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <TextField
          min={1}
          {...register('numberOfInputNodes', {})}
          variant="outlined"
          type="number"
          label="Number of input nodes"
        />
        <TextField
          min={1}
          {...register('numberOfOutputNodes', {})}
          variant="outlined"
          type="number"
          label="Number of output nodes"
        />
      </div>
    </div>
  );
}
