export function isLastFriday() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 5 for Friday
    const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
    ); // Last day of the current month
    const lastFriday = new Date(lastDayOfMonth);

    // Adjust to the previous Friday if the last day is not Friday
    while (lastFriday.getDay() !== 5) {
        lastFriday.setDate(lastFriday.getDate() - 1);
    }

    return (
        today.getDate() === lastFriday.getDate() &&
        today.getMonth() === lastFriday.getMonth() &&
        today.getFullYear() === lastFriday.getFullYear()
    );
}
