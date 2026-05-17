import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.login, // <-- THIS IS THE MAGIC FIX
          email: profile.email,
          image: profile.avatar_url,
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    callback: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
