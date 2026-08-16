import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { DropdownOption } from '../constants/filters';

export type DropdownProps = {
  id?: string;
  label?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function Dropdown({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = 'Select option',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || placeholder;
  const isFiltered = value !== '';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement | HTMLUListElement>) {
    if (event.key === 'Escape') {
      setIsOpen(false);
      containerRef.current?.querySelector('button')?.focus();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
    }
  }

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    setIsOpen(false);
    containerRef.current?.querySelector('button')?.focus();
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label ? (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      ) : null}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label || placeholder}
        className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border bg-slate-900 px-4 py-3 text-left text-sm font-medium transition-colors outline-none hover:border-slate-700 focus:border-cyan-500 ${
          isFiltered
            ? 'border-cyan-500/50 text-slate-100'
            : 'border-slate-800 text-slate-300 hover:text-slate-100'
        }`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <ul
          ref={listboxRef}
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          aria-label={label || placeholder}
          className="custom-scrollbar absolute z-50 mt-1.5 max-h-64 w-full min-w-[180px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 py-1.5 shadow-2xl shadow-black/80 backdrop-blur-md outline-none"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value || '__all__'}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`flex cursor-pointer items-center justify-between px-3.5 py-2.5 text-sm transition-colors ${
                  isSelected
                    ? 'bg-cyan-950/50 font-medium text-slate-100'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected ? (
                  <Check className="ml-2 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
