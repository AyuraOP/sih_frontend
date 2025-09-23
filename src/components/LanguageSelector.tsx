import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: 'TAMIL' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: 'KANNAD' },
  { code: 'ml', name: 'മലയാളം', flag: 'MALAYALAM' },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 sm:w-auto px-0 sm:px-3 flex items-center justify-center sm:justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
        >
          <Globe className="h-4 w-4" />
          {/* Only show flag on medium screens and above */}
          <span className="hidden sm:inline ml-2">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-md shadow-md"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer hover:bg-white/10 focus:bg-white/10 rounded-md px-3 py-2"
          >
            <div className="flex items-center">
              <span className="mr-3 text-lg">{language.flag}</span>
              <span className="font-medium text-white">{language.name}</span>
            </div>
            {i18n.language === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
