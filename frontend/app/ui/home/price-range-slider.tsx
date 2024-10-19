import { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import { useSearchParams, useRouter } from "next/navigation"; // Import useSearchParams and useRouter

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  onChange: (min: number, max: number) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  step = 0.1,
  onChange,
}) => {
  const router = useRouter(); // Router hook to update URL
  const searchParams = useSearchParams(); // To access query parameters

  // Initialize price range from searchParams or fallback to min, max
  const initialMin = parseFloat(searchParams.get("min") || min.toString());
  const initialMax = parseFloat(searchParams.get("max") || max.toString());

  const [values, setValues] = useState<number[]>([initialMin, initialMax]);

  useEffect(() => {
    // Update values when searchParams change
    setValues([initialMin, initialMax]);
  }, [searchParams]);

  const handleChange = (newValues: number[]) => {
    setValues(newValues);
    onChange(newValues[0], newValues[1]);

    // Create a new URLSearchParams object to preserve the existing query parameters
    const params = new URLSearchParams(searchParams.toString());

    // Update the min and max parameters
    params.set("min", newValues[0].toString());
    params.set("max", newValues[1].toString());

    // Update the URL parameters using the next/navigation router
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="w-full p-4">
      <div className="mb-4 text-center">
        <label className="font-semibold text-gray-700">
          Price Range: ${values[0]} - ${values[1]}
        </label>
      </div>
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={handleChange}
        renderTrack={({ props, children }) => {
          return (
            <div
              {...props}
              className="h-1.5 w-full rounded bg-gray-300"
              style={{
                background: getTrackBackground({
                  values,
                  colors: ["#E5E7EB", "#3B82F6", "#E5E7EB"],
                  min,
                  max,
                }),
              }}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 shadow-lg"
          >
            <div className="absolute -top-7 rounded bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
              ${values[index]}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default PriceRangeSlider;
