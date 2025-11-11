/**
 * TabNavigation Component
 * Componente per navigazione tra schede
 */

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex overflow-x-auto scrollbar-hide" aria-label="Tabs">
        <div className="flex space-x-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative py-4 px-1 text-sm font-medium transition-colors
                whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'text-orange-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
                {tab.label}
              </div>

              {/* Active indicator */}
              {activeTab === tab.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}




