import { useState } from 'react';
import { Alarm } from './Alarm';

function App() {
  const [clockList, setClockList] = useState([]);

  return (
    <div className="App">
      ALARM - useState
      <div
        style={{
          width: '1000px',
        }}
      >
        {clockList.map((clock, index) => {
          return <Alarm key={index} clock={clock} />;
        })}
        <button
          onClick={() => {
            setClockList((prev) => {
              return [
                ...prev,
                {
                  duration: undefined,
                  elapsed: 0,
                  isRunning: false,
                },
              ];
            });
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default App;
