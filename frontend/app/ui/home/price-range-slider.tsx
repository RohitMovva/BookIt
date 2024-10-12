import { useState } from "react";
import { Range, getTrackBackground } from "react-range";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  onChange: (min: number, max: number) => void; // Updated type
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  step = 0.1,
  onChange,
}) => {
  const [values, setValues] = useState<number[]>([min, max]);

  const handleChange = (newValues: number[]) => {
    setValues(newValues);
    onChange(newValues[0], newValues[1]); // Pass min and max to parent
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="mb-4 text-center">
        <label className="text-gray-600">
          Price Range: ${values[0].toFixed(2)} - ${values[1].toFixed(2)}
        </label>
      </div>
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={handleChange}
        renderTrack={({ props, children }) => {
          const { ...restProps } = props; // Destructure key out
          return (
            <div
              {...restProps}
              style={{
                ...restProps.style,
                height: "6px",
                width: "100%",
                background: getTrackBackground({
                  values,
                  colors: ["#ccc", "#4A90E2", "#ccc"],
                  min,
                  max,
                }),
              }}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props, index }) => {
          return (
            <div
              {...props}
              key={props.key}
              style={{
                ...props.style,
                height: "42px",
                width: "42px",
                backgroundColor: "#999",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 2px 6px #AAA",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-28px",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "14px",
                  fontFamily: "Arial,Helvetica,sans-serif",
                  padding: "4px",
                  borderRadius: "4px",
                  backgroundColor: "#4A90E2",
                }}
              >
                ${values[index].toFixed(2)}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default PriceRangeSlider;
