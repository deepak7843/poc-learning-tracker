import { useState, ChangeEvent, useCallback } from 'react';

interface InputProps {
  initialValue?: string;
  validator?: (value: string) => boolean;
}

interface InputState {
  value: string;
  isValid: boolean;
  isTouched: boolean;
}

interface InputHook {
  value: string;
  isValid: boolean;
  hasError: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
  setValue: (value: string) => void;
  reset: () => void;
}

const useInput = ({ initialValue = '', validator }: InputProps = {}): InputHook => {
  const [inputState, setInputState] = useState<InputState>({
    value: initialValue,
    isValid: !validator || validator(initialValue),
    isTouched: false,
  });

  const isValidInput = useCallback(
    (value: string) => {
      if (!validator) return true;
      return validator(value);
    },
    [validator]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setInputState({
        value: newValue,
        isValid: isValidInput(newValue),
        isTouched: true,
      });
    },
    [isValidInput]
  );

  const handleBlur = useCallback(() => {
    setInputState((prevState) => ({
      ...prevState,
      isTouched: true,
    }));
  }, []);

  const setValue = useCallback(
    (value: string) => {
      setInputState({
        value,
        isValid: isValidInput(value),
        isTouched: true,
      });
    },
    [isValidInput]
  );

  const reset = useCallback(() => {
    setInputState({
      value: initialValue,
      isValid: !validator || validator(initialValue),
      isTouched: false,
    });
  }, [initialValue, validator]);

  // hasError is true if the field is both invalid and touched
  const hasError = !inputState.isValid && inputState.isTouched;

  return {
    value: inputState.value,
    isValid: inputState.isValid,
    hasError,
    onChange: handleChange,
    onBlur: handleBlur,
    setValue,
    reset,
  };
};

export default useInput;