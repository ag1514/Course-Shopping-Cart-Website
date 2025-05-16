"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

interface GoogleLoginButtonProps {
  onLoginStart: () => void
  onLoginComplete: (success: boolean, role?: string) => void
}

export default function GoogleLoginButton({ onLoginStart, onLoginComplete }: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load the Google Identity Services script
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => setScriptLoaded(true)
    script.onerror = () => setScriptError(true)
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    // Initialize Google Sign-In when the script is loaded
    if (scriptLoaded && window.google && buttonRef.current) {
      try {
        const clientId =
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
          "245716929882-0f1h8nrbdupqcmfi0lh5j6ifsvq9q1gb.apps.googleusercontent.com"

        console.log("Initializing Google Sign-In with client ID:", clientId)

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        })

        // Render the button instead of using prompt()
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: buttonRef.current.offsetWidth,
        })
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error)
        setScriptError(true)
      }
    }
  }, [scriptLoaded, buttonRef.current])

  const handleCredentialResponse = async (response: any) => {
    setLoading(true)
    onLoginStart()

    try {
      console.log("Google response:", response)

      // Use the hardcoded URL for Google login
      console.log("Sending Google token to authentication service...")

      // Use XMLHttpRequest instead of fetch for better error handling
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "http://localhost:3001/api/auth/google", true)
      xhr.setRequestHeader("Content-Type", "application/json")
      xhr.withCredentials = true

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText)
            console.log("Google login response:", data)

            if (data.success) {
              onLoginComplete(true, data.role)
            } else {
              onLoginComplete(false)
              console.error("Google login failed:", data.error)
            }
          } catch (error) {
            console.error("Error parsing response:", error)
            onLoginComplete(false)
          }
        } else {
          console.error("Google login failed with status:", xhr.status)
          onLoginComplete(false)
        }
      }

      xhr.onerror = () => {
        console.error("Network error during Google login")
        onLoginComplete(false)
      }

      xhr.send(JSON.stringify({ token: response.credential }))
    } catch (error) {
      console.error("Error during Google login:", error)
      onLoginComplete(false)
    } finally {
      setLoading(false)
    }
  }

  if (scriptError) {
    return (
      <Button type="button" variant="outline" disabled className="w-full">
        Google Sign-In Unavailable
      </Button>
    )
  }

  // Show a loading button while the script is loading
  if (!scriptLoaded) {
    return (
      <Button type="button" variant="outline" disabled className="w-full">
        <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading Google Sign-In...
      </Button>
    )
  }

  // Return a div that will be replaced by the Google Sign-In button
  return (
    <div className="w-full">
      <div ref={buttonRef} className="w-full h-10"></div>
    </div>
  )
}
