"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

function SearchBarChild({ initialSubjects }: { initialSubjects: string[] }) {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [subjects] = useState<string[]>(initialSubjects);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);

    if (text.length > 1 && subjects.length > 0) {
      const filteredSuggestions = subjects.filter((subject) =>
        subject.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    router.push(`/catalogue?subject=${encodeURIComponent(suggestion)}`);
    setSearchText(suggestion);
    setSuggestions([]);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target as Node)
    ) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="play mx-auto w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (searchText) {
            router.push(`/catalogue?subject=${encodeURIComponent(searchText)}`);
          }
        }}
      >
        <div className="relative w-full">
          <Input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search by subject..."
            className={`text-md play rounded-lg bg-[#B2B8FF] px-4 py-6 pr-10 font-sans tracking-wider text-black shadow-sm placeholder:text-black focus:outline-none focus:ring-2 dark:bg-[#7480FF66] dark:text-white placeholder:dark:text-white ${
              searchText.length > 1 ? "rounded-b-none" : ""
            }`}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <Search className="h-5 w-5 text-black dark:text-white" />
          </button>

          {suggestions.length > 0 && (
            <ul
              ref={suggestionsRef}
              role="listbox"
              aria-label="Search suggestions"
              className="absolute z-20 mx-0.5 mt-2 w-full max-w-xl rounded-md bg-white text-center shadow-lg dark:bg-[#030712] md:mx-0"
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  role="option"
                  aria-selected={false}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="cursor-pointer truncate p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {suggestion}
                </li>
              ))}
              {suggestions.length === 0 && (
                <li className="p-2 text-gray-500 dark:text-gray-400">
                  No subjects found
                </li>
              )}
            </ul>
          )}
        </div>
      </form>
    </div>
  );
}

export default SearchBarChild;
