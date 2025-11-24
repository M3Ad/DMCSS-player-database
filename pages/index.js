import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const signIn = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        // Successful sign-in, redirect to player page
        window.location.href = "/player";
      } else {
        setError("Sign in failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Player Login</h1>

        {error && (
          <div style={styles.errorBanner}>
            <span style={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={signIn} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              style={{
                ...styles.input,
                ...(emailError ? styles.inputError : {}),
              }}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setError("");
              }}
              disabled={loading}
              autoComplete="email"
            />
            {emailError && <span style={styles.fieldError}>{emailError}</span>}
          </div>

          <div style={styles.inputGroup}>
            <input
              style={{
                ...styles.input,
                ...(passwordError ? styles.inputError : {}),
              }}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
                setError("");
              }}
              disabled={loading}
              autoComplete="current-password"
            />
            {passwordError && (
              <span style={styles.fieldError}>{passwordError}</span>
            )}
          </div>

          <button
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
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
  },
  card: {
    padding: "30px",
    background: "#1a1a1a",
    borderRadius: "12px",
    width: "350px",
    textAlign: "center",
    color: "white",
    border: "1px solid #333",
  },
  title: {
    marginBottom: "20px",
    fontSize: "26px",
  },
  errorBanner: {
    background: "#ff4444",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  errorIcon: {
    fontSize: "16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    textAlign: "left",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#222",
    color: "white",
    fontSize: "14px",
    transition: "border-color 0.2s",
  },
  inputError: {
    border: "1px solid #ff4444",
  },
  fieldError: {
    color: "#ff4444",
    fontSize: "12px",
    marginTop: "2px",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    background: "#ffcc00",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
    color: "#000",
    transition: "background 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  buttonDisabled: {
    background: "#998800",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  spinner: {
    border: "2px solid #000",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    animation: "spin 1s linear infinite",
  },
};
