"use client"
import { createAuthClient } from "better-auth/react"
import { useEffect, useState } from "react"

// Shared session cache to prevent multiple fetches
let sessionCache: any = null
let sessionCacheTime: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Get base URL for auth client
const getAuthClientBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin (this ensures it always matches)
    const origin = window.location.origin;
    console.log('🔐 Auth client using origin:', origin);
    return origin;
  }
  // Server-side: use environment variable or fallback
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  console.log('🔐 Auth client baseURL (server-side):', baseURL);
  return baseURL;
};

const authBaseURL = getAuthClientBaseURL();

export const authClient = createAuthClient({
   baseURL: authBaseURL,
  fetchOptions: {
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("bearer_token") || "" : ""}`,
      },
      // Remove onSuccess callback to prevent any blocking operations
      // Token will be fetched separately via /api/auth/get-token
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
         
         // Check cache first
         const now = Date.now()
         if (sessionCache && (now - sessionCacheTime) < CACHE_DURATION) {
            setSession(sessionCache);
            setIsPending(false);
            return;
         }

         // Try to get session - if we have a token, use it; otherwise use cookies
         let res;
         if (token) {
            // Use bearer token if available
            try {
               res = await authClient.getSession({
                  fetchOptions: {
                     auth: {
                        type: "Bearer",
                        token: token,
                     },
                  },
               });
            } catch (tokenErr) {
               // If token-based session fails, try cookies
               console.debug("Token-based session failed, trying cookies:", tokenErr)
               try {
                  const sessionResponse = await fetch("/api/auth/session", {
                     method: "GET",
                     credentials: "include"
                  });
                  
                  if (sessionResponse.ok) {
                     const sessionData = await sessionResponse.json();
                     res = { data: sessionData };
                  } else {
                     // Try authClient without auth (uses cookies)
                     res = await authClient.getSession();
                  }
               } catch (fetchErr) {
                  // If all fails, try authClient without auth
                  res = await authClient.getSession();
               }
            }
         } else {
            // No token - try using cookies
            try {
               // Try authClient.getSession first (uses cookies automatically)
               res = await authClient.getSession();
               
               // Check if token is in response headers
               // Note: We can't access headers from authClient.getSession response directly
               // So we'll try the API endpoint
               try {
                  const sessionResponse = await fetch("/api/auth/session", {
                     method: "GET",
                     credentials: "include"
                  });
                  
                  if (sessionResponse.ok) {
                     const headerToken = sessionResponse.headers.get("set-auth-token");
                     if (headerToken && typeof window !== 'undefined') {
                        localStorage.setItem("bearer_token", headerToken);
                     }
                  }
               } catch (headerErr) {
                  // Ignore header check errors
                  console.debug("Header check failed:", headerErr)
               }
            } catch (fetchErr) {
               // If fetch fails, set session to null
               setSession(null);
               setError(null);
               setIsPending(false);
               sessionCache = null;
               return;
            }
         }
         
         // Cache the session
         sessionCache = res?.data || null
         sessionCacheTime = now
         
         setSession(res?.data || null);
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