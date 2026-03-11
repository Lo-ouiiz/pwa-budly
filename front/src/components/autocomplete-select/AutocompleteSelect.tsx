import { useState, useEffect, useRef } from 'react';
import './AutocompleteSelect.css';

type Option = { id: number; name: string };

type Props = {
  options: { id: number; name: string }[];
  value: number | undefined;
  onChange: (val: number | undefined) => void;
  placeholder: string;
  disabled?: boolean;
};

export function AutocompleteSelect({ options, value, onChange, placeholder, disabled }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.id === value);

  const filtered =
    query.length > 0
      ? options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))
      : options;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        if (!selected) setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [selected]);

  const handleSelect = (opt: Option) => {
    onChange(opt.id);
    setQuery('');
    setOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
    setQuery('');
  };

  return (
    <div className="autocomplete-wrapper" ref={ref}>
      <div className="autocomplete-input-row">
        <input
          className="autocomplete-input"
          type="text"
          placeholder={disabled ? "Sélectionnez d'abord une espèce" : placeholder}
          value={selected ? selected.name : query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (selected) onChange(undefined);
          }}
          onFocus={() => !disabled && setOpen(true)}
        />
        {(selected || query) && !disabled && (
          <button type="button" className="autocomplete-clear" onClick={handleClear}>
            ✕
          </button>
        )}
      </div>
      {open && !disabled && (
        <ul className="autocomplete-dropdown">
          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <li
                key={opt.id}
                className="autocomplete-option"
                onMouseDown={() => handleSelect(opt)}
              >
                {opt.name}
              </li>
            ))
          ) : (
            <li className="autocomplete-option autocomplete-empty">Aucun résultat</li>
          )}
        </ul>
      )}
    </div>
  );
}
