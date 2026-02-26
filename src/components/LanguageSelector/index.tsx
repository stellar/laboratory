"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@stellar/design-system";

import {
  getActiveLanguage,
  resetLanguage,
  selectLanguage,
} from "@/helpers/translate";

import "./styles.scss";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "de", label: "Deutsch" },
  { code: "zh-CN", label: "中文 (简体)" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
  { code: "tr", label: "Türkçe" },
];

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCode, setActiveCode] = useState("en");
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Read cookie only on the client after mount
  useEffect(() => {
    setActiveCode(getActiveLanguage());
  }, []);

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Position the menu above the trigger using fixed coordinates
      setMenuStyle({
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left,
        width: Math.max(rect.width, 192),
      });
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (code: string) => {
    setIsOpen(false);
    if (code === "en") {
      resetLanguage();
    } else {
      selectLanguage(code);
    }
  };

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;

    const onOutsideClick = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", onOutsideClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [isOpen]);

  const activeLabel =
    LANGUAGES.find((l) => l.code === activeCode)?.label ?? "English";

  return (
    <div className="LanguageSelector">
      <button
        ref={triggerRef}
        className="LanguageSelector__trigger SidebarLink"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Language: ${activeLabel}`}
        data-testid="language-selector-trigger"
      >
        <Icon.Globe02 />
        <span>Language: {activeLabel}</span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="LanguageSelector__menu"
          // eslint-disable-next-line react/forbid-dom-props
          style={menuStyle}
          role="listbox"
          aria-label="Select language"
          data-testid="language-selector-menu"
        >
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              className="LanguageSelector__option"
              data-is-active={code === activeCode}
              role="option"
              aria-selected={code === activeCode}
              onClick={() => handleSelect(code)}
              data-testid="language-selector-option"
            >
              <span>{label}</span>
              {code === activeCode && (
                <span className="LanguageSelector__option__current">
                  Current
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
