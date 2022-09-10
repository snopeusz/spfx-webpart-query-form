export interface IDateOpenRangeProps {
    onDateRangeChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
    defaultStartDate?: Date | undefined;
    defaultEndDate?: Date | undefined;
    startNoDateLabel?: string;
    endNoDateLabel?: string;
}
