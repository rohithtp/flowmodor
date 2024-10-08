import { LogsWithTasks } from '@flowmodor/types';
import { create } from 'zustand';
import { supabase } from '../utils/supabase';

export type Period = 'Day' | 'Week' | 'Month';

interface State {
  startDate: Date;
  endDate: Date;
  period: Period;
  displayTime: string;
  logs: LogsWithTasks[] | null;
}

interface Action {
  updateLogs: () => Promise<void>;
  goNextTime: () => void;
  goPreviousTime: () => void;
  onPeriodChange: (period: Period) => void;
  setDate: (date: Date) => void;
  setWeek: (date: Date) => void;
}

interface Store extends State {
  actions: Action;
}

export const useStatsStore = create<Store>((set, get) => ({
  startDate: new Date(),
  endDate: new Date(),
  period: 'Day',
  displayTime: new Date().toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  }),
  logs: null,
  actions: {
    updateLogs: async () => {
      const { startDate: sd, endDate: ed, period } = get();
      const startDate = new Date(sd);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(ed);
      endDate.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('logs')
        .select('*, tasks(name)')
        .gte('end_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());

      if (error) {
        return;
      }

      if (period === 'Day') {
        set({
          logs: data,
          displayTime: startDate.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          }),
        });
      } else if (period === 'Week') {
        set({
          logs: data,
          displayTime: `${startDate.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })} - ${endDate.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}`,
        });
      }
    },
    goNextTime: () => {
      set((state) => {
        if (state.period === 'Day') {
          const tomorrow = new Date(state.startDate);
          tomorrow.setDate(state.startDate.getDate() + 1);
          return {
            startDate: tomorrow,
            endDate: tomorrow,
          };
        }

        if (state.period === 'Week') {
          const startDate = new Date(state.startDate);
          startDate.setDate(startDate.getDate() + 7);
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);

          return {
            startDate,
            endDate,
          };
        }

        return {};
      });
      get().actions.updateLogs();
    },
    goPreviousTime: () => {
      set((state) => {
        if (state.period === 'Day') {
          const yesterday = new Date(state.startDate);
          yesterday.setDate(state.startDate.getDate() - 1);

          return {
            startDate: yesterday,
            endDate: yesterday,
          };
        }

        if (state.period === 'Week') {
          const startDate = new Date(state.startDate);
          startDate.setDate(startDate.getDate() - 7);
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);

          return {
            startDate,
            endDate,
          };
        }

        return {};
      });
      get().actions.updateLogs();
    },
    onPeriodChange: (period: Period) => {
      set((state) => {
        const startDate =
          period === 'Week' ? new Date(state.startDate) : new Date();
        const endDate =
          period === 'Week' ? new Date(state.endDate) : new Date();

        if (period === 'Week') {
          const day = state.startDate.getDay();
          startDate.setDate(state.startDate.getDate() - day);
          endDate.setDate(state.startDate.getDate() + 6);
        }

        return {
          logs: null,
          startDate,
          endDate,
          period,
        };
      });
      get().actions.updateLogs();
    },
    setDate: (date: Date) => {
      set({
        startDate: date,
        endDate: date,
      });
      get().actions.updateLogs();
    },
    setWeek: (date: Date) => {
      const startDate = new Date(date);
      startDate.setDate(date.getDate() - date.getDay());
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      set({
        startDate,
        endDate,
      });
      get().actions.updateLogs();
    },
  },
}));

export const usePeriod = () => useStatsStore((state) => state.period);
export const useStartDate = () => useStatsStore((state) => state.startDate);
export const useEndDate = () => useStatsStore((state) => state.endDate);
export const useDisplayTime = () => useStatsStore((state) => state.displayTime);
export const useLogs = () => useStatsStore((state) => state.logs);
export const useStatsActions = () => useStatsStore((state) => state.actions);
export const useIsDisabled = () => {
  const period = usePeriod();
  const startDate = useStartDate();
  const endDate = useEndDate();
  const today = new Date();

  if (period === 'Day') {
    return today.getDate() === endDate.getDate();
  }

  if (period === 'Week') {
    return today >= startDate && today <= endDate;
  }

  return false;
};
