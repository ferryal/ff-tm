import { useState, useCallback, type ChangeEvent } from "react";

interface UseInputOptions {
  initialValue?: string;
  validate?: (value: string) => string | null;
}

interface UseInputReturn {
  value: string;
  error: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
  setValue: (value: string) => void;
  reset: () => void;
  isValid: boolean;
}

export const useInput = ({
  initialValue = "",
  validate,
}: UseInputOptions = {}): UseInputReturn => {
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<boolean>(false);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (touched && validate) {
        const validationError = validate(newValue);
        setError(validationError);
      }
    },
    [touched, validate]
  );

  const onBlur = useCallback(() => {
    setTouched(true);
    if (validate) {
      const validationError = validate(value);
      setError(validationError);
    }
  }, [value, validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error: touched ? error : null,
    onChange,
    onBlur,
    setValue,
    reset,
    isValid: !error,
  };
};
