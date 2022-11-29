import { useMachine } from '@xstate/react';
import { inspect } from '@xstate/inspect';
import { timerMachine2 } from './timerMachine';

inspect({
  // options
  // url: 'https://stately.ai/viz?inspect', // (default)
  iframe: false, // open in new window
});

function App() {
  const [state, send] = useMachine(timerMachine2, {
    devTools: true,
  });

  const { duration, elapsed } = state.context;

  const isPlayable = state.matches('Playable.Playing');

  const handleOnSubmit = (event) => {
    event.preventDefault();

    console.log(event.currentTarget[0].value);
    const duration = event.currentTarget[0].value;
    send({ type: 'SUBMIT', duration: Number(duration) });
  };

  const handleOnPlay = () => {
    send('TOGGLE');
  };

  const handleOnPause = () => {
    send('TOGGLE');
  };

  const handleInitialize = () => {
    send('RESET');
    // setElapsed(0);
  };

  return (
    <div className="App">
      ALARM - xstateWithMachine
      <div
        style={{
          width: '1000px',
          height: '1000px',
        }}
      >
        <p>알람</p>
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            width: '500px',
            height: '100px',
            border: '1px solid white',
          }}
        >
          {state.matches('waiting') ? (
            <form
              onSubmit={handleOnSubmit}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px',
              }}
            >
              <input
                type="number"
                defaultValue={10}
                maxLength={4}
                min="5"
                max="9999"
                step="1"
                placeholder="0000"
                pattern="[0-9]{4}"
                required={true}
              />
              <button type="submit">등록</button>
            </form>
          ) : null}
          {isPlayable ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gap: '10px',
              }}
            >
              <div>남은 시간: {duration - elapsed}</div>
              <button onClick={handleOnPause}>정지</button>
              <button onClick={handleInitialize}>초기화</button>
            </div>
          ) : null}
          {state.matches('Playable.Paused') ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gap: '10px',
              }}
            >
              <div>남은 시간: {duration - elapsed}</div>
              <button onClick={handleOnPlay}>재생</button>
              <button onClick={handleInitialize}>초기화</button>
            </div>
          ) : null}
          {state.matches('Done') ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px',
              }}
            >
              <div>완료</div>
              <button onClick={handleInitialize}>초기화</button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
