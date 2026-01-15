import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export function Login({ onLoginSuccess }) {
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const { login, signup } = useAuth(); 

  const submitForm = async (e) => { 
    e.preventDefault();
    setFormLoading(true); 

    try {
      const validEmail = email.trim();
      const validPassword = password.trim();
      const validUsername = username.trim();

      if (!validEmail || !validPassword) {
        throw new Error("Email and password are required.");
      }

      if (showSignUp) { 
        const user = await signup(email, password, username);

        await setDoc(doc(db, "users", user.uid), {
          username: validUsername, 
          email: validEmail,
        });

        toast.success("Account created! Please log in.");
        setShowSignUp(false); 
      } else {
        
        await login(email, password);
        toast.success("Login successful!");
        if (onLoginSuccess) {
          onLoginSuccess(); 
        }
      }

      setEmail("");
      setPassword("");
      setUsername("");
    } catch (error) {
      console.error("Error during signup or login:", error.message);
      toast.error(error.message || "An error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-emerald-800 mb-3">
            {showSignUp ? "Create Account" : "Welcome Back"} {/* Updated from isSignUp */}
          </CardTitle>
          <p className="text-gray-600 leading-relaxed">
            {showSignUp 
              ? "Join our recipe community today"
              : "Sign in to share and discover amazing recipes"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitForm} className="space-y-6"> {/* Updated from handleSubmit */}
            {showSignUp && ( /* Updated from isSignUp */
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
              disabled={formLoading}
            >
              {formLoading ? "Loading..." : showSignUp ? "Sign Up" : "Sign In"} {/* Updated references */}
            </Button>

            <div className="text-center pt-8 border-t mt-8">
              <p className="text-gray-600 leading-relaxed">
                {showSignUp ? "Already have an account?" : "Don't have an account?"}{" "} {/* Updated from isSignUp */}
                <button
                  type="button"
                  onClick={() => setShowSignUp(!showSignUp)}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  {showSignUp ? "Sign In" : "Sign Up"} {/* Updated from isSignUp */}
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}