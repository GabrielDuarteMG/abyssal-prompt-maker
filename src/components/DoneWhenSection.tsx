import {TextArea} from '@astryxdesign/core/TextArea';
import {usePromptStore} from '../store/promptStore';

export function DoneWhenSection() {
  const doneWhen = usePromptStore((s) => s.doneWhen);
  const setDoneWhen = usePromptStore((s) => s.setDoneWhen);

  return (
    <TextArea
      label="Concluído quando"
      description="A condição objetiva que encerra a tarefa."
      rows={3}
      value={doneWhen}
      onChange={setDoneWhen}
      placeholder="Ex.: o build passa, os testes ficam verdes e a tela abre sem erros no console."
    />
  );
}
