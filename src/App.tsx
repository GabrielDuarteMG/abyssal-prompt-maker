import {FormPane} from './components/FormPane';
import {PromptOutput} from './components/PromptOutput';
import './App.css';

export default function App() {
  return (
    <div className="app-bg">
      <main className="app-shell">
        <FormPane />
        <PromptOutput />
      </main>
    </div>
  );
}
