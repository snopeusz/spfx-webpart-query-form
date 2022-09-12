import { Label, Stack } from 'office-ui-fabric-react';
import * as React from 'react';
import CalendarNullButton from './CalendarNullButton';
import { IDateOpenRangeProps } from './IDateOpenRangeProps';

export default (props: IDateOpenRangeProps): JSX.Element => {
    const {
        defaultStartDate,
        defaultEndDate,
        onDateRangeChange,
        startNoDateLabel,
        endNoDateLabel,
        label
    } = props;
    const [startDate, setStartDate] = React.useState<Date | undefined>(defaultStartDate || undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(defaultEndDate || undefined);

    const setStartDateCallback: (date: Date | undefined) => void = React.useCallback(
        (date: Date | undefined): void => {
            if (!date)
                setStartDate(undefined);
            else if (endDate && date > endDate)
                setStartDate(endDate);
            else
                setStartDate(date);
            if (onDateRangeChange) onDateRangeChange(date, endDate);
        },
        [endDate, setStartDate, onDateRangeChange],
    );

    const setEndDateCallback: (date: Date | undefined) => void = React.useCallback(
        (date: Date | undefined): void => {
            if (!date)
                setEndDate(undefined);
            else if (startDate && date < startDate)
                setEndDate(startDate);
            else
                setEndDate(date);;
            if (onDateRangeChange) onDateRangeChange(startDate, date);
        },
        [startDate, setEndDate, onDateRangeChange],
    );


    return <Stack horizontal>
        <Label>{label === undefined ? "Select date range:" : label}</Label>
        <CalendarNullButton
            selectedDate={startDate}
            setSelectedDate={setStartDateCallback}
            nullLabel={startNoDateLabel}
        />
        <CalendarNullButton
            selectedDate={endDate}
            setSelectedDate={setEndDateCallback}
            nullLabel={endNoDateLabel}
        />
    </Stack>
}