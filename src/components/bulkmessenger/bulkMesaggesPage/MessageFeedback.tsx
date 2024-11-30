export default function MessageFeedback({ counter }: { counter: number }) {
  return (
    <>
      <div className="text-blue-800 border-t pt-100">
        Se envió a {counter} contactos
      </div>
    </>
  );
}
