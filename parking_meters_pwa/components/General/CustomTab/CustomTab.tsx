import { useState, ReactNode, ReactElement } from 'react';

interface Tab {
  label: string;
  icon?: ReactElement;
  isActive?: boolean;
  isDisabled?: boolean;
}

interface CustomTabProps {
  tabs: Tab[];
  children: ReactNode[];
}

export const CustomTab = ({ tabs, children }: CustomTabProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number, isDisabled?: boolean) => {
    if (!isDisabled) {
      setActiveTab(index);
    }
  };

  return (
    <>
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-300 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        {tabs.map((tab, index) => (
          <li key={tab.label} className="me-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleTabClick(index, tab.isDisabled);
              }}
              className={`inline-flex items-center p-4 rounded-t-lg ${tab.isDisabled
                ? 'text-white cursor-not-allowed dark:text-gray-500'
                : index === activeTab
                  ? 'text-white font-bold bg-blue-700'
                  : 'text-white font-light bg-blue-900 hover:bg-blue-500 dark:hover:bg-blue-500'
                }`}
              aria-current={index === activeTab ? 'page' : undefined}
            >
              {tab.icon && (
                <span className="mr-2">
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        {children[activeTab]}
      </div>
    </>
  );
};
