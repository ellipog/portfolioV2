import React from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "no" : "en")}
      className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
    >
      {language === "en" ? "Norsk" : "English"}
    </button>
  );
};

export default LanguageSwitcher;
