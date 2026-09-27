"use client";
import { AlertCircle, RefreshCw } from "lucide-react";
export function ErrorState({
  title = "Données indisponibles",
  message = "Le service de données est momentanément inaccessible.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="data-state data-error" role="alert">
      <AlertCircle size={22} />
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry}>
          <RefreshCw size={14} />
          Réessayer
        </button>
      )}
    </div>
  );
}
