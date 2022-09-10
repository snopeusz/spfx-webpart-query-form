import * as React from 'react';
import { useBoolean } from '@fluentui/react-hooks';
import { DefaultButton, Callout, DirectionalHint, FocusTrapZone, Calendar, ICalendarStrings, Stack, Label } from 'office-ui-fabric-react';

interface IDateRangeProps {
    disabled?: boolean;
}

const calstrings: ICalendarStrings = {
    months: ["Styczeń", "Luty", "Marzec", "Kwicień", "Brian", "Czerwiec", "Lipiec", "Sierp", "Wrześ", "Paździerz", "Listop", "Gruda"],
    shortMonths: ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paz", "lis", "gru"],
    days: ["Niedziela", "Poniedziałek", "wtorek", "śridoa", "czwarted", "piątunio", "sobota"],
    shortDays: ["N", "Pn", "W", "Ś", "Cz", "Pt", "S"],
    goToToday: 'dziś'
}

export const DateRangeElement = (props: IDateRangeProps): JSX.Element => {
    const [selectedDate, setSelectedDate] = React.useState<Date | null>();
    const [showCalendar, { toggle: toggleShowCalendar, setFalse: hideCalendar }] = useBoolean(false);
    const buttonContainerRef: React.MutableRefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);

    const [selectedDate2, setSelectedDate2] = React.useState<Date | null>();
    const [showCalendar2, { toggle: toggleShowCalendar2, setFalse: hideCalendar2 }] = useBoolean(false);
    const buttonContainerRef2: React.MutableRefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);

    const onSelectDate: (date: Date | null, dateRangeArray: Date[]) => void = React.useCallback(
        (date: Date, dateRangeArray: Date[]): void => {
            if (date && selectedDate2 && date > selectedDate2) {
                setSelectedDate(selectedDate2);
            } else {
                setSelectedDate(date);
            }

            hideCalendar();
        },
        [hideCalendar, selectedDate2],
    );

    const onNullDate: React.MouseEventHandler<DefaultButton> = React.useCallback(
        (e) => {
            setSelectedDate(null);
            hideCalendar();
        },
        [hideCalendar]
    );

    const onSelectDate2: (date: Date, dateRangeArray: Date[]) => void = React.useCallback(
        (date: Date, dateRangeArray: Date[]): void => {
            if (date && selectedDate && date < selectedDate) {
                setSelectedDate2(selectedDate);
            } else {
                setSelectedDate2(date);
            }
            hideCalendar2();
        },
        [hideCalendar2, selectedDate],
    );

    const onNullDate2: React.MouseEventHandler<DefaultButton> = React.useCallback(
        (e) => {
            setSelectedDate2(null);
            hideCalendar2();
        },
        [hideCalendar2]
    );

    return (
        <Stack horizontal>
            <Label>Select date range: </Label>
            <div>
                <div ref={buttonContainerRef}>
                    <DefaultButton
                        onClick={toggleShowCalendar}
                        text={!selectedDate ? '< Open range' : selectedDate.toLocaleDateString()}
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
                                    strings={calstrings}
                                />
                                <DefaultButton
                                    onClick={onNullDate}
                                > Remove constraint </DefaultButton>
                            </Stack>
                        </FocusTrapZone>
                    </Callout>
                )}
            </div>

            { /************* second calendar *************/}
            
            <div>
                <div ref={buttonContainerRef2}>
                    <DefaultButton
                        onClick={toggleShowCalendar2}
                        text={!selectedDate2 ? 'Open range >' : selectedDate2.toLocaleDateString()}
                    />
                </div>
                {showCalendar2 && (
                    <Callout
                        isBeakVisible={false}
                        gapSpace={0}
                        doNotLayer={false}
                        target={buttonContainerRef2}
                        directionalHint={DirectionalHint.bottomLeftEdge}
                        onDismiss={hideCalendar2}
                        setInitialFocus
                    >
                        <FocusTrapZone isClickableOutsideFocusTrap>
                            <Stack>
                                <Calendar
                                    onSelectDate={onSelectDate2}
                                    onDismiss={hideCalendar2}
                                    isMonthPickerVisible
                                    value={selectedDate2}
                                    highlightCurrentMonth
                                    isDayPickerVisible
                                    showGoToToday={false}
                                    // Calendar uses English strings by default. For localized apps, you must override this prop.
                                    strings={calstrings}
                                />
                                <DefaultButton
                                    onClick={onNullDate2}
                                > Remove constraint </DefaultButton>
                            </Stack>
                        </FocusTrapZone>
                    </Callout>
                )}
            </div>
        </Stack>
    );
}