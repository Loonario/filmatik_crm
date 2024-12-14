import { GraphQLClient } from 'graphql-request';

const SUPABASE_GRAPHQL_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/graphql/v1`;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const graphqlClient = new GraphQLClient(SUPABASE_GRAPHQL_URL, {
  headers: {
    apiKey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  },
});
