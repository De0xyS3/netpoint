export const getBaseUrl = () => {
    if (typeof window === "undefined") {
      // Server-side
      return process.env.NEXT_PUBLIC_BACKEND_URL || "http://10.172.0.93:5000/api"
    }
    // Client-side
    return window.location.origin.includes("localhost")
      ? "http://10.172.0.93:5000/api"
      : process.env.NEXT_PUBLIC_BACKEND_URL || "http://10.172.0.93:5000/api"
  }
  
  