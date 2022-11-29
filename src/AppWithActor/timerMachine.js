import { createMachine, assign, sendParent, send } from 'xstate';

const ticker = (ctx) => (sendBack) => {
  const interval = setInterval(() => {
    sendBack('TICK');
  }, ctx.interval * 1000);

  return () => clearInterval(interval);
};

const timerExpired = (ctx) => {
  console.log('timerExpired', ctx);
  return ctx.elapsed >= ctx.duration;
};

// https://xstate.js.org/viz/?gist=78fef4bd3ae520709ceaee62c0dd59cd
export const timerMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcCWBbMAnAxAJQFEBlAgFQG0AGAXUVAAcB7WVNRgOzpAA9EAWAEwAaEAE9EAgByUAdAFYAnHIBslSQOVSA7AEZJcgL4GRaTLgAiBADJkCVWkhBMWbTo94IAtHMkyFyvjkdAGZgrUkFSmUFSWURcQQdSh0ZSkpwuXStDWCdOT4jEwxsGQB3AENWVHYoHCIAVQAhAFkASQoaLmcqji4PYKl5BQUtZR0lEPGFeIk5LRkAvWlQrS1KYcNjEFMS+gAbctFq2ogOMBlYZHLkc52sGX3D4-su5h63UA85YTFERWCZFoFAMBDo+JQBsoAoVtsV7o8jjUcKQAPIAcTRNhejm6rj6iDyfAWCh0UN0wX0cm+M0SVJkeTGagEwUC62UWhhdweB0RUBk7EYWHQ5T2yNaAGEANLYhhvPHuP4CBQLcHRPgBSgCdI6Gla2QKAR8YJyAY6ARrUmbIpmblPGr8wXC0Uypxy1C9BUIZTBZT04FqYLJLR8SI-BKBomSSa5b7pFkQzlwh7lACusEgyPRmLsnRxbo9nwJ+WJpPZIUp1N+CC1cgWwWGoR9LINRi2AogcC4d1eLndHx4iE8Zt84PUyRiahGYcHzL8w2GGlU+mXiZtFSqNR773xtIEQ3rUTma2GfF1Khk+nCCiNSmUPmUq92POOW-lhYQfCjKqi141WvJNIBH4axGnkczqmyj7ws+9oCkKIqvn2O4mrIUZjKoejjJI2E0oGe4xt6fDjHq4RQbavIyIwABu2A7IhBYDggQIAoeOjBpkxqjJIuHJBe5asWkREclsXL0Km6YQPR-YeIINKkrIWj1kaggRMyZJkac7BgFJO6gikughFSUZagIpk0ooRJKiCYIQouBQiUmHZ7GANySXmvYMR4njSDIo5alhk66NMVbEYC3r1pIoyRDoeStgYQA */
  createMachine(
    {
      context: { duration: undefined, elapsed: 0 },
      id: 'timer',
      initial: 'waiting',
      states: {
        waiting: {
          entry: 'initialize',
          on: {
            SUBMIT: {
              target: 'playing',
              actions: 'assignDuration',
            },
          },
        },
        playing: {
          invoke: {
            src: (ctx) => (sendBack) => {
              const interval = setInterval(() => {
                if (ctx.elapsed < ctx.duration) {
                  sendBack('TICK');
                }
              }, 1000);

              return () => clearInterval(interval);
            },
            id: 'ticker',
          },
          initial: 'normal',
          states: {
            normal: {
              always: {
                target: 'overtime',
                cond: 'isExpired',
              },
              on: {
                TICK: {
                  actions: assign({
                    elapsed: (ctx) => ctx.elapsed + 1,
                  }),
                },
              },
            },
            overtime: {
              type: 'final',
            },
          },
          on: {
            TOGGLE: {
              target: 'paused',
            },
          },
          onDone: {
            target: 'done',
          },
        },
        paused: {
          on: {
            TOGGLE: {
              target: 'playing',
            },
          },
        },
        done: {},
        deleted: {
          type: 'final',
        },
      },
      on: {
        RESET: {
          target: '.waiting',
        },
        DELETE: {
          target: '.deleted',
          actions: sendParent((ctx, event) => {
            const { timerId } = event;
            return { type: 'REMOVE', timerId };
          }),
        },
      },
    },
    {
      actions: {
        initialize: assign({
          elapsed: () => {
            console.log('timer is initialized');
            return 0;
          },
        }),
        assignDuration: assign({
          duration: (_, event) => event.duration,
        }),
      },
      guards: {
        isExpired: timerExpired,
      },
    },
  );
