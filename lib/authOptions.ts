import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from "./prismadb";
import bcrypt from 'bcrypt';


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: 'Email', type: 'text' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Invalid credentials');
          }
  
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });
  
          if (!user || !user.hashedPassword) {
            throw new Error('Invalid credentials');
          }
  
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );
  
          if (!isCorrectPassword) {
            throw new Error('Invalid credentials');
          }
  
          return {
            ...user,
            id: user.id.toString(), // Ensure id is returned as a string
          } // Cast to User type
        }
      })
    ],
    session: {
      strategy: 'jwt'
    },
    secret: 'qweqwe12312314retertfdssf'
  };