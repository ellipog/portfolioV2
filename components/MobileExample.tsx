import { useIsMobile, isMobile } from "utils/isMobile";

// Example component showing different ways to use mobile detection
export default function MobileExample() {
  // Method 1: Using the React hook (recommended for components)
  const isMobileDevice = useIsMobile();

  // Method 2: Using the utility function directly (for one-time checks)
  const handleClick = () => {
    if (isMobile()) {
      console.log("User is on mobile device");
    } else {
      console.log("User is on desktop");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mobile Detection Example</h2>

      {/* Conditional rendering based on mobile detection */}
      {isMobileDevice ? (
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-blue-800">📱 Mobile Layout</p>
          <p className="text-sm text-blue-600">
            Screen width:{" "}
            {typeof window !== "undefined" ? window.innerWidth : "N/A"}px
          </p>
        </div>
      ) : (
        <div className="bg-green-100 p-4 rounded">
          <p className="text-green-800">🖥️ Desktop Layout</p>
          <p className="text-sm text-green-600">
            Screen width:{" "}
            {typeof window !== "undefined" ? window.innerWidth : "N/A"}px
          </p>
        </div>
      )}

      {/* Conditional styling */}
      <div
        className={`mt-4 p-4 rounded ${
          isMobileDevice
            ? "bg-yellow-100 text-yellow-800"
            : "bg-purple-100 text-purple-800"
        }`}
      >
        <p>This div has different styling based on device type</p>
      </div>

      {/* Button with mobile-aware behavior */}
      <button
        onClick={handleClick}
        className={`mt-4 px-4 py-2 rounded ${
          isMobileDevice ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
        }`}
      >
        {isMobileDevice ? "Mobile Button" : "Desktop Button"}
      </button>

      {/* Responsive text */}
      <p className={`mt-4 ${isMobileDevice ? "text-sm" : "text-base"}`}>
        This text size adapts to the device type
      </p>
    </div>
  );
}
