import {TextArea} from '@astryxdesign/core/TextArea';
import {usePromptStore} from '../store/promptStore';

export function NotesSection() {
  const notes = usePromptStore((s) => s.notes);
  const setNotes = usePromptStore((s) => s.setNotes);

  return (
    <TextArea
      label="Observação"
      description="Contexto extra, exemplos ou qualquer detalhe que não coube nas seções acima."
      isOptional
      rows={4}
      value={notes}
      onChange={setNotes}
      placeholder="Ex.: o projeto já usa React 19; seguir o padrão de pastas existente."
    />
  );
}
