import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Button } from "../ui/button";

export default function ErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    // router-specific errors
    title = `${error.status} ${error.statusText}`;
    message = error.data || "Oops! We couldn’t find that page.";
  } else if (error instanceof Error) {
    // JS errors
    message = error.message;
  }

  return (
    <div className="flex flex-col space-y-2 items-center justify-center h-screen text-center p-4">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">{message}</p>
      <Button
        className="mt-4 px-4 py-2"
        onClick={() => window.location.reload()}
      >
        Reload
      </Button>
    </div>
  );
}
