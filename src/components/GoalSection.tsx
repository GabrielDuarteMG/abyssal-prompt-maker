import {TextArea} from '@astryxdesign/core/TextArea';
import {usePromptStore} from '../store/promptStore';

export function GoalSection() {
  const goal = usePromptStore((s) => s.goal);
  const setGoal = usePromptStore((s) => s.setGoal);

  return (
    <TextArea
      label="Goal"
      description="Descreva em uma frase o que você quer construir."
      isOptional
      rows={3}
      maxLength={500}
      value={goal}
      onChange={setGoal}
      placeholder="Eu quero uma aplicação que vai fazer ...."
    />
  );
}
