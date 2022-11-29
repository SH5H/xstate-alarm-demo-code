import { createMachine } from 'xstate';

const timerExpired = (ctx) => {
  return ctx.elapsed >= ctx.duration;
};

// https://xstate.js.org/viz/?gist=78fef4bd3ae520709ceaee62c0dd59cd
export const timerMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcCWBbMAnAxAJQFEBlAgFQG0AGAXUVAAcB7WVNRgOzpAA9EAWAEwAaEAE9EARgAcAZgB0AThlTKfCRMoA2SgHYJfAL4GRaTFjkB3AIatU7KDiIBVAEIBZAJIUaXJizacSDyIMpQArHJSOmESYSqUCnwJwmKSsorKqupauvpGJhjYcvQANlaiVgBGJWA4EBxgcrDIVsiNpkWl5VU1VLRBfrYcXLwIYSniCHx8mnKaegoCUrE6AhIKUvkgHeZdFdWNe3YOpADyAOLnADIEfb7MQ4Ggo3wbctIymnxSUTIKOlIBJoRJNpjo5HxVmFxtIBEsBNEtjtimV9jVilYAK6wSA4M6XG53AYPAIjRDzPhyHQKCSfOF6KSaKR8EH8DSRBEbAQ0qECJGFXaonqHVHHHAeEgADQACh5CAARIkMEmoYZBUYyQQQ8bKGLQvjQ2SshCa8EyGQ6PQyASCGa6ozGEDsRgQOBcHb3fyqp7BBAAWmBqQQiTkcIkmk+sh0SQNYX5ZksNjQ9k9jzJCHDCjkoWtghtiRp0ONH3ei3CWgE5sWcPjnSFB1TpPVkkoEipmgUMX0jNWaikxoEYXB6k7lBU1otf1rgu6BxR5WOje96bCqghy31nY7+gkxs1szCPIRfE+CjH0en87RhyxOIgS7Vz3JKjkQ9kUjCgmZ4ZZQbCMgiKIdAjQFKDWdQZEvPZhTkRgADdsA6B8fVGfQs2Azt1G+eYbWkPcZjkMcFEWaQPk0cNL3qdgwGQ9NyNDbJXh0P4pGItRjTieRKyUNYYi+ciHQMIA */
  createMachine({
    context: { duration: undefined, elapsed: 0 },
    id: 'timer',
    initial: 'waiting',
    states: {
      waiting: {
        on: {
          SUBMIT: {
            target: 'playable',
          },
        },
      },
      playable: {
        initial: 'playing',
        states: {
          playing: {
            on: {
              ISEXPIRED: {
                target: 'overtime',
              },
              TOGGLE: {
                target: 'paused',
              },
            },
          },
          paused: {
            on: {
              TOGGLE: {
                target: 'playing',
              },
            },
          },
          overtime: {
            type: 'final',
          },
        },
        onDone: {
          target: 'done',
        },
      },
      done: {},
    },
    on: {
      RESET: {
        target: '.waiting',
      },
    },
  });
