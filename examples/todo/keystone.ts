import { config } from '@keystone-next/keystone/schema';
import { statelessSessions, withItemData } from '@keystone-next/keystone/session';
import { createAuth } from '@keystone-next/auth';
import { lists } from './schema';
import { KeystoneConfig } from '@keystone-next/types';

const sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --';
const sessionMaxAge = 60 * 60 * 24 * 30; // 30 days
const sessionConfig = {
  maxAge: sessionMaxAge,
  secret: sessionSecret,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
});

export default config({
  db: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL || 'postgres://keystone5:k3yst0n3@localhost:5432/todo-example',
  },
  lists,
  ui: {
    isAccessAllowed: ({ session }) => !!session,
    publicPages: ['/welcome'],
    getAdditionalFiles: [
      async (config: KeystoneConfig) => [
        {
          mode: 'write',
          outputPath: 'pages/welcome.js',
          src: `
            /* @jsx jsx */
            import { jsx } from '@keystone-ui/core';
            export default function Welcome() {
              return (<h1>Welcome to my keystone system</h1>);
            }`,
        },
      ],
    ],
  },

  // session: withItemData(statelessSessions(sessionConfig)),
});
