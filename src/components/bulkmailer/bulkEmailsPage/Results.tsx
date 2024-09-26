import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Result({ emails }: { emails: any }) {
  return (
    <>
      {emails.length === 0 ? (
        <Alert>
          <AlertDescription>
            Todos los correos se enviaron correctamente
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertDescription>Error al enviar correos.</AlertDescription>
        </Alert>
      )}
    </>
  );
}
