import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      checkAuth();

      // Listen for auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          router.push("/");
        } else if (event === "SIGNED_IN") {
          setIsAuthenticated(true);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }, []);

    async function checkAuth() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log("withAuth: Checking session...", { session: !!session, error });

        if (error || !session) {
          console.log("withAuth: No session, redirecting to login");
          router.push("/");
          return;
        }

        console.log("withAuth: Session valid, user authenticated");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoading) {
      return (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Verifying authentication...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

const styles = {
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0e0e0e",
    gap: "20px",
  },
  spinner: {
    border: "4px solid #333",
    borderTop: "4px solid #ffcc00",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#fff",
    fontSize: "16px",
  },
};
