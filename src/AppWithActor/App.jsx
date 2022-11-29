import { Alarm } from './Alarm';
import { alarmMachine } from './alarmMachine';
import { useMachine } from '@xstate/react';
import { inspect } from '@xstate/inspect';

inspect({
  // options
  // url: 'https://stately.ai/viz?inspect', // (default)
  iframe: false, // open in new window
});

function App() {
  const [state, send] = useMachine(alarmMachine, {
    devTools: true,
  });

  return (
    <div className="App">
      ALARM - xstateWithActor
      <div
        style={{
          width: '1000px',
          height: '1000px',
        }}
      >
        <button
          onClick={() => {
            send('ADD');
          }}
        >
          Add
        </button>
        {state.context.alarmList.map((clock) => {
          return <Alarm key={clock.timerId} clock={clock} />;
        })}
      </div>
    </div>
  );
}

export default App;
