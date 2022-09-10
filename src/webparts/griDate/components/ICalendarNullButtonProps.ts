export interface ICalendarNullButtonProps {
    selectedDate: Date | undefined;
    setSelectedDate: (newDate: Date | undefined) => void;
    nullLabel?: string;
}
