import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { getCurrentUserRole } from "../lib/getUserRole";

export default function withCoachAuth(Component) {
  return function CoachAuthenticatedComponent(props) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      checkAuth();

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          router.push("/");
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

        if (error || !session) {
          router.push("/");
          return;
        }

        const { role, error: roleError } = await getCurrentUserRole();

        if (roleError || role !== "coach") {
          router.push("/player");
          return;
        }

        setIsAuthorized(true);
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
          <p style={styles.loadingText}>Verifying coach access...</p>
        </div>
      );
    }

    if (!isAuthorized) {
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
