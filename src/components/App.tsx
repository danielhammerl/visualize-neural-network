import React from 'react';
import { KonvaStageWrapper } from './KonvaStage';
import { FormProvider, useForm } from 'react-hook-form';
import { Settings } from '../types/Settings';
import { SettingSection } from './SettingSection';

const defaultValues: Settings = {
  numberOfInputNodes: 2,
  numberOfOutputNodes: 1,
  hiddenLayers: [
    {
      numberOfNodes: 2,
    },
    {
      numberOfNodes: 2,
    },
  ],
};

export function App() {
  const methods = useForm({ defaultValues: defaultValues, mode: 'onChange' });

  return (
    <FormProvider {...methods}>
      <div style={{ display: 'flex' }}>
        <SettingSection />
        <KonvaStageWrapper />
      </div>
    </FormProvider>
  );
}
