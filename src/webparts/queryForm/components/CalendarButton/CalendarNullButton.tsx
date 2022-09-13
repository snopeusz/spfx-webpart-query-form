import * as React from 'react';
import { useBoolean } from '@fluentui/react-hooks';
import { DefaultButton, Callout, DirectionalHint, FocusTrapZone, Calendar, ICalendarStrings, Stack } from 'office-ui-fabric-react';
import { ICalendarNullButtonProps } from './ICalendarNullButtonProps';

const CALENDAR_STRINGS_PL: ICalendarStrings = {
    months: ["Styczeń", "Luty", "Marzec", "Kwicień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
    shortMonths: ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paz", "lis", "gru"],
    days: ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"],
    shortDays: ["N", "Pn", "Wt", "Śr", "Cz", "Pt", "S"],
    goToToday: 'dziś'
};

export default (props: ICalendarNullButtonProps): JSX.Element => {
    const [showCalendar, { toggle: toggleShowCalendar, setFalse: hideCalendar }] = useBoolean(false);
    const buttonContainerRef: React.MutableRefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);
    const {
        selectedDate,
        setSelectedDate,
        nullLabel
    } = props;

    const onSelectDate: (date: Date | null, dateRangeArray: Date[]) => void = React.useCallback(
        (date: Date, dateRangeArray: Date[]): void => {
            setSelectedDate(date);
            hideCalendar();
        },
        [hideCalendar, setSelectedDate],
    );

    const onNullDate: React.MouseEventHandler<DefaultButton> = React.useCallback(
        (): void => {
            setSelectedDate(undefined);
            hideCalendar();
        },
        [hideCalendar, setSelectedDate]
    );

    return <div>
        <div ref={buttonContainerRef}>
            <DefaultButton
                onClick={toggleShowCalendar}
                text={!selectedDate ? (nullLabel || 'Open range') : selectedDate.toLocaleDateString()}
            />
        </div>
        {showCalendar && (
            <Callout
                isBeakVisible={false}
                gapSpace={0}
                doNotLayer={false}
                target={buttonContainerRef}
                directionalHint={DirectionalHint.bottomLeftEdge}
                onDismiss={hideCalendar}
                setInitialFocus
            >
                <FocusTrapZone isClickableOutsideFocusTrap>
                    <Stack>
                        <Calendar
                            onSelectDate={onSelectDate}
                            onDismiss={hideCalendar}
                            isMonthPickerVisible
                            value={selectedDate}
                            highlightCurrentMonth
                            isDayPickerVisible
                            showGoToToday={false}
                            // Calendar uses English strings by default. For localized apps, you must override this prop.
                            strings={CALENDAR_STRINGS_PL}
                        />
                        <DefaultButton
                            onClick={onNullDate}
                        > Remove constraint </DefaultButton>
                    </Stack>
                </FocusTrapZone>
            </Callout>
        )}

    </div>
}