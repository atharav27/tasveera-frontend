import { BadgeVariant, type BadgeVariant as BadgeVariantType } from "./badge-variant";

interface StatusBadgeProps {
  text: string;
  status: string;
  statusToVariant: Record<string, BadgeVariantType>;
  className?: string;
  noBackground?: boolean;
}

function getVariantFromStatus(
  status: string,
  statusToVariant: Record<string, BadgeVariantType>,
): BadgeVariantType {
  const normalizedStatus = status.toLowerCase().trim();
  return statusToVariant[normalizedStatus] || statusToVariant[status] || "neutral";
}

export function StatusBadge({
  text,
  status,
  statusToVariant,
  className,
  noBackground = false,
}: StatusBadgeProps) {
  const variant = getVariantFromStatus(status, statusToVariant);
  return <BadgeVariant text={text} variant={variant} className={className} noBackground={noBackground} />;
}

