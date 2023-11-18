// @ts-nocheck

import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import NextAuth from "next-auth";
import type { NextAuthOptions } from 'next-auth'

import { DynamoDBAdapter } from "@auth/dynamodb-adapter"

import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";


const config: DynamoDBClientConfig = {
    credentials: {
      accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY
    },
    region: process.env.NEXT_AUTH_AWS_REGION,
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true
  },
});

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),
  EmailProvider({
    server: {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    },
    from: process.env.EMAIL_FROM
  }),
  ],
  adapter: DynamoDBAdapter(
      client,
      { 
          tableName: 'mono-next-auth'
      }
  ),
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (email?.verificationRequest == true) {
        return true
      }
      console.log("********Sign in")
      console.log(email)
      console.log(user)
      try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/backend/create_user/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-control': 'no-store'
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name ?? "",
          })
        })
        console.log(response)
      } catch(e) {
        console.error(e)
        return false
      }
      return true
    },
    async session({session, token, user}) {
      console.log("********Populate SESSION")
      console.log(session)
      console.log(token)
      console.log(user)
      const email = session.user.email
      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/backend/user/` + email, 
      {headers: {
        'Content-Type': 'application/json',
        'Cache-control': 'no-store'
      }})
      const loaded = await response.json()
      session.user_details = loaded.user
      session.eval_details = loaded.eval
      session.ranks = loaded.ranks
      session.sdk_key = loaded.sdkKey
      console.log(session)
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);