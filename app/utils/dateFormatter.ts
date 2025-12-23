export function formatDate(dateInput: string | Date): string {
  console.log(dateInput);
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
