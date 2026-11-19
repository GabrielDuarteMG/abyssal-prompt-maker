import {VStack} from '@astryxdesign/core/VStack';
import type {StepId} from '../lib/steps';
import {CustomListsSection} from './CustomListsSection';
import {DoneWhenSection} from './DoneWhenSection';
import {EditableListSection} from './EditableListSection';
import {GoalSection} from './GoalSection';
import {NotesSection} from './NotesSection';
import {SummarySection} from './SummarySection';

function sections(step: StepId) {
  switch (step) {
    case 'objective':
      return (
        <>
          <GoalSection />
          <SummarySection />
        </>
      );
    case 'priorities':
      return (
        <EditableListSection
          list="priorities"
          title="Prioridades"
          description="Nesta ordem, quando entrarem em conflito."
          itemLabel="Prioridade"
          addLabel="Adicionar prioridade"
          isOrdered
        />
      );
    case 'restrictions':
      return (
        <EditableListSection
          list="restrictions"
          title="Restrições"
          description="O que a IA não deve fazer ou ultrapassar."
          itemLabel="Restrição"
          addLabel="Adicionar restrição"
        />
      );
    case 'targets':
      return (
        <EditableListSection
          list="targets"
          title="Alvo"
          description="Quem vai usar e onde vai usar. Quanto mais específico, melhor."
          itemLabel="Alvo"
          addLabel="Adicionar alvo"
        />
      );
    case 'extras':
      return (
        <>
          <CustomListsSection />
          <NotesSection />
        </>
      );
    case 'verification':
      return (
        <>
          <EditableListSection
            list="verification"
            title="Verificação"
            description="Características que o resultado precisa ter para ser aceito. Ctrl+Enter adiciona outra."
            itemLabel="Característica"
            addLabel="Adicionar característica"
            isMultiline
          />
          <DoneWhenSection />
        </>
      );
  }
}

export function StepContent({step}: {step: StepId}) {
  return <VStack gap={6}>{sections(step)}</VStack>;
}
