import { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import { useSearchParams, useRouter } from "next/navigation"; // Import useSearchParams and useRouter
import Image from "next/image";

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
  const resetSlider = () => {
    handleChange([0,1000])
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
            className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 shadow-lg"
          >
          </div>
        )}
      />
      <p onClick={resetSlider} className="m-5 ml-36 relative flex h-6 w-20 items-center justify-center rounded bg-gray-400 shadow-lg font-semibold text-gray-700"><Image src="/reset.png" width={16} height={16} alt="Reset" className="mr-2"/>Reset</p>
    </div>
    
  );
};

export default PriceRangeSlider;
