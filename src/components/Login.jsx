import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useAuth } from "../contexts/AuthContext"; // Ensure this is correct
import { toast } from "sonner";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export function Login({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useAuth(); // Ensure these functions are correctly provided by AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sanitize inputs
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();
      const cleanUsername = username.trim();

      // Ensure both email and password are provided
      if (!cleanEmail || !cleanPassword) {
        throw new Error("Email and password are required.");
      }

      if (isSignUp) {
        // Handle signup
        const user = await signup(email, password, username);

        // Save additional user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          username: cleanUsername,
          email: cleanEmail,
        });

        toast.success("🎉 Account created! Please log in.");
        setIsSignUp(false); // Switch to login mode
      } else {
        // Handle login
        await login(email, password);
        toast.success("✅ Login successful!");
        if (onLoginSuccess) {
          onLoginSuccess(); // Redirect or perform other actions
        }
      }

      // Reset form
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (error) {
      console.error("Error during signup or login:", error.message);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-emerald-800 mb-3">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <p className="text-gray-600 leading-relaxed">
            {isSignUp
              ? "Join our recipe community today"
              : "Sign in to share and discover amazing recipes"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 mt-8"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <div className="text-center pt-8 border-t mt-8">
              <p className="text-gray-600 leading-relaxed">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}