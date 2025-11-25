import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!email.trim() || !password || !confirmPassword || !fullName.trim()) {
      setError("All fields are required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const signUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create the user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Create profile for the new user
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              full_name: fullName.trim(),
              role: "player",
            },
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }

        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Player Account</h1>
        <p style={styles.subtitle}>Sign up for DMCSS Player Portal</p>

        {success ? (
          <div style={styles.successBanner}>
            <span style={styles.successIcon}>✓</span>
            <div>
              <strong>Account created successfully!</strong>
              <p style={styles.successText}>
                Please check your email to verify your account. Redirecting to login...
              </p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div style={styles.errorBanner}>
                <span style={styles.errorIcon}>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={signUp} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {}),
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div style={styles.footer}>
              Already have an account?{" "}
              <Link href="/" style={styles.link}>
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0e0e0e",
    padding: "20px",
  },
  card: {
    background: "#1a1a1a",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
    width: "100%",
    maxWidth: "450px",
  },
  title: {
    color: "#fff",
    fontSize: "28px",
    marginBottom: "8px",
    textAlign: "center",
  },
  subtitle: {
    color: "#999",
    fontSize: "14px",
    marginBottom: "30px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    padding: "12px 16px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#2a2a2a",
    color: "#fff",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    background: "#ffcc00",
    color: "#000",
    cursor: "pointer",
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "background 0.2s",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  spinner: {
    border: "2px solid #000",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    animation: "spin 1s linear infinite",
  },
  errorBanner: {
    background: "#f44336",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
  },
  errorIcon: {
    fontSize: "20px",
  },
  successBanner: {
    background: "#4caf50",
    color: "#fff",
    padding: "16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    fontSize: "14px",
  },
  successIcon: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  successText: {
    margin: "8px 0 0 0",
    fontSize: "13px",
    opacity: 0.9,
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
    color: "#999",
    fontSize: "14px",
  },
  link: {
    color: "#ffcc00",
    textDecoration: "none",
    fontWeight: "500",
  },
};
