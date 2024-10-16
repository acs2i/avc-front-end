import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

type SortDirection = 'asc' | 'desc';

interface SortState {
  column: string | null;
  direction: SortDirection;
}

interface SortContextType {
  getSortState: (listId: string) => SortState;
  setSortState: (listId: string, state: SortState) => void;
}

const SortContext = createContext<SortContextType | undefined>(undefined);

const SORT_STATES_KEY = 'sortStates';

export const SortProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sortStates, setSortStates] = useState<Record<string, SortState>>(() => {
    const savedStates = localStorage.getItem(SORT_STATES_KEY);
    return savedStates ? JSON.parse(savedStates) : {};
  });

  useEffect(() => {
    localStorage.setItem(SORT_STATES_KEY, JSON.stringify(sortStates));
  }, [sortStates]);

  const getSortState = (listId: string): SortState => {
    return sortStates[listId] || { column: null, direction: 'asc' };
  };

  const setSortState = (listId: string, state: SortState) => {
    setSortStates(prev => {
      const newStates = {
        ...prev,
        [listId]: state
      };
      localStorage.setItem(SORT_STATES_KEY, JSON.stringify(newStates));
      return newStates;
    });
  };

  return (
    <SortContext.Provider value={{ getSortState, setSortState }}>
      {children}
    </SortContext.Provider>
  );
};

export const useSortContext = () => {
  const context = useContext(SortContext);
  if (context === undefined) {
    throw new Error('useSortContext must be used within a SortProvider');
  }
  return context;
};

interface SortHeaderProps {
    listId: string;
    column: string;
    label: string;
    onSort: (column: string) => void;
  }

export const SortHeader: React.FC<SortHeaderProps> = ({ listId, column, label, onSort }) => {
    const { getSortState, setSortState } = useSortContext();
    const sortState = getSortState(listId);
  
    const handleSort = () => {
      if (sortState.column !== column) {
        setSortState(listId, { column, direction: 'asc' });
      } else {
        setSortState(listId, {
          column,
          direction: sortState.direction === 'asc' ? 'desc' : 'asc'
        });
      }
      onSort(column);
    };

  return (
    <div className="flex items-center cursor-pointer" onClick={handleSort}>
      <span>{label}</span>
      <div className="ml-1">
        {sortState.column === column && (
          sortState.direction === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
        )}
      </div>
    </div>
  );
};