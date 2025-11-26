"use client"
import { createAuthClient } from "better-auth/react"
import { useEffect, useState } from "react"

// Shared session cache to prevent multiple fetches
let sessionCache: any = null
let sessionCacheTime: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const authClient = createAuthClient({
   baseURL: typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL,
  fetchOptions: {
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("bearer_token") || "" : ""}`,
      },
      onSuccess: (ctx) => {
          const authToken = ctx.response.headers.get("set-auth-token")
          // Store the token securely (e.g., in localStorage)
          if(authToken){
            // Split token at "." and take only the first part
            const tokenPart = authToken.includes('.') ? authToken.split('.')[0] : authToken;
            if (typeof window !== 'undefined') {
              localStorage.setItem("bearer_token", tokenPart);
              // Clear cache when token changes
              sessionCache = null
            }
          }
      }
  }
});

type SessionData = ReturnType<typeof authClient.useSession>

export function useSession(): SessionData {
   const [session, setSession] = useState<any>(sessionCache);
   const [isPending, setIsPending] = useState(!sessionCache);
   const [error, setError] = useState<any>(null);

   const refetch = () => {
      setIsPending(true);
      setError(null);
      sessionCache = null // Clear cache on manual refetch
      fetchSession();
   };

   const fetchSession = async () => {
      try {
         const token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : null
         
         // If no token, set session to null immediately
         if (!token) {
            setSession(null);
            setError(null);
            setIsPending(false);
            sessionCache = null
            return;
         }

         // Check cache first
         const now = Date.now()
         if (sessionCache && (now - sessionCacheTime) < CACHE_DURATION) {
            setSession(sessionCache);
            setIsPending(false);
            return;
         }

         const res = await authClient.getSession({
            fetchOptions: {
               auth: {
                  type: "Bearer",
                  token: token,
               },
            },
         });
         
         // Cache the session
         sessionCache = res.data
         sessionCacheTime = now
         
         setSession(res.data);
         setError(null);
      } catch (err) {
         setSession(null);
         setError(err);
         sessionCache = null // Clear cache on error
      } finally {
         setIsPending(false);
      }
   };

   useEffect(() => {
      // Only fetch if we don't have cached session
      if (!sessionCache) {
         fetchSession();
      } else {
         // Use cached session but verify token still exists
         const token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : null
         if (!token) {
            setSession(null);
            sessionCache = null
         }
      }
   }, []);

   return { data: session, isPending, error, refetch };
}